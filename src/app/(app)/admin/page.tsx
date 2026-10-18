"use client";

import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  GraduationCap,
  BookMarked,
  Megaphone,
  Clock,
  Settings as SettingsIcon,
  UserPlus,
  BookOpen,
  Award,
  TrendingUp,
  Download,
  Plus,
  Search,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Student {
  id: number;
  name: string;
  email: string;
  province: string;
  age: number;
  gender: string;
  joined: string;
  status: "Active" | "Inactive";
}

interface Job {
  id: number;
  title: string;
  company: string;
  type: string;
  location: string;
  posted: string;
}

interface Learnership {
  id: number;
  title: string;
  seta: string;
  type: string;
  province: string;
  posted: string;
}

interface Bursary {
  id: number;
  name: string;
  provider: string;
  fields: string;
  value: string;
  closing: string;
}

interface Ad {
  id: number;
  title: string;
  organisation: string;
  type: string;
  targetPage: string;
  start: string;
  end: string;
  status: "Active" | "Expired";
}

interface LoginEntry {
  id: number;
  user: string;
  email: string;
  datetime: string;
  device: string;
  province: string;
  status: "Success" | "Failed";
}

// ---------------------------------------------------------------------------
// Static seed data
// ---------------------------------------------------------------------------
const STUDENTS: Student[] = [
  { id: 1, name: "Sipho Ndlovu", email: "sipho@example.com", province: "Gauteng", age: 22, gender: "Male", joined: "Jan 12 2025", status: "Active" },
  { id: 2, name: "Amina Hassan", email: "amina@example.com", province: "Western Cape", age: 19, gender: "Female", joined: "Feb 3 2025", status: "Active" },
  { id: 3, name: "Kofi Asante", email: "kofi@example.com", province: "Gauteng", age: 24, gender: "Male", joined: "Mar 15 2025", status: "Active" },
  { id: 4, name: "Nomvula Dlamini", email: "nomvula@example.com", province: "KwaZulu-Natal", age: 21, gender: "Female", joined: "Apr 7 2025", status: "Inactive" },
  { id: 5, name: "Lethabo Mokoena", email: "lethabo@example.com", province: "Limpopo", age: 20, gender: "Male", joined: "Apr 22 2025", status: "Active" },
  { id: 6, name: "Zanele Khumalo", email: "zanele@example.com", province: "Eastern Cape", age: 23, gender: "Female", joined: "May 10 2025", status: "Active" },
  { id: 7, name: "Lungelo Zulu", email: "lungelo@example.com", province: "KwaZulu-Natal", age: 18, gender: "Male", joined: "May 28 2025", status: "Inactive" },
  { id: 8, name: "Thandi Mthembu", email: "thandi@example.com", province: "Gauteng", age: 25, gender: "Female", joined: "Jun 1 2025", status: "Active" },
  { id: 9, name: "Rethabile Sithole", email: "rethabile@example.com", province: "Free State", age: 22, gender: "Female", joined: "Jun 14 2025", status: "Active" },
  { id: 10, name: "Andile Buthelezi", email: "andile@example.com", province: "North West", age: 20, gender: "Male", joined: "Jul 2 2025", status: "Active" },
];

const JOBS: Job[] = [
  { id: 1, title: "Junior Social Media Manager", company: "Digital Hustle Agency", type: "Full-time", location: "Johannesburg GP", posted: "2d ago" },
  { id: 2, title: "Web Developer Intern", company: "TechBridge SA", type: "Internship", location: "Remote", posted: "1d ago" },
  { id: 3, title: "Agricultural Extension Officer", company: "DAFF South Africa", type: "NGO/Gov", location: "Limpopo SA", posted: "5d ago" },
  { id: 4, title: "Community Health Promoter", company: "Medecins Sans Frontieres SA", type: "NGO/Gov", location: "Khayelitsha WC", posted: "3d ago" },
  { id: 5, title: "Financial Analyst Trainee", company: "Nedbank Graduate Programme", type: "Full-time", location: "Cape Town WC", posted: "7d ago" },
  { id: 6, title: "Sales and Marketing Rep", company: "StartupHub SA", type: "Part-time", location: "Durban / Remote", posted: "4d ago" },
];

