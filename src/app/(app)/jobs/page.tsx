"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Megaphone, Monitor, Leaf, HeartPulse, DollarSign, Rocket,
  MapPin, Clock, CheckCircle2, Briefcase,
} from "lucide-react";

const jobTypes = ["All", "Full-time", "Part-time", "Internship", "Remote", "NGO/Gov"];

const jobs = [
  { id: 1, title: "Junior Social Media Manager", company: "AfriGrowth Agency", type: "Full-time", location: "Nairobi, Kenya", salary: "KES 35,000–50,000/mo", skills: ["Social Media", "Canva", "Content Writing"], postedDays: 2, icon: Megaphone, description: "Manage social media channels for a growing digital agency. Create content, run ads, and grow our clients' audiences." },
  { id: 2, title: "Web Developer Intern", company: "TechBridge Kenya", type: "Internship", location: "Remote", salary: "KES 15,000/mo", skills: ["HTML", "CSS", "JavaScript"], postedDays: 1, icon: Monitor, description: "Join our dev team and build real projects. Great learning opportunity for recent graduates." },
  { id: 3, title: "Agricultural Extension Officer", company: "Kenya Ministry of Agriculture", type: "NGO/Gov", location: "Kisumu, Kenya", salary: "KES 40,000–60,000/mo", skills: ["Agribusiness", "Community Outreach", "Reporting"], postedDays: 5, icon: Leaf, description: "Provide farmers with technical support and training on modern farming practices." },
  { id: 4, title: "Community Health Promoter", company: "Amref Health Africa", type: "NGO/Gov", location: "Mombasa, Kenya", salary: "KES 30,000–40,000/mo", skills: ["Health Education", "Community Engagement", "Data Collection"], postedDays: 3, icon: HeartPulse, description: "Educate communities on health and sanitation practices for an international NGO." },
  { id: 5, title: "Financial Analyst Trainee", company: "Equity Bank Kenya", type: "Full-time", location: "Nairobi, Kenya", salary: "KES 50,000–70,000/mo", skills: ["Excel", "Financial Literacy", "Data Analysis"], postedDays: 7, icon: DollarSign, description: "Entry-level analyst position for graduates with a passion for finance and banking." },
  { id: 6, title: "Sales & Marketing Rep", company: "StartupHub EA", type: "Part-time", location: "Nairobi / Remote", salary: "Commission-based", skills: ["Sales", "Marketing", "Customer Service"], postedDays: 4, icon: Rocket, description: "Drive sales for an East African startup accelerator. Flexible hours, high growth potential." },
];

const typeColor: Record<string, string> = {
  "Full-time": "text-blue-600",
  "Part-time": "text-purple-600",
  "Internship": "text-brand-green",
  "Remote": "text-gray-500",
  "NGO/Gov": "text-orange-500",
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
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto space-y-8">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
        <p className="text-gray-500 mt-1">{jobs.length} opportunities matched to your skills.</p>
      </motion.div>

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

      <motion.div variants={containerVariants} className="space-y-4">
        {filtered.map((job) => {
          const Icon = job.icon;
          const isApplied = applied.includes(job.id);
          return (
            <motion.div key={job.id} variants={itemVariants} whileHover={{ x: 2 }} className="card p-5 flex flex-col sm:flex-row gap-5">
              {/* Icon — flat, no container */}
              <Icon className="w-7 h-7 text-brand-green flex-shrink-0 mt-0.5" strokeWidth={1.5} />

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
                      {job.company}
                      <span className="text-gray-300">·</span>
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`font-medium ${typeColor[job.type] ?? "text-gray-500"}`}>{job.type}</span>
                    <span className="text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{job.postedDays}d ago
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{job.description}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {job.skills.map((skill) => (
                    <span key={skill} className="text-xs text-gray-500 border border-gray-200 rounded-md px-2 py-0.5">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-brand-green font-semibold text-sm">{job.salary}</p>
                  <button
                    onClick={() => handleApply(job.id)}
                    className={isApplied ? "btn-secondary text-sm px-4 py-2 flex items-center gap-2" : "btn-primary text-sm px-4 py-2 flex items-center gap-2"}
                    aria-label={isApplied ? `Applied to ${job.title}` : `Apply to ${job.title}`}
                  >
                    {isApplied && <CheckCircle2 className="w-4 h-4" />}
                    {isApplied ? "Applied" : "Apply Now"}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-20">
          <Briefcase className="w-10 h-10 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-500">No jobs found</p>
          <p className="text-sm mt-1 text-gray-400">Try different filters or search terms</p>
        </motion.div>
      )}
    </motion.div>
  );
}
