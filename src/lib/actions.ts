'use server'

import { autoAssignClassrooms } from '@/ai/flows/auto-assign-classrooms'
import { summarizeAssignmentFailures } from '@/ai/flows/summarize-assignment-failures'
import { classrooms, sections as allSections, programs, courses } from '@/lib/data'
import { Section } from './types'

export type AssignmentResult = {
  success: boolean
  message: string
  assignedCount: number
  unassignedCount: number
  failureSummary?: string
  assignedSections?: { sectionId: string; classroomId: string }[]
}

function getProgramIdForSection(section: Section): string {
    const course = courses.find(c => c.id === section.courseId);
    if (!course) return 'unknown';
    const program = programs.find(p => p.id === course.programId);
    return program?.id || 'unknown';
}

export async function runAutoAssignment(): Promise<AssignmentResult> {
  try {
    const sectionsToAssign = allSections.map(section => ({
        ...section,
        programId: getProgramIdForSection(section),
    }))

    const result = await autoAssignClassrooms({
      sections: sectionsToAssign,
      classrooms,
    })

    const assignedCount = result.assignedSections.length
    const unassignedCount = result.unassignedSections.length
    let failureSummary = ''

    if (unassignedCount > 0) {
      const reasons = result.unassignedSections.map(s => `Sección ${s.sectionId}: ${s.reason}`)
      const summaryResult = await summarizeAssignmentFailures(reasons)
      failureSummary = summaryResult.summary
    }

    // In a real application, you would update your database here.
    // For this mock, we just log the results.
    console.log('Assigned Sections:', result.assignedSections)
    console.log('Unassigned Sections:', result.unassignedSections)

    let message = `${assignedCount} comisiones asignadas con éxito.`
    if (unassignedCount > 0) {
      message += ` ${unassignedCount} no pudieron ser asignadas.`
    }

    return {
      success: true,
      message,
      assignedCount,
      unassignedCount,
      failureSummary,
      assignedSections: result.assignedSections,
    }
  } catch (error) {
    console.error('Error during auto-assignment:', error)
    return {
      success: false,
      message: 'Ocurrió un error durante la asignación automática.',
      assignedCount: 0,
      unassignedCount: allSections.filter(s => !s.assignedClassroomId).length,
    }
  }
}
