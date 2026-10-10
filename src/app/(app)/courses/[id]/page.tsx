"use client";

import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldAlert, Monitor, Megaphone, DollarSign, Leaf, HeartPulse, Rocket,
  Clock, BookOpen, Users, Star, ArrowLeft, CheckCircle2,
} from "lucide-react";

interface CourseDetail {
  id: number;
  title: string;
  category: string;
  instructor: string;
  instructor_bio: string;
  lessons_count: number;
  duration: string;
  level: string;
  enrolled: number;
  rating: number;
  icon: React.ElementType;
  video: string;
  description: string;
  lessons: string[];
  outcomes: string[];
}

const coursesData: CourseDetail[] = [
  {
    id: 7,
    title: "Understanding & Preventing GBV",
    category: "Safety & Rights",
    instructor: "Dr. Nandi Dlamini",
    instructor_bio: "Dr. Dlamini is a social worker and advocate with over 15 years of experience supporting GBV survivors across South Africa.",
    lessons_count: 20,
    duration: "7 hours",
    level: "Beginner",
    enrolled: 3100,
    rating: 5.0,
    icon: ShieldAlert,
    video: "/gbv.mp4",
    description: "A South African-focused course on recognising gender-based violence, knowing your rights, accessing support, and becoming a community advocate for change.",
    lessons: [
      "What Is Gender-Based Violence",
      "Recognising Signs of Abuse",
      "Legal Rights and Protections in South Africa",
      "Accessing Support Services and Shelters",
      "Community Advocacy and Prevention Strategies",
      "Supporting Survivors: A Practical Guide",
    ],
    outcomes: [
      "Identify different forms of gender-based violence",
      "Know your legal rights and available support structures",
      "Take action as a community advocate for change",
      "Support survivors with compassion and practical guidance",
    ],
  },
  {
    id: 1,
    title: "Web Development Basics",
    category: "Technology",
    instructor: "James Oduya",
    instructor_bio: "James is a full-stack developer and educator who has mentored over 2 000 students across Africa in web technologies.",
    lessons_count: 36,
    duration: "12 hours",
    level: "Beginner",
    enrolled: 1420,
    rating: 4.8,
    icon: Monitor,
    video: "/webDev.mp4",
    description: "Learn HTML, CSS, and JavaScript from scratch. Build real websites and launch your tech career.",
    lessons: [
      "Introduction to HTML and Document Structure",
      "Styling with CSS: Layouts and Responsive Design",
      "JavaScript Fundamentals: Variables and Functions",
      "DOM Manipulation and Events",
      "Building Your First Website Project",
      "Deploying to the Web",
    ],
    outcomes: [
      "Build responsive websites using HTML and CSS",
      "Write JavaScript to add interactivity to pages",
      "Deploy a working website to the internet",
      "Understand the foundations of modern web development",
    ],
  },
  {
    id: 2,
    title: "Digital Marketing Fundamentals",
    category: "Marketing",
    instructor: "Aisha Kamau",
    instructor_bio: "Aisha is a digital marketing strategist who has grown brands across East and Southern Africa using data-driven campaigns.",
    lessons_count: 24,
    duration: "8 hours",
    level: "Beginner",
    enrolled: 2310,
    rating: 4.9,
    icon: Megaphone,
    video: "/DigitalMarketing.mp4",
    description: "Master social media, SEO, and digital ads to grow any business online.",
    lessons: [
      "Introduction to Digital Marketing",
      "Social Media Strategy and Content Creation",
      "Search Engine Optimisation Basics",
      "Paid Advertising: Google and Meta Ads",
      "Email Marketing and Audience Building",
    ],
    outcomes: [
      "Create and execute a social media content strategy",
      "Optimise content for search engines",
      "Run effective paid advertising campaigns",
      "Measure and improve campaign performance",
    ],
  },
  {
    id: 3,
    title: "Financial Literacy & Savings",
    category: "Finance",
    instructor: "Dr. Peter Mwangi",
    instructor_bio: "Dr. Mwangi is a certified financial planner who teaches practical money management to youth and young professionals.",
    lessons_count: 18,
    duration: "6 hours",
    level: "Beginner",
    enrolled: 980,
    rating: 4.7,
    icon: DollarSign,
    video: "/financialliteracy.mp4",
    description: "Understand budgeting, saving, and investing to take control of your financial future.",
    lessons: [
      "Understanding Income, Expenses, and Net Worth",
      "Building a Personal Budget That Works",
      "Saving Strategies and Emergency Funds",
      "Introduction to Investing and Compound Interest",
      "Debt Management and Credit Scores",
    ],
    outcomes: [
      "Create and stick to a personal budget",
      "Build an emergency savings fund",
      "Understand the basics of investing",
      "Manage and reduce debt effectively",
    ],
  },
  {
    id: 4,
    title: "Modern Agribusiness",
    category: "Agriculture",
    instructor: "Grace Wanjiku",
    instructor_bio: "Grace is an agricultural entrepreneur and trainer who helps smallholder farmers access modern techniques and markets.",
    lessons_count: 20,
    duration: "7 hours",
    level: "Intermediate",
    enrolled: 650,
    rating: 4.6,
    icon: Leaf,
    video: "/farming.mp4",
    description: "Learn smart farming techniques, market access, and agricultural entrepreneurship.",
    lessons: [
      "Overview of Modern Agribusiness",
      "Soil Health and Sustainable Farming",
      "Irrigation Systems and Water Management",
      "Accessing Agricultural Markets and Supply Chains",
      "Agribusiness Finance and Record Keeping",
    ],
    outcomes: [
      "Apply sustainable farming techniques to improve yields",
      "Connect your produce to local and regional markets",
      "Manage an agribusiness with proper record keeping",
      "Identify funding and support opportunities for farmers",
    ],
  },
  {
    id: 5,
    title: "Community Health Worker Training",
    category: "Health",
    instructor: "Nurse Faith Otieno",
    instructor_bio: "Nurse Faith is a registered nurse and community health trainer with experience in rural health outreach programmes.",
    lessons_count: 30,
    duration: "10 hours",
    level: "Beginner",
    enrolled: 1100,
    rating: 4.8,
    icon: HeartPulse,
    video: "/healthcare.mp4",
    description: "Equip yourself with essential health knowledge to serve your community.",
    lessons: [
      "The Role of a Community Health Worker",
      "Basic First Aid and Emergency Response",
      "Maternal and Child Health",
      "HIV, TB, and Communicable Disease Awareness",
      "Mental Health First Aid",
      "Health Education and Community Outreach",
    ],
    outcomes: [
      "Perform basic first aid in community settings",
      "Educate community members on common health issues",
      "Support maternal and child health programmes",
      "Identify and refer mental health concerns appropriately",
    ],
  },
  {
    id: 6,
    title: "Starting a Small Business",
    category: "Entrepreneurship",
    instructor: "Brian Kipchoge",
    instructor_bio: "Brian is a serial entrepreneur and business coach who has helped launch over 100 small businesses across Sub-Saharan Africa.",
    lessons_count: 22,
    duration: "9 hours",
    level: "Beginner",
    enrolled: 1890,
    rating: 4.9,
    icon: Rocket,
    video: "/entrepreneurship.mp4",
    description: "From idea to launch: everything you need to start and grow a small business.",
    lessons: [
      "Identifying a Business Idea and Validating It",
      "Writing a Simple Business Plan",
      "Registering Your Business in South Africa",
      "Pricing, Sales, and Customer Acquisition",
      "Managing Cash Flow and Basic Accounting",
    ],
    outcomes: [
      "Validate and refine a viable business idea",
      "Write a concise business plan",
      "Navigate the business registration process",
      "Manage finances and grow your customer base",
    ],
  },
];

