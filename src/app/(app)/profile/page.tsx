"use client";

import { motion } from "framer-motion";
import {
  MapPin, BookOpen, Award, Pencil, CheckCircle2,
  Download, Share2, Trophy, Flame, Briefcase, Star, Globe,
} from "lucide-react";

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
  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-5xl mx-auto space-y-8">

      {/* Profile header */}
      <motion.div variants={itemVariants} className="card p-6 flex flex-col sm:flex-row gap-6 items-start">
        <div className="w-20 h-20 bg-brand-green rounded-2xl flex items-center justify-center text-4xl font-bold text-white flex-shrink-0">
          S
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student User</h1>
              <p className="text-gray-500">student@futurepath.app</p>
            </div>
            <button className="btn-secondary text-sm px-4 py-2 self-start flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-brand-green" />Nairobi, Kenya</span>
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
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    a.earned ? "border-brand-green" : "border-gray-100 opacity-40"
                  }`}
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
            <div key={cert.id} className="border border-brand-green rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-green-muted rounded-bl-full opacity-30" />
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
  );
}
