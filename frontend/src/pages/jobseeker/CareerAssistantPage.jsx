import React, { useState } from 'react';
import {
  BrainCircuit,
  Send,
  User,
  Sparkles,
  Bot,
  Lightbulb,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import api from '../../services/api';

const CareerAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello! I am your **HireMatch AI Career Assistant**.\n\nI can help you with:\n- **Resume Enhancement**: Optimizing for ATS keywords and quantifiable achievements.\n- **Interview Preparation**: Behavioral (STAR method) and technical deep-dives.\n- **Skill Roadmaps**: Bridging skill gaps for targeted full-stack or AI roles.\n- **Salary Negotiation**: Effective benchmark-backed strategies.\n\nWhat would you like to explore today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'How do I optimize my resume for ATS screening?',
    'Give me full-stack MERN interview questions.',
    'What skills should I learn for an AI/ML Engineer role?',
    'How should I negotiate salary for an entry-to-mid engineering role?',
  ];

  const handleSendMessage = async (textToSend) => {
    const message = textToSend || input;
    if (!message.trim() || loading) return;

    // Append user message
    const newMessages = [...messages, { sender: 'user', text: message }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/recommendations/assistant', { message });
      if (res.success) {
        setMessages([
          ...newMessages,
          {
            sender: 'assistant',
            text: res.data.reply,
            source: res.data.source,
          },
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          sender: 'assistant',
          text: 'I encountered an issue processing your request. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 mb-2">
          <Bot className="w-3.5 h-3.5" /> AI Guidance
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Career Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Instant career coaching on resumes, technical interviews, and professional roadmap planning.
        </p>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition"
          >
            "{prompt}"
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[520px]">
        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-tl-xs'
                }`}
              >
                {m.text}
                {m.source && (
                  <p className="mt-2 text-[10px] text-slate-400 font-semibold border-t border-slate-200 dark:border-slate-700 pt-1">
                    Powered by: {m.source}
                  </p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 font-medium">
                Assistant is formulating structured career advice...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about resumes, interviews, or engineering skills..."
            className="flex-1 py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CareerAssistantPage;
