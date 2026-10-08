/* ================================================================
   FUTUREPATH AI ASSISTANT — NLU ENGINE  (chatEngine.ts)
   Runs fully in the browser. No API keys, no server.
   ================================================================ */

/* ── 1. LEXICON ─────────────────────────────────────────────── */
const LEX: Record<string, string> = {
  greet:     'hi hello hey howzit heita sawubona molo sup morning afternoon evening',
  thanks:    'thanks thank thx ty appreciated cheers',
  bye:       'bye goodbye cya later goodnight',
  capab:     'help assist what can do',
  course:    'course courses learn learning lesson lessons module modules study studying enroll enrolment programme programs',
  job:       'job jobs work career employment hire hiring vacancy vacancies opportunity opportunities listing listings employer employers',
  cert:      'certificate certificates badge badges credential credentials verify verified proof achievement',
  mentor:    'mentor mentors mentorship coach coaching guide guidance support advisor connect',
  dashboard: 'dashboard home profile account page',
  register:  'register signup sign create account join start begin',
  login:     'login log sign in access',
  free:      'free cost price pay payment charge money',
  gbv:       'gbv gender violence abuse safety rights women',
  tech:      'technology tech programming coding web development html css javascript',
  marketing: 'marketing digital social media seo ads advertising',
  finance:   'finance financial literacy money budget saving investing',
  agri:      'agriculture farming agribusiness crops',
  health:    'health healthcare community nurse medical',
  entrepren: 'entrepreneurship business startup small',
  neg:       'cant cannot wont doesnt dont isnt arent not no unable never',
  privacy:   'privacy safe secure data protect confidential personal information',
  mobile:    'phone mobile app android iphone ios',
  contact:   'contact email reach us support',
  about:     'about futurepath mission vision who',
};

const SLANG: Record<string, string> = {
  wat: 'what', wht: 'what', hw: 'how', u: 'you', ur: 'your', r: 'are',
  pls: 'please', plz: 'please', abt: 'about', wen: 'when', wer: 'where',
  hows: 'how', gud: 'good', wats: 'whats', gonna: 'going to', wanna: 'want to',
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
    return SLANG[bare] ? w.replace(bare, SLANG[bare]) : w;
  }).join(' ');
}

function analyse(text: string): { concepts: Set<string>; content: number } {
  const t = text.toLowerCase().replace(/[^a-z0-9'\s]/g, ' ').replace(/'/g, '');
  const concepts = new Set<string>();
  let content = 0;
  t.split(/\s+/).filter(Boolean).forEach((raw) => {
    const tok = SLANG[raw] || raw;
    if (!STOP.has(tok) && !/^\d+$/.test(tok)) content++;
    let s = stem(tok);
    let hit = STEM_MAP[s];
    if (!hit) { const fix = spellFix(s); if (fix) hit = STEM_MAP[fix]; }
    if (hit) hit.forEach((c) => concepts.add(c));
  });
  return { concepts, content };
}

/* ── 3. INTENTS ─────────────────────────────────────────────── */
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
  'How do I find a job?',
  'Are the courses free?',
  'How do I get a certificate?',
];

