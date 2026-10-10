"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
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
    title: "1. Acceptance of Terms",
    content: `By accessing or using FuturePath, you confirm that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you must not register or use the platform. These terms apply to all visitors, registered users, and any other persons who access or use FuturePath.`,
  },
  {
    title: "2. Description of Service",
    content: `FuturePath is a South African online learning and career development platform that provides access to courses, digital certificates, job listings, learnerships, and career guidance tools. The platform is designed to connect youth with skills development opportunities, employment prospects, and further education resources relevant to the South African context.`,
  },
  {
    title: "3. Eligibility",
    content: `To register and use FuturePath, you must be at least 13 years of age. Users under the age of 18 should obtain consent from a parent or legal guardian before registering. By creating an account, you confirm that the information you provide is accurate and that you meet the eligibility requirements. FuturePath reserves the right to verify eligibility and suspend accounts that do not comply.`,
  },
  {
    title: "4. User Accounts and Registration",
    content: `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must notify FuturePath immediately of any unauthorised use of your account. FuturePath will not be liable for any loss or damage arising from your failure to protect your account information. You agree to provide accurate, current, and complete information during registration and to update it as necessary.`,
  },
  {
    title: "5. Acceptable Use",
    content: `You agree to use FuturePath only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of the platform. You must not upload false or misleading information, impersonate another person, attempt to gain unauthorised access to any part of the platform, or use the platform to distribute spam or harmful content. Violations may result in immediate suspension or termination of your account.`,
  },
  {
    title: "6. Intellectual Property",
    content: `All content on FuturePath, including course materials, videos, text, graphics, logos, and software, is the property of FuturePath or its content licensors and is protected by South African and international intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without prior written permission. Your personal use of platform content for learning purposes does not grant you any ownership rights.`,
  },
  {
    title: "7. User-Generated Content",
    content: `When you upload content to FuturePath, including profile information, CV documents, qualifications, or forum contributions, you grant FuturePath a non-exclusive, royalty-free licence to use, store, and display that content for the purpose of operating the platform. You retain ownership of your content and are solely responsible for ensuring it is accurate, lawful, and does not infringe any third-party rights. FuturePath reserves the right to remove content that violates these terms.`,
  },
  {
    title: "8. Third-Party Links and Services",
    content: `FuturePath may contain links to third-party websites, job listings, educational institutions, or external services. These links are provided for convenience and do not constitute an endorsement by FuturePath. We are not responsible for the content, accuracy, or practices of any third-party sites. You access third-party services at your own risk and should review their terms and privacy policies independently.`,
  },
  {
    title: "9. Disclaimer of Warranties",
    content: `FuturePath is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not warrant that the platform will be uninterrupted, error-free, or free of harmful components. We make no guarantees regarding the accuracy or completeness of any course content, job listings, or career information provided on the platform. Your use of FuturePath is at your own risk.`,
  },
  {
    title: "10. Limitation of Liability",
    content: `To the fullest extent permitted by South African law, FuturePath shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of, or inability to use, the platform. This includes but is not limited to loss of employment opportunities, loss of data, or any reliance placed on information found on the platform. Our total liability in any matter shall not exceed the amount paid by you, if any, to access the platform in the preceding 12 months.`,
  },
  {
    title: "11. Termination",
    content: `FuturePath reserves the right to suspend or terminate your account at any time, with or without notice, if you breach these terms or if we determine that your continued use is harmful to other users or the platform. You may also terminate your account at any time by contacting us or using the account settings. Upon termination, your right to access the platform ceases, though certain provisions of these terms will continue to apply.`,
  },
  {
    title: "12. Changes to These Terms",
    content: `FuturePath may revise these Terms of Service from time to time to reflect changes in our services, legal requirements, or operational needs. When material changes are made, we will notify registered users via email or a prominent notice on the platform. Your continued use of FuturePath after such changes constitutes your acceptance of the revised terms. We encourage you to review these terms periodically.`,
  },
  {
    title: "13. Governing Law and Jurisdiction",
    content: `These Terms of Service are governed by and construed in accordance with the laws of the Republic of South Africa, including the Electronic Communications and Transactions Act (ECTA) and the Consumer Protection Act (CPA), where applicable. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of South Africa. You consent to the jurisdiction of such courts for the resolution of any such disputes.`,
  },
];

export default function TermsPage() {
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
                <FileText className="w-6 h-6 text-brand-green" />
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-green">Legal</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Terms of Service</h1>
              <p className="text-gray-500">Last updated: October 2026</p>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Please read these terms carefully before using FuturePath. By registering or using the platform,
                you agree to be bound by these terms.
              </p>
            </motion.div>

            {/* Important notice */}
            <motion.div variants={itemVariants} className="bg-yellow-400 rounded-2xl p-5 mb-10">
              <p className="text-yellow-950 font-semibold text-sm leading-relaxed">
                Important: These terms form a binding agreement between you and FuturePath. If you do not agree
                to these terms, you may not use the platform. Continued use of FuturePath after any updates to
                these terms constitutes your acceptance of the revised terms.
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
                Questions about these terms? Visit our{" "}
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
