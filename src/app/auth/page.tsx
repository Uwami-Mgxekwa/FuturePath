"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, HandshakeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup";

const roles = [
  { id: "student", label: "Student", icon: GraduationCap, description: "Learn skills and find jobs" },
  { id: "mentor", label: "Mentor", icon: HandshakeIcon, description: "Guide the next generation" },
];

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (mode === "signup" && !name) { setError("Please enter your name."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); router.push("/dashboard"); }, 1200);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white relative">

      {/* ── LOGIN FORM — always left ── */}
      <div className="w-1/2 h-full flex items-center justify-center px-8 md:px-16 flex-shrink-0">
        <div className="w-full max-w-sm">
          <Link href="/" className="inline-flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="FuturePath" className="h-9 w-auto" />
            <span className="font-bold text-xl text-gray-900">FuturePath</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 mb-8">Sign in to continue your journey</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" placeholder="Email address" value={mode === "login" ? email : ""} onChange={(e) => setEmail(e.target.value)} className="input pl-11" autoComplete="email" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type={showPassword ? "text" : "password"} placeholder="Password" value={mode === "login" ? password : ""} onChange={(e) => setPassword(e.target.value)} className="input pl-11 pr-11" autoComplete="current-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-end">
              <Link href="/auth/reset" className="text-sm text-brand-green hover:underline">Forgot password?</Link>
            </div>
            {error && mode === "login" && <p className="text-red-500 text-sm" role="alert">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" /></svg>Signing in...</>
              ) : "Sign In"}
            </button>
            <p className="text-center text-sm text-gray-500">
              No account?{" "}
              <button type="button" onClick={() => setMode("signup")} className="text-brand-green font-semibold hover:underline">
                Sign up free
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* ── SIGNUP FORM — always right ── */}
      <div className="w-1/2 h-full flex items-center justify-center px-8 md:px-16 flex-shrink-0">
        <div className="w-full max-w-sm">
          <div className="inline-flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="FuturePath" className="h-9 w-auto" />
            <span className="font-bold text-xl text-gray-900">FuturePath</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-500 mb-8">Join thousands building their future</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3">
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <button key={r.id} type="button" onClick={() => setRole(r.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${role === r.id ? "border-brand-green" : "border-gray-200 hover:border-gray-300"}`}>
                    <Icon className={`w-5 h-5 mb-1 ${role === r.id ? "text-brand-green" : "text-gray-400"}`} strokeWidth={1.5} />
                    <p className="font-semibold text-sm text-gray-900">{r.label}</p>
                    <p className="text-xs text-gray-500">{r.description}</p>
                  </button>
                );
              })}
            </div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Full name" value={mode === "signup" ? name : ""} onChange={(e) => setName(e.target.value)} className="input pl-11" autoComplete="name" />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" placeholder="Email address" value={mode === "signup" ? email : ""} onChange={(e) => setEmail(e.target.value)} className="input pl-11" autoComplete="email" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type={showPassword ? "text" : "password"} placeholder="Password (min. 8 characters)" value={mode === "signup" ? password : ""} onChange={(e) => setPassword(e.target.value)} className="input pl-11 pr-11" autoComplete="new-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && mode === "signup" && <p className="text-red-500 text-sm" role="alert">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" /></svg>Creating account...</>
              ) : "Create Account"}
            </button>
            <p className="text-center text-sm text-gray-500">
              Have an account?{" "}
              <button type="button" onClick={() => setMode("login")} className="text-brand-green font-semibold hover:underline">
                Sign in
              </button>
            </p>
            <p className="text-center text-xs text-gray-400">
              By signing up you agree to our{" "}
              <Link href="/terms" className="text-brand-green hover:underline">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-brand-green hover:underline">Privacy Policy</Link>.
            </p>
          </form>
        </div>
      </div>

      {/* ── DIVIDER IMAGE PANEL — slides over login (left) or signup (right) ── */}
      <motion.div
        className="absolute top-0 h-full w-1/2 z-30 overflow-hidden shadow-2xl"
        animate={{ left: mode === "login" ? "50%" : "0%" }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* .jfif is just JPEG — use a plain img tag, not Next Image */}
        <img
          src="/divide.jfif"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Green overlay on top of image */}
        <div className="absolute inset-0 bg-brand-green/70" />

        {/* Branding + switch CTA */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-10 text-center">
          <div className="mb-4">
            <img src="/logo.png" alt="FuturePath" className="h-32 w-auto drop-shadow-lg" />
          </div>
          <h2 className="text-4xl font-bold mb-2 tracking-tight">FuturePath</h2>
          <p className="text-white/80 text-base max-w-xs leading-relaxed mb-10">
            Learn · Grow · Thrive
          </p>

          {/* Switch button on the image panel */}
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-white/70 text-sm">
              {mode === "login" ? "New to FuturePath?" : "Already have an account?"}
            </p>
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="px-8 py-2.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white hover:text-brand-green transition-all duration-200"
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
