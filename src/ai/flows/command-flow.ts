
'use server';
/**
 * @fileOverview A flow for running commands using AI tools.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  createTask,
  listTasks,
  createClient,
  listClients,
  createInvoice,
  createQuote,
  listStock,
  updateStock,
} from '@/app/dashboard/actions';
import { TaskSchema, ClientSchema, InvoiceSchema, QuoteSchema, StockItemSchema } from '@/lib/data';

const CommandInputSchema = z.object({
  command: z.string().describe('The user\'s command.'),
  userId: z.string().describe('The ID of the user.'),
});
export type CommandInput = z.infer<typeof CommandInputSchema>;

const CommandOutputSchema = z.object({
  reply: z.string().describe('The AI\'s reply to the user.'),
});
export type CommandOutput = z.infer<typeof CommandOutputSchema>;

// Define Tools for the AI
const createTaskTool = ai.defineTool(
  {
    name: 'createTask',
    description: 'Creates a new task. Use this to add a to-do item.',
    inputSchema: z.object({
      userId: z.string(),
      description: z.string().describe('A detailed description of the task.'),
      dueDate: z.string().optional().describe('The due date for the task in ISO format.'),
    }),
    outputSchema: TaskSchema,
  },
  async ({ userId, description, dueDate }) => createTask(userId, description, dueDate)
);

const listTasksTool = ai.defineTool(
    {
        name: 'listTasks',
        description: 'Lists all the tasks for a user.',
        inputSchema: z.object({ userId: z.string() }),
        outputSchema: z.array(TaskSchema),
    },
    async ({ userId }) => listTasks(userId)
)

const createClientTool = ai.defineTool(
  {
    name: 'createClient',
    description: 'Creates a new client record.',
    inputSchema: z.object({
      userId: z.string(),
      name: z.string().describe("The client's full name."),
      email: z.string().email().describe("The client's email address."),
      phone: z.string().describe("The client's phone number."),
      address: z.string().describe("The client's physical address."),
    }),
    outputSchema: ClientSchema,
  },
  async ({ userId, name, email, phone, address }) => createClient(userId, name, email, phone, address)
);

const listClientsTool = ai.defineTool(
  {
    name: 'listClients',
    description: 'Lists all clients to find a client ID by name.',
    inputSchema: z.object({ userId: z.string() }),
    outputSchema: z.array(ClientSchema),
  },
  async ({ userId }) => listClients(userId)
);

const createInvoiceTool = ai.defineTool(
  {
    name: 'createInvoice',
    description: 'Generates a new invoice for a client.',
    inputSchema: z.object({
      userId: z.string(),
      clientId: z.string().describe("The client's unique ID. If you only have a name, use the 'listClients' tool first to find the ID."),
      amount: z.number().describe('The total amount for the invoice.'),
      dueDate: z.string().optional().describe('The payment due date in ISO format.'),
    }),
    outputSchema: InvoiceSchema,
  },
  async ({ userId, clientId, amount, dueDate }) => createInvoice(userId, clientId, amount, dueDate)
);

const createQuoteTool = ai.defineTool(
    {
        name: 'createQuote',
        description: 'Generates a new price quote for a client.',
        inputSchema: z.object({
            userId: z.string(),
            clientId: z.string().describe("The client's unique ID. Use 'listClients' to find it if you only have a name."),
            amount: z.number().describe('The total amount for the quote.'),
        }),
        outputSchema: QuoteSchema,
    },
    async ({ userId, clientId, amount }) => createQuote(userId, clientId, amount)
);

const listStockTool = ai.defineTool(
    {
        name: 'listStock',
        description: 'Lists all items in the stock or inventory.',
        inputSchema: z.object({ userId: z.string() }),
        outputSchema: z.array(StockItemSchema),
    },
    async ({ userId }) => listStock(userId)
);

const updateStockTool = ai.defineTool(
    {
        name: 'updateStock',
        description: 'Updates the quantity of a stock item.',
        inputSchema: z.object({
            userId: z.string(),
            stockItemId: z.string().describe("The ID of the stock item to update."),
            quantity: z.number().describe("The new quantity for the stock item."),
        }),
        outputSchema: StockItemSchema,
    },
    async ({ userId, stockItemId, quantity }) => updateStock(userId, stockItemId, quantity)
);

const commandFlow = ai.defineFlow(
  {
    name: 'commandFlow',
    inputSchema: CommandInputSchema,
    outputSchema: CommandOutputSchema,
  },
  async (input) => {
    const model = ai.getModel('googleai/gemini-pro');

    const llmResponse = await model.generate({
      system: `You are Sparky, an expert AI business assistant for the Dulus Business Manager (DBM).
        Your primary function is to help users manage their business by executing commands.
        You understand natural language, even if it's casual, short, misspelled, or uses synonyms. For example, "make invoice," "create bill," and "send receipt" all mean you should use the 'createInvoice' tool.
        
        Your Thought Process:
        1.  **Understand Intent:** First, determine the user's goal. Are they trying to create, view, or update something?
        2.  **Identify the Tool:** Based on the intent, select the appropriate tool. (e.g., 'createInvoice', 'createClient', 'listTasks').
        3.  **Extract Entities:** Pull out key details from the user's command, such as names, amounts, and dates.
        4.  **Check Prerequisites:** Before executing a command, think if you need more information.
            - To create an invoice, you need a 'clientId'. If you only have a client's name, you MUST use the 'listClients' tool first to find their ID.
            - If information is missing (e.g., an email for a new client, or an amount for an invoice), you MUST ask the user for it. Do not make up information.
        5.  **Execute:** Use the tools to perform the action.
        6.  **Confirm:** After executing the tool, provide a friendly, conversational confirmation message to the user. For example: "Done! I've created invoice #INV-5678 for John Doe." or "I've added 'Follow up with marketing team' to your tasks."
        
        If the user's request is a simple question or command you can answer without a tool, do so. But prioritize using tools to perform actions within the DBM system.
        The user ID is: ${input.userId}
        `,
      prompt: input.command,
      tools: [
        createTaskTool,
        listTasksTool,
        createClientTool,
        listClientsTool,
        createInvoiceTool,
        createQuoteTool,
        listStockTool,
        updateStockTool
      ],
      toolChoice: 'auto',
    });

    const toolCalls = llmResponse.toolCalls();

    if (toolCalls.length > 0) {
      const toolResponses = [];
      for (const call of toolCalls) {
        const toolResult = await call.execute();
        toolResponses.push({
          tool: call,
          output: toolResult,
        });
      }

      // Send tool results back to the model for a final summary
      const finalResponse = await model.generate({
        prompt: {
          history: [
            { role: 'user', content: { text: input.command } },
            { role: 'model', content: { toolCalls } },
            {
              role: 'tool',
              content: toolResponses.map(response => ({
                toolResponse: { name: response.tool.name, output: response.output },
              })),
            },
          ],
        },
      });

      return { reply: finalResponse.text() };
    }

    // If no tool was called, return the direct text response
    return { reply: llmResponse.text() };
  }
);


export async function runCommand(
  input: CommandInput
): Promise<CommandOutput> {
  return await commandFlow(input);
}
