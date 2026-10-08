"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const roles = [
  { id: "student", label: "Student", icon: "🎓", description: "Learn skills and find jobs" },
  { id: "mentor", label: "Mentor", icon: "🤝", description: "Guide the next generation" },
];

export default function RegisterPage() {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    // TODO: Firebase Auth integration
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/dashboard";
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">FP</span>
            </div>
            <span className="font-bold text-2xl text-gray-900">FuturePath</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-6">Create your account</h1>
          <p className="text-gray-500 mt-1">Join thousands building their future</p>
        </div>

        <div className="card p-8">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  role === r.id
                    ? "border-brand-green bg-brand-green-muted"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                aria-pressed={role === r.id}
              >
                <span className="text-2xl block mb-1">{r.icon}</span>
                <p className="font-semibold text-sm text-gray-900">{r.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.description}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                aria-required="true"
                minLength={8}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm" role="alert">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account — It&apos;s Free"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            By signing up you agree to our{" "}
            <Link href="/terms" className="text-brand-green hover:underline">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-brand-green hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-brand-green font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