const LEARNERSHIPS: Learnership[] = [
  { id: 1, title: "IT Technical Support Learnership", seta: "MICT SETA", type: "Learnership", province: "Gauteng", posted: "3d ago" },
  { id: 2, title: "Business Administration Learnership", seta: "SERVICES SETA", type: "Learnership", province: "Western Cape", posted: "6d ago" },
  { id: 3, title: "Early Childhood Development Learnership", seta: "ETDP SETA", type: "Learnership", province: "KwaZulu-Natal", posted: "2d ago" },
  { id: 4, title: "Security Operations Learnership", seta: "SASSETA", type: "Learnership", province: "Gauteng", posted: "8d ago" },
  { id: 5, title: "Agricultural Production Learnership", seta: "AgriSETA", type: "Learnership", province: "Limpopo", posted: "4d ago" },
  { id: 6, title: "Digital Marketing Learnership", seta: "MICT SETA", type: "Learnership", province: "Johannesburg GP", posted: "1d ago" },
  { id: 7, title: "Finance and Accounting Learnership", seta: "FASSET", type: "Learnership", province: "Cape Town WC", posted: "5d ago" },
  { id: 8, title: "Community Health Worker Learnership", seta: "HW SETA", type: "Learnership", province: "Eastern Cape", posted: "3d ago" },
];

const BURSARIES: Bursary[] = [
  { id: 1, name: "NSFAS Bursary", provider: "National Student Financial Aid Scheme", fields: "All fields", value: "Full tuition + allowances", closing: "30 Nov 2026" },
  { id: 2, name: "Sasol Bursary", provider: "Sasol", fields: "Engineering / Science / IT", value: "Full tuition + stipend", closing: "31 Aug 2026" },
  { id: 3, name: "Anglo American Bursary", provider: "Anglo American", fields: "Mining / Engineering / Geology", value: "Full tuition", closing: "30 Sep 2026" },
  { id: 4, name: "Investec Bursary", provider: "Investec", fields: "Finance / Commerce / IT", value: "Full tuition + mentorship", closing: "31 Oct 2026" },
  { id: 5, name: "Standard Bank Bursary", provider: "Standard Bank", fields: "Finance / IT / Commerce", value: "Full tuition", closing: "31 Jul 2026" },
  { id: 6, name: "Nedbank Bursary", provider: "Nedbank", fields: "Finance / Accounting / IT", value: "Full tuition + vacation work", closing: "31 Aug 2026" },
  { id: 7, name: "Department of Health Bursary", provider: "Dept of Health", fields: "Medicine / Nursing / Pharmacy", value: "Full tuition", closing: "28 Feb 2027" },
  { id: 8, name: "Eskom Bursary", provider: "Eskom", fields: "Engineering / IT / Finance", value: "Full tuition + stipend", closing: "30 Sep 2026" },
];

const ADS: Ad[] = [
  { id: 1, title: "Damelin College", organisation: "Damelin", type: "Private College", targetPage: "Courses", start: "01 Jan 2026", end: "31 Dec 2026", status: "Active" },
  { id: 2, title: "Vodacom Learnership Sponsor", organisation: "Vodacom", type: "Sponsor", targetPage: "Jobs", start: "01 Mar 2026", end: "30 Jun 2026", status: "Expired" },
  { id: 3, title: "UNISA Partner Banner", organisation: "UNISA", type: "Partner", targetPage: "All Pages", start: "01 May 2026", end: "30 Apr 2027", status: "Active" },
];

const LOGIN_HISTORY: LoginEntry[] = [
  { id: 1, user: "Sipho Ndlovu", email: "sipho@example.com", datetime: "2026-10-06 08:12", device: "Mobile", province: "Gauteng", status: "Success" },
  { id: 2, user: "Amina Hassan", email: "amina@example.com", datetime: "2026-10-06 09:04", device: "Desktop", province: "Western Cape", status: "Success" },
  { id: 3, user: "Unknown User", email: "unknown@example.com", datetime: "2026-10-06 09:11", device: "Mobile", province: "Gauteng", status: "Failed" },
  { id: 4, user: "Kofi Asante", email: "kofi@example.com", datetime: "2026-10-06 10:30", device: "Desktop", province: "Gauteng", status: "Success" },
  { id: 5, user: "Nomvula Dlamini", email: "nomvula@example.com", datetime: "2026-10-05 14:22", device: "Mobile", province: "KwaZulu-Natal", status: "Success" },
  { id: 6, user: "Unknown User", email: "attacker@example.com", datetime: "2026-10-05 14:55", device: "Desktop", province: "Unknown", status: "Failed" },
  { id: 7, user: "Lethabo Mokoena", email: "lethabo@example.com", datetime: "2026-10-05 16:08", device: "Mobile", province: "Limpopo", status: "Success" },
  { id: 8, user: "Zanele Khumalo", email: "zanele@example.com", datetime: "2026-10-04 11:30", device: "Desktop", province: "Eastern Cape", status: "Success" },
  { id: 9, user: "Thandi Mthembu", email: "thandi@example.com", datetime: "2026-10-04 13:47", device: "Mobile", province: "Gauteng", status: "Success" },
  { id: 10, user: "Unknown User", email: "hacker2@example.com", datetime: "2026-10-03 22:01", device: "Desktop", province: "Unknown", status: "Failed" },
];

