"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";

export default function RocketLaunch() {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "launch" | "done">("idle");

  const handleClick = () => {
    if (phase !== "idle") return;
    setPhase("launch");
    // Navigate once curtain has fully pulled up (0.9s)
    setTimeout(() => {
      setPhase("done");
      router.push("/auth");
    }, 900);
  };

  return (
    <>
      {/* ── Green curtain — starts at bottom, arrow drags it upward ── */}
      <AnimatePresence>
        {phase === "launch" && (
          <motion.div
            className="fixed inset-0 z-[200] bg-brand-green pointer-events-none flex flex-col items-center justify-center"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Logo fades in as curtain settles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.35 }}
              className="flex flex-col items-center gap-3"
            >
              <img src="/logo.png" alt="FuturePath" className="h-20 w-auto drop-shadow-lg" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Arrow button ── */}
      <motion.button
        onClick={handleClick}
        aria-label="Enter FuturePath"
        whileHover={phase === "idle" ? { scale: 1.08 } : {}}
        whileTap={phase === "idle" ? { scale: 0.95 } : {}}
        className="relative flex flex-col items-center gap-3 focus:outline-none group"
      >
        {/* Arrow — shoots up when launched */}
        <motion.div
          animate={
            phase === "launch"
              ? { y: -800, transition: { duration: 0.85, ease: "easeIn" } }
              : {}
          }
          className="relative z-10 flex flex-col items-center gap-3"
        >
          {/* Circular arrow button */}
          <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center group-hover:bg-white/10 transition-all duration-200">
            <ArrowUp className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>

          {/* Label */}
          <motion.span
            className="text-white font-semibold text-base tracking-wide"
            animate={phase !== "idle" ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            Begin Your Journey
          </motion.span>

          {/* Subtle bounce hint on idle */}
          {phase === "idle" && (
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowUp className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.div>
      </motion.button>
    </>
  );
}
