"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, CreditCard, Calendar, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup";

const SA_PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape",
];

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

/* ── SA ID parser ────────────────────────────────────────────── */
function parseIdNumber(id: string): { dob: string; age: string; gender: string } | null {
  if (id.length !== 13 || !/^\d{13}$/.test(id)) return null;

  const yy = parseInt(id.slice(0, 2));
  const mm = parseInt(id.slice(2, 4));
  const dd = parseInt(id.slice(4, 6));
  const genderDigit = parseInt(id[6]);

  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;

  // Determine century: if yy > current 2-digit year, assume 1900s, else 2000s
  const currentYY = new Date().getFullYear() % 100;
  const yyyy = yy > currentYY ? 1900 + yy : 2000 + yy;

  const dob = `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
  const today = new Date();
  const birthDate = new Date(yyyy, mm - 1, dd);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;

  const gender = genderDigit >= 5 ? "Male" : "Female";

  return { dob, age: String(age), gender };
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginEmail || !loginPassword) { setError("Please fill in all fields."); return; }
    if (loginPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); router.push("/dashboard"); }, 1200);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !phone || !age || !gender || !idNumber || !province || !city) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (idNumber.length !== 13 || !/^\d+$/.test(idNumber)) {
      setError("ID number must be 13 digits.");
      return;
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 14 || ageNum > 38) {
      setError("Age must be between 14 and 38.");
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); router.push("/dashboard"); }, 1200);
  };

  function handleIdChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 13);
    setIdNumber(digits);
    if (digits.length === 13) {
      const parsed = parseIdNumber(digits);
      if (parsed) {
        setAge(parsed.age);
        setGender(parsed.gender);
      }
    }
  }

  const spinner = (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
    </svg>
  );

  return (
    <div className="min-h-screen w-screen bg-white relative">

      {/* ══════════════ MOBILE LAYOUT (hidden on md+) ══════════════ */}
      <div className="flex flex-col md:hidden min-h-screen px-6 py-10">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-3 mb-8">
          <img src="/logo.png" alt="FuturePath" className="h-8 w-auto" />
          <span className="font-bold text-xl text-gray-900">FuturePath</span>
        </Link>

        {/* Tab switcher */}
        <div className="flex rounded-xl border border-gray-200 mb-8 overflow-hidden">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${mode === "login" ? "bg-brand-green text-white" : "text-gray-500 bg-white"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${mode === "signup" ? "bg-brand-green text-white" : "text-gray-500 bg-white"}`}
          >
            Sign Up
          </button>
        </div>

        {/* Login form — mobile */}
        {mode === "login" && (
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 mb-6 text-sm">Sign in to continue your journey</p>
            <form onSubmit={handleLogin} noValidate className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="Email address" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="input pl-11" autoComplete="email" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="input pl-11 pr-11" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link href="/auth/reset" className="text-sm text-brand-green hover:underline">Forgot password?</Link>
              </div>
              {error && mode === "login" && <p className="text-red-500 text-sm" role="alert">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <>{spinner} Signing in...</> : "Sign In"}
              </button>
            </form>
          </div>
        )}

        {/* Signup form — mobile */}
        {mode === "signup" && (
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
            <p className="text-gray-500 mb-6 text-sm">Join thousands building their future</p>
            <form onSubmit={handleSignup} noValidate className="space-y-3">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="input pl-11" autoComplete="name" />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-11" autoComplete="email" />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" placeholder="Cellphone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="input pl-11" autoComplete="tel" maxLength={10} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className={`input pl-11 ${idNumber.length === 13 ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`} readOnly={idNumber.length === 13} min={14} max={38} />
                </div>
                <div className="relative">
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select value={gender} onChange={(e) => setGender(e.target.value)} disabled={idNumber.length === 13} className={`input pr-10 appearance-none text-gray-700 ${idNumber.length === 13 ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}>
                    <option value="">Gender</option>
                    {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="SA ID number (13 digits)" value={idNumber} onChange={(e) => handleIdChange(e.target.value)} className="input pl-11 tracking-widest" maxLength={13} inputMode="numeric" />
              </div>
              <p className="text-xs text-gray-400 -mt-1 pl-1">Gender and date of birth are read from your ID automatically.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select value={province} onChange={(e) => setProvince(e.target.value)} className="input pl-11 pr-10 appearance-none text-gray-700">
                    <option value="">Province</option>
                    {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="City / Town" value={city} onChange={(e) => setCity(e.target.value)} className="input pl-11" />
                </div>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? "text" : "password"} placeholder="Password (min. 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-11 pr-11" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && mode === "signup" && <p className="text-red-500 text-sm" role="alert">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <>{spinner} Creating account...</> : "Create Account"}
              </button>
              <p className="text-center text-xs text-gray-400">
                By signing up you agree to our{" "}
                <Link href="/terms" className="text-brand-green hover:underline">Terms</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-brand-green hover:underline">Privacy Policy</Link>.
              </p>
            </form>
          </div>
        )}
      </div>

      {/* ══════════════ DESKTOP LAYOUT (hidden on mobile) ══════════════ */}
      <div className="hidden md:flex h-screen w-screen overflow-hidden relative">

        {/* ── LOGIN PANEL ── */}
        <div className="w-1/2 h-full flex items-center justify-center px-8 md:px-16 flex-shrink-0">
          <div className="w-full max-w-sm">
            <Link href="/" className="inline-flex items-center gap-3 mb-10">
              <img src="/logo.png" alt="FuturePath" className="h-9 w-auto" />
              <span className="font-bold text-xl text-gray-900">FuturePath</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 mb-8">Sign in to continue your journey</p>
            <form onSubmit={handleLogin} noValidate className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="Email address" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="input pl-11" autoComplete="email" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="input pl-11 pr-11" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link href="/auth/reset" className="text-sm text-brand-green hover:underline">Forgot password?</Link>
              </div>
              {error && mode === "login" && <p className="text-red-500 text-sm" role="alert">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <>{spinner} Signing in...</> : "Sign In"}
              </button>
              <p className="text-center text-sm text-gray-500">
                No account?{" "}
                <button type="button" onClick={() => setMode("signup")} className="text-brand-green font-semibold hover:underline">Sign up free</button>
              </p>
            </form>
          </div>
        </div>

        {/* ── SIGNUP PANEL ── */}
        <div className="w-1/2 h-full flex items-center justify-center px-8 md:px-16 flex-shrink-0 overflow-y-auto">
          <div className="w-full max-w-sm py-10">
            <div className="inline-flex items-center gap-3 mb-8">
              <img src="/logo.png" alt="FuturePath" className="h-9 w-auto" />
              <span className="font-bold text-xl text-gray-900">FuturePath</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Create account</h1>
            <p className="text-gray-500 mb-6">Join thousands building their future</p>
            <form onSubmit={handleSignup} noValidate className="space-y-3">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="input pl-11" autoComplete="name" />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-11" autoComplete="email" />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" placeholder="Cellphone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="input pl-11" autoComplete="tel" maxLength={10} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className={`input pl-11 ${idNumber.length === 13 ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`} readOnly={idNumber.length === 13} min={14} max={38} />
                </div>
                <div className="relative">
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select value={gender} onChange={(e) => setGender(e.target.value)} disabled={idNumber.length === 13} className={`input pr-10 appearance-none text-gray-700 ${idNumber.length === 13 ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}>
                    <option value="">Gender</option>
                    {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="SA ID number (13 digits)" value={idNumber} onChange={(e) => handleIdChange(e.target.value)} className="input pl-11 tracking-widest" maxLength={13} inputMode="numeric" />
              </div>
              <p className="text-xs text-gray-400 -mt-1 pl-1">Your gender and date of birth are read from your ID automatically.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select value={province} onChange={(e) => setProvince(e.target.value)} className="input pl-11 pr-10 appearance-none text-gray-700">
                    <option value="">Province</option>
                    {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="City / Town" value={city} onChange={(e) => setCity(e.target.value)} className="input pl-11" />
                </div>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? "text" : "password"} placeholder="Password (min. 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-11 pr-11" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && mode === "signup" && <p className="text-red-500 text-sm" role="alert">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <>{spinner} Creating account...</> : "Create Account"}
              </button>
              <p className="text-center text-sm text-gray-500">
                Have an account?{" "}
                <button type="button" onClick={() => setMode("login")} className="text-brand-green font-semibold hover:underline">Sign in</button>
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

        {/* ── SLIDING PANEL ── */}
        <motion.div
          className="absolute top-0 h-full w-1/2 z-30 overflow-hidden shadow-2xl"
          animate={{ left: mode === "login" ? "50%" : "0%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <img src="/divide.jfif" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-brand-green/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-10 text-center">
            <div className="mb-4">
              <img src="/logo.png" alt="FuturePath" className="h-32 w-auto drop-shadow-lg" />
            </div>
            <h2 className="text-4xl font-bold mb-2 tracking-tight">FuturePath</h2>
            <p className="text-white/80 text-base max-w-xs leading-relaxed mb-10">Learn. Grow. Thrive.</p>
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
    </div>
  );
}
