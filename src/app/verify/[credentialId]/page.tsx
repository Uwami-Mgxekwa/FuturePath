"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldX, Loader2, CalendarDays, User2, GraduationCap, Hash } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface CertData {
  userDisplayName: string;
  courseTitle: string;
  category: string;
  instructor: string;
  issuedAt: { toDate: () => Date } | null;
  credentialId: string;
}

export default function VerifyPage() {
  const params = useParams();
  const credentialId = String(params.credentialId);

  const [cert, setCert] = useState<CertData | null>(null);
  const [status, setStatus] = useState<"loading" | "valid" | "invalid">("loading");

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, "certificates", credentialId));
        if (!snap.exists()) { setStatus("invalid"); return; }
        setCert(snap.data() as CertData);
        setStatus("valid");
      } catch (err) {
        console.error("Verify failed:", err);
        setStatus("invalid");
      }
    }
    load();
  }, [credentialId]);

  const issueDate = cert?.issuedAt?.toDate
    ? cert.issuedAt.toDate().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        {/* Brand header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <img src="/logo.png" alt="FuturePath" style={{ height: "40px", width: "auto" }} />
          </Link>
          <p className="text-xs mt-2 text-gray-400 tracking-widest uppercase">Certificate Verification</p>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="card p-12 text-center">
            <Loader2 className="w-7 h-7 text-brand-green animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Verifying certificate…</p>
          </div>
        )}

        {/* Valid */}
        {status === "valid" && cert && (
          <div className="card overflow-hidden border border-brand-green">
            {/* Verified banner */}
            <div className="bg-brand-green p-6 text-center text-white">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-8 h-8" strokeWidth={2} />
              </div>
              <h1 className="text-xl font-bold">Certificate Verified</h1>
              <p className="text-sm text-white/80 mt-1">This credential is genuine and was issued by FuturePath.</p>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div className="text-center pb-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Awarded to</p>
                <p className="text-2xl font-bold text-gray-900">{cert.userDisplayName}</p>
              </div>

              <div className="rounded-xl bg-brand-green-muted p-4 text-center">
                <GraduationCap className="w-6 h-6 text-brand-green mx-auto mb-1.5" />
                <p className="text-xs text-gray-400 uppercase tracking-wide">Completed Course</p>
                <p className="text-lg font-bold text-brand-green">{cert.courseTitle}</p>
                {cert.category && <p className="text-sm text-gray-500">{cert.category}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field icon={<User2 className="w-4 h-4" />} label="Instructor" value={cert.instructor} />
                <Field icon={<CalendarDays className="w-4 h-4" />} label="Issued On" value={issueDate} />
              </div>

              <div className="rounded-xl border border-gray-100 p-3 flex items-center gap-2">
                <Hash className="w-4 h-4 text-brand-green flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Credential ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-900 truncate">{cert.credentialId}</p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 text-center">
              <p className="text-xs text-gray-400">
                Verification for credential <span className="font-mono">{cert.credentialId}</span>. This certificate was issued through FuturePath and is verifiable online.
              </p>
            </div>
          </div>
        )}

        {/* Invalid */}
        {status === "invalid" && (
          <div className="card overflow-hidden border border-red-200">
            <div className="bg-red-500 p-6 text-center text-white">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <ShieldX className="w-8 h-8" strokeWidth={2} />
              </div>
              <h1 className="text-xl font-bold">Certificate Not Found</h1>
              <p className="text-sm text-white/80 mt-1">This credential ID does not match any issued certificate.</p>
            </div>
            <div className="p-6 text-center">
              <div className="rounded-xl bg-gray-50 p-3 mb-4">
                <p className="text-xs text-gray-400">ID checked</p>
                <p className="font-mono text-sm font-semibold text-gray-900 break-all">{credentialId}</p>
              </div>
              <p className="text-sm text-gray-500">
                Check that the ID was copied exactly, or ask the certificate holder to share the link again. If you believe this is an error, contact the FuturePath team.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-brand-green transition-colors">
            futurepath-alpha.vercel.app
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 p-3">
      <p className="text-xs text-gray-400 flex items-center gap-1.5">{icon}{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
