"use client";

import { useEffect, useRef, useState } from "react";
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

/* ── Base64 encode a local asset ─────────────────────────────── */
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

/* ── QR code rendered on a canvas via a tiny vanilla implementation ── */
function useQrCanvas(text: string) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !text) return;

    // Dynamically load qrcodejs from CDN the first time
    if (typeof window !== "undefined") {
      const run = (QRCode: new (el: HTMLElement, opts: object) => void) => {
        const div = document.createElement("div");
        new QRCode(div, {
          text,
          width: 160,
          height: 160,
          colorDark: "#1f7a4a",
          colorLight: "#ffffff",
          correctLevel: 1, // M
        });
        // Wait for QRCode to render its canvas/img then copy to our canvas
        setTimeout(() => {
          const src = div.querySelector("canvas") as HTMLCanvasElement | null
            || div.querySelector("img") as HTMLImageElement | null;
          if (!src) return;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          const img = new Image();
          img.onload = () => {
            canvas.width  = 160;
            canvas.height = 160;
            ctx.drawImage(img, 0, 0, 160, 160);
          };
          if (src instanceof HTMLCanvasElement) {
            img.src = src.toDataURL();
          } else {
            img.src = (src as HTMLImageElement).src;
          }
        }, 100);
      };

      if ((window as { QRCode?: new (el: HTMLElement, opts: object) => void }).QRCode) {
        run((window as unknown as { QRCode: new (el: HTMLElement, opts: object) => void }).QRCode);
      } else {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
        script.onload = () => run((window as unknown as { QRCode: new (el: HTMLElement, opts: object) => void }).QRCode);
        document.head.appendChild(script);
      }
    }
  }, [text]);

  return canvasRef;
}

/* ══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function CertificateDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const credId   = String(params.id);

  const [cert, setCert]         = useState<CertData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [copied, setCopied]     = useState(false);
  const [printing, setPrinting] = useState(false);

  // Ref pointing at the 1123×794 cert div inside CertificatePreview
  const certDivRef = useRef<HTMLDivElement>(null);

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
            ? d.issuedAt.toDate().toLocaleDateString("en-GB", {
                day: "2-digit", month: "long", year: "numeric",
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
      const verifyUrl = `${window.location.origin}/verify/${cert.credentialId}`;
      const html = buildPrintHtml(cert, logoData, sigData, verifyUrl);
      const win  = window.open("", "_blank");
      if (!win) { setPrinting(false); return; }
      win.document.write(html);
      win.document.close();
      win.focus();
      // Give QR time to render then print
      setTimeout(() => { win.print(); setPrinting(false); }, 1200);
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
      className="max-w-5xl mx-auto space-y-6"
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

      {/* Certificate preview */}
      <motion.div variants={itemVariants}>
        <CertificatePreview cert={cert} />
      </motion.div>

      {/* Verification note */}
      <motion.div variants={itemVariants}
        className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-4"
      >
        <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This certificate is verifiable by employers. Share the verify link or quote Credential ID{" "}
          <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
            {cert.credentialId}
          </span>.
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
   IN-PAGE PREVIEW — matches your HTML design exactly
   ══════════════════════════════════════════════════════════════ */