const PROVINCES = [
  "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape",
  "Limpopo", "North West", "Free State", "Mpumalanga", "Northern Cape",
];

const BAR_DATA = [
  { day: "Mon", count: 24 },
  { day: "Tue", count: 38 },
  { day: "Wed", count: 51 },
  { day: "Thu", count: 43 },
  { day: "Fri", count: 67 },
  { day: "Sat", count: 29 },
  { day: "Sun", count: 18 },
];

const MAX_BAR = 67;

const TOP_PROVINCES = [
  { name: "Gauteng", pct: 34 },
  { name: "Western Cape", pct: 18 },
  { name: "KwaZulu-Natal", pct: 16 },
  { name: "Eastern Cape", pct: 12 },
  { name: "Limpopo", pct: 8 },
  { name: "Others", pct: 12 },
];

const ACTIVITY = [
  { text: "Sipho Ndlovu registered", time: "2 min ago", color: "bg-brand-green" },
  { text: "New job posted: Web Developer at TechBridge SA", time: "15 min ago", color: "bg-blue-500" },
  { text: "Certificate issued to Amina Hassan", time: "1 hr ago", color: "bg-yellow-400" },
  { text: "Kofi Asante updated profile", time: "3 hrs ago", color: "bg-gray-400" },
  { text: "New bursary listed: NSFAS Bursary", time: "5 hrs ago", color: "bg-brand-green" },
];

const TOP_PAGES = [
  { page: "Home", pct: 41 },
  { page: "Courses", pct: 28 },
  { page: "Jobs", pct: 19 },
  { page: "Dashboard", pct: 8 },
  { page: "Study Further", pct: 4 },
];

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------
type TabId = "Overview" | "Students" | "Jobs" | "Learnerships" | "Bursaries" | "Advertisements" | "Login History" | "Settings";

const NAV_ITEMS: { id: TabId; icon: React.ElementType }[] = [
  { id: "Overview", icon: LayoutDashboard },
  { id: "Students", icon: Users },
  { id: "Jobs", icon: Briefcase },
  { id: "Learnerships", icon: GraduationCap },
  { id: "Bursaries", icon: BookMarked },
  { id: "Advertisements", icon: Megaphone },
  { id: "Login History", icon: Clock },
  { id: "Settings", icon: SettingsIcon },
];

