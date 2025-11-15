
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


export async function runAutoAssignment(): Promise<AssignmentResult> {
  try {
    const allComisiones = await getComisiones();
    const allAulas = await getAulas();

    const comisionesSinAsignar = allComisiones.filter(c => !c.asignacion?.aula_id);
    const comisionesYaAsignadas = allComisiones.filter(c => c.asignacion?.aula_id);

    const assignedSections: { sectionId: string; classroomId: string }[] = [];
    const unassignedSections: { sectionId: string; reason: string }[] = [];

    // Mapa para rastrear la ocupación de las aulas
    // Key: `${aulaId}-${dia}-${turno}`, Value: capacidad ocupada
    const scheduleMap = new Map<string, number>();

    // Llenar el mapa con las comisiones ya asignadas
    comisionesYaAsignadas.forEach(comision => {
      if (comision.asignacion?.aula_id && comision.horario) {
        const key = `${comision.asignacion.aula_id}-${comision.horario.dia}-${comision.horario.turno}`;
        const currentOccupancy = scheduleMap.get(key) || 0;
        scheduleMap.set(key, currentOccupancy + comision.inscriptos);
      }
    });

    for (const comision of comisionesSinAsignar) {
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

        if (futureOccupancy <= aula.capacidad) {
          potentialClassrooms.push({
            ...aula,
            id: aula._id.toString(),
            // Guardamos la capacidad restante para el criterio de "best fit"
            remainingCapacity: aula.capacidad - futureOccupancy,
          });
        }
      }

      if (potentialClassrooms.length > 0) {
        // Ordenar para encontrar el "best fit" (menor capacidad restante)
        potentialClassrooms.sort((a, b) => a.remainingCapacity - b.remainingCapacity);
        const bestFitClassroom = potentialClassrooms[0];

        // Asignar y actualizar la base de datos
        await updateComisionAsignacion(comision._id.toString(), bestFitClassroom.id);
        
        assignedSections.push({
          sectionId: comision._id.toString(),
          classroomId: bestFitClassroom.id,
        });

        // Actualizar el mapa de horarios con la nueva asignación
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
