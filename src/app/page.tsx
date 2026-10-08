"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Briefcase,
  Award,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RocketLaunch from "@/components/RocketLaunch";

const features = [
  {
    icon: BookOpen,
    title: "Structured Courses",
    description:
      "Industry-aligned modules with hands-on projects and auto-issued certificates on completion.",
  },
  {
    icon: Briefcase,
    title: "Job Board",
    description:
      "Curated listings matched to your skills — from NGOs, government programs, and private employers.",
  },
  {
    icon: Award,
    title: "Certificates & Badges",
    description:
      "Verifiable digital credentials that showcase your achievements to employers.",
  },
  {
    icon: Users,
    title: "Mentor Support",
    description:
      "Connect with experienced mentors who guide you through your learning journey.",
  },
];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero — full background video */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center overflow-hidden min-h-[92vh]">

        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 max-w-4xl mx-auto px-4 py-24 md:py-32 flex flex-col items-center"
        >
          <motion.span
            variants={itemVariants}
            className="text-sm font-medium text-white/70 mb-6 inline-block tracking-wide uppercase"
          >
            Empowering Youth Since 2024
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
          >
            Build Your{" "}
            <span className="text-brand-green">Future.</span>
            <br />
            Start Today.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-white/75 max-w-2xl mx-auto mb-14 leading-relaxed"
          >
            FuturePath gives you the skills, certifications, and job connections
            you need to turn your potential into a career.
          </motion.p>

          {/* Single rocket launch button */}
          <motion.div variants={itemVariants}>
            <RocketLaunch />
          </motion.div>
        </motion.div>
      </section>



      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-900">
              Everything you need to succeed
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
              From your first lesson to your first paycheck, FuturePath is with you every step.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="card p-6"
                >
                  <Icon className="w-6 h-6 text-brand-green mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-24 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <TrendingUp className="w-10 h-10 text-brand-green" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-900 mb-4">
            Ready to take the first step?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-500 text-lg mb-8">
            Join thousands of young people already building their futures with FuturePath.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link href="/dashboard" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              Start Learning Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
