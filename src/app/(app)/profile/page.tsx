"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, BookOpen, Award, Pencil, CheckCircle2,
  Upload, Trash2, FileCheck, Info,
  X, User, Mail, Phone, Calendar, CreditCard, ChevronDown, Save, Camera,
  FileText, Trophy, Flame, Briefcase, Star, Globe, Plus, GraduationCap,
} from "lucide-react";
import { useProfile } from "@/lib/ProfileContext";
import type { ProfileData } from "@/lib/ProfileContext";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SA_PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape",
];
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

const SKILL_SUGGESTIONS = [
  "Communication", "Microsoft Office", "Customer Service", "Teamwork",
  "Problem Solving", "Data Entry", "Social Media", "Digital Marketing",
  "Web Development", "Financial Literacy", "Public Speaking", "Leadership",
  "Project Management", "Sales", "Graphic Design", "Photography",
  "Coding", "Research", "Writing", "Excel",
];

function getAvatar(gender: string, photoUrl: string | null) {
  if (photoUrl) return <img src={photoUrl} alt="Profile" className="w-full h-full object-cover rounded-2xl" />;
  const src =
    gender === "Male"
      ? "https://api.dicebear.com/9.x/adventurer/svg?seed=FuturePathMale&backgroundColor=e6f7ee"
      : gender === "Female"
      ? "https://api.dicebear.com/9.x/adventurer/svg?seed=FuturePathFemale&backgroundColor=e6f7ee"
      : "https://api.dicebear.com/9.x/adventurer/svg?seed=FuturePathNeutral&backgroundColor=e6f7ee";
  return <img src={src} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />;
}

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

const achievements = [
  { icon: Trophy,   title: "Course Completer", description: "Finished your first course",      earned: false },
  { icon: Flame,    title: "7-Day Streak",      description: "Learned 7 days in a row",         earned: false },
  { icon: Briefcase,title: "Job Seeker",        description: "Applied to first job",            earned: false },
  { icon: Star,     title: "Top Student",       description: "Scored 90%+ on 3 assessments",   earned: false },
  { icon: Globe,    title: "Community Leader",  description: "Helped 10 fellow learners",       earned: false },
];

/* ── Education entry type ─────────────────────────────────────── */
interface EducationEntry {
  id: string;
  institution: string;
  qualification: string;
  year: string;
}

/* ── Skill entry type ─────────────────────────────────────────── */
interface SkillEntry {
  name: string;
  level: number; // 0–100
}

/* ── Documents section ───────────────────────────────────────── */
interface UploadedDoc { id: number; name: string; type: "cv" | "qualification"; size: string; url: string; }

