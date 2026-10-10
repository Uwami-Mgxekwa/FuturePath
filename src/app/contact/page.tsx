"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
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

const topics = [
  "General Enquiry",
  "Technical Support",
  "Course Question",
  "Job Board",
  "Partnership or Sponsorship",
  "Report an Issue",
  "Other",
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !email || !topic || !message) {
      setError("Please fill in all fields.");
      return;
    }
    if (message.length < 10) {
      setError("Please write a bit more detail in your message.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>

            {/* Back */}
            <motion.div variants={itemVariants} className="mb-8">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-green transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </motion.div>

            {/* Header */}
            <motion.div variants={itemVariants} className="mb-12">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-green mb-3 inline-block">Get in Touch</span>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
              <p className="text-gray-500 text-lg max-w-xl leading-relaxed">
                We are here to help. Whether you have a question about a course, need technical support, or want to partner with us, reach out and we will get back to you within 1 to 2 business days.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* Contact info */}
              <motion.div variants={itemVariants} className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-green mb-4">Contact Details</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Email</p>
                        <p className="text-sm text-gray-500">support@futurepath.co.za</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Phone</p>
                        <p className="text-sm text-gray-500">+27 (0) 11 000 0000</p>
                        <p className="text-xs text-gray-400 mt-0.5">Mon to Fri, 8am to 5pm</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Based in</p>
                        <p className="text-sm text-gray-500">South Africa</p>
                        <p className="text-xs text-gray-400 mt-0.5">Serving youth across all 9 provinces</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-green mb-3">Response Time</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    We aim to respond to all enquiries within 1 to 2 business days. For urgent technical issues, please include "Urgent" in your subject line.
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-green mb-3">GBV Support</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    If you need immediate help related to gender-based violence, contact the GBV Command Centre:
                  </p>
                  <p className="text-sm font-semibold text-brand-green mt-2">0800 428 428</p>
                  <p className="text-xs text-gray-400">24/7, free of charge</p>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                  >
                    <CheckCircle2 className="w-12 h-12 text-brand-green mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent</h2>
                    <p className="text-gray-500 leading-relaxed max-w-sm">
                      Thank you for reaching out, {name}. We have received your message and will get back to you at {email} within 1 to 2 business days.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setName(""); setEmail(""); setTopic(""); setMessage(""); }}
                      className="btn-secondary mt-6 px-6 py-2"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="card p-8 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className="input"
                          autoComplete="name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="input"
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Topic</label>
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="input appearance-none"
                      >
                        <option value="">Select a topic</option>
                        {topics.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us how we can help..."
                        rows={6}
                        className="input resize-none"
                      />
                      <p className="text-xs text-gray-400 mt-1 text-right">{message.length} characters</p>
                    </div>

                    {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                      By submitting this form you agree to our{" "}
                      <Link href="/privacy" className="text-brand-green hover:underline">Privacy Policy</Link>.
                    </p>
                  </form>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
