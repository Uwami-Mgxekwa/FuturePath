"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert, Monitor, Megaphone, DollarSign, Leaf, HeartPulse, Rocket, ShieldCheck,
  Clock, BookOpen, Users, Star, CheckCircle2, Loader2,
} from "lucide-react";
import Link from "next/link";
import { CoursesSkeleton } from "@/components/Skeleton";
import { auth, db } from "@/lib/firebase";
import {
  doc, setDoc, getDoc, serverTimestamp, collection,
  query, where, getDocs,
} from "firebase/firestore";

const categories = ["All", "Safety & Rights", "Technology", "Digital Skills", "Marketing", "Finance", "Agriculture", "Health", "Entrepreneurship"];

const courses = [
  { id: 7, title: "Understanding & Preventing GBV", category: "Safety & Rights", instructor: "Dr. Nandi Dlamini", lessons: 20, duration: "7 hours", level: "Beginner", enrolled: 3100, rating: 5.0, icon: ShieldAlert, illustration: "/course-gbv.svg", description: "A South African-focused course on recognising gender-based violence, knowing your rights, accessing support, and becoming a community advocate for change." },
  { id: 8, title: "Digital Safety and Scam Awareness", category: "Digital Skills", instructor: "Themba Nkosi", lessons: 18, duration: "6 hours", level: "Beginner", enrolled: 2750, rating: 4.9, icon: ShieldCheck, illustration: "/course-digitalsafety.svg", description: "Learn how to protect yourself from SIM swap fraud, phishing, banking scams, social media scams and online impersonation, threats that are rapidly increasing across South Africa." },
  { id: 1, title: "Web Development Basics", category: "Technology", instructor: "James Oduya", lessons: 36, duration: "12 hours", level: "Beginner", enrolled: 1420, rating: 4.8, icon: Monitor, illustration: "/course-webdev.svg", description: "Learn HTML, CSS, and JavaScript from scratch. Build real websites and launch your tech career." },
  { id: 2, title: "Digital Marketing Fundamentals", category: "Marketing", instructor: "Aisha Kamau", lessons: 24, duration: "8 hours", level: "Beginner", enrolled: 2310, rating: 4.9, icon: Megaphone, illustration: "/course-marketing.svg", description: "Master social media, SEO, and digital ads to grow any business online." },
  { id: 3, title: "Financial Literacy & Savings", category: "Finance", instructor: "Dr. Peter Mwangi", lessons: 18, duration: "6 hours", level: "Beginner", enrolled: 980, rating: 4.7, icon: DollarSign, illustration: "/course-finance.svg", description: "Understand budgeting, saving, and investing to take control of your financial future." },
  { id: 4, title: "Modern Agribusiness", category: "Agriculture", instructor: "Grace Wanjiku", lessons: 20, duration: "7 hours", level: "Intermediate", enrolled: 650, rating: 4.6, icon: Leaf, illustration: "/course-agriculture.svg", description: "Learn smart farming techniques, market access, and agricultural entrepreneurship." },
  { id: 5, title: "Community Health Worker Training", category: "Health", instructor: "Nurse Faith Otieno", lessons: 30, duration: "10 hours", level: "Beginner", enrolled: 1100, rating: 4.8, icon: HeartPulse, illustration: "/course-health.svg", description: "Equip yourself with essential health knowledge to serve your community." },
  { id: 6, title: "Starting a Small Business", category: "Entrepreneurship", instructor: "Brian Kipchoge", lessons: 22, duration: "9 hours", level: "Beginner", enrolled: 1890, rating: 4.9, icon: Rocket, illustration: "/course-entrepreneurship.svg", description: "From idea to launch: everything you need to start and grow a small business." },
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
  const [loading, setLoading] = useState(true);
  // Set of course IDs the user is already enrolled in
  const [enrolledIds, setEnrolledIds] = useState<Set<number>>(new Set());
  // Course IDs currently being enrolled (shows spinner)
  const [enrolling, setEnrolling] = useState<Set<number>>(new Set());

  // Load existing enrollments from Firestore
  useEffect(() => {
    async function loadEnrollments() {
      const user = auth.currentUser;
      if (!user) { setLoading(false); return; }
      try {
        const snap = await getDocs(
          query(collection(db, "progress"), where("userId", "==", user.uid))
        );
        const ids = new Set<number>();
        snap.forEach((d) => {
          const courseId = d.data().courseId;
          if (courseId) ids.add(Number(courseId));
        });
        setEnrolledIds(ids);
      } catch { /* silently fail */ }
      setLoading(false);
    }
    loadEnrollments();
  }, []);

  async function handleEnroll(
    e: React.MouseEvent,
    course: typeof courses[number]
  ) {
    // Prevent the Link from navigating
    e.preventDefault();
    e.stopPropagation();

    const user = auth.currentUser;
    if (!user) return;
    if (enrolledIds.has(course.id) || enrolling.has(course.id)) return;

    // Optimistic UI — mark as enrolling
    setEnrolling((prev) => new Set(prev).add(course.id));

    try {
      const progressId = `${user.uid}_${course.id}`;
      const progressRef = doc(db, "progress", progressId);

      // Only write if not already enrolled
      const existing = await getDoc(progressRef);
      if (!existing.exists()) {
        await setDoc(progressRef, {
          userId: user.uid,
          courseId: course.id,
          courseTitle: course.title,
          category: course.category,
          instructor: course.instructor,
          totalLessons: course.lessons,
          completedLessons: 0,
          progress: 0,
          enrolledAt: serverTimestamp(),
          lastAccessedAt: serverTimestamp(),
        });
      }

      // Mark enrolled
      setEnrolledIds((prev) => new Set(prev).add(course.id));
    } catch (err) {
      console.error("Enrollment failed:", err);
    } finally {
      setEnrolling((prev) => {
        const next = new Set(prev);
        next.delete(course.id);
        return next;
      });
    }
  }

  if (loading) return <CoursesSkeleton />;

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
          const isEnrolled = enrolledIds.has(course.id);
          const isEnrolling = enrolling.has(course.id);

          return (
            <Link key={course.id} href={`/courses/${course.id}`} className="block">
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4, boxShadow: "6px 6px 0px #00A651" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="card overflow-hidden border border-brand-green"
                style={{ boxShadow: "0px 0px 0px #00A651" }}
              >
                {/* Thumbnail */}
                <div className="h-44 border-b border-gray-100 overflow-hidden flex items-center justify-center p-4">
                  {course.illustration ? (
                    <img
                      src={course.illustration}
                      alt={course.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Icon className="w-12 h-12 text-brand-green" strokeWidth={1.5} />
                  )}
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

                    {/* Enroll button */}
                    <button
                      onClick={(e) => handleEnroll(e, course)}
                      disabled={isEnrolled || isEnrolling}
                      aria-label={isEnrolled ? `Already enrolled in ${course.title}` : `Enroll in ${course.title}`}
                      className={`text-sm px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 ${
                        isEnrolled
                          ? "bg-brand-green-muted text-brand-green cursor-default"
                          : "btn-primary"
                      }`}
                    >
                      {isEnrolling ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />Enrolling...</>
                      ) : isEnrolled ? (
                        <><CheckCircle2 className="w-4 h-4" />Enrolled</>
                      ) : (
                        "Enroll Free"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </Link>
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
