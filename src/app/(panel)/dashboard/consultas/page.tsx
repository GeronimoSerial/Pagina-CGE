'use client';

import { IconSend, IconRobot, IconUser, IconLoader } from '@tabler/icons-react';
import { useRef, useEffect, useState, FormEvent } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function ConsultasPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Read the streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      const assistantId = Math.random().toString(36).substring(7);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const content = line.substring(2).replace(/^"(.*)"$/, '$1');
                assistantMessage += content;

                setMessages((prev) => {
                  const existing = prev.find((m) => m.id === assistantId);
                  if (existing) {
                    return prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, content: assistantMessage }
                        : m,
                    );
                  } else {
                    return [
                      ...prev,
                      {
                        id: assistantId,
                        role: 'assistant',
                        content: assistantMessage,
                      },
                    ];
                  }
                });
              } catch (e) {
                // Ignore JSON parsing errors
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          role: 'assistant',
          content:
            'Lo siento, ocurrió un error al procesar tu consulta. Por favor, intenta de nuevo.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6">
          <IconRobot className="mr-3 h-6 w-6 text-primary" />
          <div>
            <h1 className="text-xl font-semibold">Consultas con IA</h1>
            <p className="text-sm text-muted-foreground">
              Pregunta sobre escuelas, empleados, asistencia y más
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <IconRobot className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
              <h2 className="mb-2 text-lg font-medium">
                Comienza una conversación
              </h2>
              <p className="text-sm text-muted-foreground">
                Puedo ayudarte a consultar información sobre:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                <li>• Escuelas y sus características</li>
                <li>• Empleados y personal</li>
                <li>• Registros de asistencia</li>
                <li>• Supervisión educativa</li>
                <li>• Estadísticas del sistema</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <IconRobot className="h-5 w-5 text-primary" />
                  </div>
                )}

                <div
                  className={`rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  } max-w-[80%]`}
                >
                  <div className="whitespace-pre-wrap break-words text-sm">
                    {message.content}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                    <IconUser className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <IconRobot className="h-5 w-5 text-primary" />
                </div>
                <div className="rounded-lg bg-muted px-4 py-3">
                  <IconLoader className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mx-auto max-w-3xl">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta aquí..."
                className="flex-1 rounded-lg border bg-background px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                <IconSend className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              La IA tiene acceso a la base de datos del sistema educativo
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
