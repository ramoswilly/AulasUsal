
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
    let allSections: any[] = [];
  try {
    allSections = await getComisiones();
    const classrooms = await getAulas();
    const sectionsToAssign = allSections.filter(s => !s.assignedClassroomId);
    const assignedSections: { sectionId: string; classroomId: string }[] = [];
    const unassignedSections: { sectionId: string; reason: string }[] = [];
    
    // Create a map to track classroom availability per timeslot
    // Key: `${classroomId}-${day}-${startTime}`, Value: occupied capacity
    const scheduleMap = new Map<string, number>();

    // Pre-populate schedule with already assigned sections
    allSections.forEach(section => {
        if (section.assignedClassroomId) {
            section.days.forEach(day => {
                const key = `${section.assignedClassroomId}-${day}-${section.startTime}`;
                const currentOccupancy = scheduleMap.get(key) || 0;
                scheduleMap.set(key, currentOccupancy + section.enrolledStudents);
            });
        }
    });

    for (const section of sectionsToAssign) {
        const potentialClassrooms = [];

        for (const classroom of classrooms) {
            // 1. Check resources
            const hasAllResources = section.desiredResources.every(resId => classroom.resources.includes(resId));
            if (!hasAllResources) continue;

            // 2. Check availability and capacity for all time slots of the section
            let isAvailable = true;
            let totalFutureOccupancy = 0;
            
            for (const day of section.days) {
                const key = `${classroom.id}-${day}-${section.startTime}`;
                const currentOccupancy = scheduleMap.get(key) || 0;
                totalFutureOccupancy = currentOccupancy + section.enrolledStudents;
                
                if (totalFutureOccupancy > classroom.capacity) {
                    isAvailable = false;
                    break;
                }
            }

            if (isAvailable) {
                potentialClassrooms.push({
                    ...classroom,
                    remainingCapacity: classroom.capacity - totalFutureOccupancy,
                });
            }
        }

        if (potentialClassrooms.length > 0) {
            // Sort to find the tightest fit (least remaining capacity)
            potentialClassrooms.sort((a, b) => a.remainingCapacity - b.remainingCapacity);
            const bestFitClassroom = potentialClassrooms[0];
            
            assignedSections.push({ sectionId: section.id, classroomId: bestFitClassroom.id });

            // Update schedule map with the new assignment
            section.days.forEach(day => {
                const key = `${bestFitClassroom.id}-${day}-${section.startTime}`;
                const currentOccupancy = scheduleMap.get(key) || 0;
                scheduleMap.set(key, currentOccupancy + section.enrolledStudents);
            });
        } else {
            unassignedSections.push({ sectionId: section.id, reason: 'No hay aula disponible con la capacidad y recursos necesarios en ese horario.' });
        }
    }
    
    const assignedCount = assignedSections.length;
    const unassignedCount = unassignedSections.length;

    let message = `${assignedCount} comisiones asignadas con éxito.`
    if (unassignedCount > 0) {
      message += ` ${unassignedCount} no pudieron ser asignadas.`
    }
    
    // Simulate summary for consistency with previous functionality
    const failureSummary = unassignedCount > 0 
        ? `Se encontraron ${unassignedCount} comisiones que no pudieron ser asignadas, principalmente por falta de aulas con la capacidad o recursos necesarios en los horarios solicitados.`
        : '';

    return {
      success: true,
      message,
      assignedCount,
      unassignedCount,
      failureSummary,
      assignedSections,
      unassignedSections,
    }
  } catch (error) {
    console.error('Error during local auto-assignment:', error)
    return {
      success: false,
      message: 'Ocurrió un error durante la asignación automática local.',
      assignedCount: 0,
      unassignedCount: allSections.filter(s => !s.assignedClassroomId).length,
      failureSummary: 'No se pudo generar un resumen debido a un error inesperado en el servidor.'
    }
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
