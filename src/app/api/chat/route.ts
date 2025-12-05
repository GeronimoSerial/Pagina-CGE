import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Get a language model
  const model = google('gemini-2.0-flash');

  // Call the language model with the prompt
  const result = streamText({
    model,
    system: `Sos un asistente de IA del panel de control del CGE (Consejo General de Educación) de Corrientes, Argentina.
Ayudás a los usuarios a consultar información sobre escuelas, empleados, asistencia, supervisión y estadísticas del sistema educativo.

Pautas de respuesta:
- Sé claro, conciso y útil en tus respuestas
- Respondé siempre en español argentino
- Formateá los datos de manera legible usando listas o tablas markdown cuando sea apropiado
- Si no tenés información específica, indicalo claramente

Contexto del sistema:
- CUE es el identificador único de escuelas
- Legajo es el identificador único de empleados
- El sistema maneja datos de asistencia biométrica (huella)
- Las escuelas están organizadas por supervisión y departamento

Esquemas de base de datos disponibles:
- institucional: escuelas, empleados, supervisores, departamentos
- huella (asistencia): registros de asistencia biométrica
- relevamiento: encuestas y recolección de datos de escuelas

Cuando discutas datos, proporcioná contexto y explicaciones junto con cualquier información que compartas.`,
    messages: convertToModelMessages(messages),
    temperature: 0.7,
    topP: 1,
  });

  // Respond with a streaming response
  return result.toUIMessageStreamResponse();
}
