import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';
import { prisma } from '@/features/dashboard/lib/prisma';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
    system: `You are a helpful assistant for the CGE (Consejo General de Educación) dashboard system. 
    You can help users query information about schools (escuelas), employees (empleados), 
    attendance (asistencia), supervision, and statistics (estadísticas).
    
   Always be clear, concise, and helpful in your responses.
    Format data in a readable way using tables or bullet points when appropriate.
    
    Database schemas available:
    - institucional: schools, employees, supervisors, departments
    - asistencia: attendance records
    - relevamiento: school surveys and data collection
    
    When discussing data, remember:
    - CUE is the unique identifier for schools
    - Legajo is the unique identifier for employees
    - Provide context and explanations with any information you share
    
    You can query the database directly to get real-time information. Ask the user what they would like to know!`,
  });

  return result.toTextStreamResponse();
}
