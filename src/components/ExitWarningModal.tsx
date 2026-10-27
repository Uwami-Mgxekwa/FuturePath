"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, AlertTriangle } from "lucide-react";

interface ExitWarningModalProps {
  url: string;
  jobTitle: string;
  company: string;
  source: string;
  onClose: () => void;
}

export default function ExitWarningModal({
  url,
  jobTitle,
  company,
  source,
  onClose,
}: ExitWarningModalProps) {
  function handleContinue() {
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-tight">
                  You are leaving FuturePath
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">External job listing</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Job summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 mb-4 border border-gray-100 dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{jobTitle}</p>
            <p className="text-sm text-gray-500 mt-0.5">{company}</p>
            <p className="text-xs text-gray-400 mt-1">
              Listing sourced from <span className="text-brand-green font-medium">{source}</span>
            </p>
          </div>

          {/* Warning text */}
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
            You are about to visit an external website. FuturePath does not control the content,
            privacy practices, or job application process on third-party platforms.
            Please do not pay any fees to apply for a job.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="btn-secondary flex-1 text-sm py-2.5"
            >
              Go back
            </button>
            <button
              onClick={handleContinue}
              className="btn-primary flex-1 text-sm py-2.5 flex items-center justify-center gap-2"
            >
              Continue
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
