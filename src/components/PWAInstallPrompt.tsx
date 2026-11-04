"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share, Plus } from "lucide-react";
import Image from "next/image";

/* BeforeInstallPromptEvent is not in the standard TS lib */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY  = "pwa-install-dismissed";
const VISIT_KEY      = "pwa-visit-count";
const MIN_VISITS     = 2;   // show only after this many visits
const DELAY_MS       = 15000; // 15 s after page load

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
  );
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner]         = useState(false);
  const [isIOSDevice, setIsIOSDevice]       = useState(false);

  useEffect(() => {
    // Don't show if already installed or permanently dismissed
    if (isInStandaloneMode()) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // Increment visit count — only show after MIN_VISITS
    const visits = parseInt(localStorage.getItem(VISIT_KEY) || "0", 10) + 1;
    localStorage.setItem(VISIT_KEY, String(visits));
    if (visits < MIN_VISITS) return;

    const ios = isIOS();
    setIsIOSDevice(ios);

    if (ios) {
      const t = setTimeout(() => setShowBanner(true), DELAY_MS);
      return () => clearTimeout(t);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), DELAY_MS);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setShowBanner(false);
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") localStorage.setItem(DISMISSED_KEY, "1");
    setShowBanner(false);
    setDeferredPrompt(null);
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm"
          role="dialog"
          aria-label="Install FuturePath"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-4">
            <div className="flex items-start gap-3">
              {/* App icon */}
              <Image
                src="/icons/icon-96x96.png"
                alt="FuturePath"
                width={48}
                height={48}
                className="rounded-xl flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">
                  Add FuturePath to your home screen
                </p>

                {isIOSDevice ? (
                  /* iOS — manual instructions */
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    Tap{" "}
                    <Share className="w-3.5 h-3.5 inline-block text-blue-500 mx-0.5" />
                    {" "}then{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Add to Home Screen
                    </span>
                    <Plus className="w-3 h-3 inline-block text-gray-500 mx-0.5" />
                  </p>
                ) : (
                  /* Android/Chrome — one-tap install */
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Get the full app experience, works offline too.
                  </p>
                )}

                {!isIOSDevice && (
                  <button
                    onClick={handleInstall}
                    className="mt-2.5 w-full btn-primary text-sm py-2"
                  >
                    Install App
                  </button>
                )}
              </div>

              {/* Dismiss */}
              <button
                onClick={dismiss}
                aria-label="Dismiss install prompt"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
