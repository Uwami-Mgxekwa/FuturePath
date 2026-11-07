"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Share2, ArrowLeft, Loader2, CheckCircle2, Award } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface CertData {
  userDisplayName: string;
  courseTitle: string;
  category: string;
  issuedAt: string;
  credentialId: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/* ── Base-64 encode an image URL for embedding in print HTML ── */
async function toDataUrl(url: string): Promise<string> {
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

export default function CertificateDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const credId  = String(params.id);

  const [cert, setCert]       = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState(false);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(
          query(collection(db, "certificates"), where("credentialId", "==", credId))
        );
        if (snap.empty) { setLoading(false); return; }
        const d = snap.docs[0].data();
        setCert({
          userDisplayName: d.userDisplayName || "FuturePath Learner",
          courseTitle:     d.courseTitle     || "",
          category:        d.category        || "",
          issuedAt: d.issuedAt?.toDate
            ? d.issuedAt.toDate().toLocaleDateString("en-ZA", {
                year: "numeric", month: "long", day: "numeric",
              })
            : "",
          credentialId: d.credentialId || credId,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [credId]);

  async function handleCopy() {
    const url = `${window.location.origin}/verify/${credId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy your certificate verify link:", url);
    }
  }

  async function handleDownload() {
    if (!cert || printing) return;
    setPrinting(true);
    try {
      const [logoData, sigData] = await Promise.all([
        toDataUrl("/logo.png"),
        toDataUrl("/signature.png"),
      ]);
      const html = buildCertHtml(cert, logoData, sigData);
      const win  = window.open("", "_blank");
      if (!win) { setPrinting(false); return; }
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); setPrinting(false); }, 600);
    } catch {
      setPrinting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center">
        <Loader2 className="w-8 h-8 text-brand-green animate-spin mx-auto" />
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center space-y-4">
        <Award className="w-12 h-12 mx-auto text-gray-300" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Certificate not found</h2>
        <p className="text-gray-500">This credential ID does not match any certificate on record.</p>
        <button onClick={() => router.back()} className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go back
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden" animate="visible" variants={containerVariants}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Back */}
      <motion.div variants={itemVariants}>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-green transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Certificates
        </button>
      </motion.div>

      {/* ── Certificate preview card ── */}
      <motion.div variants={itemVariants}>
        <CertificatePreview cert={cert} />
      </motion.div>

      {/* Verification note */}
      <motion.div variants={itemVariants} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This certificate is verifiable by employers. Share the verify link or quote the Credential ID{" "}
          <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{cert.credentialId}</span>.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          disabled={printing}
          className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5"
        >
          {printing
            ? <><Loader2 className="w-4 h-4 animate-spin" />Preparing…</>
            : <><Download className="w-4 h-4" />Download PDF</>}
        </button>
        <button
          onClick={handleCopy}
          className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2.5"
        >
          <Share2 className="w-4 h-4" />
          {copied ? "Link copied!" : "Copy Verify Link"}
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CERTIFICATE PREVIEW — rendered in-page (React)
   ══════════════════════════════════════════════════════════════ */
function CertificatePreview({ cert }: { cert: CertData }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-2xl"
      style={{ background: "#FAFAF7", fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Outer decorative border */}
      <div className="absolute inset-3 rounded-xl pointer-events-none"
        style={{ border: "1.5px solid #00A651", opacity: 0.35 }} />
      <div className="absolute inset-[14px] rounded-xl pointer-events-none"
        style={{ border: "0.5px solid #00A651", opacity: 0.2 }} />

      {/* Corner ornaments */}
      {[
        "top-2 left-2",
        "top-2 right-2 scale-x-[-1]",
        "bottom-2 left-2 scale-y-[-1]",
        "bottom-2 right-2 scale-[-1]",
      ].map((pos) => (
        <svg key={pos} className={`absolute ${pos} w-10 h-10`} viewBox="0 0 40 40" fill="none">
          <path d="M2 38 L2 2 L38 2" stroke="#00A651" strokeWidth="1.5" opacity="0.5" />
          <path d="M6 38 L6 6 L38 6" stroke="#00A651" strokeWidth="0.5" opacity="0.3" />
        </svg>
      ))}

      {/* ── Header band ── */}
      <div
        className="relative flex items-center justify-between px-10 py-5"
        style={{ background: "#00A651" }}
      >
        {/* Logo + wordmark */}
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="FuturePath" className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-white font-bold text-lg leading-tight tracking-wide"
              style={{ fontFamily: "Arial, sans-serif" }}>
              FuturePath
            </p>
            <p className="text-white/70 text-xs tracking-widest uppercase"
              style={{ fontFamily: "Arial, sans-serif" }}>
              Learn · Grow · Thrive
            </p>
          </div>
        </div>

        {/* Certificate label */}
        <div className="text-right">
          <p className="text-white/70 text-xs uppercase tracking-[0.2em]"
            style={{ fontFamily: "Arial, sans-serif" }}>
            Official
          </p>
          <p className="text-white font-semibold text-sm tracking-wider"
            style={{ fontFamily: "Arial, sans-serif" }}>
            Certificate of Completion
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-14 pt-10 pb-8 text-center">

        {/* Decorative rule */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #00A651)" }} />
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M10 1 L12 7 L18 7 L13 11 L15 17 L10 13 L5 17 L7 11 L2 7 L8 7 Z"
              fill="#00A651" opacity="0.6" />
          </svg>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #00A651)" }} />
        </div>

        <p className="text-gray-500 text-sm tracking-widest uppercase mb-3"
          style={{ fontFamily: "Arial, sans-serif" }}>
          This is to certify that
        </p>

        {/* Learner name */}
        <h1
          className="font-bold leading-tight mb-1"
          style={{
            fontSize: "clamp(28px, 5vw, 44px)",
            color: "#111",
            letterSpacing: "0.02em",
          }}
        >
          {cert.userDisplayName}
        </h1>

        {/* Underline accent */}
        <div className="flex justify-center mb-6">
          <div className="h-0.5 w-32 rounded-full" style={{ background: "#00A651" }} />
        </div>

        <p className="text-gray-500 text-sm tracking-wide mb-4"
          style={{ fontFamily: "Arial, sans-serif" }}>
          has successfully completed the course
        </p>

        {/* Course title */}
        <h2
          className="font-bold mb-2 leading-snug"
          style={{
            fontSize: "clamp(16px, 2.5vw, 22px)",
            color: "#00A651",
            letterSpacing: "0.01em",
          }}
        >
          {cert.courseTitle}
        </h2>

        {cert.category && (
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-8"
            style={{ fontFamily: "Arial, sans-serif" }}>
            {cert.category}
          </p>
        )}

        {/* Decorative rule */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #00A651)" }} />
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M10 1 L12 7 L18 7 L13 11 L15 17 L10 13 L5 17 L7 11 L2 7 L8 7 Z"
              fill="#00A651" opacity="0.6" />
          </svg>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #00A651)" }} />
        </div>

        {/* ── Footer row: signature left, details right ── */}
        <div className="flex items-end justify-between gap-6 mt-2">

          {/* Signature block */}
          <div className="text-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/signature.png"
              alt="Signature"
              className="h-16 w-auto object-contain mb-1"
              style={{ mixBlendMode: "multiply" }}
            />
            <div className="h-px w-40" style={{ background: "#ccc" }} />
            <p className="text-gray-900 font-semibold text-sm mt-1"
              style={{ fontFamily: "Arial, sans-serif" }}>
              Uwami Mgxekwa
            </p>
            <p className="text-gray-500 text-xs"
              style={{ fontFamily: "Arial, sans-serif" }}>
              Chief Executive Officer, FuturePath
            </p>
          </div>

          {/* Issue details */}
          <div className="text-right space-y-2">
            {cert.issuedAt && (
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide"
                  style={{ fontFamily: "Arial, sans-serif" }}>
                  Date Issued
                </p>
                <p className="text-gray-900 font-semibold text-sm"
                  style={{ fontFamily: "Arial, sans-serif" }}>
                  {cert.issuedAt}
                </p>
              </div>
            )}
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide"
                style={{ fontFamily: "Arial, sans-serif" }}>
                Credential ID
              </p>
              <p className="font-semibold text-xs text-gray-900"
                style={{ fontFamily: "monospace" }}>
                {cert.credentialId}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px]"
                style={{ fontFamily: "Arial, sans-serif" }}>
                Verify at futurepath-alpha.vercel.app/verify/{cert.credentialId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom green strip ── */}
      <div
        className="h-2 w-full"
        style={{ background: "linear-gradient(to right, #00A651, #007a3d, #00A651)" }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PRINT HTML — landscape A4, base64 images embedded
   ══════════════════════════════════════════════════════════════ */
function buildCertHtml(cert: CertData, logoData: string, sigData: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Certificate — ${cert.courseTitle}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  @page{size:A4 landscape;margin:0}
  body{
    width:297mm;height:210mm;
    background:#FAFAF7;
    font-family:'EB Garamond','Georgia',serif;
    overflow:hidden;
    position:relative;
  }

  /* Outer border */
  .outer-border{
    position:absolute;inset:10mm;
    border:1.5px solid #00A651;
    border-radius:4px;
    opacity:0.4;
    pointer-events:none;
  }
  .inner-border{
    position:absolute;inset:13mm;
    border:0.5px solid #00A651;
    border-radius:3px;
    opacity:0.2;
    pointer-events:none;
  }

  /* Corner ornament */
  .corner{position:absolute;width:28px;height:28px}
  .corner svg{width:100%;height:100%}
  .c-tl{top:8mm;left:8mm}
  .c-tr{top:8mm;right:8mm;transform:scaleX(-1)}
  .c-bl{bottom:8mm;left:8mm;transform:scaleY(-1)}
  .c-br{bottom:8mm;right:8mm;transform:scale(-1)}

  /* Header */
  .header{
    position:absolute;top:0;left:0;right:0;
    height:22mm;
    background:#00A651;
    display:flex;align-items:center;justify-content:space-between;
    padding:0 18mm;
  }
  .header-left{display:flex;align-items:center;gap:10px}
  .header-logo{width:36px;height:36px;border-radius:50%;object-fit:cover}
  .wordmark{color:#fff}
  .wordmark-name{font-family:Arial,sans-serif;font-size:15px;font-weight:700;letter-spacing:.04em}
  .wordmark-tagline{font-family:Arial,sans-serif;font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.65)}
  .header-right{text-align:right;color:#fff}
  .cert-label-sm{font-family:Arial,sans-serif;font-size:7px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.65)}
  .cert-label{font-family:Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase}

  /* Body */
  .body{
    position:absolute;
    top:22mm;bottom:4mm;left:0;right:0;
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    padding:0 18mm;
    text-align:center;
  }

  .rule{
    display:flex;align-items:center;gap:12px;
    width:100%;margin:6mm 0;
  }
  .rule-line{flex:1;height:1px}
  .rule-line-l{background:linear-gradient(to right,transparent,#00A651)}
  .rule-line-r{background:linear-gradient(to left,transparent,#00A651)}

  .certified-label{
    font-family:Arial,sans-serif;
    font-size:9px;letter-spacing:.25em;text-transform:uppercase;
    color:#888;margin-bottom:5mm;
  }
  .learner-name{
    font-size:38px;font-weight:700;color:#111;
    letter-spacing:.02em;line-height:1.1;
    margin-bottom:3mm;
  }
  .name-underline{
    width:50mm;height:2px;background:#00A651;
    border-radius:2px;margin:0 auto 6mm;
  }
  .completed-label{
    font-family:Arial,sans-serif;
    font-size:9px;letter-spacing:.12em;text-transform:uppercase;
    color:#888;margin-bottom:3mm;
  }
  .course-title{
    font-size:20px;font-weight:700;color:#00A651;
    letter-spacing:.01em;line-height:1.3;margin-bottom:1.5mm;
  }
  .course-category{
    font-family:Arial,sans-serif;
    font-size:8px;letter-spacing:.2em;text-transform:uppercase;
    color:#aaa;margin-bottom:0;
  }

  /* Footer */
  .footer{
    position:absolute;
    bottom:10mm;left:18mm;right:18mm;
    display:flex;align-items:flex-end;justify-content:space-between;
  }
  .sig-block{text-align:left}
  .sig-img{
    height:40px;object-fit:contain;
    mix-blend-mode:multiply;
    display:block;margin-bottom:1mm;
  }
  .sig-line{width:48mm;height:1px;background:#ccc;margin-bottom:2mm}
  .sig-name{
    font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#111;
  }
  .sig-title{font-family:Arial,sans-serif;font-size:8px;color:#888;margin-top:1px}

  .detail-block{text-align:right}
  .detail-row{margin-bottom:3mm}
  .detail-label{
    font-family:Arial,sans-serif;font-size:7px;
    text-transform:uppercase;letter-spacing:.15em;color:#aaa;
    display:block;margin-bottom:1px;
  }
  .detail-value{
    font-family:Arial,sans-serif;font-size:10px;font-weight:600;color:#111;
  }
  .detail-value-mono{font-family:monospace;font-size:9px;font-weight:600;color:#111;}
  .verify-url{
    font-family:Arial,sans-serif;font-size:7px;color:#aaa;margin-top:1mm;
  }

  /* Bottom strip */
  .bottom-strip{
    position:absolute;bottom:0;left:0;right:0;height:4mm;
    background:linear-gradient(to right,#00A651,#007a3d,#00A651);
  }

  @media print{
    body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  }
</style>
</head>
<body>

  <div class="outer-border"></div>
  <div class="inner-border"></div>

  <!-- Corner ornaments -->
  ${["c-tl","c-tr","c-bl","c-br"].map(cls => `
  <div class="corner ${cls}">
    <svg viewBox="0 0 28 28" fill="none">
      <path d="M2 26 L2 2 L26 2" stroke="#00A651" stroke-width="1.5" opacity=".5"/>
      <path d="M5 26 L5 5 L26 5" stroke="#00A651" stroke-width=".5" opacity=".3"/>
    </svg>
  </div>`).join("")}

  <!-- Header -->
  <div class="header">
    <div class="header-left">
      <img class="header-logo" src="${logoData}" alt="FuturePath logo"/>
      <div class="wordmark">
        <div class="wordmark-name">FuturePath</div>
        <div class="wordmark-tagline">Learn &middot; Grow &middot; Thrive</div>
      </div>
    </div>
    <div class="header-right">
      <div class="cert-label-sm">Official</div>
      <div class="cert-label">Certificate of Completion</div>
    </div>
  </div>

  <!-- Body -->
  <div class="body">

    <div class="rule">
      <div class="rule-line rule-line-l"></div>
      <svg width="16" height="16" viewBox="0 0 20 20">
        <path d="M10 1 L12 7 L18 7 L13 11 L15 17 L10 13 L5 17 L7 11 L2 7 L8 7 Z" fill="#00A651" opacity=".5"/>
      </svg>
      <div class="rule-line rule-line-r"></div>
    </div>

    <p class="certified-label">This is to certify that</p>
    <p class="learner-name">${cert.userDisplayName}</p>
    <div class="name-underline"></div>
    <p class="completed-label">has successfully completed the course</p>
    <p class="course-title">${cert.courseTitle}</p>
    ${cert.category ? `<p class="course-category">${cert.category}</p>` : ""}

    <div class="rule">
      <div class="rule-line rule-line-l"></div>
      <svg width="16" height="16" viewBox="0 0 20 20">
        <path d="M10 1 L12 7 L18 7 L13 11 L15 17 L10 13 L5 17 L7 11 L2 7 L8 7 Z" fill="#00A651" opacity=".5"/>
      </svg>
      <div class="rule-line rule-line-r"></div>
    </div>

  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="sig-block">
      <img class="sig-img" src="${sigData}" alt="Signature"/>
      <div class="sig-line"></div>
      <div class="sig-name">Uwami Mgxekwa</div>
      <div class="sig-title">Chief Executive Officer, FuturePath</div>
    </div>
    <div class="detail-block">
      ${cert.issuedAt ? `
      <div class="detail-row">
        <span class="detail-label">Date Issued</span>
        <span class="detail-value">${cert.issuedAt}</span>
      </div>` : ""}
      <div class="detail-row">
        <span class="detail-label">Credential ID</span>
        <span class="detail-value-mono">${cert.credentialId}</span>
      </div>
      <div class="verify-url">
        Verify: futurepath-alpha.vercel.app/verify/${cert.credentialId}
      </div>
    </div>
  </div>

  <div class="bottom-strip"></div>

</body>
</html>`;
}
