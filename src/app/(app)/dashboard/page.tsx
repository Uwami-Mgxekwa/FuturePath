"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Award, Briefcase, Zap, MapPin, ChevronRight, Quote,
} from "lucide-react";
import { DashboardSkeleton } from "@/components/Skeleton";

/* ── Daily words of encouragement — SA-rooted ───────────────── */
const QUOTES = [
  { text: "Umuntu ngumuntu ngabantu.", translation: "A person is a person through other people.", source: "Zulu proverb" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", source: "Nelson Mandela" },
  { text: "It always seems impossible until it is done.", source: "Nelson Mandela" },
  { text: "Education is the most powerful weapon which you can use to change the world.", source: "Nelson Mandela" },
  { text: "Do not be afraid of taking a bold step. You cannot cross a chasm in two small jumps.", source: "South African saying" },
  { text: "Nna ke motho ke motho ka batho.", translation: "I am a person through other people.", source: "Sotho proverb" },
  { text: "A person who feels appreciated will always do more than what is expected.", source: "South African proverb" },
  { text: "Even the night has ears. Work hard, someone is watching your growth.", source: "Xhosa proverb" },
  { text: "Rain does not fall on one roof alone — your community rises with you.", source: "Zulu proverb" },
  { text: "The youth of today are the leaders of tomorrow. Start leading now.", source: "Nelson Mandela" },
  { text: "Challenges are gifts that force us to search for a new centre of gravity.", source: "Oprah Winfrey" },
  { text: "Success is not final, failure is not fatal — it is the courage to continue that counts.", source: "Winnie Madikizela-Mandela" },
  { text: "A dream does not become reality through magic. It takes sweat, determination and hard work.", source: "South African proverb" },
  { text: "However long the night, the dawn will break.", source: "African proverb" },
  { text: "Go to bed wiser than when you woke up. Every lesson counts.", source: "South African saying" },
  { text: "The roots of education are bitter, but the fruit is sweet.", source: "Aristotle — beloved in SA classrooms" },
  { text: "Ubuntu: I am because we are. Share your progress — it lifts others.", source: "Ubuntu philosophy" },
  { text: "Your background does not determine your destination.", source: "South African youth proverb" },
  { text: "Isandla sihlamba esinye — one hand washes the other. Keep helping, keep growing.", source: "Zulu proverb" },
  { text: "The future belongs to those who prepare for it today.", source: "Malcolm X — widely quoted in SA schools" },
  { text: "Hard times never last, but hard people do.", source: "South African township saying" },
  { text: "Tshela metsi — pour water. Keep giving effort, even when results are not yet visible.", source: "Sesotho proverb" },
  { text: "A child who is not embraced by the village will burn it down to feel its warmth. Be the village for someone today.", source: "African proverb" },
  { text: "Ukuphila yimpilo — to live is life. Show up fully, every single day.", source: "Zulu saying" },
  { text: "You cannot plough a field by turning it over in your mind. Take action.", source: "South African farming proverb" },
  { text: "Stars cannot shine without darkness. Your struggle is building your strength.", source: "South African saying" },
  { text: "Ngeke unqobe inkosi nje ngamazwi — you cannot defeat a king with words alone. Back your dreams with action.", source: "Zulu proverb" },
  { text: "Every day above ground is a great day. Make it count.", source: "Cape Town street wisdom" },
];

function getDailyQuote() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return QUOTES[dayOfYear % QUOTES.length];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const stats = [
  { label: "Courses In Progress", value: "3", icon: BookOpen },
  { label: "Certificates Earned", value: "5", icon: Award },
  { label: "Jobs Applied", value: "2", icon: Briefcase },
  { label: "Skills Gained", value: "12", icon: Zap },
];

const activeCourses = [
  { id: 1, title: "Digital Marketing Fundamentals", progress: 72, lessons: 24, completedLessons: 17 },
  { id: 2, title: "Web Development Basics", progress: 45, lessons: 36, completedLessons: 16 },
  { id: 3, title: "Financial Literacy", progress: 20, lessons: 18, completedLessons: 4 },
];

const recentJobs = [
  { id: 1, title: 'Junior Social Media Manager', company: 'Digital Hustle Agency', type: 'Full-time', location: 'Johannesburg' },
  { id: 2, title: 'Web Developer Intern', company: 'TechBridge SA', type: 'Internship', location: 'Remote' },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">Good morning, Student</h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s what&apos;s happening with your learning journey.
        </p>
      </motion.div>

      {/* Word of the day */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl p-5 bg-yellow-400"
      >
        <div className="flex items-start gap-3">
          <Quote className="w-5 h-5 text-yellow-900 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-yellow-900 mb-1">Word of the Day</p>
            <p className="text-yellow-950 font-medium leading-relaxed">
              {getDailyQuote().text}
            </p>
            {getDailyQuote().translation && (
              <p className="text-yellow-800 text-sm italic mt-1">{getDailyQuote().translation}</p>
            )}
            <p className="text-yellow-700 text-xs mt-2">{getDailyQuote().source}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={itemVariants} className="card p-5">
              <Icon className="w-5 h-5 text-brand-green mb-3" />
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active courses */}
        <motion.div variants={itemVariants} className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Active Courses</h2>
            <a href="/courses" className="text-brand-green text-sm font-medium hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-5">
            {activeCourses.map((course) => (
              <div key={course.id} className="flex items-center gap-4">
                <BookOpen className="w-5 h-5 text-brand-green flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 truncate">{course.title}</p>
                    <span className="text-sm font-semibold text-brand-green ml-2">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <motion.div
                      className="bg-brand-green h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                      role="progressbar"
                      aria-valuenow={course.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {course.completedLessons} / {course.lessons} lessons
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Job matches */}
        <motion.div variants={itemVariants} className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Job Matches</h2>
            <a href="/jobs" className="text-brand-green text-sm font-medium hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="p-3 rounded-xl border border-gray-100 hover:border-brand-green transition-colors">
                <p className="font-medium text-gray-900 text-sm">{job.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{job.company}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="text-brand-green font-medium">{job.type}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{job.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <a href="/jobs" className="btn-secondary w-full text-center text-sm mt-4 block py-2">
            Explore Jobs
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
