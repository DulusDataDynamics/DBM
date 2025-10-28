import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      // The Gemini API key is read from the `GEMINI_API_KEY` environment variable.
    }),
  ],
  logLevel: 'debug',
  model: 'googleai/gemini-2.5-flash',
});
