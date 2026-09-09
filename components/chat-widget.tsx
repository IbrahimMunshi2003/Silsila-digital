"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronDown, LoaderCircle, Send, Sparkles, X } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };
const starter: Message = { role: "assistant", content: "Hi — I’m Silsila Digital AI, Ibrahim Munshi’s portfolio assistant. Ask me about a project, service, or how we could work together." };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([starter]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  async function submit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const outgoing: Message = { role: "user", content: text };
    setMessages((current) => [...current, outgoing]);
    setInput(""); setLoading(true);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [...messages, outgoing] }) });
      const data = await response.json();
      setMessages((current) => [...current, { role: "assistant", content: data.message ?? data.error ?? "I’m having trouble connecting right now." }]);
    } catch { setMessages((current) => [...current, { role: "assistant", content: "I’m having trouble connecting right now. Please try again shortly." }]); }
    finally { setLoading(false); setTimeout(() => inputRef.current?.focus(), 80); }
  }
  return <div className="fixed bottom-5 right-5 z-30 sm:bottom-7 sm:right-7">
    <AnimatePresence>
      {open && <motion.div initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} transition={{ duration: .2 }} className="glass mb-3 w-[calc(100vw-2.5rem)] overflow-hidden rounded-3xl sm:w-[370px]">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[.035] px-5 py-4"><div className="flex items-center gap-3"><span className="neon-ring grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/10"><Sparkles className="h-4 w-4 text-cyan-300" /></span><div><p className="text-sm font-semibold text-white">Silsila Digital AI</p><p className="text-[10px] uppercase tracking-widest text-cyan-300">Portfolio assistant · Online</p></div></div><button aria-label="Close chat" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button></div>
        <div className="max-h-[50vh] min-h-64 space-y-3 overflow-y-auto px-4 py-4">{messages.map((message, index) => <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><p className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${message.role === "user" ? "bg-indigo-500 text-white" : "border border-white/10 bg-white/[.055] text-slate-200"}`}>{message.content}</p></div>)}{loading && <div className="flex"><span className="rounded-2xl border border-white/10 bg-white/[.055] px-3 py-2 text-cyan-300"><LoaderCircle className="h-4 w-4 animate-spin" /></span></div>}</div>
        <form onSubmit={submit} className="flex gap-2 border-t border-white/10 bg-black/10 p-3"><input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything..." className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-500" /><button disabled={!input.trim() || loading} aria-label="Send message" className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400 text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40"><Send className="h-4 w-4" /></button></form>
      </motion.div>}
    </AnimatePresence>
    <button onClick={() => setOpen((value) => !value)} className="neon-ring group flex h-14 items-center gap-2 rounded-2xl border border-cyan-300/20 bg-slate-950/80 px-4 text-sm font-semibold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-300/50" aria-label="Open AI portfolio assistant">{open ? <ChevronDown className="h-5 w-5 text-cyan-300" /> : <><Bot className="h-5 w-5 text-cyan-300" /><span>Ask AI</span></>}</button>
  </div>;
}
