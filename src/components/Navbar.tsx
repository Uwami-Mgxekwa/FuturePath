"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-3 left-0 right-0 z-50 px-4 sm:px-6">
      {/* Floating pill */}
      <nav className="max-w-lg mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full shadow-md border border-gray-100 dark:border-gray-800 px-4 sm:px-5">
        <div className="flex items-center justify-between h-14 gap-3">

          {/* Logo */}
          <Link href="/" className="inline-flex items-center flex-shrink-0">
            <img src="/logo.png" alt="FuturePath" className="h-8 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 flex-shrink-0">
            <Link href="/auth" className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-green transition-colors">
              Sign In
            </Link>
            <Link href="/auth" className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-green transition-colors">
              Sign Up
            </Link>
            <Link href="/about" className="px-4 py-2 rounded-full text-sm font-semibold bg-brand-green text-white hover:bg-brand-green-dark active:scale-95 transition-all duration-200">
              Learn About FuturePath
            </Link>

            {/* Theme toggle — unique sun/moon pill */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="ml-1 relative w-14 h-7 rounded-full border-2 border-brand-green transition-colors duration-300 flex items-center px-0.5"
              style={{ background: theme === "dark" ? "#1f2937" : "#E6F7EE" }}
            >
              <motion.div
                animate={{ x: theme === "dark" ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                style={{ background: theme === "dark" ? "#00A651" : "#00A651" }}
              >
                {theme === "dark"
                  ? <Moon className="w-3 h-3 text-white" />
                  : <Sun className="w-3 h-3 text-white" />
                }
              </motion.div>
            </button>
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-2">
            {/* Theme toggle mobile */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="relative w-12 h-6 rounded-full border-2 border-brand-green flex items-center px-0.5"
              style={{ background: theme === "dark" ? "#1f2937" : "#E6F7EE" }}
            >
              <motion.div
                animate={{ x: theme === "dark" ? 22 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                style={{ background: "#00A651" }}
              >
                {theme === "dark"
                  ? <Moon className="w-2.5 h-2.5 text-white" />
                  : <Sun className="w-2.5 h-2.5 text-white" />
                }
              </motion.div>
            </button>

            <button
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-4 h-4 text-gray-700 dark:text-gray-300" /> : <Menu className="w-4 h-4 text-gray-700 dark:text-gray-300" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="max-w-lg mx-auto mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              <Link href="/auth" className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-center transition-colors" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/auth" className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-center transition-colors" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
              <Link href="/about" className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand-green text-white text-center hover:bg-brand-green-dark transition-colors" onClick={() => setMenuOpen(false)}>
                Learn About FuturePath
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
