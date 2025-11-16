
'use server'

import { getAulas, getComisiones, getMaterias } from '@/lib/data'
import { Section } from './types'
import Comision from "@/models/Comision";
import Materia from "@/models/Materia";
import connectToDB from "./mongodb";

export type AssignmentResult = {
  success: boolean
  message: string
  assignedCount: number
  unassignedCount: number
  failureSummary?: string
  assignedSections?: { sectionId: string; classroomId: string }[]
  unassignedSections?: { sectionId: string; reason: string }[];
}

function getProgramIdForSection(section: Section, courses: any[]): string {
    const course = courses.find(c => c.id === section.courseId);
    return course?.programId || 'unknown';
}

function getCourseForSection(section: Section, courses: any[]) {
    return courses.find(c => c.id === section.courseId);
}


export async function runAutoAssignment(reassignAll: boolean): Promise<AssignmentResult> {
  try {
    const allComisiones = await getComisiones();
    const allAulas = await getAulas();

    const comisionesTarget = reassignAll 
      ? allComisiones 
      : allComisiones.filter(c => !c.asignacion?.aula_id);

    const assignedSections: { sectionId: string; classroomId: string }[] = [];
    const unassignedSections: { sectionId: string; reason: string }[] = [];

    const scheduleMap = new Map<string, number>();

    if (!reassignAll) {
      const comisionesYaAsignadas = allComisiones.filter(c => c.asignacion?.aula_id);
      comisionesYaAsignadas.forEach(comision => {
        if (comision.asignacion?.aula_id && comision.horario) {
          const key = `${comision.asignacion.aula_id}-${comision.horario.dia}-${comision.horario.turno}`;
          const currentOccupancy = scheduleMap.get(key) || 0;
          scheduleMap.set(key, currentOccupancy + comision.inscriptos);
        }
      });
    } else {
      // Si es reasignación total, limpiamos todas las asignaciones primero
      await Comision.updateMany({}, { $unset: { asignacion: "" } });
    }

    for (const comision of comisionesTarget) {
      if (!comision.horario) {
        unassignedSections.push({
          sectionId: comision._id.toString(),
          reason: 'La comisión no tiene un horario definido.',
        });
        continue;
      }

      const potentialClassrooms = [];

      for (const aula of allAulas) {
        const key = `${aula._id}-${comision.horario.dia}-${comision.horario.turno}`;
        const currentOccupancy = scheduleMap.get(key) || 0;
        const futureOccupancy = currentOccupancy + comision.inscriptos;

        // 1. Chequeo de capacidad
        if (futureOccupancy > aula.capacidad) {
          continue; // No cumple capacidad
        }

        // 2. Chequeo de recursos
        const requiredRecursos = comision.recursos || [];
        const aulaRecursos = aula.recursos || [];
        const hasAllRecursos = requiredRecursos.every(req => aulaRecursos.includes(req));

        potentialClassrooms.push({
          ...aula,
          id: aula._id.toString(),
          remainingCapacity: aula.capacidad - futureOccupancy,
          hasAllRecursos,
          // Un score para ordenar: más recursos coincidentes es mejor
          resourceMatchScore: requiredRecursos.filter(req => aulaRecursos.includes(req)).length,
        });
      }

      if (potentialClassrooms.length > 0) {
        // Ordenar:
        // 1. Prioridad #1: Aulas que tienen TODOS los recursos.
        // 2. Prioridad #2: "Best fit" (menor capacidad restante).
        potentialClassrooms.sort((a, b) => {
          if (a.hasAllRecursos !== b.hasAllRecursos) {
            return a.hasAllRecursos ? -1 : 1;
          }
          return a.remainingCapacity - b.remainingCapacity;
        });

        const bestFitClassroom = potentialClassrooms[0];

        // Solo asignamos si cumple con los recursos requeridos, si es que tiene.
        if (comision.recursos?.length > 0 && !bestFitClassroom.hasAllRecursos) {
            unassignedSections.push({
                sectionId: comision._id.toString(),
                reason: `No hay aulas disponibles con los recursos necesarios (${comision.recursos.join(', ')}).`,
            });
            continue;
        }


        await updateComisionAsignacion(comision._id.toString(), bestFitClassroom.id);
        
        assignedSections.push({
          sectionId: comision._id.toString(),
          classroomId: bestFitClassroom.id,
        });

        const key = `${bestFitClassroom.id}-${comision.horario.dia}-${comision.horario.turno}`;
        const currentOccupancy = scheduleMap.get(key) || 0;
        scheduleMap.set(key, currentOccupancy + comision.inscriptos);

      } else {
        unassignedSections.push({
          sectionId: comision._id.toString(),
          reason: 'No hay aulas disponibles con capacidad suficiente en el horario solicitado.',
        });
      }
    }

    const assignedCount = assignedSections.length;
    const unassignedCount = unassignedSections.length;

    const message = `Asignación completada. Comisiones asignadas: ${assignedCount}. Comisiones no asignadas: ${unassignedCount}.`;

    const failureReasons = unassignedSections.map(u => {
        const comision = allComisiones.find(c => c._id.toString() === u.sectionId);
        return `Comisión "${comision?.nombre_comision || u.sectionId}": ${u.reason}`;
    });

    const failureSummary = unassignedCount > 0
      ? `Resumen de fallos: ${failureReasons.join('; ')}`
      : '';

    return {
      success: true,
      message,
      assignedCount,
      unassignedCount,
      failureSummary,
      assignedSections,
      unassignedSections,
    };
  } catch (error) {
    console.error('Error durante la asignación automática:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido.';
    return {
      success: false,
      message: 'Ocurrió un error durante la asignación automática.',
      assignedCount: 0,
      unassignedCount: (await getComisiones()).filter(c => !c.asignacion?.aula_id).length,
      failureSummary: `Error del servidor: ${errorMessage}`,
    };
  }
}

export async function upsertComision(data: any) {
  await connectToDB();

  const { _id, nombre_comision, profesor, inscriptos, horario, materia_ids, anio_dictado } = data;

  if (_id) {
    // Update existing comision
    await Comision.findByIdAndUpdate(_id, {
      nombre_comision,
      profesor,
      inscriptos,
      horario,
      materia_ids,
      anio_dictado,
    });
  } else {
    // Create new comision
    await Comision.create({
      nombre_comision,
      profesor,
      inscriptos,
      horario,
      materia_ids,
      anio_dictado,
    });
  }
}

export async function updateComisionAsignacion(comisionId: string, aulaId: string) {
  await connectToDB();
  await Comision.findByIdAndUpdate(comisionId, {
    'asignacion.aula_id': aulaId,
    'asignacion.fecha_asignacion': new Date()
  });
}
