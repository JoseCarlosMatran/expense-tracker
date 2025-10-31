'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export const ChatbotWidget = () => {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      setIsLoading(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error('Failed to call chatbot');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply ?? '' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'No pudimos obtener una respuesta en este momento. Intenta nuevamente en unos minutos.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage();
  };

  return (
    <div className="glass-panel flex h-full flex-col p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{t('contact.chatbot.title')}</h3>
          <p className="text-xs text-slate-400">{t('contact.chatbot.description')}</p>
        </div>
      </div>
      <div className="mt-6 flex-1 space-y-3 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-400">Pregúntanos sobre disponibilidad, precios o agenda.</p>
        ) : (
          messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                message.role === 'user'
                  ? 'ml-auto bg-ggup-secondary/20 text-white'
                  : 'bg-slate-900/60 text-slate-200'
              }`}
            >
              {message.content}
            </div>
          ))
        )}
        {isLoading ? (
          <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900/60 px-4 py-2 text-xs text-slate-300">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Escribiendo...
          </div>
        ) : null}
      </div>
      <form onSubmit={handleSubmit} className="mt-6 flex items-center gap-2">
        <input
          value={input}
          onChange={event => setInput(event.target.value)}
          className="flex-1 rounded-full border border-slate-800/60 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-ggup-secondary focus:outline-none"
          placeholder={t('contact.chatbot.placeholder')}
        />
        <button
          type="submit"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ggup-secondary text-slate-950 shadow-lg transition hover:scale-[1.05]"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
};

export default ChatbotWidget;
