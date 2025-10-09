'use server';
/**
 * @fileOverview A flow for running commands using AI tools.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  createTask,
  listClients,
  createInvoice,
  createClient,
  listTasks,
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

const listTasksTool = ai.defineTool(
    {
        name: 'listTasks',
        description: 'Lists all tasks for the user.',
        inputSchema: z.object({}),
        outputSchema: z.array(TaskSchema),
    },
    async (input, context) => {
        const { userId } = context as { userId: string };
        return listTasks(userId);
    }
);

const createClientTool = ai.defineTool(
    {
        name: 'createClient',
        description: 'Creates a new client for the user.',
        inputSchema: z.object({
            name: z.string(),
            email: z.string().email(),
            phone: z.string(),
            address: z.string(),
        }),
        outputSchema: ClientSchema,
    },
    async (input, context) => {
        const { userId } = context as { userId: string };
        return createClient(userId, input.name, input.email, input.phone, input.address);
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
    description: 'Creates a new invoice for a client. You must have a client ID to use this tool. If you only have a name, use listClients first.',
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

const commandFlow = ai.defineFlow(
  {
    name: 'commandFlow',
    inputSchema: CommandInputSchema,
    outputSchema: CommandOutputSchema,
  },
  async (input) => {
    const { command, userId } = input;
    const tools = [createTaskTool, listClientsTool, createInvoiceTool, createClientTool, listTasksTool];

    const llmResponse = await ai.generate({
      prompt: `You are Sparky, an AI business assistant. Your goal is to help the user manage their business by executing commands. The user's request is: "${command}".

Here is your thought process for fulfilling the user's request:
1.  **Deconstruct the Request:** First, fully understand what the user is asking for. Is it a single action or a multi-step command? (e.g., "Create an invoice for a new client" is two steps: create client, then create invoice).

2.  **Identify Necessary Tools:** Review your available tools: \`createTask\`, \`listTasks\`, \`createClient\`, \`listClients\`, \`createInvoice\`. Determine which tool(s) are needed.

3.  **Check for Prerequisites:**
    *   **For Invoicing:** To create an invoice, you **MUST** have a \`clientId\`.
    *   If the user provides a client's *name* but not their ID, you **MUST** use the \`listClients\` tool first to find the correct \`clientId\`.
    *   If the client does not exist after checking, and the user's intent is to create an invoice for a *new* client, you **MUST** first use the \`createClient\` tool. You will have to ask the user for the new client's details (name, email, phone, address) if they are not provided in the original prompt.
    *   **For other actions:** Check if you have all the required information (e.g., a description for a task).

4.  **Execute Tools Sequentially:** If multiple steps are needed, execute the tools in the correct order. For example, you must successfully get a \`clientId\` *before* calling \`createInvoice\`.

5.  **Formulate the Final Response:** Once all actions are complete, respond to the user in a friendly, conversational tone. Confirm what you have done. For example, instead of just saying "Done," say "I've created a new invoice for [Client Name] for [Amount]." If you performed multiple actions, summarize them, e.g., "I've added [Client Name] as a new client and created your first invoice for them."`,
      tools: tools,
      context: { userId },
    });
    
    const finalReply = llmResponse.text || "I've completed the action.";
    return { reply: finalReply };
  }
);


export async function runCommand(
  input: CommandInput
): Promise<CommandOutput> {
  return commandFlow(input);
}
