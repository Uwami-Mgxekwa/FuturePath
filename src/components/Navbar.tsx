"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Briefcase, LayoutDashboard, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Jobs", href: "/jobs", icon: Briefcase },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
      {/* Floating pill container */}
      <nav className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-100 px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 flex-shrink-0">
            <img src="/logo.png" alt="FuturePath" className="h-8 w-auto" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-brand-green hover:bg-brand-green-muted transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Link
              href="/auth"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-brand-green transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/auth"
              className="px-4 py-2 rounded-full text-sm font-semibold bg-brand-green text-white hover:bg-brand-green-dark active:scale-95 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown — floats below the pill */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="max-w-5xl mx-auto mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 font-medium hover:bg-brand-green-muted hover:text-brand-green transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
              <hr className="my-2 border-gray-100" />
              <Link
                href="/auth/login"
                className="px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 text-center transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-3 rounded-xl text-sm font-semibold bg-brand-green text-white text-center hover:bg-brand-green-dark transition-colors"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
