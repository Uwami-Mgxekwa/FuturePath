"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  Briefcase,
  Zap,
  MapPin,
  ChevronRight,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const stats = [
  {
    label: "Courses In Progress",
    value: "3",
    icon: BookOpen,
    colorClass: "bg-brand-green-muted text-brand-green",
  },
  {
    label: "Certificates Earned",
    value: "5",
    icon: Award,
    colorClass: "bg-yellow-50 text-yellow-600",
  },
  {
    label: "Jobs Applied",
    value: "2",
    icon: Briefcase,
    colorClass: "bg-blue-50 text-blue-600",
  },
  {
    label: "Skills Gained",
    value: "12",
    icon: Zap,
    colorClass: "bg-purple-50 text-purple-600",
  },
];

const activeCourses = [
  {
    id: 1,
    title: "Digital Marketing Fundamentals",
    category: "Marketing",
    progress: 72,
    lessons: 24,
    completedLessons: 17,
  },
  {
    id: 2,
    title: "Web Development Basics",
    category: "Technology",
    progress: 45,
    lessons: 36,
    completedLessons: 16,
  },
  {
    id: 3,
    title: "Financial Literacy",
    category: "Finance",
    progress: 20,
    lessons: 18,
    completedLessons: 4,
  },
];

const recentJobs = [
  {
    id: 1,
    title: "Junior Social Media Manager",
    company: "AfriGrowth Agency",
    type: "Full-time",
    location: "Nairobi",
  },
  {
    id: 2,
    title: "Web Developer Intern",
    company: "TechBridge Kenya",
    type: "Internship",
    location: "Remote",
  },
];

export default function DashboardPage() {
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

      {/* Stats */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={itemVariants} className="card p-5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.colorClass}`}
              >
                <Icon className="w-5 h-5" />
              </div>
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
            <a
              href="/courses"
              className="text-brand-green text-sm font-medium hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-5">
            {activeCourses.map((course) => (
              <div key={course.id} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-green-muted rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-brand-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 truncate">{course.title}</p>
                    <span className="text-sm font-semibold text-brand-green ml-2">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <motion.div
                      className="bg-brand-green h-2 rounded-full"
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

        {/* Recommended jobs */}
        <motion.div variants={itemVariants} className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Job Matches</h2>
            <a
              href="/jobs"
              className="text-brand-green text-sm font-medium hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="p-3 rounded-xl border border-gray-100 hover:border-brand-green transition-colors"
              >
                <p className="font-medium text-gray-900 text-sm">{job.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{job.company}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="badge-green text-xs">{job.type}</span>
                  <span className="badge-gray text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <a
            href="/jobs"
            className="btn-secondary w-full text-center text-sm mt-4 block py-2"
          >
            Explore Jobs
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
