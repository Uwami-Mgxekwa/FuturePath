"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Monitor, Megaphone, DollarSign, Leaf, HeartPulse, Rocket,
  Clock, BookOpen, Users, Star,
} from "lucide-react";

const categories = ["All", "Technology", "Marketing", "Finance", "Agriculture", "Health", "Entrepreneurship"];

const courses = [
  { id: 1, title: "Web Development Basics", category: "Technology", instructor: "James Oduya", lessons: 36, duration: "12 hours", level: "Beginner", enrolled: 1420, rating: 4.8, icon: Monitor, description: "Learn HTML, CSS, and JavaScript from scratch. Build real websites and launch your tech career." },
  { id: 2, title: "Digital Marketing Fundamentals", category: "Marketing", instructor: "Aisha Kamau", lessons: 24, duration: "8 hours", level: "Beginner", enrolled: 2310, rating: 4.9, icon: Megaphone, description: "Master social media, SEO, and digital ads to grow any business online." },
  { id: 3, title: "Financial Literacy & Savings", category: "Finance", instructor: "Dr. Peter Mwangi", lessons: 18, duration: "6 hours", level: "Beginner", enrolled: 980, rating: 4.7, icon: DollarSign, description: "Understand budgeting, saving, and investing to take control of your financial future." },
  { id: 4, title: "Modern Agribusiness", category: "Agriculture", instructor: "Grace Wanjiku", lessons: 20, duration: "7 hours", level: "Intermediate", enrolled: 650, rating: 4.6, icon: Leaf, description: "Learn smart farming techniques, market access, and agricultural entrepreneurship." },
  { id: 5, title: "Community Health Worker Training", category: "Health", instructor: "Nurse Faith Otieno", lessons: 30, duration: "10 hours", level: "Beginner", enrolled: 1100, rating: 4.8, icon: HeartPulse, description: "Equip yourself with essential health knowledge to serve your community." },
  { id: 6, title: "Starting a Small Business", category: "Entrepreneurship", instructor: "Brian Kipchoge", lessons: 22, duration: "9 hours", level: "Beginner", enrolled: 1890, rating: 4.9, icon: Rocket, description: "From idea to launch: everything you need to start and grow a small business." },
];

const levelColor: Record<string, string> = {
  Beginner: "text-brand-green",
  Intermediate: "text-yellow-600",
  Advanced: "text-red-500",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = courses.filter((c) => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto space-y-8">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
        <p className="text-gray-500 mt-1">Explore {courses.length} industry-aligned courses.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <input
          type="search"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input max-w-xs"
          aria-label="Search courses"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-brand-green text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-brand-green hover:text-brand-green"
              }`}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => {
          const Icon = course.icon;
          return (
            <motion.div key={course.id} variants={itemVariants} whileHover={{ y: -4 }} className="card overflow-hidden">
              {/* Thumbnail — clean white with centered icon */}
              <div className="h-36 flex items-center justify-center border-b border-gray-100">
                <Icon className="w-10 h-10 text-brand-green" strokeWidth={1.5} />
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3 mb-2 text-xs font-medium">
                  <span className={levelColor[course.level]}>{course.level}</span>
                  <span className="text-gray-400">{course.category}</span>
                </div>

                <h3 className="font-semibold text-gray-900 text-lg leading-snug">{course.title}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{course.description}</p>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{course.lessons} lessons</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.enrolled.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                  </div>
                  <button className="btn-primary text-sm px-4 py-2">Enroll Free</button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-20">
          <BookOpen className="w-10 h-10 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-500">No courses found</p>
          <p className="text-sm mt-1 text-gray-400">Try a different search or category</p>
        </motion.div>
      )}
    </motion.div>
  );
}