const levelColor: Record<string, string> = {
  Beginner: "text-brand-green",
  Intermediate: "text-yellow-600",
  Advanced: "text-red-500",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const course = coursesData.find((c) => c.id === Number(params.id));

  if (!course) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 py-20 text-center">
        <BookOpen className="w-12 h-12 mx-auto text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
        <p className="text-gray-500">The course you are looking for does not exist.</p>
        <button
          onClick={() => router.back()}
          className="btn-secondary inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </button>
      </div>
    );
  }

  const Icon = course.icon;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* Back button */}
      <motion.div variants={itemVariants}>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-green transition-colors text-sm font-medium"
          aria-label="Back to Courses"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </button>
      </motion.div>

      {/* Hero card */}
      <motion.div variants={itemVariants} className="card border border-brand-green">
        <div className="flex items-start gap-4">
          <Icon className="w-10 h-10 text-brand-green flex-shrink-0 mt-1" strokeWidth={1.5} />
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{course.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
              <span className={`font-medium ${levelColor[course.level]}`}>{course.level}</span>
              <span className="text-gray-400">{course.category}</span>
            </div>
            <p className="text-gray-500 mt-3">{course.description}</p>
            <div className="flex flex-wrap items-center gap-5 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium text-gray-700">{course.rating}</span>
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-brand-green" />
                {course.enrolled.toLocaleString()} enrolled
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-brand-green" />
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-brand-green" />
                {course.lessons_count} lessons
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two-column layout */}
      <div className="lg:grid lg:grid-cols-3 gap-8 space-y-6 lg:space-y-0">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video */}
          <motion.div
            variants={itemVariants}
            className="h-64 rounded-2xl overflow-hidden border border-gray-100"
          >
            <video
              autoPlay
              muted
              playsInline
              disablePictureInPicture
              controlsList="nodownload"
              aria-hidden="true"
              className="w-full h-full object-contain"
            >
              <source src={course.video} type="video/mp4" />
            </video>
          </motion.div>

          {/* Lessons */}
          <motion.div variants={itemVariants} className="card">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-brand-green" />
              Course Lessons
            </h2>
            <ol className="space-y-3">
              {course.lessons.map((lesson, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <span className="text-brand-green font-semibold text-sm w-5 flex-shrink-0 mt-0.5">
                    {index + 1}.
                  </span>
                  <span className="text-sm">{lesson}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Learning Outcomes */}
          <motion.div variants={itemVariants} className="card">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-brand-green" />
              What You Will Learn
            </h2>
            <ul className="space-y-3">
              {course.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{outcome}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right column — sticky enroll card */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="card border border-brand-green sticky top-8 space-y-6">
            <button className="btn-primary w-full py-3 text-base font-semibold">
              Enroll Free
            </button>

            {/* Instructor */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Instructor</p>
              <p className="font-semibold text-gray-900">{course.instructor}</p>
              <p className="text-sm text-gray-500 mt-1">{course.instructor_bio}</p>
            </div>

            {/* Stats */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span><span className="font-medium text-gray-900">{course.rating}</span> rating</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-brand-green" />
                <span><span className="font-medium text-gray-900">{course.enrolled.toLocaleString()}</span> enrolled</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-brand-green" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="w-4 h-4 text-brand-green" />
                <span>{course.lessons_count} lessons</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
