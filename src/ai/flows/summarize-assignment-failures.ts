'use server';

/**
 * @fileOverview Summarizes the reasons why sections could not be auto-assigned to classrooms.
 *
 * - summarizeAssignmentFailures - A function that takes a list of unassigned section reasons and returns a summary.
 * - SummarizeAssignmentFailuresInput - The input type for the summarizeAssignmentFailures function.
 * - SummarizeAssignmentFailuresOutput - The return type for the summarizeAssignmentFailures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAssignmentFailuresInputSchema = z.array(
  z.string().describe('Reason why a section could not be assigned')
);
export type SummarizeAssignmentFailuresInput = z.infer<typeof SummarizeAssignmentFailuresInputSchema>;

const SummarizeAssignmentFailuresOutputSchema = z.object({
  summary: z.string().describe('A summary of the reasons why sections could not be assigned.'),
});
export type SummarizeAssignmentFailuresOutput = z.infer<typeof SummarizeAssignmentFailuresOutputSchema>;

export async function summarizeAssignmentFailures(input: SummarizeAssignmentFailuresInput): Promise<SummarizeAssignmentFailuresOutput> {
  return summarizeAssignmentFailuresFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAssignmentFailuresPrompt',
  input: {schema: SummarizeAssignmentFailuresInputSchema},
  output: {schema: SummarizeAssignmentFailuresOutputSchema},
  prompt: `You are an administrator in charge of summarizing the reasons why sections could not be assigned to classrooms.

  Here are the reasons why sections could not be assigned:\n{{#each this}}\n- {{this}}{{#unless @last}}\n{{/unless}}{{/each}}\n\n  Provide a concise summary of these reasons.
  `,
});

const summarizeAssignmentFailuresFlow = ai.defineFlow(
  {
    name: 'summarizeAssignmentFailuresFlow',
    inputSchema: SummarizeAssignmentFailuresInputSchema,
    outputSchema: SummarizeAssignmentFailuresOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