const INTENTS: Intent[] = [
  {
    id: 'greeting', sample: 'Hello',
    w: { greet: 4 },
    a: "Hi, I am the FuturePath assistant.\n\nI can help you with courses, job opportunities, certificates, mentorship, and anything else about the platform.\n\nWhat would you like to know?",
  },
  {
    id: 'thanks', sample: 'Thanks',
    w: { thanks: 4 },
    a: "You are welcome. Feel free to ask anything else.",
  },
  {
    id: 'bye', sample: 'Goodbye',
    w: { bye: 4 },
    a: "Good luck on your journey. Come back anytime.",
  },
  {
    id: 'capabilities', sample: 'What can you help me with?',
    w: { capab: 3 },
    p: [/what can you (do|help|answer)/i, /how can you help/i],
    a: "I am the **FuturePath assistant**. Here is what I can help with:\n\n- **Courses** — what is available, how to enroll, levels\n- **Jobs** — how the job board works, finding opportunities\n- **Certificates** — how you earn and verify them\n- **Mentorship** — how to connect with a mentor\n- **Pricing** — yes, everything is free\n- **Account** — registering, logging in, your profile\n- **GBV course** — our community safety offering\n\nJust ask in your own words.",
  },
  {
    id: 'about', sample: 'What is FuturePath?',
    w: { about: 3 },
    p: [/what is futurepath/i, /tell me about futurepath/i, /what does futurepath do/i],
    a: "**FuturePath** is a free online learning platform built for South African youth.\n\nOur mission is to give young people the **skills**, **certifications**, and **job connections** they need to build a career, no matter their background.\n\nWe offer structured courses, a live job board, digital certificates, and mentor support, all in one place.",
  },
  {
    id: 'courses_general', sample: 'What courses do you offer?',
    w: { course: 3 },
    p: [/what courses/i, /which courses/i, /list.*courses/i, /available courses/i],
    a: "We currently offer **7 courses**:\n\n1. **Understanding and Preventing GBV** — Safety and Rights\n2. **Web Development Basics** — Technology\n3. **Digital Marketing Fundamentals** — Marketing\n4. **Financial Literacy and Savings** — Finance\n5. **Modern Agribusiness** — Agriculture\n6. **Community Health Worker Training** — Health\n7. **Starting a Small Business** — Entrepreneurship\n\nAll courses are **free** and come with a certificate on completion.",
  },
  {
    id: 'courses_free', sample: 'Are the courses free?',
    w: { free: 3, course: 1 },
    p: [/free/i, /cost|price|pay|charge/i],
    a: "Yes, **all courses on FuturePath are completely free.**\n\nNo hidden fees, no subscriptions. Just create an account and start learning.",
  },
  {
    id: 'enroll', sample: 'How do I enroll in a course?',
    w: { course: 2, register: 1 },
    p: [/how.*(enroll|enrol|start|join|begin).*(course|learn)/i, /enroll|enrol/i],
    a: "Enrolling is simple:\n\n1. **Create a free account**, or log in if you already have one\n2. Go to the **Courses** page\n3. Find the course you want\n4. Click **Enroll Free**\n\nYou can enroll in as many courses as you like at no cost.",
  },
  {
    id: 'certificates', sample: 'How do I get a certificate?',
    w: { cert: 4 },
    p: [/certif|badge|credential/i, /how.*(earn|get|receive).*(cert|badge)/i],
    a: "Certificates are **automatically issued** when you complete a course.\n\nThey are:\n- **Digital** — saved to your profile\n- **Verifiable** — employers can confirm they are real\n- **Free** — no charge ever\n\nHead to the **Certificates** page to view and download all your earned credentials.",
  },
  {
    id: 'jobs', sample: 'How does the job board work?',
    w: { job: 4 },
    p: [/job board/i, /find.*(job|work|employ)/i, /how.*(job|career|employ)/i],
    a: "The **FuturePath Job Board** connects you with real opportunities matched to your skills.\n\nListings come from:\n- NGOs\n- Government programmes\n- Private employers\n\nTo access it:\n1. Go to the **Jobs** page from your dashboard\n2. Browse or search listings\n3. Apply directly through the platform\n\nThe more courses you complete, the better your profile looks to employers.",
  },
  {
    id: 'mentor', sample: 'How does mentorship work?',
    w: { mentor: 4 },
    p: [/mentor|coach|guid/i, /how.*(connect|find).*(mentor|coach)/i],
    a: "**Mentor Support** connects you with experienced professionals who guide you through your learning journey.\n\nMentors can help with:\n- Career advice\n- Understanding course content\n- Real-world industry insights\n\nYou can connect with a mentor from your **Dashboard** once you are enrolled.",
  },
  {
    id: 'register', sample: 'How do I create an account?',
    w: { register: 4 },
    p: [/register|sign.?up|create.*(account|profile)/i, /how.*(join|start|get started)/i, /new (account|user)/i],
    a: "Getting started is easy:\n\n1. Click **Get Started** or go to **/auth/register**\n2. Enter your name, email and a password\n3. You are in — start exploring courses immediately\n\nNo payment details needed. It is 100% free.",
  },
  {
    id: 'login', sample: 'How do I log in?',
    w: { login: 4 },
    p: [/log.?in|sign.?in/i, /how.*(access|open).*(account|profile|dashboard)/i],
    a: "To log in:\n\n1. Go to **/auth/login**\n2. Enter your email and password\n3. You will land on your **Dashboard**\n\nForgot your password? Use the reset link on the login page.",
  },
  {
    id: 'gbv_course', sample: 'Tell me about the GBV course',
    w: { gbv: 4 },
    p: [/gbv|gender.?based|gender violence/i, /abuse|safety.*rights|violence.*women/i],
    a: "Our **Understanding and Preventing GBV** course is one of the most important we offer, especially here in South Africa.\n\nIt covers:\n- Recognising gender-based violence\n- Knowing your legal rights\n- How to access support and report incidents\n- Becoming a community advocate for change\n\n**Instructor:** Dr. Nandi Dlamini\n**Duration:** 7 hours, 20 lessons\n**Level:** Beginner\n**Cost:** Free\n\nIf you or someone you know needs immediate help, contact the **GBV Command Centre: 0800 428 428** (24/7, free).",
  },
  {
    id: 'privacy', sample: 'Is my data safe?',
    w: { privacy: 4 },
    p: [/data|privacy|safe|secure|personal info/i],
    a: "Your privacy matters to us.\n\n- We only collect what is needed to run your account\n- Your data is never sold to third parties\n- Certificates are verifiable but only share what you choose to share\n\nFor full details, see our **Privacy Policy** in the footer.",
  },
  {
    id: 'mobile', sample: 'Can I use FuturePath on my phone?',
    w: { mobile: 3 },
    p: [/phone|mobile|android|iphone/i],
    a: "Yes, FuturePath works great on mobile.\n\nOpen it in your browser and add it to your home screen:\n\n- **Android (Chrome):** Menu, then Add to Home screen\n- **iPhone (Safari):** Share, then Add to Home Screen",
  },
  {
    id: 'contact', sample: 'How do I contact support?',
    w: { contact: 3 },
    p: [/contact|reach|support|help desk|email/i],
    a: "For support or questions:\n\n- Use the **Contact** page in the footer\n- Email us directly from the contact form\n\nWe aim to respond within 1 to 2 business days.",
  },
  {
    id: 'dashboard', sample: 'What is on my dashboard?',
    w: { dashboard: 3 },
    p: [/dashboard|home page|my page/i],
    a: "Your **Dashboard** is your personal home on FuturePath. From there you can:\n\n- See your enrolled courses and progress\n- View your earned certificates\n- Browse the job board\n- Connect with mentors\n- Update your profile\n\nLog in or register to access it.",
  },
  {
    id: 'frustrated', sample: '',
    w: {},
    p: [/not (helpful|right|what i|working)/i, /you (dont|do not|never) (understand|get)/i, /wrong answer/i],
    a: "Sorry about that. Try asking something like:\n- What courses are free?\n- How do I get a certificate?\n- Tell me about the GBV course",
  },
];

