"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Home, BookOpen } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Background decorative shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-brand-green-muted rounded-full -translate-x-1/2 -translate-y-1/2 opacity-60" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-green-muted rounded-full translate-x-1/3 translate-y-1/3 opacity-40" />
      <div className="absolute top-1/2 right-12 w-16 h-16 border-4 border-brand-green rounded-full opacity-20" />
      <div className="absolute top-24 right-1/4 w-6 h-6 bg-brand-green rounded-full opacity-30" />
      <div className="absolute bottom-32 left-1/4 w-10 h-10 border-4 border-brand-green-light rounded-full opacity-20" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 text-center max-w-lg mx-auto"
      >
        {/* Big 404 */}
        <motion.div variants={itemVariants} className="relative mb-6">
          <span className="text-[10rem] md:text-[13rem] font-extrabold leading-none text-gray-100 select-none block">
            404
          </span>
          {/* Overlaid label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-brand-green font-bold text-xl tracking-widest uppercase">
              Page Not Found
            </span>
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Looks like you took a wrong turn
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-gray-500 text-lg leading-relaxed mb-10"
        >
          The page you are looking for does not exist or has been moved.
          Let us get you back on your path.
        </motion.p>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="w-16 h-1 bg-brand-green rounded-full mx-auto mb-10"
        />

        {/* Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link href="/courses" className="btn-secondary inline-flex items-center gap-2 px-8 py-3">
            <BookOpen className="w-4 h-4" />
            Browse Courses
          </Link>
        </motion.div>

        {/* Back link */}
        <motion.div variants={itemVariants} className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-green transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back to previous page
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
