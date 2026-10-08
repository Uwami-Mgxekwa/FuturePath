"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { getReply } from "@/lib/chatEngine";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  chips?: string[];
}

const WELCOME: Message = {
  id: 0,
  role: "bot",
  text: "Hey! 👋 I'm the FuturePath assistant. Ask me anything about courses, jobs, certificates, or mentorship.",
  chips: ["What courses do you offer?", "Are the courses free?", "How do I get a certificate?", "How does the job board work?"],
};

// Simple markdown-like renderer for **bold** and \n newlines
function renderText(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.+?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    );
  });
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");

    const userMsg: Message = { id: Date.now(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    // Slight delay to feel natural
    setTimeout(() => {
      const response = getReply(trimmed);
      const botMsg: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: response.text,
        chips: response.chips,
      };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 600);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? "Close assistant" : "Open AI assistant"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-green text-white shadow-lg flex items-center justify-center"
        style={{ boxShadow: "0 4px 20px rgba(0,166,81,0.4)" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
            style={{ height: "520px" }}
          >
            {/* Header */}
            <div className="bg-brand-green px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">FuturePath Assistant</p>
                <p className="text-white/70 text-xs mt-0.5">Always here to help</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex flex-col gap-2 max-w-[85%]">
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-brand-green text-white rounded-tr-sm"
                          : "bg-gray-100 text-gray-800 rounded-tl-sm"
                      }`}
                    >
                      {renderText(msg.text)}
                    </div>
                    {/* Suggestion chips */}
                    {msg.chips && msg.chips.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.chips.map((chip) => (
                          <button
                            key={chip}
                            onClick={() => send(chip)}
                            className="text-xs px-3 py-1.5 rounded-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-all duration-150"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gray-400 block"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-gray-100 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 text-sm px-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                aria-label="Chat input"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center disabled:opacity-40 transition-opacity"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
