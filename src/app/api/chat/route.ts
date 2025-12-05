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
    maxSteps: 8,
    stopWhen: stepCountIs(8),
    temperature: 0.7,
    topP: 1,
    onStepFinish: (step) => {
      console.log('--- STEP FINISHED ---');
      console.log('Reasoning:', step.reasoning || 'None');
      if (step.text) {
        console.log('Step text:', step.text);
      }
      try {
        if (step.response?.messages) {
          const assistantMsgs = step.response.messages.filter(
            (m: any) => m.role === 'assistant',
          );
          if (assistantMsgs.length > 0) {
            console.log(
              'Assistant messages in step:',
              JSON.stringify(assistantMsgs, null, 2),
            );
          }
        }
      } catch (e) {
        console.log('Error logging step response', e);
      }
      if (step.toolCalls.length > 0) {
        console.log('Tool Calls:', JSON.stringify(step.toolCalls, null, 2));
      }
      if (step.toolResults.length > 0) {
        console.log('Tool Results:', JSON.stringify(step.toolResults, null, 2));
      }
    },
    onFinish: (payload) => {
      console.log('--- STREAM FINISHED ---');
      console.log(
        'Finish reason:',
        payload.finishReason || 'unknown',
        'Steps:',
        payload.steps?.length ?? 'n/a',
      );
      try {
        if (payload.steps) {
          console.log(
            'Steps dump:',
            JSON.stringify(
              payload.steps.map((s: any) => ({
                finishReason: s.finishReason,
                text: s.text,
                toolCalls: s.toolCalls,
                toolResults: s.toolResults,
              })),
              null,
              2,
            ),
          );
        }
        if (payload.response) {
          console.log(
            'Full response (assistant messages):',
            JSON.stringify(
              payload.response.messages?.filter(
                (m: any) => m.role === 'assistant',
              ),
              null,
              2,
            ),
          );
        }
      } catch (e) {
        console.log('Error logging finish payload', e);
      }
    },
    onError: ({ error }) => {
      console.error('--- STREAM ERROR ---', error);
    },
  });

  return result.toUIMessageStreamResponse();
}
