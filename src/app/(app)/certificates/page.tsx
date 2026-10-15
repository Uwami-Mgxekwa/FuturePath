"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Download, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

interface Certificate {
  id: string;
  title: string;
  category: string;
  issueDate: string;
  instructor: string;
  score: number;
  credential: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const user = auth.currentUser;
      if (!user) { setLoading(false); return; }
      try {
        const snap = await getDocs(
          query(collection(db, "certificates"), where("userId", "==", user.uid))
        );
        const certs: Certificate[] = [];
        snap.forEach((d) => {
          const data = d.data();
          certs.push({
            id: d.id,
            title: data.courseTitle || "Certificate",
            category: data.category || "",
            issueDate: data.issuedAt?.toDate
              ? data.issuedAt.toDate().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })
              : "",
            instructor: data.instructor || "",
            score: data.score || 0,
            credential: data.credentialId || d.id.slice(0, 12).toUpperCase(),
          });
        });
        setCertificates(certs);
      } catch {
        // silently show empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="card overflow-hidden">
              <div className="h-40 bg-gray-100 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-5xl mx-auto space-y-8">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-500 mt-1">
          {certificates.length > 0
            ? `${certificates.length} certificate${certificates.length > 1 ? "s" : ""} earned.`
            : "Your verifiable credentials will appear here once you complete a course."}
        </p>
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
                  {cert.category && (
                    <p className="text-sm opacity-80 mt-2">FuturePath · {cert.category}</p>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {cert.instructor && (
                    <div>
                      <p className="text-gray-400 text-xs">Instructor</p>
                      <p className="font-medium text-gray-900">{cert.instructor}</p>
                    </div>
                  )}
                  {cert.issueDate && (
                    <div>
                      <p className="text-gray-400 text-xs">Issue Date</p>
                      <p className="font-medium text-gray-900">{cert.issueDate}</p>
                    </div>
                  )}
                  {cert.score > 0 && (
                    <div>
                      <p className="text-gray-400 text-xs">Score</p>
                      <p className="font-semibold text-brand-green">{cert.score}%</p>
                    </div>
                  )}
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
          <p className="text-sm mt-2 mb-6 text-gray-400">
            Complete a course to earn your first certificate. They are free and verifiable by employers.
          </p>
          <Link href="/courses" className="btn-primary inline-flex items-center gap-2">
            Browse Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
