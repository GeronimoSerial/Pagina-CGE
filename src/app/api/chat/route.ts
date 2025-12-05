/**
 * Chat API Route
 * AI-powered assistant for CGE dashboard queries
 */

import {
  streamText,
  UIMessage,
  convertToModelMessages,
  stepCountIs,
} from 'ai';
import { google } from '@ai-sdk/google';
import { chatTools, getSchema, getSystemPrompt } from './lib';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const model = google('gemini-2.5-flash-lite');
  const schema = getSchema();
  const systemPrompt = getSystemPrompt(schema);

  const result = streamText({
    model,
    system: systemPrompt,
    messages: convertToModelMessages(messages),
    tools: chatTools,
    stopWhen: stepCountIs(5),
    temperature: 0.7,
    topP: 1,
  });

  return result.toUIMessageStreamResponse();
}
