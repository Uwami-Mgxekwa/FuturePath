"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RocketLaunch from "@/components/RocketLaunch";

const features = [
  {
    illustration: "/courses.png",
    alt: "Structured courses illustration",
    title: "Structured Courses",
    description:
      "Industry-aligned modules with hands-on projects and auto-issued certificates on completion.",
  },
  {
    illustration: "/job.png",
    alt: "Job board illustration",
    title: "Job Board",
    description:
      "Curated listings matched to your skills — from NGOs, government programs, and private employers.",
  },
  {
    illustration: "/certificate.png",
    alt: "Certificates and badges illustration",
    title: "Certificates & Badges",
    description:
      "Verifiable digital credentials that showcase your achievements to employers.",
  },
  {
    illustration: "/coaching.png",
    alt: "Mentor support illustration",
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
            Empowering Youth
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



      {/* Features — alternating sections */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-900">
              Everything you need to succeed
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
              From your first lesson to your first paycheck, FuturePath is with you every step.
            </motion.p>
          </motion.div>

          <div className="flex flex-col gap-24">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={feature.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={containerVariants}
                  className={`flex flex-col md:flex-row items-center gap-12 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Illustration */}
                  <motion.div
                    variants={itemVariants}
                    className="w-full md:w-1/2 flex justify-center"
                  >
                    <div className="relative w-full max-w-sm h-72">
                      <Image
                        src={feature.illustration}
                        alt={feature.alt}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </motion.div>

                  {/* Text */}
                  <motion.div
                    variants={itemVariants}
                    className={`w-full md:w-1/2 ${isEven ? "md:text-left" : "md:text-left"}`}
                  >
                    <span className="text-xs font-semibold uppercase tracking-widest text-brand-green mb-3 inline-block">
                      {`0${index + 1}`}
                    </span>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-500 text-lg leading-relaxed">{feature.description}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
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
