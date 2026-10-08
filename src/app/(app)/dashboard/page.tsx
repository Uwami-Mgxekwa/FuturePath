"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Award, Briefcase, Zap, MapPin, ChevronRight, Quote,
} from "lucide-react";
import { DashboardSkeleton } from "@/components/Skeleton";

/* ── Daily words of encouragement — SA-rooted ───────────────── */
const QUOTES = [
  { text: "Umuntu ngumuntu ngabantu.", translation: "A person is a person through other people.", source: "Zulu proverb" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", source: "Nelson Mandela" },
  { text: "It always seems impossible until it is done.", source: "Nelson Mandela" },
  { text: "Education is the most powerful weapon which you can use to change the world.", source: "Nelson Mandela" },
  { text: "Do not be afraid of taking a bold step. You cannot cross a chasm in two small jumps.", source: "South African saying" },
  { text: "Nna ke motho ke motho ka batho.", translation: "I am a person through other people.", source: "Sotho proverb" },
  { text: "A person who feels appreciated will always do more than what is expected.", source: "South African proverb" },
  { text: "Even the night has ears. Work hard, someone is watching your growth.", source: "Xhosa proverb" },
  { text: "Rain does not fall on one roof alone, your community rises with you.", source: "Zulu proverb" },
  { text: "The youth of today are the leaders of tomorrow. Start leading now.", source: "Nelson Mandela" },
  { text: "Challenges are gifts that force us to search for a new centre of gravity.", source: "Oprah Winfrey" },
  { text: "Success is not final, failure is not fatal. It is the courage to continue that counts.", source: "Winnie Madikizela-Mandela" },
  { text: "A dream does not become reality through magic. It takes sweat, determination and hard work.", source: "South African proverb" },
  { text: "However long the night, the dawn will break.", source: "African proverb" },
  { text: "Go to bed wiser than when you woke up. Every lesson counts.", source: "South African saying" },
  { text: "The roots of education are bitter, but the fruit is sweet.", source: "Aristotle, beloved in SA classrooms" },
  { text: "Ubuntu: I am because we are. Share your progress, it lifts others.", source: "Ubuntu philosophy" },
  { text: "Your background does not determine your destination.", source: "South African youth proverb" },
  { text: "Isandla sihlamba esinye, one hand washes the other. Keep helping, keep growing.", source: "Zulu proverb" },
  { text: "The future belongs to those who prepare for it today.", source: "Malcolm X, widely quoted in SA schools" },
  { text: "Hard times never last, but hard people do.", source: "South African township saying" },
  { text: "Tshela metsi, pour water. Keep giving effort, even when results are not yet visible.", source: "Sesotho proverb" },
  { text: "A child who is not embraced by the village will burn it down to feel its warmth. Be the village for someone today.", source: "African proverb" },
  { text: "Ukuphila yimpilo, to live is life. Show up fully, every single day.", source: "Zulu saying" },
  { text: "You cannot plough a field by turning it over in your mind. Take action.", source: "South African farming proverb" },
  { text: "Stars cannot shine without darkness. Your struggle is building your strength.", source: "South African saying" },
  { text: "Ngeke unqobe inkosi nje ngamazwi, you cannot defeat a king with words alone. Back your dreams with action.", source: "Zulu proverb" },
  { text: "Every day above ground is a great day. Make it count.", source: "Cape Town street wisdom" },
  { text: "Courage was not the absence of fear, but the triumph over it.", source: "Nelson Mandela" },
  { text: "After climbing a great hill, one only finds that there are many more hills to climb.", source: "Nelson Mandela" },
  { text: "A good head and a good heart are always a formidable combination.", source: "Nelson Mandela" },
  { text: "There is no easy walk to freedom anywhere.", source: "Nelson Mandela, quoting Nehru" },
  { text: "I am not a saint, unless you think of a saint as a sinner who keeps on trying.", source: "Nelson Mandela" },
  { text: "What counts in life is not the mere fact that we have lived. It is what difference we have made to the lives of others.", source: "Nelson Mandela" },
  { text: "It is what we make out of what we have, not what we are given, that separates one person from another.", source: "Nelson Mandela" },
  { text: "Education is the great engine of personal development.", source: "Nelson Mandela" },
  { text: "Sometimes it falls upon a generation to be great. You can be that great generation.", source: "Nelson Mandela" },
  { text: "To be free is not merely to cast off one's chains, but to live in a way that respects and enhances the freedom of others.", source: "Nelson Mandela" },
  { text: "The first thing is to be honest with yourself. You can never have an impact on society if you have not changed yourself.", source: "Nelson Mandela" },
  { text: "A winner is a dreamer who never gives up.", source: "Nelson Mandela" },
  { text: "It is in your hands to make of our world a better one for all.", source: "Nelson Mandela" },
  { text: "Do your little bit of good where you are; it is those little bits of good put together that overwhelm the world.", source: "Desmond Tutu" },
  { text: "Hope is being able to see that there is light despite all of the darkness.", source: "Desmond Tutu" },
  { text: "My humanity is bound up in yours, for we can only be human together.", source: "Desmond Tutu" },
  { text: "Goodness is stronger than evil; love is stronger than hate; light is stronger than darkness; life is stronger than death.", source: "Desmond Tutu" },
  { text: "I am human because I belong. I participate, I share.", source: "Desmond Tutu" },
  { text: "Don't raise your voice, improve your argument.", source: "Desmond Tutu" },
  { text: "The most potent weapon of the oppressor is the mind of the oppressed.", source: "Steve Biko" },
  { text: "It is better to die for an idea that will live, than to live for an idea that will die.", source: "Steve Biko" },
  { text: "We have set out on a quest for true humanity.", source: "Steve Biko" },
  { text: "The children of any nation are its future.", source: "Oliver Tambo" },
  { text: "Amandla! Awethu!", translation: "Power! It is ours!", source: "Struggle slogan" },
  { text: "Masakhane.", translation: "Let us build together.", source: "Zulu / Xhosa" },
  { text: "Sawubona.", translation: "I see you.", source: "Zulu greeting" },
  { text: "Thuma mina.", translation: "Send me.", source: "Zulu" },
  { text: "!ke e: /xarra //ke", translation: "Unity in Diversity", source: "South African national motto (Khoisan)" },
  { text: "Khotso, Pula, Nala.", translation: "Peace, rain, prosperity.", source: "Sesotho motto" },
  { text: "Umntu ngumntu ngabantu.", translation: "A person is a person through other people.", source: "Xhosa proverb" },
  { text: "Indlela ibuzwa kwabaphambili.", translation: "The way is asked from those who have walked ahead.", source: "Zulu proverb" },
  { text: "Inkosi yinkosi ngabantu.", translation: "A king is a king because of the people.", source: "Zulu proverb" },
  { text: "Izandla ziyagezana.", translation: "Hands wash each other.", source: "Zulu proverb" },
  { text: "Inkunzi isematholeni.", translation: "The bull is still among the calves, great things start small.", source: "Zulu proverb" },
  { text: "Waar 'n wil is, is 'n weg.", translation: "Where there is a will, there is a way.", source: "Afrikaans proverb" },
  { text: "Eendrag maak mag.", translation: "Unity makes strength.", source: "Afrikaans proverb" },
  { text: "Na reën kom sonskyn.", translation: "After rain comes sunshine.", source: "Afrikaans proverb" },
  { text: "Stadig maar seker.", translation: "Slowly but surely.", source: "Afrikaans proverb" },
  { text: "Wie nie waag nie, sal nie wen nie.", translation: "Whoever does not dare will not win.", source: "Afrikaans proverb" },
  { text: "Oefening maak meester.", translation: "Practice makes the master.", source: "Afrikaans proverb" },
  { text: "Moenie moed verloor nie.", translation: "Do not lose heart.", source: "Afrikaans saying" },
  { text: "Haba na haba hujaza kibaba.", translation: "Little by little fills the measure.", source: "Swahili proverb" },
  { text: "Pole pole ndiyo mwendo.", translation: "Slowly, slowly is the way to go.", source: "Swahili proverb" },
  { text: "Akili ni mali.", translation: "Intelligence is wealth.", source: "Swahili proverb" },
  { text: "Subira huvuta heri.", translation: "Patience draws good fortune.", source: "Swahili proverb" },
  { text: "If you want to go fast, go alone. If you want to go far, go together.", source: "African proverb" },
  { text: "It takes a village to raise a child.", source: "African proverb" },
  { text: "Smooth seas do not make skilful sailors.", source: "African proverb" },
  { text: "He who learns, teaches.", source: "Ethiopian proverb" },
  { text: "Knowledge is like a garden: if it is not cultivated, it cannot be harvested.", source: "Guinean proverb" },
  { text: "Wisdom is like a baobab tree; no one individual can embrace it.", source: "Akan proverb" },
  { text: "When spider webs unite, they can tie up a lion.", source: "Ethiopian proverb" },
  { text: "The one who asks questions does not lose his way.", source: "African proverb" },
  { text: "Patience is the mother of a beautiful child.", source: "African proverb" },
  { text: "Not to know is bad; not to wish to know is worse.", source: "African proverb" },
  { text: "The moon moves slowly, but it crosses the town.", source: "African proverb" },
  { text: "Do not look where you fell, but where you slipped.", source: "African proverb" },
  { text: "When you pray, move your feet.", source: "African proverb" },
  { text: "Sticks in a bundle are unbreakable.", source: "Kenyan proverb" },
  { text: "To get lost is to learn the way.", source: "African proverb" },
  { text: "Until the lion learns to write, every story will glorify the hunter.", source: "African proverb" },
  { text: "Tomorrow belongs to the people who prepare for it today.", source: "African proverb" },
  { text: "However far the stream flows, it never forgets its source.", source: "African proverb" },
  { text: "The fool speaks, the wise man listens.", source: "Ethiopian proverb" },
  { text: "The sun does not forget a village just because it is small.", source: "African proverb" },
  { text: "Fall seven times, stand up eight.", source: "Japanese proverb" },
  { text: "The best time to plant a tree was twenty years ago. The second best time is now.", source: "Chinese proverb" },
  { text: "Imagination is more important than knowledge.", source: "Albert Einstein" },
  { text: "Life is like riding a bicycle. To keep your balance, you must keep moving.", source: "Albert Einstein" },
  { text: "Genius is one percent inspiration and ninety-nine percent perspiration.", source: "Thomas Edison" },
  { text: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.", source: "Thomas Edison" },
  { text: "If you can't fly, then run; if you can't run, then walk; if you can't walk, then crawl, but keep moving forward.", source: "Martin Luther King Jr." },
  { text: "The time is always right to do what is right.", source: "Martin Luther King Jr." },
  { text: "Faith is taking the first step even when you don't see the whole staircase.", source: "Martin Luther King Jr." },
  { text: "You must do the thing you think you cannot do.", source: "Eleanor Roosevelt" },
  { text: "Alone we can do so little; together we can do so much.", source: "Helen Keller" },
  { text: "A journey of a thousand miles begins with a single step.", source: "Lao Tzu" },
  { text: "It does not matter how slowly you go as long as you do not stop.", source: "Confucius" },
  { text: "What stands in the way becomes the way.", source: "Marcus Aurelius" },
  { text: "One child, one teacher, one book, one pen can change the world.", source: "Malala Yousafzai" },
  { text: "The only way to do great work is to love what you do.", source: "Steve Jobs" },
  { text: "Don't count the days, make the days count.", source: "Muhammad Ali" },
  { text: "If there is no struggle, there is no progress.", source: "Frederick Douglass" },
  { text: "An investment in knowledge pays the best interest.", source: "Benjamin Franklin" },
  { text: "Start where you are. Use what you have. Do what you can.", source: "Arthur Ashe" },
  { text: "You may encounter many defeats, but you must not be defeated.", source: "Maya Angelou" },
  { text: "Nothing will work unless you do.", source: "Maya Angelou" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", source: "B.B. King" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", source: "Robert Collier" },
  { text: "You miss 100% of the shots you don't take.", source: "Wayne Gretzky" },
  { text: "Small steps taken every day will carry you further than one big leap taken once.", source: "Daily encouragement" },
  { text: "You do not have to see the whole road. Just take the next step in the light you have.", source: "Daily encouragement" },
  { text: "A bad day is a bad day, not a bad life. Rest, then try again tomorrow.", source: "Daily encouragement" },
  { text: "Load-shedding ends. The lights come back on. So will your energy.", source: "Daily encouragement" },
  { text: "Table Mountain was climbed one step at a time. So is every goal.", source: "Daily encouragement" },
  { text: "You are allowed to be a work in progress and a masterpiece at the same time.", source: "Daily encouragement" },
  { text: "Your effort today is a gift to the person you will be next year.", source: "Daily encouragement" },
  { text: "Do not compare your chapter one to someone else's chapter twenty.", source: "Daily encouragement" },
  { text: "Discipline is just kindness to your future self.", source: "Daily encouragement" },
  { text: "Tired is not the same as finished. Take a breath and keep going.", source: "Daily encouragement" },
  { text: "A Highveld storm is loud and short, and the sky afterwards is the clearest you will ever see.", source: "Daily encouragement" },
  { text: "Every expert was once a beginner who refused to quit.", source: "Daily encouragement" },
  { text: "You have survived every difficult day so far. That is a perfect record.", source: "Daily encouragement" },
  { text: "What you practise grows. Practise patience, practise courage, practise showing up.", source: "Daily encouragement" },
  { text: "Be proud of how far you have come, and gentle with how far you still have to go.", source: "Daily encouragement" },
  { text: "Your future is built in the quiet hours when nobody is watching.", source: "Daily encouragement" },
  { text: "Do it scared. Courage is just fear that has decided to show up anyway.", source: "Daily encouragement" },
  { text: "Rest is part of the work. Even the soil needs a season to lie fallow.", source: "Daily encouragement" },
  { text: "You are not behind. You are on your own road, at your own pace.", source: "Daily encouragement" },
  { text: "Start before you feel ready. Ready is a feeling that arrives halfway through.", source: "Daily encouragement" },
  { text: "A good braai takes patience. Keep the fire going and the good things will come.", source: "Daily encouragement" },
  { text: "Choose progress over perfection.", source: "Daily encouragement" },
  { text: "Your struggle today is the story you will tell with a smile one day.", source: "Daily encouragement" },
  { text: "Today's effort is tomorrow's confidence.", source: "Daily encouragement" },
  { text: "You carry more strength than you think. Today is a good day to find out how much.", source: "Daily encouragement" },
  { text: "Every no brings you closer to the yes that is meant for you.", source: "Daily encouragement" },
  { text: "The seed does not see the tree it will become. Trust the growing.", source: "Daily encouragement" },
  { text: "Today is a fresh page. Write something you will be proud to read.", source: "Daily encouragement" },
  { text: "Your dreams do not expire. Keep watering them.", source: "Daily encouragement" },
  { text: "Doubt is normal. Let it ride along, but do not let it drive.", source: "Daily encouragement" },
  { text: "You are enough, and you are growing. Both are true.", source: "Daily encouragement" },
  { text: "Celebrate small wins. They are the stepping stones to big ones.", source: "Daily encouragement" },
  { text: "The sun rises over Table Mountain every morning. Second chances rise just as reliably.", source: "Daily encouragement" },
  { text: "Courage is not always loud. Sometimes it is simply opening the book again.", source: "Daily encouragement" },
  { text: "If you are the first in your family to reach this far, you are clearing the path for those behind you.", source: "Daily encouragement" },
  { text: "Do something today that your future self will thank you for.", source: "Daily encouragement" },
  { text: "Bad marks are feedback, not a verdict.", source: "Daily encouragement" },
  { text: "Be patient with yourself. Baobabs take centuries to grow, and they are magnificent.", source: "Daily encouragement" },
  { text: "A river carves a canyon not by force but by persistence.", source: "Daily encouragement" },
  { text: "When you feel like giving up, remember why you started.", source: "Daily encouragement" },
  { text: "Keep going. Someone younger is watching you and learning that it is possible.", source: "Daily encouragement" },
  { text: "Focus on what you can control and let the rest drift by like clouds over the Drakensberg.", source: "Daily encouragement" },
  { text: "Dream big, start small, finish strong.", source: "Daily encouragement" },
  { text: "Your voice, your questions and your ideas matter in this world.", source: "Daily encouragement" },
  { text: "Think of the person who believed in you first. Make them proud today.", source: "Daily encouragement" },
  { text: "You are stronger than the thing you are afraid of.", source: "Daily encouragement" },
  { text: "Treat every attempt as practice for the next one.", source: "Daily encouragement" },
  { text: "The robot may be red, but the road ahead will turn green. Be ready to go.", source: "Daily encouragement" },
  { text: "One kilometre at a time still gets you to Durban.", source: "Daily encouragement" },
  { text: "Every sunrise over the Indian Ocean starts the day with a clean slate. Take yours.", source: "Daily encouragement" },
  { text: "Even the Karoo blooms after rain. Your season is coming.", source: "Daily encouragement" },
  { text: "Give yourself credit for showing up on the days it was hard.", source: "Daily encouragement" },
  { text: "Whatever you learn today, you get to keep for life.", source: "Daily encouragement" },
  { text: "Your potential is bigger than your current results.", source: "Daily encouragement" },
  { text: "Study like someone who knows their community is cheering.", source: "Daily encouragement" },
  { text: "Your attitude is the one thing nobody can load-shed.", source: "Daily encouragement" },
  { text: "Aim to be better than yesterday, not better than everyone.", source: "Daily encouragement" },
  { text: "Make today count. It is the only one you can still change.", source: "Daily encouragement" },
];

function getDailyQuote() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return QUOTES[dayOfYear % QUOTES.length];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const stats = [
  { label: "Courses In Progress", value: "3", icon: BookOpen },
  { label: "Certificates Earned", value: "5", icon: Award },
  { label: "Jobs Applied", value: "2", icon: Briefcase },
  { label: "Skills Gained", value: "12", icon: Zap },
];

const activeCourses = [
  { id: 1, title: "Digital Marketing Fundamentals", progress: 72, lessons: 24, completedLessons: 17 },
  { id: 2, title: "Web Development Basics", progress: 45, lessons: 36, completedLessons: 16 },
  { id: 3, title: "Financial Literacy", progress: 20, lessons: 18, completedLessons: 4 },
];

const recentJobs = [
  { id: 1, title: 'Junior Social Media Manager', company: 'Digital Hustle Agency', type: 'Full-time', location: 'Johannesburg' },
  { id: 2, title: 'Web Developer Intern', company: 'TechBridge SA', type: 'Internship', location: 'Remote' },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">Good morning, Student</h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s what&apos;s happening with your learning journey.
        </p>
      </motion.div>

      {/* Word of the day */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl p-5 bg-yellow-400"
      >
        <div className="flex items-start gap-3">
          <Quote className="w-5 h-5 text-yellow-900 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-yellow-900 mb-1">Word of the Day</p>
            <p className="text-yellow-950 font-medium leading-relaxed">
              {getDailyQuote().text}
            </p>
            {getDailyQuote().translation && (
              <p className="text-yellow-800 text-sm italic mt-1">{getDailyQuote().translation}</p>
            )}
            <p className="text-yellow-700 text-xs mt-2">{getDailyQuote().source}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={itemVariants} className="card p-5">
              <Icon className="w-5 h-5 text-brand-green mb-3" />
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active courses */}
        <motion.div variants={itemVariants} className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Active Courses</h2>
            <a href="/courses" className="text-brand-green text-sm font-medium hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-5">
            {activeCourses.map((course) => (
              <div key={course.id} className="flex items-center gap-4">
                <BookOpen className="w-5 h-5 text-brand-green flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 truncate">{course.title}</p>
                    <span className="text-sm font-semibold text-brand-green ml-2">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <motion.div
                      className="bg-brand-green h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                      role="progressbar"
                      aria-valuenow={course.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {course.completedLessons} / {course.lessons} lessons
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Job matches */}
        <motion.div variants={itemVariants} className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Job Matches</h2>
            <a href="/jobs" className="text-brand-green text-sm font-medium hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="p-3 rounded-xl border border-gray-100 hover:border-brand-green transition-colors">
                <p className="font-medium text-gray-900 text-sm">{job.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{job.company}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="text-brand-green font-medium">{job.type}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{job.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <a href="/jobs" className="btn-secondary w-full text-center text-sm mt-4 block py-2">
            Explore Jobs
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
