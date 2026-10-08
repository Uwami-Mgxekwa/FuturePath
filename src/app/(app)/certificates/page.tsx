"use client";

import { motion } from "framer-motion";
import { Award, Download, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const certificates = [
  { id: 1, title: "Digital Marketing Fundamentals", category: "Marketing", issueDate: "September 15, 2026", instructor: "Aisha Kamau", score: 94, credential: "FP-2026-DM-001" },
  { id: 2, title: "Financial Literacy & Savings", category: "Finance", issueDate: "August 3, 2026", instructor: "Dr. Peter Mwangi", score: 88, credential: "FP-2026-FL-002" },
];

export default function CertificatesPage() {
  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-5xl mx-auto space-y-8">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-500 mt-1">Your verifiable credentials — earned through hard work.</p>
      </motion.div>

      {certificates.length > 0 ? (
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <motion.div key={cert.id} variants={itemVariants} whileHover={{ y: -4 }} className="card overflow-hidden">
              {/* Certificate banner */}
              <div className="bg-brand-green p-8 relative">
                <div className="absolute inset-0 opacity-10">
                  <div className="w-40 h-40 border-4 border-white rounded-full absolute -top-10 -right-10" />
                  <div className="w-24 h-24 border-4 border-white rounded-full absolute bottom-4 left-4" />
                </div>
                <div className="relative text-center text-white">
                  <Award className="w-10 h-10 mx-auto mb-3 opacity-90" strokeWidth={1.5} />
                  <p className="text-xs font-medium uppercase tracking-widest opacity-80 mb-2">
                    Certificate of Completion
                  </p>
                  <p className="text-2xl font-bold leading-tight">{cert.title}</p>
                  <p className="text-sm opacity-80 mt-2">FuturePath · {cert.category}</p>
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Instructor</p>
                    <p className="font-medium text-gray-900">{cert.instructor}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Issue Date</p>
                    <p className="font-medium text-gray-900">{cert.issueDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Score</p>
                    <p className="font-semibold text-brand-green">{cert.score}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Credential ID</p>
                    <p className="font-medium text-gray-900 font-mono text-xs">{cert.credential}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="btn-primary text-sm flex-1 py-2 flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />Download PDF
                  </button>
                  <button className="btn-secondary text-sm flex-1 py-2 flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />Share
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="text-center py-24">
          <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
          <p className="text-xl font-semibold text-gray-700">No certificates yet</p>
          <p className="text-sm mt-2 mb-6 text-gray-400">Complete a course to earn your first certificate.</p>
          <Link href="/courses" className="btn-primary inline-flex items-center gap-2">
            Browse Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
