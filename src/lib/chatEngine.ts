/* ================================================================
   VUKA — FUTUREPATH AI ASSISTANT  (chatEngine.ts)
   Fully browser-based. No API keys required.
   ================================================================ */

/* ── 1. LEXICON ─────────────────────────────────────────────── */
const LEX: Record<string, string> = {
  greet:     'hi hello hey howzit heita sawubona molo sup morning afternoon evening hola',
  thanks:    'thanks thank thx ty appreciated cheers dankie siyabonga',
  bye:       'bye goodbye cya later goodnight hamba kahle',
  capab:     'help assist what can do capabilities features',
  course:    'course courses learn learning lesson lessons module modules study studying enroll enrolment programme programs class classes',
  job:       'job jobs work career employment hire hiring vacancy vacancies opportunity opportunities listing listings employer employers apply applied',
  cert:      'certificate certificates badge badges credential credentials verify verified proof achievement diploma',
  mentor:    'mentor mentors mentorship coach coaching guide guidance support advisor connect',
  dashboard: 'dashboard home profile account page overview',
  register:  'register signup sign create account join start begin',
  login:     'login log sign in access forgot password reset',
  free:      'free cost price pay payment charge money afford afford',
  gbv:       'gbv gender violence abuse safety rights women femicide',
  tech:      'technology tech programming coding web development html css javascript python',
  marketing: 'marketing digital social media seo ads advertising content',
  finance:   'finance financial literacy money budget saving investing banking',
  agri:      'agriculture farming agribusiness crops livestock',
  health:    'health healthcare community nurse medical wellness',
  entrepren: 'entrepreneurship business startup small enterprise hustle',
  neg:       'cant cannot wont doesnt dont isnt arent not no unable never',
  privacy:   'privacy safe secure data protect confidential personal information',
  mobile:    'phone mobile app android iphone ios',
  contact:   'contact email reach us support helpdesk',
  about:     'about futurepath mission vision who team',
  cyber:     'cyber cybersecurity digital safety scam scams phishing fraud sim swap banking online impersonation identity theft protect password',
  bursary:   'bursary bursaries nsfas scholarship fund funding financial aid sponsorship sasol anglo investec nedbank standard bank eskom government grant',
  study:     'study further university college postgrad upgrade qualification nsfas bursary scholarship',
  skills:    'skills skill add competency competencies proficiency',
  profile:   'profile edit update photo picture personal details',
  dark:      'dark mode light theme appearance',
  notify:    'notification notifications alert bell updates',
  progress:  'progress completion percent percentage track',
  vuka:      'vuka assistant ai bot who are you your name',
};

const SLANG: Record<string, string> = {
  wat: 'what', wht: 'what', hw: 'how', u: 'you', ur: 'your', r: 'are',
  pls: 'please', plz: 'please', abt: 'about', wen: 'when', wer: 'where',
  hows: 'how', gud: 'good', wats: 'whats', gonna: 'going to', wanna: 'want to',
  nah: 'no', ya: 'yes', yep: 'yes', yup: 'yes', nope: 'no', lol: '',
  bruh: '', bro: '', sis: '', sisi: '',
};

const STOP = new Set(('the a an is are was were be to of in on for and or it its do does did can could you your please this that these those there here at by with as from so if but about just me my i we us am').split(' '));
const COMMON = new Set(('make made take name need want like will with that this then than them they what when where which who why how have has had been from your about after also some just more most much many other into over only both each same show tell give know keep here there does done gone come came went able good best time times date dates week today tomorrow please could would should might shall').split(' '));

/* ── 2. TEXT UTILITIES ──────────────────────────────────────── */
function stem(w: string): string {
  if (w.length <= 3) return w;
  return w.replace(/(ingly|edly|ing|ed|ly|es|s)$/, '') || w;
}

