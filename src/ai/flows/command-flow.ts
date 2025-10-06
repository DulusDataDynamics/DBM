'use server';
/**
 * @fileOverview A flow for running commands using AI tools.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  createTask,
  listClients,
} from '@/app/dashboard/actions';
import { TaskSchema, ClientSchema } from '@/lib/data';


const CommandInputSchema = z.object({
  command: z.string().describe('The user\'s command.'),
  userId: z.string().describe('The ID of the user.'),
});
export type CommandInput = z.infer<typeof CommandInputSchema>;

const CommandOutputSchema = z.object({
  reply: z.string().describe('The AI\'s reply to the user.'),
});
export type CommandOutput = z.infer<typeof CommandOutputSchema>;

const createTaskTool = ai.defineTool(
  {
    name: 'createTask',
    description: 'Creates a new task for the user.',
    inputSchema: z.object({
      description: z.string(),
      dueDate: z.string().optional().describe('The due date in YYYY-MM-DD format'),
    }),
    outputSchema: TaskSchema,
  },
  async (input, context) => {
    const { userId } = context as { userId: string };
    return createTask(userId, input.description, input.dueDate);
  }
);

const listClientsTool = ai.defineTool(
  {
    name: 'listClients',
    description: 'Lists all clients for the user.',
    inputSchema: z.object({}),
    outputSchema: z.array(ClientSchema),
  },
  async (input, context) => {
    const { userId } = context as { userId: string };
    return listClients(userId);
  }
);

export async function runCommand(
  input: CommandInput
): Promise<CommandOutput> {
  const { command, userId } = input;

  const llmResponse = await ai.generate({
    prompt: `You are an AI assistant. The user's request is: "${command}". Respond conversationally and helpfully.`,
    tools: [createTaskTool, listClientsTool],
    context: { userId },
  });

  const toolResponse = llmResponse.toolRequest();
  if (toolResponse) {
     const toolResult = await toolResponse.run();
     const secondResponse = await ai.generate({
       history: [llmResponse.message, toolResult],
       tools: [createTaskTool, listClientsTool],
       context: { userId },
     });
     return { reply: secondResponse.text() };
  }

  return { reply: llmResponse.text() };
}
