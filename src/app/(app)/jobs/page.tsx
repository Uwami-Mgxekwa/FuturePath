"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Leaf, HeartPulse, DollarSign, Rocket,
  GraduationCap, Wrench, ShieldCheck, BarChart2, Megaphone,
  MapPin, Clock, Briefcase, Search, ExternalLink, RefreshCw,
  Building2,
} from "lucide-react";
import { JobsSkeleton } from "@/components/Skeleton";
import ExitWarningModal from "@/components/ExitWarningModal";

/* ── Types ─────────────────────────────────────────────────── */

interface LiveJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  type: string;
  category: string;
  postedDate: string;
  applyUrl: string;
  source: "Adzuna";
}

interface ExitModal {
  url: string;
  jobTitle: string;
  company: string;
  source: string;
}

/* ── Static learnerships (SA-specific, no external API) ──── */

const learnerships = [
  { id: "l1", title: "IT Technical Support Learnership", company: "MICT SETA", type: "Learnership", location: "Gauteng", salary: "R3,500/mo stipend", skills: ["IT Support", "Networking", "Hardware"], postedDays: 3, icon: Wrench, description: "NQF Level 4 learnership in IT technical support. Gain hands-on experience while earning a nationally recognised qualification. Open to youth aged 18 to 35." },
  { id: "l2", title: "Business Administration Learnership", company: "SERVICES SETA", type: "Learnership", location: "Western Cape", salary: "R3,000/mo stipend", skills: ["Administration", "Communication", "MS Office"], postedDays: 6, icon: BarChart2, description: "NQF Level 3 learnership covering office administration, customer service and business communication. Matric required." },
  { id: "l3", title: "Early Childhood Development Learnership", company: "ETDP SETA", type: "Learnership", location: "KwaZulu-Natal", salary: "R2,800/mo stipend", skills: ["Child Care", "Education", "Communication"], postedDays: 2, icon: GraduationCap, description: "NQF Level 4 ECD learnership for aspiring teachers and caregivers. Practical placement at a registered ECD centre included." },
  { id: "l4", title: "Security Operations Learnership", company: "SASSETA", type: "Learnership", location: "Gauteng", salary: "R3,200/mo stipend", skills: ["Security", "First Aid", "Conflict Management"], postedDays: 8, icon: ShieldCheck, description: "PSIRA-accredited security learnership covering Grade C to E. Registered for PSIRA upon successful completion. Ages 18 to 35." },
  { id: "l5", title: "Agricultural Production Learnership", company: "AgriSETA", type: "Learnership", location: "Limpopo", salary: "R2,500/mo stipend", skills: ["Farming", "Soil Science", "Irrigation"], postedDays: 4, icon: Leaf, description: "NQF Level 2 learnership in agricultural production covering crop farming, soil management and irrigation. Rural candidates encouraged to apply." },
  { id: "l6", title: "Digital Marketing Learnership", company: "MICT SETA", type: "Learnership", location: "Johannesburg, GP", salary: "R3,500/mo stipend", skills: ["Social Media", "SEO", "Content Creation"], postedDays: 1, icon: Megaphone, description: "NQF Level 5 digital marketing learnership. Learn SEO, paid ads, analytics and content strategy with a leading agency partner." },
  { id: "l7", title: "Finance and Accounting Learnership", company: "FASSET", type: "Learnership", location: "Cape Town, WC", salary: "R4,000/mo stipend", skills: ["Accounting", "Excel", "Bookkeeping"], postedDays: 5, icon: DollarSign, description: "NQF Level 4 learnership in financial services. Suitable for matric graduates wanting to enter the banking or accounting sector." },
  { id: "l8", title: "Community Health Worker Learnership", company: "HW SETA", type: "Learnership", location: "Eastern Cape", salary: "R2,800/mo stipend", skills: ["Health Education", "First Aid", "Community Work"], postedDays: 3, icon: HeartPulse, description: "NQF Level 3 CHW learnership covering basic health promotion, HIV/AIDS awareness and home-based care. No experience required." },
  { id: "l9", title: "Project Management Learnership", company: "SERVICES SETA", type: "Learnership", location: "Pretoria, GP", salary: "R3,800/mo stipend", skills: ["Project Management", "MS Office", "Communication"], postedDays: 7, icon: Rocket, description: "NQF Level 5 learnership covering project planning, risk management and stakeholder communication. Suitable for graduates and school leavers." },
];