function CertificatePreview({ cert }: { cert: CertData }) {
  const holderRef  = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const verifyUrl  = typeof window !== "undefined"
    ? `${window.location.origin}/verify/${cert.credentialId}`
    : `https://futurepath-alpha.vercel.app/verify/${cert.credentialId}`;
  const qrRef      = useQrCanvas(verifyUrl);

  // Responsive scale: fit the 1123px-wide cert into its container
  useEffect(() => {
    function resize() {
      if (!holderRef.current) return;
      const available = holderRef.current.parentElement?.clientWidth ?? window.innerWidth - 48;
      setScale(Math.min(1, (available) / 1123));
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    /* outer wrapper sets its height to match the scaled cert */
    <div
      ref={holderRef}
      style={{ width: "100%", height: 794 * scale, position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1123,
          height: 794,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          background: "#fff",
          boxShadow: "0 12px 40px rgba(20,60,38,.18)",
          overflow: "hidden",
          color: "#16211a",
          fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
        }}
      >
        {/* ── Watermark pattern ── */}
        <div style={{
          position: "absolute", inset: 0, opacity: .55,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='52'%3E%3Cg fill='none' stroke='%232e9a5b' stroke-width='.7' opacity='.45'%3E%3Ccircle cx='0' cy='0' r='30'/%3E%3Ccircle cx='60' cy='0' r='30'/%3E%3Ccircle cx='30' cy='26' r='30'/%3E%3Ccircle cx='0' cy='52' r='30'/%3E%3Ccircle cx='60' cy='52' r='30'/%3E%3C/g%3E%3C/svg%3E")`,
          WebkitMaskImage: "radial-gradient(ellipse 52% 56% at 50% 50%,transparent 55%,#000 100%)",
          maskImage: "radial-gradient(ellipse 52% 56% at 50% 50%,transparent 55%,#000 100%)",
        }} />

        {/* ── Faded logo watermark ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" style={{
          position: "absolute", left: "50%", top: "50%",
          width: 470, height: 470, marginLeft: -235, marginTop: -235,
          objectFit: "contain", opacity: .055, mixBlendMode: "multiply",
        }} />

        {/* ── Double frame ── */}
        <div style={{ position: "absolute", inset: 26, border: "1.5px solid #2e9a5b" }} />
        <div style={{ position: "absolute", inset: 34, border: "1px solid #dcefe3" }} />

        {/* ── Corner brackets ── */}
        {([
          { top: 20, left: 20,   borderRight: 0, borderBottom: 0 },
          { top: 20, right: 20,  borderLeft: 0,  borderBottom: 0 },
          { bottom: 20, left: 20,  borderRight: 0, borderTop: 0 },
          { bottom: 20, right: 20, borderLeft: 0,  borderTop: 0 },
        ] as React.CSSProperties[]).map((s, i) => (
          <div key={i} style={{
            position: "absolute", width: 46, height: 46,
            border: "5px solid #2e9a5b", ...s,
          }} />
        ))}

        {/* ── Body ── */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "62px 96px 58px", textAlign: "center",
        }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="FuturePath logo" style={{ width: 52, height: 52 }} />
            <span style={{
              font: '600 22px "Playfair Display", Georgia, serif',
              letterSpacing: ".04em", color: "#1f7a4a",
            }}>FuturePath</span>
          </div>

          {/* Title */}
          <div style={{
            marginTop: 26,
            font: "500 15px Inter, sans-serif",
            letterSpacing: ".42em", color: "#5b6b61", textTransform: "uppercase",
          }}>
            Certificate of Completion
          </div>

          {/* Lead */}
          <div style={{ marginTop: 34, font: "400 15px Inter, sans-serif", letterSpacing: ".06em", color: "#5b6b61" }}>
            This is to certify that
          </div>

          {/* Name */}
          <div style={{
            marginTop: 12,
            font: '700 76px/1.1 "Playfair Display", Georgia, serif',
            color: "#111a14", maxWidth: 880, overflowWrap: "anywhere",
          }}>
            {cert.userDisplayName}
          </div>

          {/* Rule */}
          <div style={{ width: 230, height: 3, background: "#2e9a5b", margin: "16px auto 0", borderRadius: 2 }} />

          {/* Did text */}
          <div style={{ marginTop: 26, font: "400 16px Inter, sans-serif", color: "#5b6b61" }}>
            has successfully completed the course
          </div>

          {/* Course */}
          <div style={{
            marginTop: 14,
            font: '600 40px/1.2 "Playfair Display", Georgia, serif',
            color: "#1f7a4a", maxWidth: 880,
          }}>
            {cert.courseTitle}
          </div>

          {/* Category */}
          {cert.category && (
            <div style={{
              marginTop: 12, font: "500 13px Inter, sans-serif",
              letterSpacing: ".2em", color: "#8a9a90", textTransform: "uppercase",
            }}>
              {cert.category}
            </div>
          )}

          {/* ── Footer: date | signature | QR ── */}
          <div style={{
            marginTop: "auto", width: "100%",
            display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr",
            alignItems: "flex-end", gap: 20,
          }}>
            {/* Left: date */}
            <div style={{ textAlign: "left" }}>
              <div style={{ font: "400 12px Inter, sans-serif", color: "#7a8a80", letterSpacing: ".05em" }}>
                Date issued
              </div>
              <div style={{ marginTop: 4, font: "500 16px Inter, sans-serif", color: "#16211a" }}>
                {cert.issuedAt}
              </div>
            </div>

            {/* Centre: signature */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/signature.png" alt="Signature" style={{
                width: 190, height: "auto", marginBottom: -4,
                mixBlendMode: "multiply",
              }} />
              <div style={{ width: 240, height: 1.5, background: "#16211a", opacity: .7 }} />
              <div style={{ marginTop: 8, font: "600 15px Inter, sans-serif", color: "#16211a" }}>
                Uwami Mgxekwa
              </div>
              <div style={{ marginTop: 2, font: "400 12.5px Inter, sans-serif", color: "#5b6b61" }}>
                Chief Executive Officer, FuturePath
              </div>
            </div>

            {/* Right: credential ID + QR */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", gap: 14 }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ font: "400 12px Inter, sans-serif", color: "#7a8a80", letterSpacing: ".05em" }}>
                  Certificate ID
                </div>
                <div style={{
                  font: "500 13px Inter, sans-serif", color: "#16211a",
                  fontVariantNumeric: "tabular-nums", marginTop: 4,
                }}>
                  {cert.credentialId}
                </div>
                <div style={{ font: "400 12px Inter, sans-serif", color: "#7a8a80", marginTop: 8, letterSpacing: ".05em" }}>
                  Scan to verify
                </div>
              </div>
              {/* QR canvas */}
              <div style={{
                width: 92, height: 92, padding: 5,
                border: "1px solid #dcefe3", background: "#fff", borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <canvas ref={qrRef} style={{ display: "block", width: 80, height: 80 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PRINT HTML — landscape A4, QR rendered via qrcodejs
   ══════════════════════════════════════════════════════════════ */
function buildPrintHtml(
  cert: CertData,
  logoData: string,
  sigData: string,
  verifyUrl: string,
): string {
  // SVG pattern for watermark (same as inline)
  const patternSvg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="52"><g fill="none" stroke="#2e9a5b" stroke-width=".7" opacity=".45"><circle cx="0" cy="0" r="30"/><circle cx="60" cy="0" r="30"/><circle cx="30" cy="26" r="30"/><circle cx="0" cy="52" r="30"/><circle cx="60" cy="52" r="30"/></g></svg>`
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Certificate — ${cert.courseTitle}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  :root{--page:#fff;--ink:#16211a;--green:#2e9a5b;--green-deep:#1f7a4a;--green-soft:#dcefe3;--muted:#5b6b61}
  *{margin:0;padding:0;box-sizing:border-box}
  @page{size:297mm 210mm;margin:0}
  body{
    width:1123px;height:794px;background:var(--page);
    font-family:Inter,system-ui,-apple-system,'Segoe UI',Arial,sans-serif;
    overflow:hidden;position:relative;color:var(--ink);
    -webkit-print-color-adjust:exact;print-color-adjust:exact;
  }
  .pattern{
    position:absolute;inset:0;opacity:.55;
    background-image:url("data:image/svg+xml,${patternSvg}");
    -webkit-mask-image:radial-gradient(ellipse 52% 56% at 50% 50%,transparent 55%,#000 100%);
    mask-image:radial-gradient(ellipse 52% 56% at 50% 50%,transparent 55%,#000 100%);
  }
  .mark{
    position:absolute;left:50%;top:50%;
    width:470px;height:470px;margin:-235px 0 0 -235px;
    object-fit:contain;opacity:.055;mix-blend-mode:multiply;
  }
  .frame{position:absolute;inset:26px;border:1.5px solid var(--green)}
  .frame2{position:absolute;inset:34px;border:1px solid var(--green-soft)}
  .corner{position:absolute;width:46px;height:46px;border:5px solid var(--green)}
  .c1{top:20px;left:20px;border-right:0;border-bottom:0}
  .c2{top:20px;right:20px;border-left:0;border-bottom:0}
  .c3{bottom:20px;left:20px;border-right:0;border-top:0}
  .c4{bottom:20px;right:20px;border-left:0;border-top:0}
  .body{
    position:absolute;inset:0;
    display:flex;flex-direction:column;align-items:center;
    padding:62px 96px 58px;text-align:center;
  }
  .brand{display:flex;align-items:center;gap:12px}
  .brand img{width:52px;height:52px}
  .brand span{font:600 22px 'Playfair Display',Georgia,serif;letter-spacing:.04em;color:var(--green-deep)}
  .title{margin-top:26px;font:500 15px Inter,sans-serif;letter-spacing:.42em;color:var(--muted);text-transform:uppercase}
  .lead{margin-top:34px;font:400 15px Inter,sans-serif;letter-spacing:.06em;color:var(--muted)}
  .name{margin-top:12px;font:700 76px/1.1 'Playfair Display',Georgia,serif;color:#111a14;max-width:880px;overflow-wrap:anywhere}
  .rule{width:230px;height:3px;background:var(--green);margin:16px auto 0;border-radius:2px}
  .did{margin-top:26px;font:400 16px Inter,sans-serif;color:var(--muted)}
  .course{margin-top:14px;font:600 40px/1.2 'Playfair Display',Georgia,serif;color:var(--green-deep);max-width:880px}
  .cat{margin-top:12px;font:500 13px Inter,sans-serif;letter-spacing:.2em;color:#8a9a90;text-transform:uppercase}
  .foot{
    margin-top:auto;width:100%;
    display:grid;grid-template-columns:1fr 1.2fr 1fr;
    align-items:flex-end;gap:20px;
  }
  .f-left{text-align:left}
  .lbl{font:400 12px Inter,sans-serif;color:#7a8a80;letter-spacing:.05em}
  .val{margin-top:4px;font:500 16px Inter,sans-serif;color:var(--ink)}
  .sig{display:flex;flex-direction:column;align-items:center}
  .sig img{width:190px;height:auto;margin-bottom:-4px;mix-blend-mode:multiply}
  .sig .line{width:240px;height:1.5px;background:var(--ink);opacity:.7}
  .sig .who{margin-top:8px;font:600 15px Inter,sans-serif;color:var(--ink)}
  .sig .role{margin-top:2px;font:400 12.5px Inter,sans-serif;color:var(--muted)}
  .f-right{display:flex;justify-content:flex-end;align-items:flex-end;gap:14px;text-align:left}
  .id{font:500 13px Inter,sans-serif;color:var(--ink);font-variant-numeric:tabular-nums;margin-top:4px}
  #qr{width:92px;height:92px;padding:5px;border:1px solid var(--green-soft);background:#fff;border-radius:6px}
  #qr img,#qr canvas{display:block;width:80px!important;height:80px!important}
</style>
</head>
<body>
  <div class="pattern"></div>
  <img class="mark" src="${logoData}" alt=""/>
  <div class="frame"></div>
  <div class="frame2"></div>
  <i class="corner c1"></i><i class="corner c2"></i>
  <i class="corner c3"></i><i class="corner c4"></i>

  <div class="body">
    <div class="brand">
      <img src="${logoData}" alt="FuturePath logo"/>
      <span>FuturePath</span>
    </div>
    <div class="title">Certificate of Completion</div>
    <div class="lead">This is to certify that</div>
    <div class="name">${cert.userDisplayName}</div>
    <div class="rule"></div>
    <div class="did">has successfully completed the course</div>
    <div class="course">${cert.courseTitle}</div>
    ${cert.category ? `<div class="cat">${cert.category}</div>` : ""}

    <div class="foot">
      <div class="f-left">
        <div class="lbl">Date issued</div>
        <div class="val">${cert.issuedAt}</div>
      </div>
      <div class="sig">
        <img src="${sigData}" alt="Signature of Uwami Mgxekwa"/>
        <div class="line"></div>
        <div class="who">Uwami Mgxekwa</div>
        <div class="role">Chief Executive Officer, FuturePath</div>
      </div>
      <div class="f-right">
        <div>
          <div class="lbl">Certificate ID</div>
          <div class="id">${cert.credentialId}</div>
          <div class="lbl" style="margin-top:8px">Scan to verify</div>
        </div>
        <div id="qr"></div>
      </div>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script>
  <script>
    try{
      new QRCode(document.getElementById("qr"),{
        text:${JSON.stringify(verifyUrl)},
        width:160,height:160,
        colorDark:"#1f7a4a",colorLight:"#ffffff",
        correctLevel:QRCode.CorrectLevel.M
      });
    }catch(e){}
  <\/script>
</body>
</html>`;
}