const OUT_OF_SCOPE = [
  /sport|soccer|football|cricket|rugby/i,
  /celebrity|music|movie|film|song/i,
  /weather|news|politic/i,
  /recipe|food|cook/i,
  /joke|funny/i,
];

const SOCIAL = new Set(['greeting', 'thanks', 'bye', 'frustrated']);

/* ── 4. SCORING ─────────────────────────────────────────────── */
function scoreClause(clause: string, ctx: { last: string | null }) {
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

/* ── 5. MAIN REPLY FUNCTION ─────────────────────────────────── */
const ctx = { last: null as string | null };

export function getReply(input: string): ChatResponse {
  const raw = String(input || '').trim().slice(0, 500);
  if (!raw) return { text: "Type a question and I will help.", chips: DEFAULT_CHIPS };

  const clauses = splitClauses(normText(raw));
  const scored = clauses.map((c) => scoreClause(c, ctx));

  let picks: { it: Intent; s: number }[] = [];
  let alts: Intent[] = [];

  scored.forEach((sc) => {
    const top = sc.ranked[0], second = sc.ranked[1];
    if (top && top.s >= 3) {
      if (!picks.some((p) => p.it.id === top.it.id)) picks.push({ it: top.it, s: top.s });
      if (second && second.s >= top.s * 0.85 && second.it.id !== top.it.id) alts.push(second.it);
    }
  });

  if (!picks.length) {
    const whole = scoreClause(normText(raw), ctx);
    if (whole.ranked[0] && whole.ranked[0].s >= 3) picks.push({ it: whole.ranked[0].it, s: whole.ranked[0].s });
  }

  const real = picks.filter((p) => !SOCIAL.has(p.it.id));
  if (real.length) picks = real;

  if (picks.length) {
    picks = picks.slice(0, 2);
    const body = picks.map((p) => typeof p.it.a === 'function' ? p.it.a() : p.it.a).join('\n\n');
    ctx.last = picks[0].it.id;
    const chips = alts
      .filter((a) => !picks.some((p) => p.it.id === a.id) && a.sample)
      .slice(0, 3)
      .map((a) => a.sample);
    return { text: body, chips };
  }

  const weak = scored.flatMap((s) => s.ranked).sort((a, b) => b.s - a.s);
  if (weak[0] && weak[0].s >= 1.5 && !SOCIAL.has(weak[0].it.id) && !OUT_OF_SCOPE.some((re) => re.test(raw))) {
    const guesses = [...new Set(weak.filter((w) => w.it.sample).map((w) => w.it.sample))].slice(0, 3);
    return { text: "I am not quite sure what you mean. Did you want one of these?", chips: guesses };
  }

  if (OUT_OF_SCOPE.some((re) => re.test(raw))) {
    return { text: "I can only help with FuturePath — courses, jobs, certificates, and mentorship. Anything along those lines?", chips: DEFAULT_CHIPS };
  }

  return { text: "I did not quite catch that. Try asking about our **courses**, **job board**, **certificates**, or **mentorship**.", chips: DEFAULT_CHIPS };
}
