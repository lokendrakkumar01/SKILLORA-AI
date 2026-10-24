import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp, Brain, ChevronDown, LoaderCircle, MessageCircle, Sparkles, Trash2, X } from 'lucide-react';
import { aiApi } from '../../api/roadmaps';

type ChatMessage = { role: 'user' | 'assistant'; content: string; error?: boolean; retryContent?: string };
const STORAGE_KEY = 'skillora_global_ai_messages';
const STARTERS = ['Explain a topic in simple words', 'Help me plan my next study session', 'How can I stay consistent while learning?'];

function readMessages(): ChatMessage[] {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((item) => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string').slice(-30) : [];
  } catch { return []; }
}

export function GlobalAiAssistant() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(readMessages);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const page = useMemo(() => {
    if (location.pathname.startsWith('/dashboard')) return 'Dashboard';
    if (location.pathname.startsWith('/roadmap')) return 'Learning roadmap';
    if (location.pathname.startsWith('/quizzes')) return 'Quizzes';
    if (location.pathname.startsWith('/leaderboard')) return 'Leaderboard';
    if (location.pathname.startsWith('/achievements')) return 'Achievements';
    if (location.pathname.startsWith('/profile')) return 'Profile';
    if (location.pathname.startsWith('/settings')) return 'Settings';
    return 'Learning workspace';
  }, [location.pathname]);

  useEffect(() => { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30))); }, [messages]);
  useEffect(() => { if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [open, messages, busy]);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Lessons already have a dedicated context-aware tutor panel.
  if (location.pathname.startsWith('/lesson/')) return null;

  const send = async (override?: string, retryIndex?: number) => {
    const prompt = (override ?? input).trim();
    if (!prompt || busy) return;
    const cleanHistory = messages.filter((message, index) => {
      if (message.error || messages[index + 1]?.error) return false;
      if (typeof retryIndex === 'number' && (index === retryIndex || index === retryIndex - 1)) return false;
      return true;
    });
    const pending: ChatMessage[] = [...cleanHistory, { role: 'user', content: prompt }];
    setMessages(pending);
    setInput('');
    setBusy(true);
    try {
      const response = await aiApi.chat(prompt, { page, route: location.pathname }, cleanHistory);
      const answer = response.data?.response;
      if (typeof answer !== 'string' || !answer.trim()) throw new Error('The AI assistant returned an empty reply. Please try again.');
      setMessages([...pending, { role: 'assistant', content: answer.trim() }]);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'The AI assistant could not reply. Check your connection and try again.';
      setInput(prompt);
      setMessages([...pending, { role: 'assistant', content: message, error: true, retryContent: prompt }]);
    } finally { setBusy(false); }
  };

  return <>
    <button type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close AI assistant' : 'Open AI assistant'} aria-expanded={open}
      className="global-ai-trigger fixed z-40 flex items-center gap-2 rounded-full border border-violet-300/25 bg-violet-600 px-4 py-3 text-sm font-bold text-white shadow-[0_10px_35px_rgba(109,40,217,.35)] transition hover:-translate-y-0.5 hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300">
      {open ? <ChevronDown className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}<span>{open ? 'Close' : 'Ask AI'}</span>
    </button>
    <AnimatePresence>
      {open && <motion.section role="dialog" aria-label="Skillora AI Assistant" aria-modal="false"
        initial={{ opacity: 0, y: 14, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: .98 }} transition={{ duration: .18 }}
        className="global-ai-panel fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#10121b] shadow-[0_24px_80px_rgba(0,0,0,.55)]">
        <header className="flex items-center justify-between border-b border-white/8 bg-white/[.025] px-4 py-3.5">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/15 text-violet-300"><Brain className="h-5 w-5" /></div><div><h2 className="text-sm font-bold text-white">Skillora AI</h2><p className="text-xs text-slate-400">Your learning assistant · {page}</p></div></div>
          <div className="flex items-center gap-1"><button type="button" title="Start a new chat" aria-label="Start a new chat" disabled={!messages.length || busy} onClick={() => setMessages([])} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-40"><Trash2 className="h-4 w-4" /></button><button type="button" title="Close assistant" aria-label="Close assistant" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"><X className="h-4 w-4" /></button></div>
        </header>
        <div className="global-ai-messages flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
          {!messages.length && <div className="flex min-h-full flex-col justify-center"><div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-violet-300"><MessageCircle className="h-5 w-5" /></div><h3 className="text-lg font-bold text-white">What are you learning today?</h3><p className="mt-1 mb-5 text-sm leading-6 text-slate-400">Ask for an explanation, study plan, or a little guidance to keep moving.</p><div className="space-y-2">{STARTERS.map((starter) => <button key={starter} type="button" onClick={() => setInput(starter)} className="block w-full rounded-xl border border-white/8 bg-white/[.025] px-3 py-2.5 text-left text-xs text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/5">{starter}<span className="float-right text-violet-300">↗</span></button>)}</div></div>}
          {messages.map((message, index) => <div key={`${index}-${message.role}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-md bg-violet-600 text-white' : message.error ? 'rounded-bl-md border border-rose-400/20 bg-rose-400/5 text-rose-200' : 'rounded-bl-md border border-white/8 bg-white/[.04] text-slate-200'}`}><div className="whitespace-pre-wrap break-words">{message.content}</div>{message.error && message.retryContent && <button type="button" disabled={busy} onClick={() => void send(message.retryContent, index)} className="mt-2 text-xs font-semibold text-violet-300 underline underline-offset-2 disabled:opacity-50">Try again</button>}</div></div>)}
          {busy && <div className="flex items-center gap-2 text-xs text-slate-400"><LoaderCircle className="h-4 w-4 animate-spin text-violet-300" />Thinking through it…</div>}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={(event) => { event.preventDefault(); void send(); }} className="border-t border-white/8 p-3">
          <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-[#0b0d14] p-2 focus-within:border-violet-400/45"><textarea value={input} onChange={(event) => setInput(event.target.value.slice(0, 4000))} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void send(); } }} maxLength={4000} rows={2} placeholder="Ask anything about learning…" aria-label="Message the AI assistant" className="max-h-28 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-5 text-white outline-none placeholder:text-slate-500" /><button type="submit" disabled={busy || !input.trim()} aria-label="Send message" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-violet-600 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40">{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-5 w-5" />}</button></div>
          <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-slate-500"><span>AI can make mistakes. Check important details.</span><span>{input.length}/4000</span></div>
        </form>
      </motion.section>}
    </AnimatePresence>
  </>;
}
