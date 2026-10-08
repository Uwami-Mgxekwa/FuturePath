"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Target, Eye, Heart, Users, BookOpen, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const values = [
  {
    icon: Target,
    title: "Purpose-Driven",
    description:
      "Every course, every feature, and every decision is made with one question in mind: does this help a young South African move forward?",
  },
  {
    icon: Heart,
    title: "Inclusive by Design",
    description:
      "We build for everyone — regardless of background, location, or prior education. Free, accessible, and built for real lives.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "FuturePath is more than a platform. It is a growing community of learners, mentors, and employers invested in each other.",
  },
  {
    icon: Award,
    title: "Quality Without Compromise",
    description:
      "Our courses are built to industry standards. Every certificate issued means something because the work behind it means something.",
  },
];

const stats = [
  { value: "7+", label: "Courses Available" },
  { value: "Free", label: "Always and Forever" },
  { value: "SA", label: "Built for South Africa" },
  { value: "24/7", label: "Learn at Your Pace" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative py-28 px-4 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-green-muted rounded-full translate-x-1/2 -translate-y-1/2 opacity-60" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-green-muted rounded-full -translate-x-1/3 translate-y-1/3 opacity-40" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <motion.span
            variants={itemVariants}
            className="text-xs font-semibold uppercase tracking-widest text-brand-green mb-4 inline-block"
          >
            Our Story
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6"
          >
            Built for the youth.
            <br />
            <span className="text-brand-green">Powered by purpose.</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto"
          >
            FuturePath was created because too many young South Africans have
            the potential but not the access. We are here to change that.
          </motion.p>
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="bg-brand-green py-10 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={itemVariants}>
              <p className="text-4xl font-extrabold text-white">{s.value}</p>
              <p className="text-white/70 text-sm mt-1 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Mission and Vision */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-brand-green" />
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-green">Our Mission</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-4">
              Skills that open doors
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-500 text-lg leading-relaxed">
              Our mission is to equip South African youth with the practical skills,
              digital credentials, and employment connections they need to build
              sustainable careers — completely free of charge.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
              <Eye className="w-5 h-5 text-brand-green" />
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-green">Our Vision</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-4">
              A generation that rises
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-500 text-lg leading-relaxed">
              We envision a South Africa where every young person, regardless of
              where they come from, has access to the tools they need to build
              a future on their own terms.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Why we built this */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="max-w-3xl"
          >
            <motion.span variants={itemVariants} className="text-xs font-semibold uppercase tracking-widest text-brand-green mb-4 inline-block">
              Why FuturePath
            </motion.span>
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-900 mb-6">
              The problem we are solving
            </motion.h2>
            <motion.div variants={itemVariants} className="space-y-5 text-gray-500 text-lg leading-relaxed">
              <p>
                South Africa has one of the highest youth unemployment rates in the world.
                Millions of young people are capable, driven, and ready to work — but
                lack access to the right skills, networks, and opportunities.
              </p>
              <p>
                Traditional education is expensive, slow, and not always aligned with
                what employers actually need. FuturePath was built to bridge that gap:
                fast, practical, industry-relevant, and free.
              </p>
              <p>
                We also recognise that building a future requires safety. That is why
                our GBV awareness course is one of the first things you see on our
                platform. A strong community starts with informed, empowered individuals.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.span variants={itemVariants} className="text-xs font-semibold uppercase tracking-widest text-brand-green mb-4 inline-block">
              What We Stand For
            </motion.span>
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-900">
              Our values
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8"
          >
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="card p-8"
                >
                  <Icon className="w-6 h-6 text-brand-green mb-5" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{v.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* What we offer */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.span variants={itemVariants} className="text-xs font-semibold uppercase tracking-widest text-brand-green mb-4 inline-block">
              The Platform
            </motion.span>
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-900">
              Everything in one place
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: BookOpen, title: "Free Courses", desc: "Practical, industry-aligned modules across technology, finance, health, agriculture, and more." },
              { icon: Award, title: "Verified Certificates", desc: "Earn digital credentials that employers can verify — proof that your skills are real." },
              { icon: Users, title: "Jobs and Mentors", desc: "Connect with employers and mentors who are invested in helping you succeed." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} variants={itemVariants} className="text-center p-8">
                  <Icon className="w-7 h-7 text-brand-green mx-auto mb-5" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-900 mb-4">
            Ready to start your path?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-500 text-lg mb-8 leading-relaxed">
            Join FuturePath today — no cost, no catch, just the tools you need to move forward.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/courses" className="btn-secondary text-lg px-10 py-4 inline-flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Browse Courses
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
