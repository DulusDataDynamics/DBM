'use server';

/**
 * @fileOverview A simple chatbot flow.
 *
 * - chat - A function that takes a user's message and returns a reply.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.string().describe('The user\'s message to the chatbot.');
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  reply: z.string().describe('The chatbot\'s reply to the user.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return { reply: "This feature is under construction." };
}
