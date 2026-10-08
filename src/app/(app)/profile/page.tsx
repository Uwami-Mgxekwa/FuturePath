"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, BookOpen, Award, Pencil, CheckCircle2,
  Download, Share2, Trophy, Flame, Briefcase, Star, Globe,
  X, User, Mail, Phone, Calendar, CreditCard, ChevronDown, Save, Camera,
} from "lucide-react";
import { useProfile } from "@/lib/ProfileContext";
import type { ProfileData } from "@/lib/ProfileContext";

const SA_PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape",
];
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

/* ── Gender-based avatar via DiceBear ────────────────────────── */

function getAvatar(gender: string, photoUrl: string | null) {
  if (photoUrl) {
    return (
      <img src={photoUrl} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
    );
  }
  const src =
    gender === "Male"
      ? "https://api.dicebear.com/9.x/adventurer/svg?seed=FuturePathMale&backgroundColor=e6f7ee"
      : gender === "Female"
      ? "https://api.dicebear.com/9.x/adventurer/svg?seed=FuturePathFemale&backgroundColor=e6f7ee"
      : "https://api.dicebear.com/9.x/adventurer/svg?seed=FuturePathNeutral&backgroundColor=e6f7ee";
  return (
    <img src={src} alt={`${gender || "default"} avatar`} className="w-full h-full object-cover rounded-2xl" />
  );
}

