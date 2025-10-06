'use server';
/**
 * @fileOverview A flow for running commands using AI tools.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  createTask,
  listClients,
  createInvoice,
} from '@/app/dashboard/actions';
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
    description: 'Lists all clients for the user. Use this to get the client ID before creating an invoice if the client name is provided.',
    inputSchema: z.object({}),
    outputSchema: z.array(ClientSchema),
  },
  async (input, context) => {
    const { userId } = context as { userId: string };
    return listClients(userId);
  }
);

const createInvoiceTool = ai.defineTool(
  {
    name: 'createInvoice',
    description: 'Creates a new invoice for a client.',
    inputSchema: z.object({
        clientId: z.string().describe('The ID of the client this invoice belongs to.'),
        amount: z.number().describe('The total amount of the invoice.'),
        dueDate: z.string().optional().describe('The due date in Y1111-MM-DD format. Defaults to today if not provided.'),
    }),
    outputSchema: InvoiceSchema,
  },
  async (input, context) => {
    const { userId } = context as { userId: string };
    return createInvoice(userId, input.clientId, input.amount, input.dueDate);
  }
);


export async function runCommand(
  input: CommandInput
): Promise<CommandOutput> {
  const { command, userId } = input;

  const llmResponse = await ai.generate({
    prompt: `You are an AI assistant that can perform actions. The user's request is: "${command}". Respond conversationally. If you need to find a client's ID before creating an invoice, use the listClients tool first.`,
    tools: [createTaskTool, listClientsTool, createInvoiceTool],
    context: { userId },
  });

  const toolRequest = llmResponse.toolRequest();
  if (toolRequest) {
     const toolResult = await toolRequest.run();
     const secondResponse = await ai.generate({
       history: [llmResponse.message, toolResult],
       tools: [createTaskTool, listClientsTool, createInvoiceTool],
       context: { userId },
     });
      // Check if the second response also wants to call a tool (e.g., createInvoice after listClients)
      const secondToolRequest = secondResponse.toolRequest();
      if(secondToolRequest) {
        const secondToolResult = await secondToolRequest.run();
        const thirdResponse = await ai.generate({
            history: [llmResponse.message, toolResult, secondResponse.message, secondToolResult],
            tools: [createTaskTool, listClientsTool, createInvoiceTool],
            context: { userId },
        });
        return { reply: thirdResponse.text };
      }
     return { reply: secondResponse.text };
  }

  return { reply: llmResponse.text };
}
