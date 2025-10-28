'use server';
/**
 * @fileOverview A flow for running commands using AI tools.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { TaskSchema, ClientSchema, InvoiceSchema } from '@/lib/data';


const CommandInputSchema = z.object({
  command: z.string().describe('The user\'s command.'),
  userId: z.string().describe('The ID of the user.'),
});
export type CommandInput = z.infer<typeof CommandInputSchema>;

const CommandOutputSchema = z.object({
  reply: z.string().describe('The AI\'s reply to the user.'),
});
export type CommandOutput = z.infer<typeof CommandOutputSchema>;


export async function runCommand(
  input: CommandInput
): Promise<CommandOutput> {
  return { reply: "This feature is under construction." };
}