function osa(a: string, b: string): number {
  const d: number[][] = [];
  for (let i = 0; i <= a.length; i++) { d[i] = [i]; }
  for (let j = 0; j <= b.length; j++) { d[0][j] = j; }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

const STEM_MAP: Record<string, string[]> = {};
const VOCAB: string[] = [];
Object.keys(LEX).forEach((concept) => {
  LEX[concept].split(' ').forEach((word) => {
    const s = stem(word);
    if (!STEM_MAP[s]) STEM_MAP[s] = [];
    if (!STEM_MAP[s].includes(concept)) STEM_MAP[s].push(concept);
    if (!VOCAB.includes(s)) VOCAB.push(s);
  });
});

function spellFix(tok: string): string | null {
  if (tok.length < 5 || COMMON.has(tok)) return null;
  const limit = tok.length >= 8 ? 2 : 1;
  let best: string | null = null, bestD = 99;
  for (const v of VOCAB) {
    if (v[0] !== tok[0] || Math.abs(v.length - tok.length) > 2 || v.length < 4) continue;
    const dist = osa(tok, v);
    if (dist <= limit && dist < bestD) { best = v; bestD = dist; }
  }
  return best;
}

function normText(t: string): string {
  return t.toLowerCase().replace(/['`]/g, "'").split(/\s+/).map((w) => {
    const bare = w.replace(/[^a-z0-9']/g, '');
    return SLANG[bare] !== undefined ? (SLANG[bare] ? w.replace(bare, SLANG[bare]) : '') : w;
  }).filter(Boolean).join(' ');
}

function analyse(text: string): { concepts: Set<string>; content: number } {
  const t = text.toLowerCase().replace(/[^a-z0-9'\s]/g, ' ').replace(/'/g, '');
  const concepts = new Set<string>();
  let content = 0;
  t.split(/\s+/).filter(Boolean).forEach((raw) => {
    const tok = SLANG[raw] || raw;
    if (!STOP.has(tok) && !/^\d+$/.test(tok)) content++;
    const s = stem(tok);
    let hit = STEM_MAP[s];
    if (!hit) { const fix = spellFix(s); if (fix) hit = STEM_MAP[fix]; }
    if (hit) hit.forEach((c) => concepts.add(c));
  });
  return { concepts, content };
}

/* ── 3. USER CONTEXT ─────────────────────────────────────────── */
export interface VukaUserContext {
  name?: string;
  coursesInProgress?: number;
  certificatesEarned?: number;
  skills?: string[];
}

let _userCtx: VukaUserContext = {};

export function setVukaContext(ctx: VukaUserContext) {
  _userCtx = ctx;
}

/* ── 4. INTENTS ─────────────────────────────────────────────── */
export interface ChatResponse {
  text: string;
  chips: string[];
}

type AnswerFn = () => string;

interface Intent {
  id: string;
  sample: string;
  w: Record<string, number>;
  p?: RegExp[];
  pw?: number;
  a: string | AnswerFn;
}

const DEFAULT_CHIPS = [
  'What courses do you offer?',
  'Tell me about bursaries',
  'Are the courses free?',
  'How do I build a CV?',
];

const INTENTS: Intent[] = [
  {
    id: 'greeting', sample: 'Hello',
    w: { greet: 4 },
    a: () => {
      const name = _userCtx.name ? `, ${_userCtx.name.split(' ')[0]}` : '';
      return `Sawubona${name}! I am **Vuka**, your FuturePath learning assistant.\n\nI can help you with courses, jobs, certificates, the CV builder, study further options, and anything else about the platform.\n\nWhat would you like to know?`;
    },
  },
  {
    id: 'who_am_i', sample: 'Who are you?',
    w: { vuka: 5 },
    p: [/who are you/i, /what is your name/i, /your name/i, /are you ai/i, /are you a bot/i, /are you human/i],
    a: "I am **Vuka** — the FuturePath AI assistant.\n\n*Vuka* means *rise up* or *wake up* in Zulu and Xhosa. That is exactly what FuturePath is about — helping South African youth rise to their potential.\n\nI am not a human, but I am trained on everything about this platform. Ask me anything about courses, jobs, or your learning journey.",
  },
  {
    id: 'thanks', sample: 'Thank you',
    w: { thanks: 4 },
    a: "You are welcome! Keep going — you are doing great.\n\nAnything else I can help with?",
  },
  {
    id: 'bye', sample: 'Goodbye',
    w: { bye: 4 },
    a: () => {
      const name = _userCtx.name ? `, ${_userCtx.name.split(' ')[0]}` : '';
      return `Hamba kahle${name}! Go well and keep learning. Come back anytime.`;
    },
  },
  {
    id: 'capabilities', sample: 'What can you help me with?',
    w: { capab: 3 },
    p: [/what can you (do|help|answer)/i, /how can you help/i, /what do you know/i],
    a: "I am **Vuka**, and here is what I can help with:\n\n- **Courses** — what is available, how to enroll, levels\n- **Jobs** — how the job board works, applying\n- **Certificates** — how to earn and verify them\n- **CV Builder** — creating your first CV\n- **Study Further** — universities, NSFAS, bursaries\n- **Profile** — adding skills and education\n- **Pricing** — yes, it is all free\n- **GBV Course** — our community safety programme\n- **Mentorship** — connecting with a guide\n\nJust ask in your own words — I understand English, Zulu greetings, and SA slang.",
  },
  {
    id: 'about', sample: 'What is FuturePath?',
    w: { about: 3 },
    p: [/what is futurepath/i, /tell me about futurepath/i, /what does futurepath do/i, /futurepath mission/i],
    a: "**FuturePath** is a free online learning platform built specifically for South African youth.\n\nOur mission is simple: give every young person — regardless of background or circumstances — access to **skills**, **certifications**, and **real job connections**.\n\nWe offer:\n- Structured free courses\n- A live job board\n- Digital certificates\n- A CV builder\n- Mentor support\n- Study further guidance\n\nAll in one place. No fees. Ever.",
  },
  {
    id: 'my_progress', sample: 'How am I doing?',
    w: { progress: 3, dashboard: 1 },
    p: [/how am i doing/i, /my progress/i, /how many courses/i, /my stats/i],
    a: () => {
      const c = _userCtx.coursesInProgress ?? 0;
      const cert = _userCtx.certificatesEarned ?? 0;
      if (c === 0 && cert === 0) {
        return "You have not enrolled in any courses yet — but that is about to change!\n\nHead to the **Courses** page and pick something that matches your interests. All courses are free and you can start immediately.";
      }
      return `Here is your progress snapshot:\n\n- **Courses in progress:** ${c}\n- **Certificates earned:** ${cert}\n\n${cert > 0 ? "Well done on those certificates — they are verifiable and will look great to employers!" : "Keep going — you earn a certificate every time you complete a course!"}\n\nView everything on your **Dashboard**.`;
    },
  },
  {
    id: 'courses_general', sample: 'What courses do you offer?',
    w: { course: 3 },
    p: [/what courses/i, /which courses/i, /list.*courses/i, /available courses/i, /what can i learn/i],
    a: "We currently offer **8 free courses**:\n\n1. **Understanding and Preventing GBV** — Safety and Rights\n2. **Digital Safety and Scam Awareness** — Digital Skills\n3. **Web Development Basics** — Technology\n4. **Digital Marketing Fundamentals** — Marketing\n5. **Financial Literacy and Savings** — Finance\n6. **Modern Agribusiness** — Agriculture\n7. **Community Health Worker Training** — Health\n8. **Starting a Small Business** — Entrepreneurship\n\nAll 8 courses are free and come with a **certificate on completion**. Browse them on the **Courses** page.",
  },
  {
    id: 'courses_free', sample: 'Are the courses free?',
    w: { free: 3, course: 1 },
    p: [/free/i, /cost|price|pay|charge|afford/i, /do i pay/i],
    a: "**Yes — 100% free.**\n\nEvery course, certificate, and feature on FuturePath costs nothing. No hidden fees, no subscriptions, no data collection for profit.\n\nJust create an account and start learning.",
  },
  {
    id: 'enroll', sample: 'How do I enroll in a course?',
    w: { course: 2, register: 1 },
    p: [/how.*(enroll|enrol|start|join|begin).*(course|learn)/i, /enroll|enrol/i, /how do i start/i],
    a: "Enrolling is simple:\n\n1. **Create a free account** or log in\n2. Go to the **Courses** page from your dashboard\n3. Find the course you want\n4. Click **Enroll Free**\n\nYou can enroll in as many courses as you like at no cost. Your progress is saved automatically.",
  },
  {
    id: 'certificates', sample: 'How do I get a certificate?',
    w: { cert: 4 },
    p: [/certif|badge|credential/i, /how.*(earn|get|receive).*(cert|badge)/i, /proof of learning/i],
    a: "Certificates are **automatically issued** when you complete a course.\n\nThey are:\n- **Digital** — saved to your profile instantly\n- **Verifiable** — employers can confirm they are genuine\n- **Downloadable** — PDF format, share anywhere\n- **Free** — always\n\nGo to the **Certificates** page to view and download all your credentials.",
  },
  {
    id: 'jobs', sample: 'How does the job board work?',
    w: { job: 4 },
    p: [/job board/i, /find.*(job|work|employ)/i, /how.*(job|career|employ)/i, /apply for job/i],
    a: "The **FuturePath Job Board** connects you with real, vetted opportunities matched to your skills.\n\nListings come from:\n- NGOs and community organisations\n- Government youth programmes\n- Private employers\n- Remote and hybrid roles\n\nTo use it:\n1. Go to **Job Board** from your dashboard\n2. Browse or filter listings\n3. Click **Apply Now** directly on the platform\n\nThe more courses you complete and skills you add to your profile, the stronger your applications look.",
  },
  {
    id: 'cv_builder', sample: 'How do I use the CV builder?',
    w: { cv: 5 },
    p: [/cv|resume|curriculum vitae/i, /build.*cv|create.*cv|write.*cv/i, /cv builder/i],
    a: "The **CV Builder** helps you create a professional CV in minutes — even if you have never written one before.\n\nHere is how:\n\n1. Go to **CV Builder** in your sidebar\n2. Fill in your personal details, skills, education, and experience\n3. Your FuturePath certificates are automatically included\n4. Download as a **PDF** — ready to send to employers\n\nYour CV is built from your profile, so make sure your skills and education are up to date on your **Profile** page first.",
  },
  {
    id: 'study_further', sample: 'How can I study further?',
    w: { study: 5 },
    p: [/study further/i, /university|college|postgrad/i, /nsfas|bursary|scholarship/i, /upgrade.*qualification/i, /higher education/i],
    a: "The **Study Further** section guides you on pathways beyond FuturePath.\n\nIt covers:\n- **Universities and TVET colleges** that accept FuturePath certificates\n- **NSFAS applications** — step-by-step guidance\n- **Bursaries and scholarships** for South African youth\n- **Short courses and learnerships** from partner institutions\n\nGo to **Study Further** in your sidebar to explore all options.\n\nCompleting FuturePath courses strengthens your application profile for further studies.",
  },
  {
    id: 'profile_skills', sample: 'How do I add my skills?',
    w: { skills: 4, profile: 2 },
    p: [/add.*skill|my skill|update.*skill/i, /profile.*skill|skill.*profile/i],
    a: "You can add your skills directly on your **Profile** page:\n\n1. Go to **Profile** in your sidebar\n2. Scroll to the **Skills** section\n3. Click **Add Skill**\n4. Pick from suggestions or type a custom skill\n5. Set your proficiency level with the slider\n\nYour skills are saved to your profile and used to match you with relevant jobs on the job board.",
  },
  {
    id: 'profile_edit', sample: 'How do I update my profile?',
    w: { profile: 4 },
    p: [/update.*profile|edit.*profile|change.*detail/i, /my profile/i, /profile page/i],
    a: "To update your profile:\n\n1. Go to **Profile** in the sidebar\n2. Click **Edit Profile** at the top right\n3. A drawer slides open where you can update:\n   - Your name, email, phone\n   - Province and city\n   - Profile photo\n   - SA ID number (auto-fills age and gender)\n4. Click **Save Changes**\n\nYou can also add **Skills** and **Education** directly on the profile page.",
  },
  {
    id: 'dark_mode', sample: 'How do I turn on dark mode?',
    w: { dark: 5 },
    p: [/dark mode|light mode|theme|appearance/i, /change.*theme|switch.*theme/i],
    a: "You can toggle between **light and dark mode** from the sidebar.\n\nAt the bottom of the sidebar, there is a **Dark Mode** toggle. Click it and the interface switches instantly — your preference is saved.",
  },
  {
    id: 'notifications', sample: 'How do notifications work?',
    w: { notify: 4 },
    p: [/notification|bell|alert|update/i],
    a: "The **notification bell** in the sidebar keeps you updated on:\n\n- New course recommendations\n- Job listings that match your skills\n- Certificate milestones\n- Platform announcements\n\nClick the bell icon to see all your notifications.",
  },
  {
    id: 'mentor', sample: 'How does mentorship work?',
    w: { mentor: 4 },
    p: [/mentor|coach|guid/i, /how.*(connect|find).*(mentor|coach)/i],
    a: "**Mentor Support** connects you with experienced professionals who guide your learning journey.\n\nMentors help with:\n- Career advice and direction\n- Understanding course content\n- Real industry insights\n- Job application preparation\n\nYou can connect with a mentor from your **Dashboard** once you are enrolled in a course.",
  },
  {
    id: 'register', sample: 'How do I create an account?',
    w: { register: 4 },
    p: [/register|sign.?up|create.*(account|profile)/i, /how.*(join|start|get started)/i, /new (account|user)/i],
    a: "Creating an account takes under a minute:\n\n1. Click **Sign In** in the navbar\n2. Switch to **Sign Up**\n3. Enter your name, email, phone, ID number, and location\n4. Set a password\n5. Click **Create Account**\n\nThat is it. No payment needed — it is completely free.",
  },
  {
    id: 'login', sample: 'How do I log in?',
    w: { login: 4 },
    p: [/log.?in|sign.?in/i, /how.*(access|open).*(account|dashboard)/i, /forgot.*password|reset.*password/i],
    a: "To log in:\n\n1. Click **Sign In** in the navbar\n2. Enter your email and password\n3. You land straight on your **Dashboard**\n\nForgot your password? Click the **Forgot password?** link on the login screen and we will send a reset link to your email.",
  },
  {
    id: 'gbv_course', sample: 'Tell me about the GBV course',
    w: { gbv: 4 },
    p: [/gbv|gender.?based|gender violence/i, /abuse|safety.*rights|violence.*women|femicide/i],
    a: "Our **Understanding and Preventing GBV** course is one of the most important we offer.\n\nIt covers:\n- Recognising the forms of gender-based violence\n- Knowing your legal rights under South African law\n- How to access support and report incidents safely\n- Becoming a community advocate for change\n\n**Instructor:** Dr. Nandi Dlamini\n**Duration:** 7 hours · 20 lessons · Free certificate\n**Level:** Beginner — open to everyone\n\n---\n**Need help right now?**\nGBV Command Centre: **0800 428 428** (24/7, free, confidential)",
  },
  {
    id: 'cyber_course', sample: 'Tell me about the Digital Safety course',
    w: { cyber: 5 },
    p: [/digital safety|scam awareness|cyber|phishing|sim swap|fraud/i, /protect.*online|online.*safe/i, /scam/i],
    a: "Our **Digital Safety and Scam Awareness** course is built specifically for South Africa, where scams are rising fast.\n\nYou will learn how to protect yourself from:\n- **SIM swap fraud** — one of the fastest growing crimes in SA banking\n- **Phishing** — fake emails, SMS and WhatsApp messages\n- **Banking app scams** — vishing calls pretending to be your bank\n- **Social media impersonation** — fake profiles stealing your identity\n- **Online shopping fraud** — fake stores and payment scams\n\nThe course also covers **what to do if you have been scammed** — who to call, how to report it, how to recover.\n\n**Instructor:** Themba Nkosi\n**Duration:** 6 hours · 18 lessons · Free certificate\n**Level:** Beginner — no tech knowledge needed",
  },
  {
    id: 'bursaries', sample: 'Tell me about bursaries',
    w: { bursary: 5 },
    p: [/bursary|bursaries|scholarship|nsfas|financial aid|funding|sponsorship/i, /how do i apply.*fund/i, /who.*pay.*studies/i],
    a: "FuturePath lists real South African bursaries you can apply for:\n\n- **NSFAS** — government bursary covering full tuition and living allowances for eligible students at public universities and TVET colleges\n- **Sasol Bursary** — for engineering, science and IT students\n- **Anglo American Bursary** — mining, engineering and geology\n- **Investec Bursary** — finance, commerce and IT\n- **Standard Bank Bursary** — finance, IT and commerce\n- **Nedbank Bursary** — finance, accounting and IT with vacation work\n- **Eskom Bursary** — engineering, IT and finance\n- **Department of Health Bursary** — medicine, nursing and pharmacy\n\nAll bursaries are listed on the **Study Further** page with details and application links.\n\nCompleting FuturePath courses strengthens your bursary application significantly.",
  },
  {
    id: 'privacy', sample: 'Is my data safe?',
    w: { privacy: 4 },
    p: [/data|privacy|safe|secure|personal info|confidential/i],
    a: "Your privacy is taken seriously at FuturePath.\n\n- We only collect what is needed to run your account\n- Your data is never sold to third parties\n- All data is encrypted and stored securely\n- You control what appears on your public profile\n\nFor full details, see our **Privacy Policy** in the footer.",
  },
  {
    id: 'mobile', sample: 'Can I use FuturePath on my phone?',
    w: { mobile: 3 },
    p: [/phone|mobile|android|iphone|data|load/i],
    a: "Yes, FuturePath is fully mobile-friendly.\n\nTo save it to your home screen (works offline for some content):\n\n- **Android (Chrome):** Tap the three dots → **Add to Home screen**\n- **iPhone (Safari):** Tap Share → **Add to Home Screen**\n\nWe also try to keep pages lightweight to use as little data as possible.",
  },
  {
    id: 'contact', sample: 'How do I contact support?',
    w: { contact: 3 },
    p: [/contact|reach|support|help desk|email us/i],
    a: "You can reach the FuturePath team via:\n\n- The **Contact** page in the footer\n- The contact form on the site\n\nWe aim to respond within **1 to 2 business days**. For urgent matters, include the word *Urgent* in your message subject.",
  },
  {
    id: 'dashboard', sample: 'What is on my dashboard?',
    w: { dashboard: 3 },
    p: [/dashboard|home page|my page/i, /what is on.*dashboard/i],
    a: "Your **Dashboard** is your personal command centre on FuturePath:\n\n- **Stats** — courses in progress, certificates earned, jobs applied\n- **Active Courses** — your current progress\n- **Job Matches** — opportunities matched to your profile\n- **Word of the Day** — a daily quote to keep you motivated\n\nEverything updates in real time as you learn and apply.",
  },
  {
    id: 'frustrated', sample: '',
    w: {},
    p: [/not (helpful|right|what i|working)/i, /you (dont|do not|never) (understand|get)/i, /wrong answer|useless/i],
    a: "I am sorry about that — let me try again.\n\nMaybe try asking something like:\n- *What courses are available?*\n- *How do I build a CV?*\n- *Tell me about the GBV course*\n\nOr describe what you are trying to do in your own words.",
  },
];

const OUT_OF_SCOPE = [
  /sport|soccer|football|cricket|rugby/i,
  /celebrity|music|movie|film|song/i,
  /weather|news|politic/i,
  /recipe|food|cook/i,
  /joke|funny/i,
  /girlfriend|boyfriend|relationship|love|dating/i,
];

const SOCIAL = new Set(['greeting', 'thanks', 'bye', 'frustrated']);

/* ── 5. SCORING ─────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function scoreClause(clause: string, _ctx: { last: string | null }) {
  const an = analyse(clause);
  const ranked: { it: Intent; s: number }[] = [];
  INTENTS.forEach((it) => {
    let s = 0;
    Object.keys(it.w).forEach((c) => { if (an.concepts.has(c)) s += it.w[c]; });
    (it.p || []).forEach((re) => { if (re.test(clause)) s += (it.pw || 4); });
    if (s > 0) ranked.push({ it, s });
  });
  ranked.sort((a, b) => b.s - a.s);
  return { ranked, content: an.content };
}

function splitClauses(t: string): string[] {
  return t.split(/[?.!;,\n]+|\b(?:and also|and then|also|then|plus|and)\b/i)
    .map((x) => x.trim()).filter((x) => x.length > 1);
}

/* ── 6. MAIN REPLY ──────────────────────────────────────────── */
const _ctx = { last: null as string | null };

export function getReply(input: string): ChatResponse {
  const raw = String(input || '').trim().slice(0, 500);
  if (!raw) return { text: "Type a question and I will help.", chips: DEFAULT_CHIPS };

  const clauses = splitClauses(normText(raw));
  const scored = clauses.map((c) => scoreClause(c, _ctx));

  let picks: { it: Intent; s: number }[] = [];
  const alts: Intent[] = [];

  scored.forEach((sc) => {
    const top = sc.ranked[0], second = sc.ranked[1];
    if (top && top.s >= 3) {
      if (!picks.some((p) => p.it.id === top.it.id)) picks.push({ it: top.it, s: top.s });
      if (second && second.s >= top.s * 0.85 && second.it.id !== top.it.id) alts.push(second.it);
    }
  });

  if (!picks.length) {
    const whole = scoreClause(normText(raw), _ctx);
    if (whole.ranked[0] && whole.ranked[0].s >= 3) picks.push({ it: whole.ranked[0].it, s: whole.ranked[0].s });
  }

  const real = picks.filter((p) => !SOCIAL.has(p.it.id));
  if (real.length) picks = real;

  if (picks.length) {
    picks = picks.slice(0, 2);
    const body = picks.map((p) => typeof p.it.a === 'function' ? p.it.a() : p.it.a).join('\n\n');
    _ctx.last = picks[0].it.id;
    const chips = alts
      .filter((a) => !picks.some((p) => p.it.id === a.id) && a.sample)
      .slice(0, 3)
      .map((a) => a.sample);
    return { text: body, chips };
  }

  const weak = scored.flatMap((s) => s.ranked).sort((a, b) => b.s - a.s);
  if (weak[0] && weak[0].s >= 1.5 && !SOCIAL.has(weak[0].it.id) && !OUT_OF_SCOPE.some((re) => re.test(raw))) {
    const guesses = Array.from(new Set(weak.filter((w) => w.it.sample).map((w) => w.it.sample))).slice(0, 3);
    return { text: "I am not quite sure what you mean. Did you want to know about one of these?", chips: guesses };
  }

  if (OUT_OF_SCOPE.some((re) => re.test(raw))) {
    return { text: "I can only help with FuturePath topics — courses, jobs, certificates, CV building, and more. Anything along those lines?", chips: DEFAULT_CHIPS };
  }

  return { text: "I did not quite catch that. Try asking about our **courses**, **job board**, **CV builder**, or **certificates**.", chips: DEFAULT_CHIPS };
}