function DocumentsSection() {
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const cvRef = useRef<HTMLInputElement>(null);
  const qualRef = useRef<HTMLInputElement>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>, type: "cv" | "qualification") {
    const files = Array.from(e.target.files || []);
    const newDocs: UploadedDoc[] = files.map((f, i) => ({ id: Date.now() + i, name: f.name, type, size: (f.size / 1024).toFixed(0) + " KB", url: URL.createObjectURL(f) }));
    setDocs((prev) => [...prev, ...newDocs]);
    e.target.value = "";
  }

  return (
    <motion.div variants={itemVariants} className="card p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">Documents</h2>
      <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6">
        <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-yellow-800 leading-relaxed">
          Your documents may be shared with employers and partner organisations.
          By uploading, you agree to our <a href="/privacy" className="underline font-medium">Privacy Policy</a>.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {(["cv", "qualification"] as const).map((type) => {
          const ref = type === "cv" ? cvRef : qualRef;
          const label = type === "cv" ? "CV / Resume" : "Qualifications";
          const accept = type === "cv" ? ".pdf,.doc,.docx" : ".pdf,.doc,.docx,.jpg,.jpeg,.png";
          const filtered = docs.filter((d) => d.type === type);
          return (
            <div key={type}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-green" />
                  <h3 className="font-semibold text-gray-900 text-sm">{label}</h3>
                </div>
                <button onClick={() => ref.current?.click()} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />Upload
                </button>
                <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => handleUpload(e, type)} multiple />
              </div>
              {filtered.length === 0 ? (
                <div onClick={() => ref.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-brand-green transition-colors">
                  <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">{type === "cv" ? "Click to upload your CV" : "Matric, diplomas, certificates"}</p>
                  <p className="text-xs text-gray-300 mt-1">{accept.toUpperCase().replace(/\./g, "").replace(/,/g, ", ")}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((d) => (
                    <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                      <FileCheck className="w-5 h-5 text-brand-green flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{d.name}</p>
                        <p className="text-xs text-gray-400">{d.size}</p>
                      </div>
                      <a href={d.url} download={d.name} className="text-brand-green hover:underline text-xs">Download</a>
                      <button onClick={() => setDocs((prev) => prev.filter((x) => x.id !== d.id))} className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { profile, setProfile } = useProfile();
  const [editOpen, setEditOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<ProfileData>({ ...profile });
  const [draftPhotoPreview, setDraftPhotoPreview] = useState<string | null>(null);

  // Skills & Education state — loaded from Firestore
  const [skills, setSkills] = useState<SkillEntry[]>([]);
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [profileComplete, setProfileComplete] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Skills / Education edit modal
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);

  // Skill input
  const [skillInput, setSkillInput] = useState("");
  const [skillLevel, setSkillLevel] = useState(50);

  // Education input
  const [eduDraft, setEduDraft] = useState<Omit<EducationEntry, "id">>({ institution: "", qualification: "", year: "" });

  // Load skills & education from Firestore on mount
  useEffect(() => {
    async function load() {
      const user = auth.currentUser;
      if (!user) { setDataLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.skills) setSkills(data.skills);
          if (data.education) setEducation(data.education);
          setProfileComplete(!!(data.skills?.length && data.education?.length));
        }
      } catch { /* silently ignore */ }
      setDataLoading(false);
    }
    load();
  }, []);

  async function saveSkillsAndEdu(newSkills: SkillEntry[], newEdu: EducationEntry[]) {
    const user = auth.currentUser;
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), { skills: newSkills, education: newEdu }, { merge: true });
  }

  function addSkill() {
    if (!skillInput.trim()) return;
    const newSkill: SkillEntry = { name: skillInput.trim(), level: skillLevel };
    const updated = [...skills.filter((s) => s.name.toLowerCase() !== skillInput.toLowerCase()), newSkill];
    setSkills(updated);
    setSkillInput("");
    setSkillLevel(50);
    saveSkillsAndEdu(updated, education);
  }

  function removeSkill(name: string) {
    const updated = skills.filter((s) => s.name !== name);
    setSkills(updated);
    saveSkillsAndEdu(updated, education);
  }

  function addEducation() {
    if (!eduDraft.institution || !eduDraft.qualification) return;
    const newEdu: EducationEntry = { ...eduDraft, id: Date.now().toString() };
    const updated = [...education, newEdu];
    setEducation(updated);
    setEduDraft({ institution: "", qualification: "", year: "" });
    saveSkillsAndEdu(skills, updated);
  }

  function removeEducation(id: string) {
    const updated = education.filter((e) => e.id !== id);
    setEducation(updated);
    saveSkillsAndEdu(skills, updated);
  }

  function openEdit() {
    setDraft({ ...profile });
    setDraftPhotoPreview(profile.photoUrl);
    setSaved(false);
    setEditOpen(true);
  }

  function handleDraftIdChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 13);
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
        setDraft((prev) => ({ ...prev, age: String(age), gender: genderDigit >= 5 ? "Male" : "Female" }));
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const updated = { ...draft, photoUrl: draftPhotoPreview };
    setProfile(updated);
    // Save to Firestore
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "users", user.uid), {
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        age: updated.age,
        gender: updated.gender,
        province: updated.province,
        city: updated.city,
      }, { merge: true });
    }
    setSaved(true);
    setTimeout(() => setEditOpen(false), 800);
  }

  function field(key: keyof ProfileData, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  const isNewUser = !dataLoading && skills.length === 0 && education.length === 0 && !profileComplete;

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-5xl mx-auto space-y-8">

        {/* ── New user prompt ── */}
        {isNewUser && (
          <motion.div variants={itemVariants} className="card p-6 border-2 border-brand-green">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-green-muted rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-brand-green" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">Complete your profile</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Add your skills and education so employers and the platform can match you with the right opportunities.
                </p>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setSkillsOpen(true)} className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
                    <Plus className="w-4 h-4" />Add Skills
                  </button>
                  <button onClick={() => setEduOpen(true)} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />Add Education
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile header */}
        <motion.div variants={itemVariants} className="card p-6 flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
            {getAvatar(profile.gender, profile.photoUrl)}
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name || "—"}</h1>
                <p className="text-gray-500">{profile.email || "—"}</p>
              </div>
              <button onClick={openEdit} className="btn-secondary text-sm px-4 py-2 self-start flex items-center gap-2">
                <Pencil className="w-4 h-4" />Edit Profile
              </button>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
              {(profile.city || profile.province) && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-green" />{[profile.city, profile.province].filter(Boolean).join(", ")}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Skills ── */}
          <motion.div variants={itemVariants} className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
              <button onClick={() => setSkillsOpen(true)} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />Add Skill
              </button>
            </div>
            {skills.length === 0 ? (
              <div className="text-center py-10">
                <Star className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">No skills added yet</p>
                <p className="text-gray-400 text-xs mt-1 mb-4">Add the skills you have to showcase yourself to employers</p>
                <button onClick={() => setSkillsOpen(true)} className="btn-primary text-sm px-4 py-2">Add Your Skills</button>
              </div>
            ) : (
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-700">{skill.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-brand-green">{skill.level}%</p>
                        <button onClick={() => removeSkill(skill.name)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Education ── */}
          <motion.div variants={itemVariants} className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-900">Education</h2>
              <button onClick={() => setEduOpen(true)} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />Add
              </button>
            </div>
            {education.length === 0 ? (
              <div className="text-center py-10">
                <GraduationCap className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">No education added yet</p>
                <p className="text-gray-400 text-xs mt-1 mb-4">Add your school, college or university history</p>
                <button onClick={() => setEduOpen(true)} className="btn-primary text-sm px-4 py-2">Add Education</button>
              </div>
            ) : (
              <div className="space-y-3">
                {education.map((e) => (
                  <div key={e.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 group">
                    <GraduationCap className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{e.qualification}</p>
                      <p className="text-gray-500 text-xs">{e.institution}</p>
                      {e.year && <p className="text-gray-400 text-xs mt-0.5">{e.year}</p>}
                    </div>
                    <button onClick={() => removeEducation(e.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div variants={itemVariants} className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.title} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${a.earned ? "border-brand-green" : "border-gray-100 opacity-40"}`}>
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

        <DocumentsSection />
      </motion.div>

      {/* ── Add Skills Modal ── */}
      <AnimatePresence>
        {skillsOpen && (
          <>
            <motion.div key="skills-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40" onClick={() => setSkillsOpen(false)} />
            <motion.div key="skills-modal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold text-gray-900">Add a Skill</h3>
                  <button onClick={() => setSkillsOpen(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
                </div>

                {/* Suggestions */}
                <p className="text-xs text-gray-500 mb-2 font-medium">Quick add:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {SKILL_SUGGESTIONS.filter((s) => !skills.find((sk) => sk.name === s)).slice(0, 12).map((s) => (
                    <button key={s} onClick={() => setSkillInput(s)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${skillInput === s ? "border-brand-green text-brand-green bg-brand-green-muted" : "border-gray-200 text-gray-600 hover:border-brand-green"}`}>
                      {s}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Or type a custom skill..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="input mb-4"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />

                <div className="mb-5">
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700">Proficiency level</p>
                    <p className="text-sm font-semibold text-brand-green">{skillLevel}%</p>
                  </div>
                  <input type="range" min={10} max={100} step={10} value={skillLevel} onChange={(e) => setSkillLevel(Number(e.target.value))}
                    className="w-full accent-brand-green" aria-label="Skill proficiency level" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Beginner</span><span>Intermediate</span><span>Expert</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setSkillsOpen(false)} className="btn-secondary flex-1 py-3">Done</button>
                  <button type="button" onClick={addSkill} disabled={!skillInput.trim()} className="btn-primary flex-1 py-3 disabled:opacity-50 flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />Add Skill
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Add Education Modal ── */}
      <AnimatePresence>
        {eduOpen && (
          <>
            <motion.div key="edu-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40" onClick={() => setEduOpen(false)} />
            <motion.div key="edu-modal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold text-gray-900">Add Education</h3>
                  <button onClick={() => setEduOpen(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-3 mb-5">
                  <input type="text" placeholder="Institution (e.g. University of Johannesburg)" value={eduDraft.institution}
                    onChange={(e) => setEduDraft((p) => ({ ...p, institution: e.target.value }))} className="input" />
                  <input type="text" placeholder="Qualification (e.g. Matric, Diploma, Degree)" value={eduDraft.qualification}
                    onChange={(e) => setEduDraft((p) => ({ ...p, qualification: e.target.value }))} className="input" />
                  <input type="text" placeholder="Year completed (e.g. 2023)" value={eduDraft.year}
                    onChange={(e) => setEduDraft((p) => ({ ...p, year: e.target.value }))} className="input" maxLength={4} />
                </div>

                {/* Existing entries */}
                {education.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs text-gray-500 font-medium mb-2">Added so far:</p>
                    <div className="space-y-2">
                      {education.map((e) => (
                        <div key={e.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                          <GraduationCap className="w-4 h-4 text-brand-green flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">{e.qualification} — {e.institution}</p>
                          </div>
                          <button onClick={() => removeEducation(e.id)} className="text-gray-300 hover:text-red-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setEduOpen(false)} className="btn-secondary flex-1 py-3">Done</button>
                  <button type="button" onClick={addEducation} disabled={!eduDraft.institution || !eduDraft.qualification}
                    className="btn-primary flex-1 py-3 disabled:opacity-50 flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />Add
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Edit Profile Drawer ── */}
      <AnimatePresence>
        {editOpen && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40" onClick={() => setEditOpen(false)} />
            <motion.div key="drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                <button onClick={() => setEditOpen(false)} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                <div className="flex flex-col items-center gap-3 pb-2">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-100">
                    {draftPhotoPreview ? <img src={draftPhotoPreview} alt="Preview" className="w-full h-full object-cover" /> : getAvatar(draft.gender, null)}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
                    <Camera className="w-4 h-4" />{draftPhotoPreview ? "Change Photo" : "Upload Photo"}
                  </button>
                  {draftPhotoPreview && (
                    <button type="button" onClick={() => { setDraftPhotoPreview(null); setDraft((p) => ({ ...p, photoUrl: null })); }} className="text-xs text-red-400 hover:text-red-600">Remove photo</button>
                  )}
                </div>

                <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Full name" value={draft.name} onChange={(e) => field("name", e.target.value)} className="input pl-11" required /></div>

                <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" placeholder="Email address" value={draft.email} onChange={(e) => field("email", e.target.value)} className="input pl-11" required /></div>

                <div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" placeholder="Cellphone number" value={draft.phone} onChange={(e) => field("phone", e.target.value)} className="input pl-11" maxLength={10} /></div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative"><Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="number" placeholder="Age" value={draft.age} onChange={(e) => field("age", e.target.value)}
                      readOnly={draft.idNumber.length === 13}
                      className={`input pl-11 ${draft.idNumber.length === 13 ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`} min={14} max={38} /></div>
                  <div className="relative"><ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select value={draft.gender} onChange={(e) => field("gender", e.target.value)}
                      disabled={draft.idNumber.length === 13}
                      className={`input pr-10 appearance-none ${draft.idNumber.length === 13 ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}>
                      <option value="">Gender</option>
                      {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select></div>
                </div>

                <div className="relative"><CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="SA ID number (13 digits)" value={draft.idNumber} onChange={(e) => handleDraftIdChange(e.target.value)}
                    className="input pl-11 tracking-widest" maxLength={13} inputMode="numeric" /></div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select value={draft.province} onChange={(e) => field("province", e.target.value)} className="input pl-11 pr-10 appearance-none">
                      <option value="">Province</option>
                      {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select></div>
                  <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="City / Town" value={draft.city} onChange={(e) => field("city", e.target.value)} className="input pl-11" /></div>
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
