'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-business-insights.ts';
import '@/ai/flows/summarize-daily-activity.ts';
import '@/ai/flows/chat.ts';
import '@/ai/flows/command-flow.ts';
