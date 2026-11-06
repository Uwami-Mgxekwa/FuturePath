"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Loader2, ShieldCheck, Share2, Printer } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

/* ── Config: update these to match your brand & signatory ── */
const CEO_NAME = "Uwami Mgxekwa";        // Founder & CEO — change if needed
const CEO_TITLE = "Founder & CEO, FuturePath";
const LOGO_SRC = "/logo.png";            // exists in /public
const SIGNATURE_SRC = "/ceo-signature.png"; // place this PNG in /public
const VERIFY_BASE = "futurepath-alpha.vercel.app";

interface CertData {
  userId: string;
  userDisplayName: string;
  courseTitle: string;
  category: string;
  instructor: string;
  issuedAt: { toDate: () => Date } | null;
  credentialId: string;
  score: number;
}

export default function CertificatePage() {
  const params = useParams();
  const credentialId = String(params.id);

  const [cert, setCert] = useState<CertData | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "denied" | "notfound">("loading");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, "certificates", credentialId));
        if (!snap.exists()) { setStatus("notfound"); return; }
        const data = snap.data() as CertData;
        const user = auth.currentUser;
        // Only the owner can view / download from here. Anyone can verify via /verify.
        if (user && data.userId === user.uid) {
          setCert(data);
          setStatus("ok");
        } else {
          setStatus("denied");
        }
      } catch (err) {
        console.error("Certificate load failed:", err);
        setStatus("notfound");
      }
    }
    load();
  }, [credentialId]);

  function handlePrint() {
    window.print();
  }

  async function handleShare() {
    const url = `${typeof window !== "undefined" ? window.location.origin : VERIFY_BASE}/verify/${credentialId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      window.prompt("Copy your verify link:", url);
    }
  }

  const issueDate = cert?.issuedAt?.toDate
    ? cert.issuedAt.toDate().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  /* ── Loading ── */
  if (status === "loading") {
    return (
      <div className="max-w-5xl mx-auto py-24 text-center">
        <Loader2 className="w-6 h-6 text-brand-green animate-spin mx-auto mb-3" />
        <p className="text-gray-500">Loading your certificate…</p>
      </div>
    );
  }

  /* ── Not found ── */
  if (status === "notfound") {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Certificate not found</h1>
        <p className="text-gray-500">This credential ID does not match any issued certificate.</p>
        <Link href="/certificates" className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to my certificates
        </Link>
      </div>
    );
  }

  /* ── Access denied (not the owner) ── */
  if (status === "denied") {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">This is not your certificate</h1>
        <p className="text-gray-500">
          You can only download your own certificate. Anyone can check a certificate is genuine using the public verify link.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link href={`/verify/${credentialId}`} className="btn-primary inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Verify this certificate
          </Link>
          <Link href="/certificates" className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> My certificates
          </Link>
        </div>
      </div>
    );
  }

  /* ── Certificate ── */
  if (!cert) return null;

  return (
    <div className="cert-wrap max-w-5xl mx-auto space-y-6">
      {/* Print-only stylesheet */}
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 10mm; }
          html, body { background: #ffffff !important; }
          body * { visibility: hidden !important; }
          .cert-sheet, .cert-sheet * { visibility: visible !important; }
          .cert-sheet { position: absolute !important; left: 0; top: 0; width: 100% !important; max-width: none !important; box-shadow: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Action bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Link href="/certificates" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-green transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> My certificates
        </Link>
        <div className="flex gap-2">
          <button onClick={handleShare} className="btn-secondary text-sm py-2 flex items-center gap-2">
            <Share2 className="w-4 h-4" /> {copied ? "Link copied!" : "Share verify link"}
          </button>
          <button onClick={handlePrint} className="btn-primary text-sm py-2 flex items-center gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* The certificate sheet — always white, regardless of dark mode */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="cert-sheet relative mx-auto bg-white shadow-xl"
        style={{ backgroundColor: "#ffffff", border: "2px solid #00A651", borderRadius: "16px", padding: "clamp(20px, 4vw, 56px)" }}
      >
        {/* Decorative inner border */}
        <div style={{ position: "absolute", inset: "10px", border: "1px solid #00A651", borderRadius: "12px", opacity: 0.35, pointerEvents: "none" }} />
        {/* Corner accents */}
        <div style={{ position: "absolute", top: "18px", left: "18px", width: "40px", height: "40px", borderTop: "3px solid #00A651", borderLeft: "3px solid #00A651", borderRadius: "6px 0 0 0" }} />
        <div style={{ position: "absolute", top: "18px", right: "18px", width: "40px", height: "40px", borderTop: "3px solid #00A651", borderRight: "3px solid #00A651", borderRadius: "0 6px 0 0" }} />
        <div style={{ position: "absolute", bottom: "18px", left: "18px", width: "40px", height: "40px", borderBottom: "3px solid #00A651", borderLeft: "3px solid #00A651", borderRadius: "0 0 0 6px" }} />
        <div style={{ position: "absolute", bottom: "18px", right: "18px", width: "40px", height: "40px", borderBottom: "3px solid #00A651", borderRight: "3px solid #00A651", borderRadius: "0 0 6px 0" }} />

        <div className="relative" style={{ color: "#111827" }}>
          {/* Header / logo */}
          <div className="flex flex-col items-center text-center" style={{ marginBottom: "clamp(16px, 2.5vw, 28px)" }}>
            <img src={LOGO_SRC} alt="FuturePath logo" style={{ height: "56px", width: "auto", objectFit: "contain" }} />
            <p style={{ marginTop: "6px", fontSize: "12px", letterSpacing: "0.25em", color: "#00A651", fontWeight: 600, textTransform: "uppercase" }}>
              Learn. Grow. Thrive.
            </p>
          </div>

          {/* Title */}
          <div className="text-center" style={{ marginBottom: "clamp(10px, 2vw, 20px)" }}>
            <h1 style={{ fontSize: "clamp(20px, 3.4vw, 32px)", fontWeight: 800, letterSpacing: "0.18em", color: "#00A651", textTransform: "uppercase" }}>
              Certificate of Completion
            </h1>
            <div style={{ width: "64px", height: "3px", background: "#00A651", margin: "10px auto 0", borderRadius: "2px" }} />
          </div>

          {/* Body */}
          <div className="text-center" style={{ color: "#444" }}>
            <p style={{ fontSize: "clamp(11px, 1.6vw, 15px)" }}>This is to proudly certify that</p>
            <p style={{
              fontSize: "clamp(22px, 4.2vw, 40px)", fontWeight: 700, color: "#111827",
              margin: "10px 0", fontFamily: "'Poppins', Georgia, serif",
            }}>
              {cert.userDisplayName}
            </p>
            <p style={{ fontSize: "clamp(11px, 1.6vw, 15px)" }}>has successfully completed the course</p>
            <p style={{
              fontSize: "clamp(16px, 2.6vw, 24px)", fontWeight: 700, color: "#00A651",
              margin: "8px 0 4px",
            }}>
              {cert.courseTitle}
            </p>
            {cert.category && (
              <p style={{ fontSize: "clamp(10px, 1.4vw, 13px)", color: "#777" }}>FuturePath · {cert.category}</p>
            )}
          </div>

          {/* Divider with diamond */}
          <div className="flex items-center justify-center" style={{ margin: "clamp(14px, 2.2vw, 22px) 0" }}>
            <div style={{ height: "1px", background: "#00A651", opacity: 0.3, flex: 1, maxWidth: "120px" }} />
            <div style={{ width: "8px", height: "8px", background: "#00A651", transform: "rotate(45deg)", margin: "0 12px" }} />
            <div style={{ height: "1px", background: "#00A651", opacity: 0.3, flex: 1, maxWidth: "120px" }} />
          </div>

          {/* Signatures row */}
          <div className="grid grid-cols-2 gap-8" style={{ marginTop: "clamp(12px, 2vw, 20px)" }}>
            {/* Instructor */}
            <div className="text-center">
              <p style={{ fontSize: "clamp(13px, 1.8vw, 18px)", fontWeight: 600, color: "#111827", fontStyle: "italic" }}>
                {cert.instructor}
              </p>
              <div style={{ width: "140px", height: "1px", background: "#00A651", opacity: 0.5, margin: "8px auto" }} />
              <p style={{ fontSize: "clamp(9px, 1.2vw, 12px)", color: "#777", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Course Instructor
              </p>
            </div>

            {/* CEO */}
            <div className="text-center">
              <div className="flex items-end justify-center" style={{ height: "44px", marginBottom: "2px" }}>
                <img
                  src={SIGNATURE_SRC}
                  alt={`${CEO_NAME} signature`}
                  style={{ height: "44px", width: "auto", objectFit: "contain" }}
                  onError={(e) => { (e.currentTarget.style.display = "none"); }}
                />
              </div>
              <div style={{ width: "140px", height: "1px", background: "#00A651", opacity: 0.5, margin: "8px auto" }} />
              <p style={{ fontSize: "clamp(10px, 1.3vw, 13px)", fontWeight: 600, color: "#111827" }}>{CEO_NAME}</p>
              <p style={{ fontSize: "clamp(9px, 1.2vw, 12px)", color: "#777", marginTop: "1px" }}>{CEO_TITLE}</p>
            </div>
          </div>

          {/* Footer: credential + verify */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center" style={{ marginTop: "clamp(16px, 2.5vw, 26px)", paddingTop: "14px", borderTop: "1px solid rgba(0,166,81,0.2)" }}>
            <div>
              <p style={{ fontSize: "clamp(8px, 1.1vw, 11px)", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>Credential ID</p>
              <p style={{ fontSize: "clamp(10px, 1.3vw, 13px)", fontFamily: "monospace", fontWeight: 600, color: "#00A651" }}>{cert.credentialId}</p>
            </div>
            <div>
              <p style={{ fontSize: "clamp(8px, 1.1vw, 11px)", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>Issued On</p>
              <p style={{ fontSize: "clamp(10px, 1.3vw, 13px)", fontWeight: 600, color: "#111827" }}>{issueDate}</p>
            </div>
            <div>
              <p style={{ fontSize: "clamp(8px, 1.1vw, 11px)", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>Verify Online</p>
              <p style={{ fontSize: "clamp(10px, 1.3vw, 13px)", fontWeight: 600, color: "#00A651" }}>{VERIFY_BASE}/verify/{cert.credentialId}</p>
            </div>
          </div>

          {/* Seal */}
          <div style={{ position: "absolute", right: "clamp(8px, 3vw, 40px)", top: "50%", transform: "translateY(-50%)", textAlign: "center", pointerEvents: "none" }} className="hidden sm:block">
            <div style={{
              width: "clamp(54px, 7vw, 76px)", height: "clamp(54px, 7vw, 76px)", borderRadius: "50%",
              border: "2px solid #00A651", display: "flex", alignItems: "center", justifyContent: "center",
              background: "#E6F7EE", color: "#00A651",
            }}>
              <ShieldCheck style={{ width: "40%", height: "40%" }} strokeWidth={2} />
            </div>
            <p style={{ fontSize: "7px", color: "#00A651", marginTop: "3px", letterSpacing: "0.08em", fontWeight: 600 }}>VERIFIED</p>
          </div>
        </div>
      </motion.div>

      {/* Mobile print hint */}
      <div className="no-print text-center">
        <p className="text-xs text-gray-400 inline-flex items-center gap-1.5">
          <Printer className="w-3.5 h-3.5" />
          Click “Download PDF” then choose “Save as PDF” in the print dialog.
        </p>
      </div>
    </div>
  );
}
