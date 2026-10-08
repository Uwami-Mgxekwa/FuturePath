"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
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
  text: "Hi, I am the FuturePath assistant. Ask me anything about courses, jobs, certificates, or mentorship.",
  chips: [
    "What courses do you offer?",
    "Are the courses free?",
    "How do I get a certificate?",
    "How does the job board work?",
  ],
};

function renderText(text: string) {
  return text.split("\n").map((line, i, arr) => {
    const parts = line.split(/\*\*(.+?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

export default function AskAIPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");

    const userMsg: Message = { id: Date.now(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

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
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ask AI</h1>
            <p className="text-gray-500 text-sm">Your FuturePath assistant — ask anything about the platform</p>
          </div>
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
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === "bot" ? "bg-brand-green" : "bg-gray-200"
              }`}>
                {msg.role === "bot"
                  ? <Bot className="w-4 h-4 text-white" />
                  : <User className="w-4 h-4 text-gray-600" />
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

                {/* Chips */}
                {msg.chips && msg.chips.length > 0 && (
                  <div className="flex flex-wrap gap-2">
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
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {typing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gray-400 block"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex gap-3 border-t border-gray-100 pt-4"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about FuturePath..."
          className="input flex-1"
          aria-label="Chat input"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="btn-primary px-5 flex items-center gap-2 disabled:opacity-40"
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </form>
    </div>
  );
}
