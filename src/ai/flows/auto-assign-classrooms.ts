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

const prompt = ai.definePrompt({
  name: 'autoAssignClassroomsPrompt',
  input: {schema: AutoAssignClassroomsInputSchema},
  output: {schema: AutoAssignClassroomsOutputSchema},
  prompt: `You are an expert university scheduler. Your task is to assign sections to classrooms based on a set of rules.

  Assignment Rules:
  1.  **Schedule & Availability**: A section can only be assigned to a classroom if the classroom is free during the section's scheduled time (days and time slot). A classroom can host multiple sections at the same time if their combined student count does not exceed the classroom's capacity.
  2.  **Resources**: The assigned classroom must have all the "desiredResources" specified for the section.
  3.  **Capacity (Shared Classrooms)**: The total number of enrolled students from all sections assigned to the same classroom at the same time slot cannot exceed the classroom's capacity.
  4.  **Optimal Fit**: Prioritize assigning sections to classrooms where the capacity is closest to (but not less than) the number of enrolled students to make efficient use of space. Avoid using a large classroom for a small section if a smaller, suitable classroom is available.

  Process:
  -   Iterate through each section that does not yet have an assigned classroom.
  -   Find the best available classroom based on the rules above.
  -   If a suitable classroom is found, assign the section to it.
  -   If no suitable classroom can be found, add the section to the unassigned list with a clear reason for the failure (e.g., "No available classroom with sufficient capacity and required resources," "Time conflict in all suitable classrooms.").
  
  Provided Data:
  Classrooms:
  {{{json classrooms}}}
  
  Sections to assign:
  {{{json sections}}}
  
  Your goal is to maximize the number of assigned sections while adhering strictly to all the rules, especially the optimal fit.
  `,
});


const autoAssignClassroomsFlow = ai.defineFlow(
  {
    name: 'autoAssignClassroomsFlow',
    inputSchema: AutoAssignClassroomsInputSchema,
    outputSchema: AutoAssignClassroomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
