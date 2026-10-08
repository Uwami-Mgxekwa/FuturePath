"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const jobTypes = ["All", "Full-time", "Part-time", "Internship", "Remote", "NGO/Gov"];

const jobs = [
  {
    id: 1,
    title: "Junior Social Media Manager",
    company: "AfriGrowth Agency",
    type: "Full-time",
    location: "Nairobi, Kenya",
    salary: "KES 35,000–50,000/mo",
    skills: ["Social Media", "Canva", "Content Writing"],
    postedDays: 2,
    logo: "📣",
    description: "Manage social media channels for a growing digital agency. Create content, run ads, and grow our clients' audiences.",
  },
  {
    id: 2,
    title: "Web Developer Intern",
    company: "TechBridge Kenya",
    type: "Internship",
    location: "Remote",
    salary: "KES 15,000/mo",
    skills: ["HTML", "CSS", "JavaScript"],
    postedDays: 1,
    logo: "💻",
    description: "Join our dev team and build real projects. Great learning opportunity for recent graduates.",
  },
  {
    id: 3,
    title: "Agricultural Extension Officer",
    company: "Kenya Ministry of Agriculture",
    type: "NGO/Gov",
    location: "Kisumu, Kenya",
    salary: "KES 40,000–60,000/mo",
    skills: ["Agribusiness", "Community Outreach", "Reporting"],
    postedDays: 5,
    logo: "🌱",
    description: "Provide farmers with technical support and training on modern farming practices.",
  },
  {
    id: 4,
    title: "Community Health Promoter",
    company: "Amref Health Africa",
    type: "NGO/Gov",
    location: "Mombasa, Kenya",
    salary: "KES 30,000–40,000/mo",
    skills: ["Health Education", "Community Engagement", "Data Collection"],
    postedDays: 3,
    logo: "🏥",
    description: "Educate communities on health and sanitation practices for an international NGO.",
  },
  {
    id: 5,
    title: "Financial Analyst Trainee",
    company: "Equity Bank Kenya",
    type: "Full-time",
    location: "Nairobi, Kenya",
    salary: "KES 50,000–70,000/mo",
    skills: ["Excel", "Financial Literacy", "Data Analysis"],
    postedDays: 7,
    logo: "💰",
    description: "Entry-level analyst position for graduates with a passion for finance and banking.",
  },
  {
    id: 6,
    title: "Sales & Marketing Rep",
    company: "StartupHub EA",
    type: "Part-time",
    location: "Nairobi / Remote",
    salary: "Commission-based",
    skills: ["Sales", "Marketing", "Customer Service"],
    postedDays: 4,
    logo: "🚀",
    description: "Drive sales for an East African startup accelerator. Flexible hours, high growth potential.",
  },
];

const typeColors: Record<string, string> = {
  "Full-time": "bg-blue-50 text-blue-700 badge",
  "Part-time": "bg-purple-50 text-purple-700 badge",
  "Internship": "badge-green",
  "Remote": "bg-gray-100 text-gray-700 badge",
  "NGO/Gov": "bg-orange-50 text-orange-700 badge",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function JobsPage() {
  const [activeType, setActiveType] = useState("All");
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState<number[]>([]);

  const filtered = jobs.filter((j) => {
    const matchType = activeType === "All" || j.type === activeType;
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleApply = (id: number) => {
    setApplied((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
        <p className="text-gray-500 mt-1">{jobs.length} opportunities matched to your skills.</p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <input
          type="search"
          placeholder="Search jobs or companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input max-w-xs"
          aria-label="Search jobs"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by job type">
          {jobTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeType === type
                  ? "bg-brand-green text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-brand-green hover:text-brand-green"
              }`}
              aria-pressed={activeType === type}
            >
              {type}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Job listings */}
      <motion.div variants={containerVariants} className="space-y-4">
        {filtered.map((job) => (
          <motion.div
            key={job.id}
            variants={itemVariants}
            whileHover={{ x: 2 }}
            className="card p-5 flex flex-col sm:flex-row gap-4"
          >
            {/* Logo */}
            <div className="w-14 h-14 bg-brand-green-muted rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
              {job.logo}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                  <p className="text-gray-500 text-sm">{job.company} · {job.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={typeColors[job.type] || "badge-gray"}>{job.type}</span>
                  <span className="text-xs text-gray-400">{job.postedDays}d ago</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mt-2 line-clamp-2">{job.description}</p>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                {job.skills.map((skill) => (
                  <span key={skill} className="badge-gray text-xs">{skill}</span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-brand-green font-semibold text-sm">{job.salary}</p>
                <button
                  onClick={() => handleApply(job.id)}
                  className={applied.includes(job.id) ? "btn-secondary text-sm px-4 py-2" : "btn-primary text-sm px-4 py-2"}
                  aria-label={applied.includes(job.id) ? `Applied to ${job.title}` : `Apply to ${job.title}`}
                >
                  {applied.includes(job.id) ? "✓ Applied" : "Apply Now"}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-20 text-gray-400">
          <span className="text-5xl block mb-4">🔍</span>
          <p className="text-lg font-medium">No jobs found</p>
          <p className="text-sm mt-1">Try different filters or search terms</p>
        </motion.div>
      )}
    </motion.div>
  );
}
