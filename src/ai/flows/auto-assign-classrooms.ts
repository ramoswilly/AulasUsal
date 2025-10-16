'use server';

/**
 * @fileOverview Implements the auto-assignment of classrooms to sections based on availability, required resources, and capacity.
 *
 * - autoAssignClassrooms - A function to automatically assign classrooms to sections.
 * - AutoAssignClassroomsInput - The input type for the autoAssignClassrooms function.
 * - AutoAssignClassroomsOutput - The return type for the autoAssignClassrooms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoAssignClassroomsInputSchema = z.object({
  sections: z.array(
    z.object({
      id: z.string().describe('The unique identifier for the section.'),
      courseId: z.string().describe('The identifier for the course.'),
      programId: z.string().describe('The identifier for the program.'),
      enrolledStudents: z.number().describe('The number of enrolled students.'),
      days: z.array(z.string()).describe('The days of the week the section is held (e.g., Monday, Tuesday).'),
      startTime: z.string().describe('The start time of the section (e.g., 09:00).'),
      endTime: z.string().describe('The end time of the section (e.g., 10:00).'),
      desiredResources: z.array(z.string()).describe('The list of desired resources for the section (e.g., Projector, Whiteboard).'),
      assignedClassroomId: z.string().optional().describe('The id of the classroom assigned to the section, if any.'),
    })
  ).describe('The list of sections to be assigned to classrooms.'),
  classrooms: z.array(
    z.object({
      id: z.string().describe('The unique identifier for the classroom.'),
      name: z.string().describe('The name of the classroom (e.g., Room 301).'),
      capacity: z.number().describe('The maximum capacity of the classroom.'),
      resources: z.array(z.string()).describe('The list of available resources in the classroom (e.g., Projector, Whiteboard).'),
    })
  ).describe('The list of available classrooms.'),
});
export type AutoAssignClassroomsInput = z.infer<typeof AutoAssignClassroomsInputSchema>;

const AutoAssignClassroomsOutputSchema = z.object({
  assignedSections: z.array(
    z.object({
      sectionId: z.string().describe('The ID of the section that was assigned.'),
      classroomId: z.string().describe('The ID of the classroom to which the section was assigned.'),
    })
  ).describe('The list of sections that were successfully assigned to classrooms.'),
  unassignedSections: z.array(
    z.object({
      sectionId: z.string().describe('The ID of the section that could not be assigned.'),
      reason: z.string().describe('The reason why the section could not be assigned (e.g., no available classroom, insufficient capacity).'),
    })
  ).describe('The list of sections that could not be assigned to classrooms along with the reasons.'),
});
export type AutoAssignClassroomsOutput = z.infer<typeof AutoAssignClassroomsOutputSchema>;

export async function autoAssignClassrooms(input: AutoAssignClassroomsInput): Promise<AutoAssignClassroomsOutput> {
  return autoAssignClassroomsFlow(input);
}

const autoAssignClassroomsFlow = ai.defineFlow(
  {
    name: 'autoAssignClassroomsFlow',
    inputSchema: AutoAssignClassroomsInputSchema,
    outputSchema: AutoAssignClassroomsOutputSchema,
  },
  async input => {
    const {sections, classrooms} = input;
    const assignedSections: { sectionId: string; classroomId: string }[] = [];
    const unassignedSections: { sectionId: string; reason: string }[] = [];

    for (const section of sections) {
      // Skip already assigned sections
      if (section.assignedClassroomId) {
        continue;
      }

      for (const classroom of classrooms) {
        // Rule 2: Resources. The aula asignada debe tener todos los "recursos deseados" que se especificaron para la comisión.
        const hasAllResources = section.desiredResources.every(resource => classroom.resources.includes(resource));
        if (!hasAllResources) {
          continue;
        }

        // Rule 3: Capacidad (Manejo de Aulas Compartidas).
        // Check if the classroom has enough capacity for the section.
        let totalEnrolled = section.enrolledStudents;

        // Check for conflicts with existing assignments in the classroom
        for (const assignedSection of assignedSections) {
          const assignedSectionDetails = sections.find(s => s.id === assignedSection.sectionId);
          if (assignedSection.classroomId === classroom.id && assignedSectionDetails) {
            // Simulate time conflict (Need to implement actual time conflict checking)
            totalEnrolled += assignedSectionDetails.enrolledStudents;
          }
        }

        if (totalEnrolled > classroom.capacity) {
          continue; // Skip to the next classroom if capacity is exceeded
        }


        //Implement rules 1 here
        // Rule 1: Horario y Disponibilidad. Solo puede asignar una comisión a un aula si esta no tiene conflictos de horario irresolubles.

        // Simulate assignment success for now.
        assignedSections.push({ sectionId: section.id, classroomId: classroom.id });
        section.assignedClassroomId = classroom.id; // Update assignedClassroomId to prevent re-assignment
        break; // Exit the inner loop once a classroom is assigned
      }

      if (!section.assignedClassroomId) {
        unassignedSections.push({ sectionId: section.id, reason: 'No suitable classroom found.' });
      }
    }

    return { assignedSections, unassignedSections };
  }
);

