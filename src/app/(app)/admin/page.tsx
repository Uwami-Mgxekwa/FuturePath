"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Briefcase, Award, Download, Plus, TrendingUp, Search } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const stats = [
  { label: "Total Students", value: "10,243", change: "+12%", icon: Users },
  { label: "Active Courses", value: "48", change: "+3", icon: BookOpen },
  { label: "Jobs Posted", value: "126", change: "+8", icon: Briefcase },
  { label: "Certificates Issued", value: "3,891", change: "+24%", icon: Award },
];

const recentUsers = [
  { id: 1, name: "Amina Hassan", email: "amina@example.com", role: "Student", joined: "Oct 6, 2026", status: "active" },
  { id: 2, name: "Kofi Asante", email: "kofi@example.com", role: "Student", joined: "Oct 5, 2026", status: "active" },
  { id: 3, name: "Ngozi Obi", email: "ngozi@example.com", role: "Mentor", joined: "Oct 4, 2026", status: "active" },
  { id: 4, name: "James Mwangi", email: "james@example.com", role: "Student", joined: "Oct 3, 2026", status: "inactive" },
  { id: 5, name: "Faith Otieno", email: "faith@example.com", role: "Admin", joined: "Oct 1, 2026", status: "active" },
];

const roleColor: Record<string, string> = {
  Admin: "text-red-500",
  Mentor: "text-blue-600",
  Student: "text-brand-green",
};

const tabs = ["Overview", "Users", "Courses", "Jobs"];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 mt-1">Manage courses, jobs, and users.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />Export Data
          </button>
          <button className="btn-primary text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />Add Course
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? "border-brand-green text-brand-green"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={itemVariants} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-brand-green" />
                <span className="text-xs font-semibold text-green-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />{stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Users table */}
      <motion.div variants={itemVariants} className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="search" placeholder="Search users..." className="input pl-9 text-sm" aria-label="Search users" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Email", "Role", "Joined", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium ${roleColor[user.role] ?? "text-gray-500"}`}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.joined}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium ${user.status === "active" ? "text-brand-green" : "text-gray-400"}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button className="text-brand-green text-xs font-medium hover:underline">Edit</button>
                      <button className="text-red-400 text-xs font-medium hover:underline">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
