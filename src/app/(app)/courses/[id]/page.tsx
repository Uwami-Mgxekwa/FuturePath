"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert, Monitor, Megaphone, DollarSign, Leaf, HeartPulse, Rocket, ShieldCheck,
  Clock, BookOpen, Users, Star, ArrowLeft, ArrowRight, CheckCircle2, Loader2,
  Award, Lock, ChevronDown, Lightbulb, Sparkles, Download,
} from "lucide-react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp,
  collection, query, where, getDocs,
} from "firebase/firestore";
import { useProfile } from "@/lib/ProfileContext";
import { BUILT_COURSES, generateCredentialId, type Lesson } from "@/lib/courseContent";

/* ── Course metadata (lightweight; full content lives in courseContent.ts) ── */
interface CourseMeta {
  id: number;
  title: string;
  category: string;
  instructor: string;
  instructor_bio: string;
  lessons_count: number;
  duration: string;
  level: string;
  enrolled: number;
  rating: number;
  icon: React.ElementType;
  description: string;
}

const COURSE_META: CourseMeta[] = [
  { id: 7, title: "Understanding & Preventing GBV", category: "Safety & Rights", instructor: "Dr. Nandi Dlamini", instructor_bio: "Dr. Dlamini is a social worker and advocate with over 15 years of experience supporting GBV survivors across South Africa.", lessons_count: 20, duration: "7 hours", level: "Beginner", enrolled: 3100, rating: 5.0, icon: ShieldAlert, description: "A South African-focused course on recognising gender-based violence, knowing your rights, accessing support, and becoming a community advocate for change." },
  { id: 8, title: "Digital Safety and Scam Awareness", category: "Digital Skills", instructor: "Themba Nkosi", instructor_bio: "Themba is a cybersecurity specialist and digital literacy trainer who helps South Africans protect themselves from online fraud and scams.", lessons_count: 6, duration: "6 hours", level: "Beginner", enrolled: 2750, rating: 4.9, icon: ShieldCheck, description: "Learn how to protect yourself from SIM swap fraud, phishing, banking scams, social media scams and online impersonation, threats that are rapidly increasing across South Africa." },
  { id: 1, title: "Web Development Basics", category: "Technology", instructor: "James Oduya", instructor_bio: "James is a full-stack developer and educator who has mentored over 2 000 students across Africa in web technologies.", lessons_count: 36, duration: "12 hours", level: "Beginner", enrolled: 1420, rating: 4.8, icon: Monitor, description: "Learn HTML, CSS, and JavaScript from scratch. Build real websites and launch your tech career." },
  { id: 2, title: "Digital Marketing Fundamentals", category: "Marketing", instructor: "Aisha Kamau", instructor_bio: "Aisha is a digital marketing strategist who has grown brands across East and Southern Africa using data-driven campaigns.", lessons_count: 24, duration: "8 hours", level: "Beginner", enrolled: 2310, rating: 4.9, icon: Megaphone, description: "Master social media, SEO, and digital ads to grow any business online." },
  { id: 3, title: "Financial Literacy & Savings", category: "Finance", instructor: "Dr. Peter Mwangi", instructor_bio: "Dr. Mwangi is a certified financial planner who teaches practical money management to youth and young professionals.", lessons_count: 18, duration: "6 hours", level: "Beginner", enrolled: 980, rating: 4.7, icon: DollarSign, description: "Understand budgeting, saving, and investing to take control of your financial future." },
  { id: 4, title: "Modern Agribusiness", category: "Agriculture", instructor: "Grace Wanjiku", instructor_bio: "Grace is an agricultural entrepreneur and trainer who helps smallholder farmers access modern techniques and markets.", lessons_count: 20, duration: "7 hours", level: "Intermediate", enrolled: 650, rating: 4.6, icon: Leaf, description: "Learn smart farming techniques, market access, and agricultural entrepreneurship." },
  { id: 5, title: "Community Health Worker Training", category: "Health", instructor: "Nurse Faith Otieno", instructor_bio: "Nurse Faith is a registered nurse and community health trainer with experience in rural health outreach programmes.", lessons_count: 30, duration: "10 hours", level: "Beginner", enrolled: 1100, rating: 4.8, icon: HeartPulse, description: "Equip yourself with essential health knowledge to serve your community." },
  { id: 6, title: "Starting a Small Business", category: "Entrepreneurship", instructor: "Brian Kipchoge", instructor_bio: "Brian is a serial entrepreneur and business coach who has helped launch over 100 small businesses across Sub-Saharan Africa.", lessons_count: 22, duration: "9 hours", level: "Beginner", enrolled: 1890, rating: 4.9, icon: Rocket, description: "From idea to launch: everything you need to start and grow a small business." },
];

