'use client';

import { useChat } from '@ai-sdk/react';
import { ChatHeader } from '@/features/dashboard/modules/consultas/components/chat-header';
import { ChatInput } from '@/features/dashboard/modules/consultas/components/chat-input';
import { ChatMessages } from '@/features/dashboard/modules/consultas/components/chat-messages';
import { useCallback, useState } from 'react';

export default function ConsultasClientPage() {
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, stop } = useChat({});

  console.log('Chat status:', status);
  console.log('Messages:', messages);

  const isLoading = status === 'streaming' || status === 'submitted';

  const handleSubmit = useCallback(() => {
    console.log('Submit clicked, input:', input, 'isLoading:', isLoading);
    if (!input?.trim() || isLoading) return;

    console.log('Sending message:', input);
    sendMessage({ text: input });
    setInput('');
  }, [input, isLoading, sendMessage]);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      sendMessage({ text: suggestion });
    },
    [sendMessage],
  );

  return (
    <div className="flex h-[calc(100vh-var(--header-height))] flex-col">
      <ChatHeader />
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        onSuggestionClick={handleSuggestionClick}
      />
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        onStop={stop}
        isLoading={isLoading}
      />
    </div>
  );
}