// ---------------------------------------------------------------------------
// Chip input helper
// ---------------------------------------------------------------------------
function ChipInput({
  chips,
  setChips,
  placeholder,
}: {
  chips: string[];
  setChips: (v: string[]) => void;
  placeholder: string;
}) {
  const [val, setVal] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = val.trim();
      if (trimmed && !chips.includes(trimmed)) {
        setChips([...chips, trimmed]);
      }
      setVal("");
    }
  }

  return (
    <div
      className="input flex flex-wrap gap-1 cursor-text min-h-[48px]"
      onClick={() => inputRef.current?.focus()}
    >
      {chips.map((chip) => (
        <span
          key={chip}
          className="flex items-center gap-1 bg-brand-green text-white text-xs font-medium px-2 py-0.5 rounded-full"
        >
          {chip}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setChips(chips.filter((c) => c !== chip));
            }}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={val}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setVal(e.target.value)}
        onKeyDown={handleKey}
        placeholder={chips.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview tab
// ---------------------------------------------------------------------------
function OverviewTab() {
  const overviewStats = [
    { label: "Total Students", value: "10,243", change: "+12%", icon: Users },
    { label: "New This Week", value: "84", change: "+6%", icon: UserPlus },
    { label: "Active Courses", value: "48", change: "+3%", icon: BookOpen },
    { label: "Jobs Posted", value: "126", change: "+8%", icon: Briefcase },
    { label: "Certificates Issued", value: "3,891", change: "+24%", icon: Award },
    { label: "Bursaries Listed", value: "8", change: "+1%", icon: GraduationCap },
  ];

  return (
    <>
      {/* Stat cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="card p-5 cursor-default"
              whileHover={{ y: -4, boxShadow: "6px 6px 0px #00A651" }}
              initial={{ boxShadow: "0px 0px 0px #00A651" }}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-brand-green" />
                <span className="text-xs font-semibold text-green-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bar chart */}
      <motion.div variants={itemVariants} className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Signups Over Time</h2>
        <div className="flex items-end gap-2 h-40">
          {BAR_DATA.map((bar) => (
            <div key={bar.day} className="flex flex-col items-center flex-1 h-full justify-end gap-1">
              <span className="text-xs text-gray-500">{bar.count}</span>
              <div
                className="w-full bg-brand-green rounded-t-sm"
                style={{ height: `${(bar.count / MAX_BAR) * 100}%` }}
              />
              <span className="text-xs text-gray-400">{bar.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top provinces */}
        <motion.div variants={itemVariants} className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Top Provinces</h2>
          <div className="space-y-3">
            {TOP_PROVINCES.map((row) => (
              <div key={row.name} className="flex items-center gap-3">
                <span className="w-28 text-sm text-gray-600 flex-shrink-0">{row.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-brand-green h-2 rounded-full"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{row.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Most visited pages */}
        <motion.div variants={itemVariants} className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Most Visited Pages</h2>
          <div className="space-y-3">
            {TOP_PAGES.map((row, i) => (
              <div key={row.page} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                <span className="w-24 text-sm text-gray-600 flex-shrink-0">{row.page}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-brand-green h-2 rounded-full"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{row.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent activity */}
      <motion.div variants={itemVariants} className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {ACTIVITY.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${item.color}`} />
              <div>
                <p className="text-sm text-gray-800">{item.text}</p>
                <p className="text-xs text-gray-400">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Students tab
// ---------------------------------------------------------------------------
function StudentsTab() {
  const [search, setSearch] = useState<string>("");
  const [province, setProvince] = useState<string>("All Provinces");
  const [status, setStatus] = useState<string>("All");

  const filtered = STUDENTS.filter((s) => {
    const matchSearch =
      search === "" ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchProvince = province === "All Provinces" || s.province === province;
    const matchStatus = status === "All" || s.status === status;
    return matchSearch && matchProvince && matchStatus;
  });

  return (
    <>
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap gap-2 flex-1">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search students..."
              className="input pl-9 text-sm"
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input text-sm w-auto"
            value={province}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setProvince(e.target.value)}
          >
            <option>All Provinces</option>
            {PROVINCES.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select
            className="input text-sm w-auto"
            value={status}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <button className="btn-secondary text-sm flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["", "Name", "Email", "Province", "Age", "Gender", "Joined", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                      {s.name.charAt(0)}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{s.name}</td>
                  <td className="px-4 py-3 text-gray-500">{s.email}</td>
                  <td className="px-4 py-3 text-gray-500">{s.province}</td>
                  <td className="px-4 py-3 text-gray-500">{s.age}</td>
                  <td className="px-4 py-3 text-gray-500">{s.gender}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{s.joined}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${s.status === "Active" ? "text-brand-green" : "text-gray-400"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 items-center">
                      <button className="btn-ghost text-xs py-1 px-2">View</button>
                      <button className="text-yellow-600 text-xs font-medium hover:underline">Suspend</button>
                      <button className="text-red-500 text-xs font-medium hover:underline">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Showing {filtered.length} of 240 students</span>
          <span>Page 1 of 24</span>
        </div>
      </motion.div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Jobs tab
// ---------------------------------------------------------------------------
function JobsTab() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [jobs, setJobs] = useState<Job[]>(JOBS);
  const [title, setTitle] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [jobType, setJobType] = useState<string>("Full-time");
  const [location, setLocation] = useState<string>("");
  const [salary, setSalary] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState<{ title?: string; company?: string }>({});

  function handlePost() {
    const newErrors: { title?: string; company?: string } = {};
    if (!title.trim()) newErrors.title = "Job title is required.";
    if (!company.trim()) newErrors.company = "Company is required.";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setJobs([
      ...jobs,
      { id: jobs.length + 1, title, company, type: jobType, location, posted: "just now" },
    ]);
    setTitle(""); setCompany(""); setLocation(""); setSalary(""); setSkills([]); setDescription("");
    setErrors({});
    setShowForm(false);
  }

  function handleRemove(id: number) {
    setJobs(jobs.filter((j) => j.id !== id));
  }

  return (
    <>
      <motion.div variants={itemVariants} className="flex justify-end">
        <button className="btn-primary text-sm flex items-center gap-2" onClick={() => setShowForm((v) => !v)}>
          <Plus className="w-4 h-4" />
          Post New Job
        </button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            key="job-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="card p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-900">New Job</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input placeholder="Job Title *" className="input text-sm" value={title} onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div>
                  <input placeholder="Company *" className="input text-sm" value={company} onChange={(e: ChangeEvent<HTMLInputElement>) => setCompany(e.target.value)} />
                  {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                </div>
                <select className="input text-sm" value={jobType} onChange={(e: ChangeEvent<HTMLSelectElement>) => setJobType(e.target.value)}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                  <option>Remote</option>
                  <option>NGO/Gov</option>
                  <option>Learnership</option>
                </select>
                <input placeholder="Location" className="input text-sm" value={location} onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)} />
                <input placeholder="Salary" className="input text-sm" value={salary} onChange={(e: ChangeEvent<HTMLInputElement>) => setSalary(e.target.value)} />
                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">Skills (press Enter to add)</label>
                  <ChipInput chips={skills} setChips={setSkills} placeholder="e.g. React, Node.js" />
                </div>
                <div className="sm:col-span-2">
                  <textarea
                    placeholder="Description"
                    rows={3}
                    className="input text-sm resize-none"
                    value={description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn-primary text-sm" onClick={handlePost}>Post</button>
                <button className="btn-secondary text-sm" onClick={() => { setShowForm(false); setErrors({}); }}>Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Title", "Company", "Type", "Location", "Posted", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{job.title}</td>
                  <td className="px-4 py-3 text-gray-500">{job.company}</td>
                  <td className="px-4 py-3 text-gray-500">{job.type}</td>
                  <td className="px-4 py-3 text-gray-500">{job.location}</td>
                  <td className="px-4 py-3 text-gray-500">{job.posted}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-brand-green text-xs font-medium hover:underline">Edit</button>
                      <button className="text-red-500 text-xs font-medium hover:underline" onClick={() => handleRemove(job.id)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Learnerships tab
// ---------------------------------------------------------------------------
function LearnershipTab() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [learnerships, setLearnerships] = useState<Learnership[]>(LEARNERSHIPS);
  const [lTitle, setLTitle] = useState<string>("");
  const [lSeta, setLSeta] = useState<string>("");
  const [lNqf, setLNqf] = useState<string>("1");
  const [lProvince, setLProvince] = useState<string>("Gauteng");
  const [lStipend, setLStipend] = useState<string>("");
  const [lDuration, setLDuration] = useState<string>("");
  const [lReqs, setLReqs] = useState<string>("");
  const [errors, setErrors] = useState<{ title?: string; seta?: string }>({});

  function handlePost() {
    const newErrors: { title?: string; seta?: string } = {};
    if (!lTitle.trim()) newErrors.title = "Title is required.";
    if (!lSeta.trim()) newErrors.seta = "SETA is required.";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLearnerships([
      ...learnerships,
      { id: learnerships.length + 1, title: lTitle, seta: lSeta, type: "Learnership", province: lProvince, posted: "just now" },
    ]);
    setLTitle(""); setLSeta(""); setLStipend(""); setLDuration(""); setLReqs("");
    setErrors({});
    setShowForm(false);
  }

  function handleRemove(id: number) {
    setLearnerships(learnerships.filter((l) => l.id !== id));
  }

  return (
    <>
      <motion.div variants={itemVariants} className="flex justify-end">
        <button className="btn-primary text-sm flex items-center gap-2" onClick={() => setShowForm((v) => !v)}>
          <Plus className="w-4 h-4" />
          Post New Learnership
        </button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            key="learnership-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="card p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-900">New Learnership</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input placeholder="Title *" className="input text-sm" value={lTitle} onChange={(e: ChangeEvent<HTMLInputElement>) => setLTitle(e.target.value)} />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div>
                  <input placeholder="SETA *" className="input text-sm" value={lSeta} onChange={(e: ChangeEvent<HTMLInputElement>) => setLSeta(e.target.value)} />
                  {errors.seta && <p className="text-red-500 text-sm mt-1">{errors.seta}</p>}
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">NQF Level</label>
                  <select className="input text-sm" value={lNqf} onChange={(e: ChangeEvent<HTMLSelectElement>) => setLNqf(e.target.value)}>
                    {["1","2","3","4","5","6","7","8"].map((n) => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Province</label>
                  <select className="input text-sm" value={lProvince} onChange={(e: ChangeEvent<HTMLSelectElement>) => setLProvince(e.target.value)}>
                    {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <input placeholder="Stipend (e.g. R3,500/mo)" className="input text-sm" value={lStipend} onChange={(e: ChangeEvent<HTMLInputElement>) => setLStipend(e.target.value)} />
                <input placeholder="Duration (e.g. 12 months)" className="input text-sm" value={lDuration} onChange={(e: ChangeEvent<HTMLInputElement>) => setLDuration(e.target.value)} />
                <div className="sm:col-span-2">
                  <textarea
                    placeholder="Requirements"
                    rows={3}
                    className="input text-sm resize-none"
                    value={lReqs}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setLReqs(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn-primary text-sm" onClick={handlePost}>Post</button>
                <button className="btn-secondary text-sm" onClick={() => { setShowForm(false); setErrors({}); }}>Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Title", "SETA", "Type", "Province", "Posted", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {learnerships.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{l.title}</td>
                  <td className="px-4 py-3 text-gray-500">{l.seta}</td>
                  <td className="px-4 py-3 text-gray-500">{l.type}</td>
                  <td className="px-4 py-3 text-gray-500">{l.province}</td>
                  <td className="px-4 py-3 text-gray-500">{l.posted}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-brand-green text-xs font-medium hover:underline">Edit</button>
                      <button className="text-red-500 text-xs font-medium hover:underline" onClick={() => handleRemove(l.id)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Bursaries tab
// ---------------------------------------------------------------------------
function BursariesTab() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [bursaries, setBursaries] = useState<Bursary[]>(BURSARIES);
  const [bName, setBName] = useState<string>("");
  const [bProvider, setBProvider] = useState<string>("");
  const [bFieldChips, setBFieldChips] = useState<string[]>([]);
  const [bProvChips, setBProvChips] = useState<string[]>([]);
  const [bValue, setBValue] = useState<string>("");
  const [bClosing, setBClosing] = useState<string>("");
  const [bReqs, setBReqs] = useState<string>("");
  const [bUrl, setBUrl] = useState<string>("");
  const [errors, setErrors] = useState<{ name?: string; provider?: string }>({});

  function handlePost() {
    const newErrors: { name?: string; provider?: string } = {};
    if (!bName.trim()) newErrors.name = "Bursary name is required.";
    if (!bProvider.trim()) newErrors.provider = "Provider is required.";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setBursaries([
      ...bursaries,
      {
        id: bursaries.length + 1,
        name: bName,
        provider: bProvider,
        fields: bFieldChips.join(" / ") || "All fields",
        value: bValue,
        closing: bClosing,
      },
    ]);
    setBName(""); setBProvider(""); setBFieldChips([]); setBProvChips([]); setBValue(""); setBClosing(""); setBReqs(""); setBUrl("");
    setErrors({});
    setShowForm(false);
  }

  function handleRemove(id: number) {
    setBursaries(bursaries.filter((b) => b.id !== id));
  }

  return (
    <>
      <motion.div variants={itemVariants} className="flex justify-end">
        <button className="btn-primary text-sm flex items-center gap-2" onClick={() => setShowForm((v) => !v)}>
          <Plus className="w-4 h-4" />
          Post New Bursary
        </button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            key="bursary-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="card p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-900">New Bursary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input placeholder="Bursary Name *" className="input text-sm" value={bName} onChange={(e: ChangeEvent<HTMLInputElement>) => setBName(e.target.value)} />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input placeholder="Provider *" className="input text-sm" value={bProvider} onChange={(e: ChangeEvent<HTMLInputElement>) => setBProvider(e.target.value)} />
                  {errors.provider && <p className="text-red-500 text-sm mt-1">{errors.provider}</p>}
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Fields of Study (press Enter to add)</label>
                  <ChipInput chips={bFieldChips} setChips={setBFieldChips} placeholder="e.g. Engineering" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Provinces (press Enter to add)</label>
                  <ChipInput chips={bProvChips} setChips={setBProvChips} placeholder="e.g. Gauteng" />
                </div>
                <input placeholder="Value (e.g. Full tuition + stipend)" className="input text-sm" value={bValue} onChange={(e: ChangeEvent<HTMLInputElement>) => setBValue(e.target.value)} />
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Closing Date</label>
                  <input type="date" className="input text-sm" value={bClosing} onChange={(e: ChangeEvent<HTMLInputElement>) => setBClosing(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <textarea
                    placeholder="Requirements"
                    rows={3}
                    className="input text-sm resize-none"
                    value={bReqs}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBReqs(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <input placeholder="Website URL" className="input text-sm" value={bUrl} onChange={(e: ChangeEvent<HTMLInputElement>) => setBUrl(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn-primary text-sm" onClick={handlePost}>Post</button>
                <button className="btn-secondary text-sm" onClick={() => { setShowForm(false); setErrors({}); }}>Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Provider", "Fields", "Value", "Closing", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bursaries.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
                  <td className="px-4 py-3 text-gray-500">{b.provider}</td>
                  <td className="px-4 py-3 text-gray-500">{b.fields}</td>
                  <td className="px-4 py-3 text-gray-500">{b.value}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{b.closing}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-brand-green text-xs font-medium hover:underline">Edit</button>
                      <button className="text-red-500 text-xs font-medium hover:underline" onClick={() => handleRemove(b.id)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Advertisements tab
// ---------------------------------------------------------------------------
function AdsTab() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [ads, setAds] = useState<Ad[]>(ADS);
  const [adTitle, setAdTitle] = useState<string>("");
  const [adOrg, setAdOrg] = useState<string>("");
  const [adType, setAdType] = useState<string>("Private College");
  const [adTarget, setAdTarget] = useState<string>("Home");
  const [adDesc, setAdDesc] = useState<string>("");
  const [adUrl, setAdUrl] = useState<string>("");
  const [adStart, setAdStart] = useState<string>("");
  const [adEnd, setAdEnd] = useState<string>("");
  const [errors, setErrors] = useState<{ title?: string; org?: string }>({});

  function handlePost() {
    const newErrors: { title?: string; org?: string } = {};
    if (!adTitle.trim()) newErrors.title = "Ad title is required.";
    if (!adOrg.trim()) newErrors.org = "Organisation name is required.";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setAds([
      ...ads,
      {
        id: ads.length + 1,
        title: adTitle,
        organisation: adOrg,
        type: adType,
        targetPage: adTarget,
        start: adStart,
        end: adEnd,
        status: "Active",
      },
    ]);
    setAdTitle(""); setAdOrg(""); setAdDesc(""); setAdUrl(""); setAdStart(""); setAdEnd("");
    setErrors({});
    setShowForm(false);
  }

  function handleRemove(id: number) {
    setAds(ads.filter((a) => a.id !== id));
  }

  return (
    <>
      <motion.div variants={itemVariants} className="flex justify-end">
        <button className="btn-primary text-sm flex items-center gap-2" onClick={() => setShowForm((v) => !v)}>
          <Plus className="w-4 h-4" />
          Post New Ad
        </button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            key="ad-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="card p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-900">New Advertisement</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input placeholder="Ad Title *" className="input text-sm" value={adTitle} onChange={(e: ChangeEvent<HTMLInputElement>) => setAdTitle(e.target.value)} />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div>
                  <input placeholder="Organisation Name *" className="input text-sm" value={adOrg} onChange={(e: ChangeEvent<HTMLInputElement>) => setAdOrg(e.target.value)} />
                  {errors.org && <p className="text-red-500 text-sm mt-1">{errors.org}</p>}
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Ad Type</label>
                  <select className="input text-sm" value={adType} onChange={(e: ChangeEvent<HTMLSelectElement>) => setAdType(e.target.value)}>
                    <option>Private College</option>
                    <option>Sponsor</option>
                    <option>Partner</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Target Page</label>
                  <select className="input text-sm" value={adTarget} onChange={(e: ChangeEvent<HTMLSelectElement>) => setAdTarget(e.target.value)}>
                    <option>Home</option>
                    <option>Courses</option>
                    <option>Jobs</option>
                    <option>Study Further</option>
                    <option>All Pages</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <textarea
                    placeholder="Description (max 200 characters)"
                    rows={3}
                    maxLength={200}
                    className="input text-sm resize-none"
                    value={adDesc}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAdDesc(e.target.value)}
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">{adDesc.length} / 200</p>
                </div>
                <div className="sm:col-span-2">
                  <input placeholder="Website URL" className="input text-sm" value={adUrl} onChange={(e: ChangeEvent<HTMLInputElement>) => setAdUrl(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
                  <input type="date" className="input text-sm" value={adStart} onChange={(e: ChangeEvent<HTMLInputElement>) => setAdStart(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">End Date</label>
                  <input type="date" className="input text-sm" value={adEnd} onChange={(e: ChangeEvent<HTMLInputElement>) => setAdEnd(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn-primary text-sm" onClick={handlePost}>Post</button>
                <button className="btn-secondary text-sm" onClick={() => { setShowForm(false); setErrors({}); }}>Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Title", "Organisation", "Type", "Target Page", "Start", "End", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{ad.title}</td>
                  <td className="px-4 py-3 text-gray-500">{ad.organisation}</td>
                  <td className="px-4 py-3 text-gray-500">{ad.type}</td>
                  <td className="px-4 py-3 text-gray-500">{ad.targetPage}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{ad.start}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{ad.end}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${ad.status === "Active" ? "text-brand-green" : "text-gray-400"}`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-brand-green text-xs font-medium hover:underline">Edit</button>
                      <button className="text-red-500 text-xs font-medium hover:underline" onClick={() => handleRemove(ad.id)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Login History tab
// ---------------------------------------------------------------------------
function LoginHistoryTab() {
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  return (
    <>
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap gap-2">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Date From</label>
            <input type="date" className="input text-sm w-auto" value={dateFrom} onChange={(e: ChangeEvent<HTMLInputElement>) => setDateFrom(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Date To</label>
            <input type="date" className="input text-sm w-auto" value={dateTo} onChange={(e: ChangeEvent<HTMLInputElement>) => setDateTo(e.target.value)} />
          </div>
        </div>
        <button className="btn-secondary text-sm flex items-center gap-2 self-end">
          <Download className="w-4 h-4" />
          Export
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["User", "Email", "Date and Time", "Device", "Province", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {LOGIN_HISTORY.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{entry.user}</td>
                  <td className="px-4 py-3 text-gray-500">{entry.email}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{entry.datetime}</td>
                  <td className="px-4 py-3 text-gray-500">{entry.device}</td>
                  <td className="px-4 py-3 text-gray-500">{entry.province}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${entry.status === "Success" ? "text-brand-green" : "text-red-500"}`}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Settings tab
// ---------------------------------------------------------------------------
function SettingsTabContent() {
  const [platformName, setPlatformName] = useState<string>("FuturePath");
  const [supportEmail, setSupportEmail] = useState<string>("support@futurepath.co.za");
  const [maxAge, setMaxAge] = useState<number>(35);
  const [emailNotif, setEmailNotif] = useState<boolean>(true);
  const [smsAlerts, setSmsAlerts] = useState<boolean>(false);
  const [weeklyDigest, setWeeklyDigest] = useState<boolean>(true);

  return (
    <>
      {/* Platform settings */}
      <motion.div variants={itemVariants} className="card p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">Platform Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Platform Name</label>
            <input className="input text-sm" value={platformName} onChange={(e: ChangeEvent<HTMLInputElement>) => setPlatformName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Support Email</label>
            <input type="email" className="input text-sm" value={supportEmail} onChange={(e: ChangeEvent<HTMLInputElement>) => setSupportEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Max Age Limit</label>
            <input
              type="number"
              className="input text-sm"
              value={maxAge}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setMaxAge(Number(e.target.value))}
            />
          </div>
        </div>
        <button className="btn-primary text-sm">Save Changes</button>
      </motion.div>

      {/* Notification settings */}
      <motion.div variants={itemVariants} className="card p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">Notification Settings</h2>

        {/* Toggle: Email notifications */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Email notifications</p>
            <p className="text-xs text-gray-500">Receive updates and alerts via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={emailNotif}
              onChange={() => setEmailNotif((v) => !v)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-checked:bg-brand-green rounded-full transition-colors duration-200 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
          </label>
        </div>

        {/* Toggle: SMS alerts */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">SMS alerts</p>
            <p className="text-xs text-gray-500">Receive critical alerts via SMS</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={smsAlerts}
              onChange={() => setSmsAlerts((v) => !v)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-checked:bg-brand-green rounded-full transition-colors duration-200 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
          </label>
        </div>

        {/* Toggle: Weekly digest */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Weekly digest</p>
            <p className="text-xs text-gray-500">Get a weekly summary of platform activity</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={weeklyDigest}
              onChange={() => setWeeklyDigest((v) => !v)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-checked:bg-brand-green rounded-full transition-colors duration-200 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
          </label>
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div variants={itemVariants} className="border border-red-200 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-red-600">Danger Zone</h2>
        <div className="flex flex-wrap gap-6">
          <div className="space-y-1">
            <button className="bg-white border border-red-300 text-red-600 hover:bg-red-50 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
              Clear All Test Data
            </button>
            <p className="text-xs text-gray-500">Removes all seeded or test data from the platform. This cannot be undone.</p>
          </div>
          <div className="space-y-1">
            <button className="bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
              Export All Data
            </button>
            <p className="text-xs text-gray-500">Downloads a full export of all platform data as a CSV archive.</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>("Overview");

  function renderContent() {
    switch (activeTab) {
      case "Overview": return <OverviewTab />;
      case "Students": return <StudentsTab />;
      case "Jobs": return <JobsTab />;
      case "Learnerships": return <LearnershipTab />;
      case "Bursaries": return <BursariesTab />;
      case "Advertisements": return <AdsTab />;
      case "Login History": return <LoginHistoryTab />;
      case "Settings": return <SettingsTabContent />;
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
        <p className="text-gray-500 mt-1">{activeTab}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop sidebar */}
        <nav className="hidden md:flex flex-col gap-1 w-52 flex-shrink-0">
          {NAV_ITEMS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border-l-4 ${
                activeTab === id
                  ? "border-brand-green bg-green-50 text-brand-green"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{id}</span>
            </button>
          ))}
        </nav>

        {/* Mobile horizontal tab bar */}
        <div className="md:hidden flex overflow-x-auto gap-1 pb-2 border-b border-gray-200 mb-2">
          {NAV_ITEMS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                activeTab === id
                  ? "bg-green-50 text-brand-green"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {id}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-6"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
