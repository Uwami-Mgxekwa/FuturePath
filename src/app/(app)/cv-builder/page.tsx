"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, User, Mail, Phone, MapPin, ChevronDown,
  Plus, Trash2, Download, CheckCircle2, Briefcase,
  BookOpen, ChevronRight,
} from "lucide-react";

/* ── Types ────────────────────────────────────────────────────── */

interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  linkedin: string;
}

interface EducationEntry {
  id: number;
  institution: string;
  qualification: string;
  year: string;
  subjects: string;
}

interface ExperienceEntry {
  id: number;
  jobTitle: string;
  company: string;
  startYear: string;
  endYear: string;
  isPresent: boolean;
  responsibilities: string;
}

/* ── Constants ────────────────────────────────────────────────── */

const SA_PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape",
];

const STEPS = [
  { number: 1, label: "Personal" },
  { number: 2, label: "Education" },
  { number: 3, label: "Experience" },
  { number: 4, label: "Skills" },
];

/* ── Animations ───────────────────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/* ── CV HTML builder (shared by PDF and Word) ─────────────────── */

function buildCVHtml(
  personal: PersonalDetails,
  education: EducationEntry[],
  experience: ExperienceEntry[],
  skills: string[],
  summary: string,
): string {
  const contactParts = [
    personal.phone,
    personal.city && personal.province
      ? `${personal.city}, ${personal.province}`
      : personal.city || personal.province,
    personal.linkedin,
  ].filter(Boolean);

  const educationHtml = education
    .map(
      (e) => `
      <div class="entry">
        <div class="entry-header">
          <strong>${e.institution || ""}</strong>
          <span>${e.year || ""}</span>
        </div>
        <div>${e.qualification || ""}</div>
        ${e.subjects ? `<div class="subjects">Subjects: ${e.subjects}</div>` : ""}
      </div>`,
    )
    .join("");

  const experienceHtml = experience
    .map(
      (e) => `
      <div class="entry">
        <div class="entry-header">
          <strong>${e.jobTitle || ""} ${e.company ? "at " + e.company : ""}</strong>
          <span>${e.startYear || ""}${e.startYear ? " - " : ""}${e.isPresent ? "Present" : e.endYear || ""}</span>
        </div>
        ${e.responsibilities ? `<p>${e.responsibilities}</p>` : ""}
      </div>`,
    )
    .join("");

  const skillsHtml = skills.length
    ? `<div class="skills-list">${skills.map((s) => `<span class="skill">${s}</span>`).join("")}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>CV - ${personal.fullName || "My CV"}</title>
<style>
  body { font-family: Arial, sans-serif; color: #111; max-width: 700px; margin: 40px auto; padding: 0 24px; line-height: 1.5; }
  h1 { font-size: 28px; margin-bottom: 4px; }
  .contact { font-size: 13px; color: #444; margin-bottom: 24px; }
  .contact a { color: #444; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.08em; color: #00A651; border-bottom: 1px solid #00A651; padding-bottom: 4px; margin-top: 24px; margin-bottom: 12px; }
  .entry { margin-bottom: 12px; }
  .entry-header { display: flex; justify-content: space-between; font-size: 14px; }
  .entry-header strong { font-size: 14px; }
  .entry-header span { font-size: 13px; color: #555; }
  .subjects { font-size: 12px; color: #555; margin-top: 2px; }
  p { font-size: 13px; margin: 4px 0; }
  .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .skill { font-size: 13px; border: 1px solid #ccc; border-radius: 20px; padding: 2px 12px; }
  .summary { font-size: 13px; }
  @media print { body { margin: 0; padding: 16px; } }
</style>
</head>
<body>
  <h1>${personal.fullName || "Your Name"}</h1>
  <div class="contact">
    ${personal.email ? `<a href="mailto:${personal.email}">${personal.email}</a>` : ""}
    ${contactParts.join("  |  ")}
  </div>
  ${education.length ? `<h2>Education</h2>${educationHtml}` : ""}
  ${experience.length ? `<h2>Experience</h2>${experienceHtml}` : ""}
  ${skills.length ? `<h2>Skills</h2>${skillsHtml}` : ""}
  ${summary ? `<h2>Professional Summary</h2><p class="summary">${summary}</p>` : ""}
</body>
</html>`;
}

