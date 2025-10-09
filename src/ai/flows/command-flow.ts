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
      model: 'googleai/gemini-2.5-pro',
      prompt: `You are Sparky, an AI business assistant. Your goal is to help the user manage their business by executing commands based on their requests, even if their grammar is imperfect. Your primary job is to understand the user's *intent* and use the available tools to accomplish their goal.

The user's request is: "${command}".

Follow this thought process to fulfill the user's request:

1.  **Analyze Intent:** Read the user's command carefully. What is their ultimate goal? Don't worry about perfect grammar. Extract the key actions and entities (e.g., "invoice", "task", "client name", "amount").

2.  **Deconstruct into Steps:** Is it a single action ("list my tasks") or a multi-step command ("Create an invoice for a new client")? Acknowledge the steps internally.

3.  **Identify Necessary Tools:** Review your available tools: \`createTask\`, \`listTasks\`, \`createClient\`, \`listClients\`, \`createInvoice\`. Determine which tool(s) are needed to complete the user's goal.

4.  **Check Prerequisites and Gather Information:**
    *   **For Invoicing:** To use \`createInvoice\`, you **MUST** have a \`clientId\`.
    *   If the user provides a client's *name* but not their ID, you **MUST** use the \`listClients\` tool first to find the correct \`clientId\`.
    *   If \`listClients\` returns no matching client and the user's intent implies creating a *new* client, you **MUST** use the \`createClient\` tool first.
    *   **Missing Details:** If you need to create a new client but you don't have all the information (name, email, phone, address), you **MUST** ask the user for the missing details. Do not proceed without them.
    *   **For other actions:** Check if you have all the required information (e.g., a description for a task). If not, ask for it.

5.  **Execute Tools Sequentially:** If multiple steps are needed, execute them in the correct logical order. For example, you must successfully get a \`clientId\` *before* calling \`createInvoice\`.

6.  **Formulate the Final Response:** Once all actions are complete, respond to the user in a friendly, conversational tone.
    *   **Confirm what you have done.** Instead of a generic "Done," say "I've created a new invoice for [Client Name] for [Amount]."
    *   **Summarize multiple actions.** If you created a client and then an invoice, say "I've added [Client Name] as a new client and created your first invoice for them."
    *   If you can't fulfill the request, explain why in a helpful way.`,
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
