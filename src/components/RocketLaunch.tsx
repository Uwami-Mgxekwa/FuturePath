"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";

export default function RocketLaunch() {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "launch">("idle");

  const handleClick = () => {
    if (phase !== "idle") return;
    setPhase("launch");

    // Prefetch the auth page immediately so it's ready
    router.prefetch("/auth");

    // Navigate as soon as the curtain starts rising — don't wait for it to finish.
    // The curtain stays on screen covering the home page while Next.js loads /auth.
    // By the time the curtain reaches the top (~0.85s), auth page is already loaded.
    setTimeout(() => {
      router.push("/auth");
    }, 200);
  };

  return (
    <>
      {/* ── Green curtain ── */}
      {/* Stays mounted the entire time — never removed, so no flash of home page */}
      <motion.div
        className="fixed inset-0 z-[200] bg-brand-green pointer-events-none flex flex-col items-center justify-center"
        initial={{ y: "100%" }}
        animate={{ y: phase === "launch" ? "0%" : "100%" }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase === "launch" ? 1 : 0, y: phase === "launch" ? 0 : 20 }}
          transition={{ delay: 0.45, duration: 0.35 }}
          className="flex flex-col items-center gap-3"
        >
          <img src="/logo.png" alt="FuturePath" className="h-20 w-auto drop-shadow-lg" />
        </motion.div>
      </motion.div>

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
          <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center group-hover:bg-white/10 transition-all duration-200">
            <ArrowUp className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>

          <motion.span
            className="text-white font-semibold text-base tracking-wide"
            animate={phase !== "idle" ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            Begin Your Journey
          </motion.span>

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
