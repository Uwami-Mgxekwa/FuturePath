"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const sections = [
  {
    title: "1. Who We Are",
    content: `FuturePath is a South African online learning and employment platform designed to equip youth with skills, certifications, and job opportunities. When you register and use FuturePath, you enter into an agreement with us regarding the collection and use of your personal information, as described in this policy.`,
  },
  {
    title: "2. What Information We Collect",
    content: `When you register, we collect the following personal information:

- Full name
- Email address
- Cellphone number
- Date of birth (derived from your SA ID number)
- Gender (derived from your SA ID number)
- South African ID or passport number
- Province and city of residence
- Profile photograph (if uploaded)
- CV and qualification documents (if uploaded)

We also collect usage data such as courses enrolled, progress, certificates earned, and jobs applied for.`,
  },
  {
    title: "3. Why We Collect Your Information",
    content: `We collect and process your personal information for the following purposes:

- To create and manage your FuturePath account
- To personalise your learning experience and job recommendations based on your location and skills
- To issue and verify digital certificates and badges
- To match your profile with relevant job opportunities from employers and partner organisations
- To communicate important updates, reminders, and opportunities
- To improve the platform and its features

Your ID number is used solely to verify your identity and auto-populate your date of birth and gender. It is stored securely and is never displayed publicly.`,
  },
  {
    title: "4. Sharing Your Information with Third Parties",
    content: `FuturePath may share your personal information with third parties in the following circumstances:

- Employers and recruiters: When you apply for a job or make your profile visible to employers, your name, location, skills, certificates, CV, and qualification documents may be shared with the relevant employer or organisation.
- Partner NGOs and government programmes: We work with NGOs and government employment programmes. Your profile information, including your location and qualifications, may be shared with these partners to connect you with opportunities.
- Service providers: We use trusted third-party services to host the platform, process data, and send communications. These providers are contractually required to protect your information.
- Legal requirements: We may disclose information if required to do so by South African law or in response to valid legal process.

We do not sell your personal information to any third party for marketing purposes.`,
  },
  {
    title: "5. Document Uploads",
    content: `If you upload a CV, qualifications, or other documents to your profile, you acknowledge and agree that:

- These documents may be accessed and reviewed by potential employers and partner organisations on the platform.
- FuturePath stores these documents securely on its servers.
- You are responsible for ensuring the documents you upload are accurate and belong to you.
- You can remove uploaded documents from your profile at any time.`,
  },
  {
    title: "6. Your Rights Under POPIA",
    content: `In terms of the Protection of Personal Information Act (POPIA) of South Africa, you have the right to:

- Access the personal information we hold about you
- Request correction of inaccurate or incomplete information
- Request deletion of your personal information, subject to legal requirements
- Object to the processing of your personal information
- Lodge a complaint with the Information Regulator of South Africa

To exercise any of these rights, please contact us through the Contact page.`,
  },
  {
    title: "7. Data Security",
    content: `We take the security of your personal information seriously. We implement appropriate technical and organisational measures to protect your data from unauthorised access, disclosure, alteration, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "8. Data Retention",
    content: `We retain your personal information for as long as your account is active or as needed to provide services. If you delete your account, we will retain certain data as required by South African law or for legitimate business purposes such as resolving disputes.`,
  },
  {
    title: "9. Cookies and Usage Data",
    content: `FuturePath uses cookies and similar technologies to maintain your session, remember your preferences, and understand how the platform is used. You can control cookies through your browser settings, though disabling them may affect some platform features.`,
  },
  {
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we do, we will notify you via email or a notice on the platform. Continued use of FuturePath after changes are made constitutes your acceptance of the updated policy.`,
  },
  {
    title: "11. Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us through the Contact page on the FuturePath platform. We aim to respond within 5 business days.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Back link */}
            <motion.div variants={itemVariants} className="mb-8">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-green transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </motion.div>

            {/* Header */}
            <motion.div variants={itemVariants} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-brand-green" />
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-green">Legal</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
              <p className="text-gray-500">Last updated: October 2026</p>
              <p className="text-gray-600 mt-4 leading-relaxed">
                FuturePath is committed to protecting your privacy and handling your personal information
                responsibly, in accordance with the Protection of Personal Information Act (POPIA) of South Africa.
                Please read this policy carefully before using the platform.
              </p>
            </motion.div>

            {/* Important notice */}
            <motion.div variants={itemVariants} className="bg-yellow-400 rounded-2xl p-5 mb-10">
              <p className="text-yellow-950 font-semibold text-sm leading-relaxed">
                Important: By registering and using FuturePath, you consent to the collection, storage,
                and sharing of your personal information as described in this policy. This includes sharing
                your profile, documents, and qualifications with potential employers and partner organisations.
              </p>
            </motion.div>

            {/* Sections */}
            <div className="space-y-8">
              {sections.map((section) => (
                <motion.div key={section.title} variants={itemVariants}>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                    {section.content}
                  </div>
                  <div className="border-b border-gray-100 mt-8" />
                </motion.div>
              ))}
            </div>

            {/* Footer note */}
            <motion.div variants={itemVariants} className="mt-10 text-center">
              <p className="text-gray-400 text-sm">
                Questions about this policy? Visit our{" "}
                <Link href="/contact" className="text-brand-green hover:underline">Contact page</Link>.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