/* ── Static data ─────────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const skills = [
  { name: "Digital Marketing", level: 80 },
  { name: "Web Development", level: 55 },
  { name: "Financial Literacy", level: 40 },
  { name: "Public Speaking", level: 70 },
  { name: "Microsoft Office", level: 90 },
];

const achievements = [
  { icon: Trophy, title: "Course Completer", description: "Finished your first course", earned: true },
  { icon: Flame, title: "7-Day Streak", description: "Learned 7 days in a row", earned: true },
  { icon: Briefcase, title: "Job Seeker", description: "Applied to first job", earned: true },
  { icon: Star, title: "Top Student", description: "Scored 90%+ on 3 assessments", earned: false },
  { icon: Globe, title: "Community Leader", description: "Helped 10 fellow learners", earned: false },
];

const certificates = [
  { id: 1, title: "Digital Marketing Fundamentals", issueDate: "Sep 2026", instructor: "Aisha Kamau" },
  { id: 2, title: "Financial Literacy & Savings", issueDate: "Aug 2026", instructor: "Dr. Peter Mwangi" },
];



export default function ProfilePage() {
  const { profile, setProfile } = useProfile();
  const [editOpen, setEditOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<ProfileData>({ ...profile });
  const [draftPhotoPreview, setDraftPhotoPreview] = useState<string | null>(null);

  function openEdit() {
    setDraft({ ...profile });
    setDraftPhotoPreview(profile.photoUrl);
    setSaved(false);
    setEditOpen(true);
  }

  function handleDraftIdChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 13);
    setDraft((prev) => ({ ...prev, idNumber: digits }));
    if (digits.length === 13) {
      const yy = parseInt(digits.slice(0, 2));
      const mm = parseInt(digits.slice(2, 4));
      const dd = parseInt(digits.slice(4, 6));
      const genderDigit = parseInt(digits[6]);
      if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
        const currentYY = new Date().getFullYear() % 100;
        const yyyy = yy > currentYY ? 1900 + yy : 2000 + yy;
        const today = new Date();
        let age = today.getFullYear() - yyyy;
        if (today.getMonth() + 1 < mm || (today.getMonth() + 1 === mm && today.getDate() < dd)) age--;
        const gender = genderDigit >= 5 ? "Male" : "Female";
        setDraft((prev) => ({ ...prev, age: String(age), gender }));
      }
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setDraftPhotoPreview(url);
    setDraft((prev) => ({ ...prev, photoUrl: url }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setProfile({ ...draft, photoUrl: draftPhotoPreview });
    setSaved(true);
    setTimeout(() => setEditOpen(false), 800);
  }

  function field(key: keyof ProfileData, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-5xl mx-auto space-y-8">

        {/* Profile header */}
        <motion.div variants={itemVariants} className="card p-6 flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
            {getAvatar(profile.gender, profile.photoUrl)}
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-500">{profile.email}</p>
              </div>
              <button onClick={openEdit} className="btn-secondary text-sm px-4 py-2 self-start flex items-center gap-2">
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-green" />{profile.city}, {profile.province}
              </span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-brand-green" />3 Courses In Progress</span>
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-brand-green" />5 Certificates</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills */}
          <motion.div variants={itemVariants} className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">Skills</h2>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700">{skill.name}</p>
                    <p className="text-sm font-semibold text-brand-green">{skill.level}%</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <motion.div
                      className="bg-brand-green h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      role="progressbar"
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${skill.name} proficiency: ${skill.level}%`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div variants={itemVariants} className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">Achievements</h2>
            <div className="space-y-3">
              {achievements.map((a) => {
                const Icon = a.icon;
                return (
                  <div
                    key={a.title}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${a.earned ? "border-brand-green" : "border-gray-100 opacity-40"}`}
                    aria-label={a.earned ? `Earned: ${a.title}` : `Not yet earned: ${a.title}`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${a.earned ? "text-brand-green" : "text-gray-400"}`} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                      <p className="text-xs text-gray-500">{a.description}</p>
                    </div>
                    {a.earned && <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Certificates */}
        <motion.div variants={itemVariants} className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Certificates</h2>
            <a href="/certificates" className="text-brand-green text-sm font-medium hover:underline">View all</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="border border-brand-green rounded-xl p-5">
                <Award className="w-7 h-7 text-brand-green mb-3" strokeWidth={1.5} />
                <p className="font-semibold text-gray-900">{cert.title}</p>
                <p className="text-sm text-gray-500 mt-1">Instructor: {cert.instructor}</p>
                <p className="text-xs text-gray-400 mt-0.5">Issued: {cert.issueDate}</p>
                <div className="flex gap-2 mt-3">
                  <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />Download
                  </button>
                  <button className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5" />Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Edit Profile Drawer */}
      <AnimatePresence>
        {editOpen && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40" onClick={() => setEditOpen(false)} />

            <motion.div
              key="drawer"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                <button onClick={() => setEditOpen(false)} aria-label="Close" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">

                {/* Photo upload */}
                <div className="flex flex-col items-center gap-3 pb-2">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-100">
                    {draftPhotoPreview
                      ? <img src={draftPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                      : getAvatar(draft.gender, null)
                    }
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} aria-label="Upload profile picture" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary text-sm px-4 py-2 flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    {draftPhotoPreview ? "Change Photo" : "Upload Photo"}
                  </button>
                  {draftPhotoPreview && (
                    <button
                      type="button"
                      onClick={() => { setDraftPhotoPreview(null); setDraft((p) => ({ ...p, photoUrl: null })); }}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      Remove photo
                    </button>
                  )}
                </div>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Full name" value={draft.name} onChange={(e) => field("name", e.target.value)} className="input pl-11" required />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" placeholder="Email address" value={draft.email} onChange={(e) => field("email", e.target.value)} className="input pl-11" required />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" placeholder="Cellphone number" value={draft.phone} onChange={(e) => field("phone", e.target.value)} className="input pl-11" maxLength={10} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      placeholder="Age"
                      value={draft.age}
                      onChange={(e) => field("age", e.target.value)}
                      readOnly={draft.idNumber.length === 13}
                      className={`input pl-11 ${draft.idNumber.length === 13 ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}
                      min={14} max={38}
                    />
                  </div>
                  <div className="relative">
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select
                      value={draft.gender}
                      onChange={(e) => field("gender", e.target.value)}
                      disabled={draft.idNumber.length === 13}
                      className={`input pr-10 appearance-none ${draft.idNumber.length === 13 ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}
                    >
                      <option value="">Gender</option>
                      {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="SA ID number (13 digits)"
                    value={draft.idNumber}
                    onChange={(e) => handleDraftIdChange(e.target.value)}
                    className="input pl-11 tracking-widest"
                    maxLength={13}
                    inputMode="numeric"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select value={draft.province} onChange={(e) => field("province", e.target.value)} className="input pl-11 pr-10 appearance-none">
                      <option value="">Province</option>
                      {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="City / Town" value={draft.city} onChange={(e) => field("city", e.target.value)} className="input pl-11" />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setEditOpen(false)} className="btn-secondary flex-1 py-3">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                    {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? "Saved" : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