const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Learnership"];

const typeColor: Record<string, string> = {
  "Full-time":   "text-blue-600",
  "Part-time":   "text-purple-600",
  "Contract":    "text-orange-500",
  "Internship":  "text-brand-green",
  "Learnership": "text-yellow-600",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/* ── Date formatter ─────────────────────────────────────────── */

function postedLabel(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

/* ── Page ────────────────────────────────────────────────────── */

export default function JobsPage() {
  const [liveJobs, setLiveJobs]     = useState<LiveJob[]>([]);
  const [apiError, setApiError]     = useState<string | null>(null);
  const [liveLoading, setLiveLoading] = useState(true);
  const [skeletonDone, setSkeletonDone] = useState(false);

  const [activeType, setActiveType] = useState("All");
  const [search, setSearch]         = useState("");
  const [exitModal, setExitModal]   = useState<ExitModal | null>(null);

  /* fetch live jobs */
  const fetchJobs = useCallback(async (q: string) => {
    setLiveLoading(true);
    setApiError(null);
    try {
      const params = new URLSearchParams({ what: q, where: "south africa" });
      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      if (data.error) {
        setApiError(data.error);
      } else {
        setLiveJobs(data.jobs ?? []);
      }
    } catch {
      setApiError("Could not load live jobs. Showing learnerships only.");
    } finally {
      setLiveLoading(false);
    }
  }, []);

  /* initial load — skeleton for 1 s then fetch */
  useEffect(() => {
    const t = setTimeout(() => {
      setSkeletonDone(true);
      fetchJobs("");
    }, 800);
    return () => clearTimeout(t);
  }, [fetchJobs]);

  /* debounced search */
  useEffect(() => {
    if (!skeletonDone) return;
    const t = setTimeout(() => fetchJobs(search), 500);
    return () => clearTimeout(t);
  }, [search, skeletonDone, fetchJobs]);

  if (!skeletonDone) return <JobsSkeleton />;

  /* filter learnerships locally */
  const filteredLearnerships = learnerships.filter((j) => {
    const matchType = activeType === "All" || activeType === "Learnership";
    const matchSearch =
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  /* filter live jobs by type */
  const filteredLive = liveJobs.filter((j) => {
    const matchType =
      activeType === "All" ||
      activeType === "Learnership"
        ? false
        : j.type === activeType || activeType === "All";
    return matchType;
  });

  const showLive   = activeType !== "Learnership";
  const showLearn  = activeType === "All" || activeType === "Learnership";
  const totalShown = (showLive ? filteredLive.length : 0) + (showLearn ? filteredLearnerships.length : 0);

  return (
    <>
      {exitModal && (
        <ExitWarningModal
          url={exitModal.url}
          jobTitle={exitModal.jobTitle}
          company={exitModal.company}
          source={exitModal.source}
          onClose={() => setExitModal(null)}
        />
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Job Board</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Live opportunities across South Africa, sourced from{" "}
            <span className="text-brand-green font-medium">Adzuna</span>,
            plus {learnerships.length} SETA learnerships.
          </p>
        </motion.div>

        {/* Search + filters */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search jobs or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
              aria-label="Search jobs"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by job type">
            {jobTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeType === type
                    ? "bg-brand-green text-white"
                    : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-green hover:text-brand-green"
                }`}
                aria-pressed={activeType === type}
              >
                {type}
              </button>
            ))}
          </div>
        </motion.div>

        {/* API error banner */}
        {apiError && (
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400"
          >
            <span>{apiError}</span>
            <button
              onClick={() => fetchJobs(search)}
              className="flex items-center gap-1.5 text-xs font-medium text-yellow-700 dark:text-yellow-400 hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </motion.div>
        )}

        {/* Live jobs section */}
        {showLive && (
          <div className="space-y-3">
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Live Jobs — South Africa
              </h2>
              {liveLoading && (
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Loading...
                </span>
              )}
              {!liveLoading && !apiError && (
                <span className="text-xs text-gray-400">{filteredLive.length} results from Adzuna</span>
              )}
            </motion.div>

            {!liveLoading && filteredLive.length === 0 && !apiError && (
              <motion.div variants={itemVariants} className="card p-8 text-center text-gray-400 text-sm">
                No live jobs found for this search. Try a different keyword.
              </motion.div>
            )}

            <motion.div variants={containerVariants} className="space-y-3">
              {filteredLive.map((job) => (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  whileHover={{ x: 2 }}
                  className="card p-5 flex flex-col sm:flex-row gap-4"
                >
                  <Building2 className="w-6 h-6 text-brand-green flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
                          {job.company}
                          <span className="text-gray-300">·</span>
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          {job.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs flex-shrink-0">
                        <span className={`font-medium ${typeColor[job.type] ?? "text-gray-500"}`}>
                          {job.type}
                        </span>
                        <span className="text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {postedLabel(job.postedDate)}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex items-center justify-between mt-3 gap-3">
                      <div>
                        <p className="text-brand-green font-semibold text-sm">{job.salary}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{job.category}</p>
                      </div>
                      <button
                        onClick={() =>
                          setExitModal({
                            url: job.applyUrl,
                            jobTitle: job.title,
                            company: job.company,
                            source: job.source,
                          })
                        }
                        className="btn-primary text-sm px-4 py-2 flex items-center gap-2 flex-shrink-0"
                        aria-label={`Apply for ${job.title} at ${job.company}`}
                      >
                        Apply Now
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Learnerships section */}
        {showLearn && filteredLearnerships.length > 0 && (
          <div className="space-y-3">
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                SETA Learnerships
              </h2>
              <span className="text-xs text-gray-400">{filteredLearnerships.length} available</span>
            </motion.div>

            <motion.div variants={containerVariants} className="space-y-3">
              {filteredLearnerships.map((job) => {
                const Icon = job.icon;
                return (
                  <motion.div
                    key={job.id}
                    variants={itemVariants}
                    whileHover={{ x: 2 }}
                    className="card p-5 flex flex-col sm:flex-row gap-4 border-l-4 border-yellow-400"
                  >
                    <Icon className="w-6 h-6 text-brand-green flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base leading-snug">
                            {job.title}
                          </h3>
                          <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
                            {job.company}
                            <span className="text-gray-300">·</span>
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            {job.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs flex-shrink-0">
                          <span className="font-medium text-yellow-600">Learnership</span>
                          <span className="text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />{job.postedDays}d ago
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs text-gray-500 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-0.5"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-3 gap-3">
                        <p className="text-brand-green font-semibold text-sm">{job.salary}</p>
                        <button
                          onClick={() =>
                            setExitModal({
                              url: `https://www.google.com/search?q=${encodeURIComponent(job.title + " " + job.company + " apply")}`,
                              jobTitle: job.title,
                              company: job.company,
                              source: job.company,
                            })
                          }
                          className="btn-primary text-sm px-4 py-2 flex items-center gap-2 flex-shrink-0"
                          aria-label={`Apply for ${job.title}`}
                        >
                          Apply Now
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}

        {/* Empty state */}
        {totalShown === 0 && !liveLoading && (
          <motion.div variants={itemVariants} className="text-center py-20">
            <Briefcase className="w-10 h-10 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-500">No opportunities found</p>
            <p className="text-sm mt-1 text-gray-400">Try different filters or search terms</p>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