const levelColor: Record<string, string> = {
  Beginner: "text-brand-green",
  Intermediate: "text-yellow-600",
  Advanced: "text-red-500",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

type Stage = "loading" | "not-enrolled" | "learning" | "complete" | "certified";

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = Number(params.id);
  const meta = COURSE_META.find((c) => c.id === courseId);
  const built = BUILT_COURSES[courseId];
  const { profile } = useProfile();

  const [stage, setStage] = useState<Stage>("loading");
  const [enrolling, setEnrolling] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [certifying, setCertifying] = useState(false);
  const [existingCertId, setExistingCertId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Resolved Firebase user — populated once onAuthStateChanged fires
  const [firebaseUser, setFirebaseUser] = useState<User | null | undefined>(undefined);

  // ── Wait for Firebase Auth to resolve ──
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setFirebaseUser(u));
    return () => unsub();
  }, []);

  // ── Load enrollment progress + any existing certificate ──
  useEffect(() => {
    // Still waiting for auth to resolve
    if (firebaseUser === undefined) return;
    async function load() {
      const user = firebaseUser;
      if (!user || !meta) { setStage("not-enrolled"); return; }
      try {
        const progressId = `${user.uid}_${courseId}`;
        const pSnap = await getDoc(doc(db, "progress", progressId));
        if (!pSnap.exists()) { setStage("not-enrolled"); return; }

        const data = pSnap.data();
        const done: string[] = Array.isArray(data.completedLessonIds) ? data.completedLessonIds : [];
        setCompletedIds(done);

        // Has a certificate already been issued?
        const certSnap = await getDocs(
          query(collection(db, "certificates"), where("userId", "==", user.uid), where("courseId", "==", courseId))
        );
        if (!certSnap.empty) {
          setExistingCertId(certSnap.docs[0].data().credentialId || certSnap.docs[0].id);
          setStage("certified");
        } else if (built && done.length >= built.lessons.length) {
          setStage("complete");
        } else {
          setStage("learning");
          // Auto-expand the first incomplete lesson for a smooth start
          if (built) {
            const next = built.lessons.find((l) => !done.includes(l.id));
            if (next) setExpandedId(next.id);
          }
        }
      } catch (err) {
        console.error("Load progress failed:", err);
        setStage("not-enrolled");
      }
    }
    load();
  }, [courseId, meta, built, firebaseUser]);

  // ── Enroll (create progress doc) ──
  async function handleEnroll() {
    const user = firebaseUser;
    if (!user || !meta) return;
    setEnrolling(true);
    try {
      const progressId = `${user.uid}_${courseId}`;
      const existing = await getDoc(doc(db, "progress", progressId));
      if (!existing.exists()) {
        await setDoc(doc(db, "progress", progressId), {
          userId: user.uid,
          courseId,
          courseTitle: meta.title,
          category: meta.category,
          instructor: meta.instructor,
          totalLessons: built ? built.lessons.length : meta.lessons_count,
          completedLessons: 0,
          completedLessonIds: [],
          progress: 0,
          enrolledAt: serverTimestamp(),
          lastAccessedAt: serverTimestamp(),
        });
      }
      setStage("learning");
      if (built) setExpandedId(built.lessons[0].id);
    } catch (err) {
      console.error("Enroll failed:", err);
      setError("Could not enrol. Please try again.");
    } finally {
      setEnrolling(false);
    }
  }

  // ── Mark a lesson complete ──
  async function handleComplete(lesson: Lesson) {
    const user = firebaseUser;
    if (!user || !built) return;
    if (completedIds.includes(lesson.id)) return;
    setMarkingId(lesson.id);
    try {
      const progressId = `${user.uid}_${courseId}`;
      const nextIds = [...completedIds, lesson.id];
      const nextCount = nextIds.length;
      const nextPct = Math.round((nextCount / built.lessons.length) * 100);

      await updateDoc(doc(db, "progress", progressId), {
        completedLessonIds: arrayUnion(lesson.id),
        completedLessons: nextCount,
        progress: nextPct,
        lastAccessedAt: serverTimestamp(),
      });

      setCompletedIds(nextIds);

      // Move to the next incomplete lesson automatically
      const next = built.lessons.find((l) => !nextIds.includes(l.id));
      setExpandedId(next ? next.id : lesson.id);

      if (nextCount >= built.lessons.length) {
        const certSnap = await getDocs(
          query(collection(db, "certificates"), where("userId", "==", user.uid), where("courseId", "==", courseId))
        );
        if (!certSnap.empty) {
          setExistingCertId(certSnap.docs[0].data().credentialId || certSnap.docs[0].id);
          setStage("certified");
        } else {
          setStage("complete");
        }
      }
    } catch (err) {
      console.error("Mark complete failed:", err);
      setError("Could not save your progress. Please try again.");
    } finally {
      setMarkingId(null);
    }
  }

  // ── Generate the certificate ──
  async function handleGenerateCertificate() {
    const user = firebaseUser;
    if (!user || !built || !meta) return;
    setCertifying(true);
    setError(null);
    try {
      // Double-check no certificate already exists for this user+course
      const existing = await getDocs(
        query(collection(db, "certificates"), where("userId", "==", user.uid), where("courseId", "==", courseId))
      );
      let credentialId: string;
      if (!existing.empty) {
        credentialId = existing.docs[0].data().credentialId || existing.docs[0].id;
      } else {
        credentialId = generateCredentialId(courseId);
        const studentName = profile.name?.trim() || user.displayName || "FuturePath Learner";
        await setDoc(doc(db, "certificates", credentialId), {
          userId: user.uid,
          userDisplayName: studentName,
          courseId,
          courseTitle: meta.title,
          category: meta.category,
          instructor: meta.instructor,
          score: 100, // completion
          issuedAt: serverTimestamp(),
          credentialId,
        });
      }
      router.push(`/certificates/${credentialId}`);
    } catch (err) {
      console.error("Certificate generation failed:", err);
      setError("Could not issue your certificate. Please try again.");
      setCertifying(false);
    }
  }

  if (!meta) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 py-20 text-center">
        <BookOpen className="w-12 h-12 mx-auto text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
        <p className="text-gray-500">The course you are looking for does not exist.</p>
        <button onClick={() => router.back()} className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </button>
      </div>
    );
  }

  const Icon = meta.icon;

  /* ── If this course is not built out yet, show the under-construction state ── */
  if (!built) {
    return (
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-5xl mx-auto space-y-6">
        <motion.div variants={itemVariants}>
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-green transition-colors text-sm font-medium" aria-label="Back to Courses">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </button>
        </motion.div>
        <motion.div variants={itemVariants} className="card border border-brand-green p-6">
          <div className="flex items-start gap-4">
            <Icon className="w-10 h-10 text-brand-green flex-shrink-0 mt-1" strokeWidth={1.5} />
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">{meta.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                <span className={`font-medium ${levelColor[meta.level]}`}>{meta.level}</span>
                <span className="text-gray-400">{meta.category}</span>
              </div>
              <p className="text-gray-500 mt-3">{meta.description}</p>
            </div>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="card p-10 flex flex-col items-center text-center border border-gray-100">
          <div className="w-16 h-16 rounded-full border-4 border-brand-green flex items-center justify-center mb-6">
            <Clock className="w-7 h-7 text-brand-green" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{meta.title}</h2>
          <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-4">Course Under Construction</p>
          <p className="text-gray-500 max-w-md leading-relaxed mb-8">
            This course is currently being developed by our team and will be launched soon. You will be notified as soon as it is ready.
          </p>
          <div className="border border-gray-100 rounded-2xl px-6 py-4 w-full max-w-sm text-left mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Instructor</p>
            <p className="font-semibold text-gray-900">{meta.instructor}</p>
            <p className="text-sm text-gray-500 mt-1">{meta.instructor_bio}</p>
          </div>
          <button onClick={() => router.back()} className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </button>
        </motion.div>
      </motion.div>
    );
  }

  /* ── Built course: hero ── */
  const totalLessons = built.lessons.length;
  const doneCount = completedIds.length;
  const progressPct = Math.round((doneCount / totalLessons) * 100);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <motion.div variants={itemVariants}>
        <Link href="/courses" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-green transition-colors text-sm font-medium" aria-label="Back to Courses">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>
      </motion.div>

      {/* Hero */}
      <motion.div variants={itemVariants} className="card border border-brand-green p-6">
        <div className="flex items-start gap-4">
          <Icon className="w-10 h-10 text-brand-green flex-shrink-0 mt-1" strokeWidth={1.5} />
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{meta.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
              <span className={`font-medium ${levelColor[meta.level]}`}>{meta.level}</span>
              <span className="text-gray-400">{meta.category}</span>
            </div>
            <p className="text-gray-500 mt-3">{meta.description}</p>
            <div className="flex flex-wrap items-center gap-5 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /><span className="font-medium text-gray-700">{meta.rating}</span></span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4 text-brand-green" />{meta.enrolled.toLocaleString()} enrolled</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-brand-green" />{meta.duration}</span>
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-brand-green" />{totalLessons} lessons</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error banner */}
      {error && (
        <motion.div variants={itemVariants} className="card border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </motion.div>
      )}

      {/* ── Not enrolled ── */}
      {stage === "loading" ? (
        <motion.div variants={itemVariants} className="card p-10 text-center">
          <Loader2 className="w-6 h-6 text-brand-green animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading your course…</p>
        </motion.div>
      ) : stage === "not-enrolled" ? (
        <motion.div variants={itemVariants} className="card border border-gray-100 p-8 sm:p-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-brand-green-muted flex items-center justify-center mb-6">
            <Lock className="w-7 h-7 text-brand-green" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to start learning?</h2>
          <p className="text-gray-500 max-w-md leading-relaxed mb-6">
            Enrol for free to unlock all {totalLessons} lessons. Your progress is saved automatically, and you earn a verifiable certificate when you complete the course.
          </p>
          <button onClick={handleEnroll} disabled={enrolling} className="btn-primary inline-flex items-center gap-2">
            {enrolling ? <><Loader2 className="w-4 h-4 animate-spin" />Enrolling…</> : <><Sparkles className="w-4 h-4" />Enrol Free & Start</>}
          </button>
        </motion.div>
      ) : (
        /* ── Enrolled: progress + lessons ── */
        <>
          {/* Progress bar */}
          <motion.div variants={itemVariants} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-900">
                {doneCount} of {totalLessons} lessons complete
              </p>
              <p className="text-sm font-bold text-brand-green">{progressPct}%</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-brand-green h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                role="progressbar"
                aria-valuenow={progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </motion.div>

          {/* Lessons */}
          <motion.div variants={containerVariants} className="space-y-3">
            {built.lessons.map((lesson, idx) => {
              const isDone = completedIds.includes(lesson.id);
              const isOpen = expandedId === lesson.id;
              const isMarking = markingId === lesson.id;
              return (
                <motion.div key={lesson.id} variants={itemVariants} className={`card overflow-hidden border ${isDone ? "border-brand-green" : "border-gray-100"}`}>
                  {/* Lesson header (click to expand) */}
                  <button
                    onClick={() => setExpandedId(isOpen ? null : lesson.id)}
                    className="w-full flex items-center gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? "bg-brand-green text-white" : "bg-brand-green-muted text-brand-green"}`}>
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{idx + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold ${isDone ? "text-gray-500 line-through" : "text-gray-900"}`}>{lesson.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                        <Clock className="w-3 h-3" />{lesson.duration}
                        {!isDone && <span className="truncate">{lesson.summary}</span>}
                      </p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Lesson body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-gray-100">
                          <div className="prose-lesson max-w-none space-y-4">
                            {lesson.sections.map((s, i) => (
                              <div key={i}>
                                {s.heading && <h3 className="font-semibold text-gray-900 mt-4 mb-1.5 first:mt-0">{s.heading}</h3>}
                                <p className="text-gray-600 leading-relaxed">{s.body}</p>
                              </div>
                            ))}
                          </div>

                          {/* Key takeaways */}
                          <div className="mt-6 rounded-xl bg-brand-green-muted p-4">
                            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-green mb-3">
                              <Lightbulb className="w-4 h-4" />Key takeaways
                            </p>
                            <ul className="space-y-2">
                              {lesson.takeaways.map((t, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                                  {t}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Complete button */}
                          <div className="mt-5 flex items-center justify-between gap-4">
                            {isDone ? (
                              <p className="flex items-center gap-2 text-sm font-medium text-brand-green">
                                <CheckCircle2 className="w-4 h-4" />Lesson complete
                              </p>
                            ) : (
                              <p className="text-sm text-gray-400">Read the lesson, then mark it complete to continue.</p>
                            )}
                            <button
                              onClick={() => handleComplete(lesson)}
                              disabled={isDone || isMarking}
                              className={`text-sm px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 ${
                                isDone
                                  ? "bg-brand-green-muted text-brand-green cursor-default"
                                  : "btn-primary"
                              }`}
                            >
                              {isMarking ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
                                : isDone ? <><CheckCircle2 className="w-4 h-4" />Completed</>
                                : <>Mark as Complete <ArrowRight className="w-4 h-4" /></>}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

          {/* ── Completion banner: generate certificate ── */}
          {stage === "complete" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="card border-2 border-brand-green p-8 text-center bg-brand-green-muted"
            >
              <div className="w-16 h-16 rounded-full bg-brand-green flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Course complete! 🎉</h2>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
                Well done, you have finished every lesson. Your verifiable certificate is ready to issue. It carries a unique credential ID employers can verify.
              </p>
              <button onClick={handleGenerateCertificate} disabled={certifying} className="btn-primary inline-flex items-center gap-2">
                {certifying ? <><Loader2 className="w-4 h-4 animate-spin" />Issuing your certificate…</> : <><Award className="w-4 h-4" />Get My Certificate</>}
              </button>
            </motion.div>
          )}

          {/* ── Already certified ── */}
          {stage === "certified" && existingCertId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="card border-2 border-brand-green p-8 text-center bg-brand-green-muted"
            >
              <div className="w-16 h-16 rounded-full bg-brand-green flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You are certified!</h2>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
                You have already earned your certificate for this course. View it, download it as a PDF, or share the verify link with employers.
              </p>
              <Link href={`/certificates/${existingCertId}`} className="btn-primary inline-flex items-center gap-2">
                <Download className="w-4 h-4" />View & Download Certificate
              </Link>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
