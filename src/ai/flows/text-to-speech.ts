'use server';
/**
 * @fileOverview A text-to-speech flow.
 *
 * - textToSpeech - A function that converts text to speech.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TextToSpeechOutputSchema = z.object({
  audio: z.string().describe('The base64 encoded audio data in data URI format.'),
});


export async function textToSpeech(input: string) {
  return { audio: "" };
}
