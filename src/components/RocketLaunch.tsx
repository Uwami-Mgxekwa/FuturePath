"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function RocketLaunch() {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "rumble" | "launch" | "done">("idle");

  const handleClick = () => {
    if (phase !== "idle") return;

    // Phase 1 — rumble / ignition (0.6s)
    setPhase("rumble");

    // Phase 2 — rocket flies + curtain rises (0.6s → 1.5s)
    setTimeout(() => setPhase("launch"), 600);

    // Phase 3 — curtain fully covers screen, navigate
    setTimeout(() => {
      setPhase("done");
      router.push("/auth");
    }, 1700);
  };

  return (
    <>
      {/* ── Green curtain ── rises from bottom when launch starts */}
      <AnimatePresence>
        {phase === "launch" && (
          <motion.div
            className="fixed inset-0 z-[200] bg-brand-green pointer-events-none flex items-center justify-center"
            // Start fully off-screen below, slide up to cover entire viewport
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "0%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* FuturePath wordmark fades in as curtain covers screen */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <span className="text-brand-green font-bold text-lg">FP</span>
              </div>
              <span className="text-white font-bold text-2xl tracking-wide">FuturePath</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main rocket button ── */}
      <div className="relative flex flex-col items-center justify-center">

        {/* Smoke / exhaust particles */}
        <AnimatePresence>
          {(phase === "rumble" || phase === "launch") && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-white/40"
                  initial={{ y: 0, opacity: 0.8, scale: 1 }}
                  animate={{
                    y: [0, 12 + i * 4, 30 + i * 6],
                    x: (i - 2.5) * 8,
                    opacity: [0.6, 0.3, 0],
                    scale: [1, 1.8, 2.4],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.05,
                    ease: "easeOut",
                    repeat: phase === "rumble" ? Infinity : 0,
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Rocket button */}
        <motion.button
          onClick={handleClick}
          aria-label="Launch — go to login"
          animate={
            phase === "rumble"
              ? {
                  x: [0, -4, 4, -3, 3, -2, 2, 0],
                  transition: { duration: 0.6, ease: "easeInOut" },
                }
              : phase === "launch"
              ? {
                  y: -700,
                  scale: 0.5,
                  transition: { duration: 0.9, ease: "easeIn" },
                }
              : {}
          }
          whileHover={phase === "idle" ? { scale: 1.06 } : {}}
          whileTap={phase === "idle" ? { scale: 0.97 } : {}}
          className="relative flex flex-col items-center gap-3 focus:outline-none"
        >
          {/* Pulsing glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-brand-green/30 blur-xl"
            animate={
              phase === "idle"
                ? { scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }
                : { opacity: 0 }
            }
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Rocket SVG */}
          <motion.div
            className="relative z-10"
            animate={
              phase === "rumble"
                ? {
                    rotate: [0, -2, 2, -1, 1, 0],
                    transition: { duration: 0.6, ease: "easeInOut" },
                  }
                : {}
            }
          >
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M36 8C36 8 22 22 22 40H50C50 22 36 8 36 8Z" fill="white" fillOpacity="0.95" />
              <path d="M36 6C32 14 28 20 26 26H46C44 20 40 14 36 6Z" fill="#00A651" />
              <circle cx="36" cy="33" r="5" fill="#00A651" fillOpacity="0.9" />
              <circle cx="36" cy="33" r="3" fill="white" fillOpacity="0.5" />
              <path d="M22 40L16 52L26 46Z" fill="white" fillOpacity="0.8" />
              <path d="M50 40L56 52L46 46Z" fill="white" fillOpacity="0.8" />
              <rect x="26" y="46" width="20" height="4" rx="2" fill="white" fillOpacity="0.7" />
              {phase !== "idle" && (
                <>
                  <ellipse cx="33" cy="54" rx="3" ry="5" fill="#FF6B00" fillOpacity="0.9" />
                  <ellipse cx="36" cy="56" rx="4" ry="7" fill="#FFB800" fillOpacity="0.8" />
                  <ellipse cx="39" cy="54" rx="3" ry="5" fill="#FF6B00" fillOpacity="0.9" />
                  <ellipse cx="36" cy="54" rx="2" ry="4" fill="white" fillOpacity="0.6" />
                </>
              )}
            </svg>
          </motion.div>

          {/* Label */}
          <motion.span
            className="relative z-10 text-white font-semibold text-lg tracking-wide"
            animate={phase !== "idle" ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {phase === "idle" ? "Launch Your Future" : phase === "rumble" ? "Igniting..." : ""}
          </motion.span>

          {/* Hint */}
          {phase === "idle" && (
            <motion.span
              className="relative z-10 text-white/50 text-xs"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              click to begin
            </motion.span>
          )}
        </motion.button>
      </div>
    </>
  );
}
