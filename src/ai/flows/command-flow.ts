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
        dueDate: z.string().optional().describe('The due date in YYYY-MM-DD format. Defaults to today if not provided.'),
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

  const tools = [createTaskTool, listClientsTool, createInvoiceTool];

  const llmResponse = await ai.generate({
    prompt: `You are an AI assistant that can perform actions based on the user's request. The user's request is: "${command}".
1.  Figure out which tool to use.
2.  If you need to create an invoice and only have a client's name, you MUST use the \`listClients\` tool first to find their ID.
3.  Once the action is complete, respond in a conversational and friendly tone.`,
    tools: tools,
    context: { userId },
  });

  let message = llmResponse.message;

  // This loop will continue as long as the AI wants to call a tool.
  // It allows for multi-step operations (e.g., listClients -> createInvoice).
  while (message.toolRequest) {
    const toolRequest = message.toolRequest;
    const toolResult = await toolRequest.run();

    // Send the tool result back to the AI to continue the conversation
    const nextResponse = await ai.generate({
      history: [message, toolResult],
      tools: tools,
      context: { userId },
    });
    message = nextResponse.message;
  }

  // Once the AI is done calling tools, it will generate a final text response.
  return { reply: message.content[0].text || "I've completed the action." };
}