/* ── Download helpers ─────────────────────────────────────────── */

function downloadPDF(
  personal: PersonalDetails,
  education: EducationEntry[],
  experience: ExperienceEntry[],
  skills: string[],
  summary: string,
) {
  const html = buildCVHtml(personal, education, experience, skills, summary);
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

function downloadWord(
  personal: PersonalDetails,
  education: EducationEntry[],
  experience: ExperienceEntry[],
  skills: string[],
  summary: string,
) {
  const html = buildCVHtml(personal, education, experience, skills, summary);
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cv.doc";
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Word template download ───────────────────────────────────── */

function downloadTemplate() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>CV Template</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 24px; line-height: 1.5; }
  h1 { font-size: 28px; }
  h2 { font-size: 15px; text-transform: uppercase; color: #00A651; border-bottom: 1px solid #00A651; padding-bottom: 4px; margin-top: 24px; }
  .placeholder { color: #bbb; font-style: italic; font-size: 13px; }
</style>
</head>
<body>
  <h1>[Your Full Name]</h1>
  <p class="placeholder">[email@example.com] | [0XX XXX XXXX] | [City, Province] | [LinkedIn URL]</p>
  <h2>Education</h2>
  <p class="placeholder">[Institution] | [Qualification] | [Year]</p>
  <p class="placeholder">Subjects: [List your main subjects]</p>
  <h2>Experience</h2>
  <p class="placeholder">[Job Title] at [Company] | [Start Year] - [End Year / Present]</p>
  <p class="placeholder">[Describe your responsibilities]</p>
  <h2>Skills</h2>
  <p class="placeholder">[Skill 1], [Skill 2], [Skill 3]</p>
  <h2>Professional Summary</h2>
  <p class="placeholder">[Write a short professional summary about yourself]</p>
</body>
</html>`;
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cv-template.doc";
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Step Indicator ───────────────────────────────────────────── */

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, index) => {
        const isComplete = currentStep > step.number;
        const isActive = currentStep === step.number;
        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                  isComplete
                    ? "bg-brand-green border-brand-green text-white"
                    : isActive
                    ? "bg-brand-green border-brand-green text-white"
                    : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {isComplete ? <CheckCircle2 className="w-4 h-4" /> : step.number}
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive || isComplete ? "text-brand-green" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`w-12 h-0.5 mb-5 mx-1 transition-all ${
                  currentStep > step.number ? "bg-brand-green" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */

export default function CVBuilderPage() {
  const [mode, setMode] = useState<"build" | "template">("build");
  const [currentStep, setCurrentStep] = useState(1);

  const [personal, setPersonal] = useState<PersonalDetails>({
    fullName: "", email: "", phone: "", city: "", province: "", linkedin: "",
  });

  const [education, setEducation] = useState<EducationEntry[]>([
    { id: Date.now(), institution: "", qualification: "", year: "", subjects: "" },
  ]);

  const [experience, setExperience] = useState<ExperienceEntry[]>([]);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [summary, setSummary] = useState("");

  /* Education helpers */
  function addEducation() {
    setEducation((prev) => [
      ...prev,
      { id: Date.now(), institution: "", qualification: "", year: "", subjects: "" },
    ]);
  }
  function removeEducation(id: number) {
    setEducation((prev) => prev.filter((e) => e.id !== id));
  }
  function updateEducation(id: number, key: keyof EducationEntry, value: string) {
    setEducation((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [key]: value } : e)),
    );
  }

  /* Experience helpers */
  function addExperience() {
    setExperience((prev) => [
      ...prev,
      { id: Date.now(), jobTitle: "", company: "", startYear: "", endYear: "", isPresent: false, responsibilities: "" },
    ]);
  }
  function removeExperience(id: number) {
    setExperience((prev) => prev.filter((e) => e.id !== id));
  }
  function updateExperience(id: number, key: keyof ExperienceEntry, value: string | boolean) {
    setExperience((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [key]: value } : e)),
    );
  }

  /* Skills helpers */
  function addSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  }
  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  /* Template mode handler */
  function handleModeChange(selected: "build" | "template") {
    setMode(selected);
    if (selected === "template") {
      downloadTemplate();
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Page header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-1">
          <FileText className="w-6 h-6 text-brand-green" />
          <h1 className="text-2xl font-bold text-gray-900">CV Builder</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Build your professional CV step by step, or download a Word template to fill in yourself.
        </p>
      </motion.div>

      {/* Choice cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Build My CV */}
        <button
          onClick={() => handleModeChange("build")}
          className={`card p-5 text-left transition-all border-2 ${
            mode === "build"
              ? "border-brand-green"
              : "border-transparent hover:border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-brand-green" />
            <span className="font-semibold text-gray-900">Build My CV</span>
            {mode === "build" && <CheckCircle2 className="w-4 h-4 text-brand-green ml-auto" />}
          </div>
          <p className="text-sm text-gray-500">
            Fill in a step-by-step form and download your CV as PDF or Word.
          </p>
        </button>

        {/* Download Template */}
        <button
          onClick={() => handleModeChange("template")}
          className="card p-5 text-left transition-all border-2 border-transparent hover:border-gray-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-5 h-5 text-brand-green" />
            <span className="font-semibold text-gray-900">Download Template</span>
          </div>
          <p className="text-sm text-gray-500">
            Get a Word template you can fill in and edit on your own device.
          </p>
        </button>
      </motion.div>

      {/* Form — only shown in build mode */}
      <AnimatePresence>
        {mode === "build" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
          >
            <StepIndicator currentStep={currentStep} />

            {/* Step 1 — Personal Details */}
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -12 }}
                  className="card p-6 space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-brand-green" />
                    <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
                  </div>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={personal.fullName}
                      onChange={(e) => setPersonal((p) => ({ ...p, fullName: e.target.value }))}
                      className="input pl-11"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={personal.email}
                      onChange={(e) => setPersonal((p) => ({ ...p, email: e.target.value }))}
                      className="input pl-11"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={personal.phone}
                      onChange={(e) => setPersonal((p) => ({ ...p, phone: e.target.value }))}
                      className="input pl-11"
                      maxLength={10}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="City / Town"
                        value={personal.city}
                        onChange={(e) => setPersonal((p) => ({ ...p, city: e.target.value }))}
                        className="input pl-11"
                      />
                    </div>
                    <div className="relative">
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <select
                        value={personal.province}
                        onChange={(e) => setPersonal((p) => ({ ...p, province: e.target.value }))}
                        className="input pr-10 appearance-none"
                      >
                        <option value="">Province</option>
                        {SA_PROVINCES.map((prov) => (
                          <option key={prov} value={prov}>{prov}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/yourname"
                      value={personal.linkedin}
                      onChange={(e) => setPersonal((p) => ({ ...p, linkedin: e.target.value }))}
                      className="input pl-11"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2 — Education */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-brand-green" />
                    <h2 className="text-lg font-semibold text-gray-900">Education</h2>
                  </div>

                  {education.map((entry) => (
                    <motion.div
                      key={entry.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="card p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Education entry</span>
                        {education.length > 1 && (
                          <button
                            onClick={() => removeEducation(entry.id)}
                            aria-label="Remove education entry"
                            className="text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Institution (e.g. Northfield Secondary School)"
                        value={entry.institution}
                        onChange={(e) => updateEducation(entry.id, "institution", e.target.value)}
                        className="input"
                      />
                      <input
                        type="text"
                        placeholder="Qualification (e.g. National Senior Certificate)"
                        value={entry.qualification}
                        onChange={(e) => updateEducation(entry.id, "qualification", e.target.value)}
                        className="input"
                      />
                      <input
                        type="text"
                        placeholder="Year (e.g. 2022)"
                        value={entry.year}
                        onChange={(e) => updateEducation(entry.id, "year", e.target.value)}
                        className="input"
                      />
                      <textarea
                        placeholder="List your main subjects"
                        value={entry.subjects}
                        onChange={(e) => updateEducation(entry.id, "subjects", e.target.value)}
                        className="input resize-none"
                        rows={3}
                      />
                    </motion.div>
                  ))}

                  <button
                    onClick={addEducation}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Education
                  </button>
                </motion.div>
              )}

              {/* Step 3 — Experience */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-brand-green" />
                    <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
                  </div>

                  {experience.length === 0 && (
                    <p className="text-sm text-gray-400 card p-5 text-center">
                      No experience entries yet. Click &quot;Add Experience&quot; to get started.
                    </p>
                  )}

                  {experience.map((entry) => (
                    <motion.div
                      key={entry.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="card p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Experience entry</span>
                        <button
                          onClick={() => removeExperience(entry.id)}
                          aria-label="Remove experience entry"
                          className="text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={entry.jobTitle}
                        onChange={(e) => updateExperience(entry.id, "jobTitle", e.target.value)}
                        className="input"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={entry.company}
                        onChange={(e) => updateExperience(entry.id, "company", e.target.value)}
                        className="input"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Start Year"
                          value={entry.startYear}
                          onChange={(e) => updateExperience(entry.id, "startYear", e.target.value)}
                          className="input"
                        />
                        <input
                          type="text"
                          placeholder="End Year"
                          value={entry.endYear}
                          onChange={(e) => updateExperience(entry.id, "endYear", e.target.value)}
                          disabled={entry.isPresent}
                          className={`input ${entry.isPresent ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
                        />
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={entry.isPresent}
                          onChange={(e) => updateExperience(entry.id, "isPresent", e.target.checked)}
                          className="w-4 h-4 accent-brand-green"
                        />
                        Currently working here
                      </label>
                      <textarea
                        placeholder="Describe your responsibilities"
                        value={entry.responsibilities}
                        onChange={(e) => updateExperience(entry.id, "responsibilities", e.target.value)}
                        className="input resize-none"
                        rows={4}
                      />
                    </motion.div>
                  ))}

                  <button
                    onClick={addExperience}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Experience
                  </button>
                </motion.div>
              )}

              {/* Step 4 — Skills and Summary */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-5"
                >
                  {/* Skills */}
                  <motion.div variants={itemVariants} className="card p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-5 h-5 text-brand-green" />
                      <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a skill (e.g. Microsoft Excel)"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                        className="input flex-1"
                      />
                      <button onClick={addSkill} className="btn-secondary flex items-center gap-1 px-4">
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-full px-3 py-1 text-sm"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              aria-label={`Remove ${skill}`}
                              className="hover:text-red-500 transition-colors"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {/* Summary */}
                  <motion.div variants={itemVariants} className="card p-6 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-5 h-5 text-brand-green" />
                      <h2 className="text-lg font-semibold text-gray-900">Professional Summary</h2>
                    </div>
                    <textarea
                      placeholder="Write a short professional summary about yourself..."
                      value={summary}
                      onChange={(e) => setSummary(e.target.value.slice(0, 300))}
                      maxLength={300}
                      rows={5}
                      className="input resize-none"
                    />
                    <div className="text-right text-sm text-gray-400">
                      {summary.length} / 300
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <motion.div variants={itemVariants} className="flex items-center justify-between mt-6">
              <button
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                disabled={currentStep === 1}
                className="btn-secondary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Back
              </button>

              <div className="flex items-center gap-3">
                {currentStep < 4 ? (
                  <button
                    onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
                    className="btn-primary flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => downloadWord(personal, education, experience, skills, summary)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Word
                    </button>
                    <button
                      onClick={() => downloadPDF(personal, education, experience, skills, summary)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
