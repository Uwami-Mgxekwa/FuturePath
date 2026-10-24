"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User } from "lucide-react";
import { getReply, setVukaContext } from "@/lib/chatEngine";
import { useProfile } from "@/lib/ProfileContext";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  chips?: string[];
}

function getWelcome(name?: string): Message {
  const firstName = name ? name.split(" ")[0] : null;
  return {
    id: 0,
    role: "bot",
    text: `Sawubona${firstName ? `, ${firstName}` : ""}! I am **Vuka**, your FuturePath learning assistant.\n\nVuka means rise up in Zulu — and that is exactly what I am here to help you do.\n\nAsk me anything about courses, jobs, the CV builder, certificates, study further options, or your profile.`,
    chips: [
      "What courses do you offer?",
      "Tell me about bursaries",
      "How do I build a CV?",
      "Tell me about the Digital Safety course",
    ],
  };
}

function renderText(text: string) {
  return text.split("\n").map((line, i, arr) => {
    // Remove single asterisk italic markers, keep double asterisk bold
    const cleaned = line.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '$1');
    const parts = cleaned.split(/\*\*(.+?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

export default function AskAIPage() {
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([getWelcome()]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [ctxLoaded, setCtxLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load user context into Vuka
  useEffect(() => {
    async function loadCtx() {
      const user = auth.currentUser;
      if (!user) { setCtxLoaded(true); return; }
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const data = snap.exists() ? snap.data() : {};
        setVukaContext({
          name: profile.name || user.displayName || undefined,
          coursesInProgress: data.coursesInProgress ?? 0,
          certificatesEarned: data.certificatesEarned ?? 0,
          skills: data.skills?.map((s: { name: string }) => s.name) ?? [],
        });
        // Update welcome message with real name
        setMessages([getWelcome(profile.name || user.displayName || undefined)]);
      } catch {
        setVukaContext({ name: profile.name || undefined });
      }
      setCtxLoaded(true);
    }
    loadCtx();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.name]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || !ctxLoaded) return;
    setInput("");
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: trimmed }]);
    setTyping(true);
    setTimeout(() => {
      const response = getReply(trimmed);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "bot", text: response.text, chips: response.chips }]);
      setTyping(false);
    }, 600);
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-4rem)]">

      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-green flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-xl">V</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vuka</h1>
          <p className="text-gray-500 text-sm">Your FuturePath AI assistant · <em>vuka</em> means <em>rise up</em> in Zulu</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-1 pb-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className="flex-shrink-0 mt-1">
                {msg.role === "bot"
                  ? <div className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center"><span className="text-white font-bold text-xs">V</span></div>
                  : <User className="w-5 h-5 text-gray-400" />
                }
              </div>

              <div className="flex flex-col gap-2 max-w-[80%]">
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand-green text-white rounded-tr-sm"
                    : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-sm"
                }`}>
                  {renderText(msg.text)}
                </div>

                {msg.chips && msg.chips.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {msg.chips.map((chip) => (
                      <button key={chip} onClick={() => send(chip)}
                        className="text-xs px-3 py-1.5 rounded-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-all duration-150">
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 block"
                  animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-4 flex gap-3 border-t border-gray-100 pt-4">
        <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Vuka anything..." className="input flex-1" aria-label="Chat input" />
        <button type="submit" disabled={!input.trim()}
          className="btn-primary px-5 flex items-center gap-2 disabled:opacity-40" aria-label="Send">
          <Send className="w-4 h-4" />Send
        </button>
      </form>
    </div>
  );
}
