/**
 * Chat API Route
 * AI-powered assistant for CGE dashboard queries
 */

import { streamText, UIMessage, convertToModelMessages, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { chatTools, getSchema, getSystemPrompt } from './lib';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Log user input
  const lastMessage = messages[messages.length - 1];
  console.log('--- NEW CHAT REQUEST ---');
  console.log('User Input:', lastMessage);

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
    onStepFinish: (step) => {
      console.log('--- STEP FINISHED ---');
      console.log('Reasoning:', step.reasoning || 'None');
      if (step.toolCalls.length > 0) {
        console.log('Tool Calls:', JSON.stringify(step.toolCalls, null, 2));
      }
      if (step.toolResults.length > 0) {
        console.log('Tool Results:', JSON.stringify(step.toolResults, null, 2));
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
