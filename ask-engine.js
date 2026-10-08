/* ================================================================
   GCC IT ASSISTANT — NLU ENGINE  (ask-engine.js)
   Runs fully in the browser. No API keys, no server.

   Pipeline for every message:
     1. Pull out an ID/passport number (if any) and look the student up
     2. Extract entities  → year, course, group, DP number, subject
     3. Split into clauses ("marks and timetable" = 2 questions)
     4. Normalise → slang fix → stem → spell-correct → concepts
     5. Score every intent (weighted concepts + phrase patterns)
     6. Confident → answer   |  Unsure → answer + "did you mean"
        Nothing   → suggestions
     7. Remember context so follow-ups work ("and for 2nd year?")

   To teach it something new: add a word to LEX and/or an entry in INTENTS.
   ================================================================ */
(function (root) {
'use strict';

/* ---------------- 1. LEXICON: concept → words ---------------- */
const LEX = {
  self:     'my me mine myself',
  neg:      'cant cannot cannt wont doesnt dont isnt arent didnt not no unable never without',
  greet:    'hi hello hey howzit heita sawubona molo yo sup morning afternoon evening',
  thanks:   'thanks thank thx ty appreciated cheers',
  bye:      'bye goodbye cya later goodnight',
  capab:    'help assist',
  define:   'mean meaning define definition stand explain',
  find:     'find search lookup look locate detail info information profile record portal hub access open check see view',
  qr:       'qr barcode scan scanner code',
  digital:  'digital',
  result:   'result mark score grade percentage percent points outcome',
  dp:       'dp',
  pending:  'pending released release captured waiting written publish',
  timetable:'timetable schedule lectures periods calendar',
  course:   'course programme subject study studying qualification offered offer department module',
  group:    'group groups',
  year:     'year yr',
  nqf:      'nqf framework matric',
  lecturer: 'lecturer teacher owami mr sir instructor teach teaches',
  id:       'id passport identity',
  notfound: 'invalid error missing nothing blank notfound',
  error:    'wrong incorrect mistake fix correct change update edit misspelled misspelt typo',
  privacy:  'safe secure privacy private security protect confidential leak',
  mobile:   'phone mobile android iphone ios app install homescreen',
  contact:  'contact email office visit reach call address campus',
  brelinx:  'brelinx',
  admin:    'admin administrator dashboard',
  count:    'enrolled headcount',
  insult:   'stupid dumb useless rubbish trash terrible idiot garbage hopeless silly',
  pass:     'pass passed passing fail failed failing'
};

// slang / SMS spellings → real word
const SLANG = { wat:'what', wht:'what', hw:'how', hou:'how', ma:'my', mi:'my', u:'you', ur:'your',
  r:'are', pls:'please', plz:'please', abt:'about', wen:'when', wer:'where', mrks:'marks',
  mks:'marks', tt:'timetable', tmtbl:'timetable', reslts:'results', rslt:'result', dets:'details',
  info:'info', stud:'student', wats:'whats', hows:'how', txt:'text', ppl:'people', gud:'good' };

// everyday words that must never be "spell-corrected" into domain words
const COMMON = new Set(('make made take name need want like will with that this then than them they what when where which ' +
  'who why how have has had been from your about after also some just more most much many other into over only both each ' +
  'same show tell give know keep here there does done gone come came went able good best time times date dates week today ' +
  'tomorrow please could would should might shall late early first second third last next').split(' '));

const STOP = new Set(('the a an is are was were be to of in on for and or it its do does did can could you your please ' +
  'this that these those there here at by with as from so if but about just me my i we us am').split(' '));

/* ---------------- 2. TEXT UTILITIES ---------------- */
function stem(w) {
  if (w.length <= 3) return w;
  return w.replace(/(ingly|edly|ing|ed|ly|es|s)$/, '') || w;
}

// optimal-string-alignment edit distance (handles swaps: "timetalbe")
function osa(a, b) {
  const d = [];
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

// stem → [concepts]
const STEM_MAP = {};
const VOCAB = [];                       // stems used for spell-correction
Object.keys(LEX).forEach(function (concept) {
  LEX[concept].split(' ').forEach(function (word) {
    const s = stem(word);
    (STEM_MAP[s] = STEM_MAP[s] || []).push(concept);
    if (VOCAB.indexOf(s) < 0) VOCAB.push(s);
  });
});

function spellFix(tok) {
  if (tok.length < 5 || COMMON.has(tok)) return null;
  const limit = tok.length >= 8 ? 2 : 1;
  let best = null, bestD = 99;
  for (let i = 0; i < VOCAB.length; i++) {
    const v = VOCAB[i];
    if (v[0] !== tok[0] || Math.abs(v.length - tok.length) > 2 || v.length < 4) continue;
    const dist = osa(tok, v);
    if (dist <= limit && dist < bestD) { best = v; bestD = dist; }
  }
  return best;
}

function normText(t) {
  return t.toLowerCase().replace(/[’`]/g, "'").split(/\s+/).map(function (w) {
    const bare = w.replace(/[^a-z0-9']/g, '');
    return SLANG[bare] ? w.replace(bare, SLANG[bare]) : w;
  }).join(' ');
}

// text → { concepts:Set, content:number }
function analyse(text) {
  const t = text.toLowerCase().replace(/[’`]/g, "'")
    .replace(/\b(dp|nqf|group)\s?-?\d\b/g, '$1')         // dp1 → dp, nqf4 → nqf
    .replace(/[^a-z0-9'\s]/g, ' ').replace(/'/g, '');
  const concepts = new Set();
  let content = 0;
  t.split(/\s+/).filter(Boolean).forEach(function (raw) {
    const tok = SLANG[raw] || raw;
    if (!STOP.has(tok) && !/^\d+$/.test(tok)) content++;
    let s = stem(tok);
    let hit = STEM_MAP[s];
    if (!hit) { const fix = spellFix(s); if (fix) hit = STEM_MAP[fix]; }
    if (hit) hit.forEach(function (c) { concepts.add(c); });
  });
  return { concepts: concepts, content: content };
}

/* ---------------- 3. ENTITIES ---------------- */
function extractEntities(t) {
  t = t.toLowerCase();
  const e = {};
  const y1 = /\b(1st|first|year\s?(1|one)|nqf\s?4|level\s?4)\b/.test(t);
  const y2 = /\b(2nd|second|year\s?(2|two)|nqf\s?5|level\s?5)\b/.test(t);
  if (y1 && !y2) e.year = 1;
  if (y2 && !y1) e.year = 2;

  if (/system'?s?\s*dev|\bsd\b|software\s*dev|it system/.test(t)) e.course = 'sd';
  else if (/tech(nical)?\s*support|\bts\b|\bsupport course/.test(t)) e.course = 'ts';
  else if (/graphic|\bgd\b/.test(t)) e.course = 'gd';
  else if (/end\s*-?user/.test(t)) e.course = 'eu';
  else if (/multimedia|\bimd\b/.test(t)) e.course = 'imd';

  const g = t.match(/group\s?-?([123])/);
  if (g) e.group = 'Group ' + g[1];
  if (/end\s*-?user/.test(t)) e.group = 'End User';

  const dp = t.match(/\bdp\s?-?([123])\b/);
  if (dp) e.dp = +dp[1];

  if (/advanced\s*prog|programming\s*(ii|2)\b|\bap\s?(ii|2)\b/.test(t)) e.subject = 'Advanced Programming II';
  else if (/programming/.test(t)) e.subject = 'Introduction to Programming';
  else if (/database|dbms/.test(t)) e.subject = 'Introduction to Database Management Systems';
  else if (/\bweb\b/.test(t)) e.subject = 'Web Development';
  return e;
}

/* ---------------- 4. DOMAIN FACTS (mirror app.js — keep in sync) ---------------- */
const COURSE_NAME = { sd:'Systems Development', ts:'Technical Support', gd:'Graphic Design',
                      eu:'End User Computing', imd:'Interactive Multimedia Design' };

function courseKey(str) {
  const c = (str || '').toLowerCase();
  if (c.includes('system')) return 'sd';
  if (c.includes('technical support')) return 'ts';
  if (c.includes('graphic')) return 'gd';
  if (c.includes('end user')) return 'eu';
  if (c.includes('multimedia')) return 'imd';
  return null;
}

function subjectsFor(year, key) {
  if (year === 1) {
    if (key === 'sd') return ['Introduction to Programming'];
    if (key === 'ts' || key === 'gd') return ['Introduction to Database Management Systems'];
    return [];
  }
  if (year === 2) {
    if (key === 'sd') return ['Web Development', 'Advanced Programming II'];
    if (key === 'imd') return ['Web Development'];
  }
  return [];
}

function timetableFor(year, group, key) {
  if (year === 1) {
    if (!group && key === 'ts') group = 'Group 3';
    if (!group && key === 'gd') group = 'Group 3';
    if (!group && key === 'eu') group = 'End User';
    if (group === 'Group 1') return '../docs/SYTEMS DEVELOPMENT 1ST YEAR GROUP 1.pdf';
    if (group === 'Group 2') return '../docs/SYTEMS DEVELOPMENT 1ST YEAR GROUP 2.pdf';
    if (group === 'Group 3') return key === 'gd' ? '../docs/GRAPHIC DESIGN 1ST YEAR.pdf' : '../docs/TECHNICAL SUPPORT 1ST YEAR GROUP 3.pdf';
    if (group === 'End User') return '../docs/END USER 1ST YEAR .pdf';
  }
  if (year === 2) {
    if (key === 'sd') return '../docs/2ND YEAR SYSTEM DEVELOPMENT TIMETABLE.pdf';
    if (key === 'imd') return '../docs/2ND YEAR INTERACTIVE MULTIMEDIA DESIGN TIMETABLE.pdf';
  }
  return null;
}

function titleCase(s) { return (s || '').toLowerCase().replace(/\b\w/g, function (m) { return m.toUpperCase(); }); }
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }
function yearLabel(y) { return y === 2 ? '2nd Year (NQF5)' : '1st Year (NQF4)'; }

function collectResults(s, allowed) {
  const res = s.results || {}, out = {};
  const allow = allowed.map(function (a) { return a.toLowerCase(); });
  const keys = Object.keys(res);
  const hasDp = keys.some(function (k) { return /^DP\d+\s*—/i.test(k); });
  if (hasDp) {
    keys.forEach(function (k) {
      const m = k.match(/^(DP\d+)\s*—\s*(.+)$/i);
      if (!m || allow.indexOf(m[2].trim().toLowerCase()) < 0) return;
      (out[m[1].toUpperCase()] = out[m[1].toUpperCase()] || []).push({ subject: titleCase(m[2].trim()).replace(' Ii', ' II').replace(' To ', ' to ').replace(' Of ', ' of '), val: res[k] });
    });
  } else {
    allowed.forEach(function (a) { if (a in res) (out.DP1 = out.DP1 || []).push({ subject: a, val: res[a] }); });
  }
  return out;
}

const fmtMark = function (v) { return typeof v === 'number' ? v + '%' : (v || 'Not yet resulted'); };

/* ---------------- 5. ANSWERS ---------------- */
const ASK_ID = "To look you up, just type your **ID or passport number** in this chat. I match it exactly the way the Home page search does, and I only show the record that matches.";

function marksAnswer(E, ctx) {
  const s = ctx.student;
  if (!s) return "I can show your marks. " + ASK_ID + "\n\nOr use the search box on the **Home page**.";
  const key = courseKey(s.course);
  const subj = subjectsFor(s.year, key);
  if (!subj.length) return "Mr Owami doesn't capture results for **" + esc(s.course) + "**, so nothing is shown for you on the Hub. Your marks for that programme come from your own lecturers or the college results system.";
  const rows = collectResults(s, subj);
  let dps = Object.keys(rows).sort();
  if (E.dp) dps = dps.filter(function (d) { return d === 'DP' + E.dp; });
  if (!dps.length) return "There are no results captured for you yet" + (E.dp ? " for **DP" + E.dp + "**" : "") + ". Once Mr Owami captures them they'll appear here and on your student card.";
  const body = dps.map(function (dp) {
    return '**' + dp + '**\n' + rows[dp].map(function (r) { return '- ' + esc(r.subject) + ': **' + esc(fmtMark(r.val)) + '**'; }).join('\n');
  }).join('\n\n');
  return "Here are your results, **" + esc(titleCase(s.name)) + "**:\n\n" + body +
    "\n\n**\"Not yet written\"** = the assessment hasn't happened yet. **\"Not yet resulted\"** = it was written but marks aren't released.";
}

function myInfoAnswer(E, ctx) {
  const s = ctx.student;
  if (!s) return "Your course, year and group are shown on your student card on the Home page. " + ASK_ID;
  const lines = ['- **Name:** ' + esc(titleCase(s.name + ' ' + s.surname)),
                 '- **Year:** ' + yearLabel(s.year),
                 '- **Course:** ' + esc(s.course)];
  if (s.year === 1 && s.group) lines.push('- **Group:** ' + esc(s.group));
  return "Here's what I have on record for you:\n\n" + lines.join('\n') +
    "\n\nIf anything is wrong, Mr Owami or the IT Department office can correct it.";
}

function timetableAnswer(E, ctx) {
  const s = ctx.student;
  const key = s ? courseKey(s.course) : E.course;
  const year = s ? s.year : (E.year || (key === 'imd' ? 2 : (key === 'ts' || key === 'gd' || key === 'eu') ? 1 : undefined));
  const group = s ? s.group : E.group;
  const f = timetableFor(year, group, key);
  if (f) {
    return (s ? "Your" : "The") + " timetable is ready: [Open timetable PDF](" + encodeURIComponent(f) + ")\n\nYou can also open or download it from your student card on the Home page after searching.";
  }
  if (year === 2 && !key) return "2nd year timetables exist for **Systems Development** and **Interactive Multimedia Design**. Which one are you in?";
  if (year === 1 && !key && !group) return "1st year timetables depend on your course and group. Tell me e.g. \"systems development group 2\" or \"technical support\", or type your ID.";
  if (year === 1 && key === 'sd') return "1st year Systems Development has separate timetables for **Group 1** and **Group 2**. Which group are you in? Or type your ID and I'll check for you.";
  if (year || group || key) return "I don't have a timetable PDF uploaded for that combination yet. Check back later or ask Mr Owami.";
  return "Your **timetable PDF** is on your student card after you search. Tell me your course, year and group (e.g. \"1st year systems development group 2\") and I'll link it, or type your ID.\n\nTimetables exist for:\n- 1st Year Systems Development (Group 1 and 2)\n- 1st Year Technical Support (Group 3)\n- 1st Year Graphic Design\n- 1st Year End User\n- 2nd Year Systems Development\n- 2nd Year Interactive Multimedia Design";
}

function coursesAnswer(E) {
  if (E.course) {
    const name = COURSE_NAME[E.course];
    const yrs = E.year ? [E.year] : (E.course === 'sd' ? [1, 2] : E.course === 'imd' ? [2] : [1]);
    const parts = yrs.map(function (y) {
      const subj = subjectsFor(y, E.course);
      return '**' + yearLabel(y) + '**: ' + (subj.length ? 'Mr Owami teaches ' + subj.join(' and ') + '.' : 'no subjects on the Hub are taught by Mr Owami for this one.');
    });
    return "**" + name + "** is offered in the IT Department.\n\n" + parts.join('\n\n');
  }
  const y1 = "**1st Year (NQF Level 4)**\n- Systems Development\n- Technical Support\n- Graphic Design\n- End User Computing";
  const y2 = "**2nd Year (NQF Level 5)**\n- Systems Development\n- Interactive Multimedia Design";
  return "The GCC IT Department offers:\n\n" + (E.year === 1 ? y1 : E.year === 2 ? y2 : y1 + "\n\n" + y2);
}

function statsAnswer(E, ctx) {
  const all = ctx.data.s1.concat(ctx.data.s2);
  if (!all.length) return "The student data is still loading. Try again in a moment.";
  const list = all.filter(function (s) {
    return (!E.year || s.year === E.year) && (!E.course || courseKey(s.course) === E.course) && (!E.group || s.group === E.group);
  });
  const what = [E.year ? yearLabel(E.year) : '', E.course ? COURSE_NAME[E.course] : '', E.group || ''].filter(Boolean).join(' · ');
  return "There are **" + list.length + "** students registered" + (what ? " in " + what : " in the IT Department on this Hub") + ".";
}

function lecturerAnswer(E) {
  const intro = E.subject ? "**" + E.subject + "** is taught by **Mr Owami**.\n\n" : "";
  return intro + "**Mr Owami** is an IT Lecturer at Gauteng City College. He teaches:\n\n- Introduction to Programming (1st year SD)\n- Introduction to Database Management Systems (1st year TS and Graphic Design)\n- Web Development (2nd year)\n- Advanced Programming II (2nd year SD)\n\nHe also designed and built this Student Hub, powered by **Brelinx**.";
}

/* ---------------- 6. INTENTS ----------------
   w: concept weights   p: phrase regexes (+4 each, tested on raw text)
   need: at least one of these concepts must be present
   boost(E, ctx): extra score from context                              */
const INTENTS = [
  { id:'greeting', sample:'Hello', w:{greet:4}, a:"Hey there! 👋 I'm the GCC IT assistant.\n\nAsk me about your **marks**, **timetable**, **QR code**, **courses**, or how the Hub works. You can even type your ID number and I'll look you up.\n\nWhat would you like to know?" },
  { id:'thanks', sample:'Thanks', w:{thanks:4}, a:"You're welcome! Ask me anything else about the Student Hub or your studies. 😊" },
  { id:'bye', sample:'Bye', w:{bye:4}, a:"See you! Good luck with your studies. 👋" },
  { id:'capabilities', sample:'What can you do?', w:{capab:3}, p:[/what can you (do|help|answer)/i, /what (do|can) you know/i, /how can you help/i, /your (purpose|role|function)/i],
    a:"I'm the **GCC IT Department assistant**. I can:\n\n- Look up **your marks** and details (just send your ID number)\n- Explain results, DP marks and the Hub\n- Link your **timetable** PDF\n- Explain your **QR code**\n- Tell you about IT courses, groups and NQF levels\n- Explain data privacy and who to contact\n\nYou can ask in your own words, even with typos, or ask two things at once." },
  { id:'identity', sample:'Are you a real AI?', p:[/who are you/i, /what are you\b/i, /are you (a |an )?(bot|ai|human|real|robot|chatgpt|gpt|claude|gemini|llm)/i, /your name/i], w:{},
    a:"I'm the **GCC IT assistant**, a built-in helper made for the Student Hub. I'm not ChatGPT or a general AI. I understand plain-language questions about your IT studies and can look up your record with your ID." },
  { id:'find_details', sample:'How do I find my student details?', w:{find:3, self:0.5}, p:[/how.*(use|work).*(portal|hub|system|site|website)/i, /where.*(find|see|check).*(detail|info|record|profile)/i],
    a:"To find your details:\n\n1. Go to the **Home page** of the Student Hub.\n2. Enter your **ID or passport number** in the search box.\n3. Press **Search** or hit Enter.\n4. Your student card appears with your course, year, group and results.\n\nOr skip all that: type your ID number here and I'll show it." },
  { id:'qr', sample:'How do I get my QR code?', w:{qr:4, digital:1}, p:[/digital\s*id/i, /student card/i],
    a:"After a successful search your **QR code is generated automatically**.\n\n- Show it to your lecturer to verify your group.\n- Tap **Download PNG** to save it to your phone.\n- Tap **Print** for a physical copy.\n\nWhen scanned, it opens your verified student record." },
  { id:'my_marks', sample:'Show my marks', w:{result:2.5, self:2, dp:0.5}, need:['result','dp'], boost:function (E, c) { return c.student ? 2 : 0; }, a:marksAnswer },
  { id:'pending_info', sample:'What does "Not yet resulted" mean?', w:{pending:3, result:1}, pw:6, p:[/not yet (resulted|written)/i, /when.*(releas|updat|captur|publish|ready|available|com+ing out|come out|be out)/i],
    a:"There are two labels you might see:\n\n- **\"Not yet written\"**: the assessment hasn't taken place yet.\n- **\"Not yet resulted\"**: it was written but Mr Owami hasn't captured or released the marks.\n\nOnce marks are released you'll see a **percentage** (e.g. 72%). Results are updated after assessment capture." },
  { id:'marks_info', sample:'Whose results appear on the Hub?', w:{result:3, dp:1.5},
    a:"Results on the Hub are captured by **Mr Owami** for the subjects he teaches:\n\n**1st Year**\n- Systems Development: Introduction to Programming\n- Technical Support and Graphic Design: Introduction to Database Management Systems\n\n**2nd Year**\n- Systems Development: Web Development, Advanced Programming II\n- Interactive Multimedia Design: Web Development\n\nA **percentage** means the mark is confirmed. For other subjects, check with the relevant lecturer or the college results system. Type your ID and I'll show your own marks." },
  { id:'dp_info', sample:'What is a DP mark?', w:{dp:4, define:1.5}, p:[/what'?s?\s+(is\s+|does\s+|are\s+)?(a\s+|an\s+|the\s+)?dp\d?\b/i, /\bdp\d?\b.*(stand|mean)/i, /daily prog/i],
    a:"A **DP (Daily Programme) mark** is a continuous assessment mark built up during the year from assignments, tests, practicals and participation.\n\nA valid DP mark is normally needed to be admitted to final exams. On the Hub, assessments are labelled **DP1**, **DP2** and **DP3**." },
  { id:'pass_fail', sample:'Did I pass?', w:{pass:2}, p:[/(did|will|can|do) i (pass|fail)/i, /am i (passing|failing)/i, /pass mark/i, /(allowed|admitted|admission).*(exam|write)/i],
    a:"I can't tell you whether you've passed. Pass and exam-admission rules are set by the college and your lecturer. I can show you the marks that are captured, and Mr Owami can confirm where you stand." },
  { id:'timetable', sample:'Where is my timetable?', w:{timetable:4}, a:timetableAnswer },
  { id:'courses', sample:'What courses are in IT?', w:{course:3}, p:[/what.*(study|offer)/i, /which.*(programme|course)s?/i], a:coursesAnswer },
  { id:'my_info', sample:'What course and group am I in?', w:{self:1.5, group:1.5, course:1.5, year:1.5}, need:['self'],
    p:[/who am i/i, /(what|which).*(course|group|year).*(am i|i'?m|i am|is my|my)/i], boost:function (E, c) { return c.student ? 2 : 0; }, a:myInfoAnswer },
  { id:'groups', sample:'How do groups work?', w:{group:4},
    a:"Your group is shown on your student card after you search.\n\n1st years are placed in **Group 1**, **Group 2**, **Group 3** or **End User**, depending on course and class allocation. 2nd years aren't split into groups.\n\nIf yours is wrong, speak to Mr Owami or the IT Department office." },
  { id:'nqf', sample:'What is NQF?', w:{nqf:4},
    a:"**NQF** is the **National Qualifications Framework**, South Africa's way of grading qualification levels.\n\n- **NQF Level 4** = 1st year IT programmes at GCC\n- **NQF Level 5** = 2nd year IT programmes at GCC\n\nThese can lead on to further study at university or TVET colleges." },
  { id:'lecturer', sample:'Who is Mr Owami?', w:{lecturer:4}, p:[/mr\.?\s*owami/i, /who (built|made|created|designed|teach)/i], a:lecturerAnswer },
  { id:'id_problem', sample:"My ID number isn't found", w:{neg:1.5, id:2, notfound:2},
    p:[/(id|passport).*(doesnt|doesn't|not|wont|won't|isnt|cant|can't|error|invalid|work)/i, /(cant|can't|cannot|unable).*find.*(me|myself|my (id|name|record|detail))/i, /not found|no results?|nothing (comes|shows|found)/i],
    a:"If your ID isn't found, try this:\n\n1. **Check for typos.** No spaces, dashes or extra characters.\n2. **Use the full number.** All 13 digits of an SA ID, or the full passport number.\n3. **Try the other document**: passport if you used your ID, or vice versa.\n4. **Still nothing?** You may not have been added yet. Speak to Mr Owami or visit the IT Department office." },
  { id:'wrong_info', sample:'My name or group is wrong', w:{error:3}, p:[/(name|course|group|surname|gender|details?).*(wrong|incorrect|mistake|misspell|spelt)/i, /(fix|change|correct|update|edit).*(my )?(name|course|group|details?|info|surname)/i],
    a:"You can't edit your details through the portal. Only the administrator can.\n\nIf something is wrong (name, course, group, ID):\n\n1. Tell **Mr Owami** in your next class, or\n2. Visit the **IT Department office** with your student card or ID document.\n\nCorrections usually take **1 to 2 working days**." },
  { id:'privacy', sample:'Is my information safe?', w:{privacy:4},
    a:"Your data is handled carefully:\n\n- The Hub only shows the record that matches the number you enter.\n- It's **read-only**. You can't change anything through the portal.\n- Only authorised administrators (like Mr Owami) can manage the student database.\n\nDon't share your ID number with people you don't trust." },
  { id:'mobile', sample:'Can I use this on my phone?', w:{mobile:4},
    a:"Yes, the Hub works well on a phone. You can add it to your home screen:\n\n**Android (Chrome):** menu → \"Add to Home screen\"\n**iPhone (Safari):** Share → \"Add to Home Screen\"" },
  { id:'contact', sample:'Who can I speak to for help?', w:{contact:3.5}, p:[/where.*(office|it department|campus)/i, /how.*(contact|reach|speak to|talk to)/i, /who.*(speak|talk|ask|see)/i],
    a:"You can:\n\n- **Approach Mr Owami in class** (bring your student card or ID)\n- **Visit the IT Department office** on the Gauteng City College campus\n- For technical issues with the portal, see [brelinx.com](https://brelinx.com)" },
  { id:'brelinx', sample:'What is Brelinx?', w:{brelinx:5},
    a:"**Brelinx** is the technology provider behind the GCC IT Student Hub, built in collaboration with Mr Owami. More at [brelinx.com](https://brelinx.com)." },
  { id:'admin', sample:'Who can edit student data?', w:{admin:4},
    a:"The admin panel is for authorised IT Department staff only. Students can't access or edit records. If something needs correcting, ask Mr Owami." },
  { id:'stats', sample:'How many students are there?', w:{count:3}, pw:7, p:[/how many (students|people|learners)/i, /number of (students|learners)/i, /class size/i], a:statsAnswer },
  { id:'frustrated', sample:'', w:{insult:4}, p:[/that'?s? (wrong|not (right|helpful|what))/i, /(you|u) (dont|do not|didnt|never) (understand|get it)/i, /not what i (asked|meant)/i],
    a:"Sorry about that! Let me try again. Could you rephrase it? For example:\n\n- \"What are my DP1 marks?\"\n- \"Timetable for 1st year group 2\"\n- \"My ID isn't found\"" }
];

const OUT_OF_SCOPE = [/sport|soccer|football|cricket|rugby/i, /celebrity|music|movie|film|song/i, /weather|news|politic|government/i,
  /recipe|food|cook/i, /girlfriend|boyfriend|relationship/i, /joke|funny/i, /\b(math|maths|history|geography|biology|chemistry|physics)\b/i];

const SOCIAL = { greeting:1, thanks:1, bye:1, frustrated:1 };
const DEFAULT_CHIPS = ['Show my marks', 'Where is my timetable?', 'What courses are in IT?', 'How do I get my QR code?'];

/* ---------------- 7. SCORING ---------------- */
function scoreClause(rawClause, ents, ctx) {
  const clause = normText(rawClause);
  const an = analyse(rawClause);
  const ranked = [];
  INTENTS.forEach(function (it) {
    if (it.need && !it.need.some(function (c) { return an.concepts.has(c); })) {
      // phrase can still rescue an intent that has `need`
      if (!(it.p || []).some(function (re) { return re.test(clause); })) return;
    }
    let s = 0;
    Object.keys(it.w || {}).forEach(function (c) { if (an.concepts.has(c)) s += it.w[c]; });
    (it.p || []).forEach(function (re) { if (re.test(clause)) s += (it.pw || 4); });
    if (s > 0 && it.boost) s += it.boost(ents, ctx);
    if (s > 0) ranked.push({ it: it, s: s });
  });
  ranked.sort(function (a, b) { return b.s - a.s; });
  return { ranked: ranked, content: an.content, concepts: an.concepts };
}

function splitClauses(t) {
  return t.split(/[?.!;,\n]+|\b(?:and also|and then|also|then|plus|and)\b/i)
          .map(function (x) { return x.trim(); }).filter(function (x) { return x.length > 1; });
}

const ID_RE = /\b(?=[a-z0-9]*\d{6})[a-z0-9]{7,16}\b/i;

/* ---------------- 8. ENGINE ---------------- */
function create(initial) {
  const ctx = { student: null, last: null, lastEnts: {}, data: { s1: [], s2: [] } };
  if (initial) setData(initial.s1, initial.s2);

  function setData(s1, s2) {
    ctx.data.s1 = (s1 || []).map(function (s) { return Object.assign({}, s, { year: s.year || 1 }); });
    ctx.data.s2 = (s2 || []).map(function (s) { return Object.assign({}, s, { year: s.year || 2 }); });
  }

  function lookup(id) {
    const q = id.toLowerCase();
    return ctx.data.s1.concat(ctx.data.s2).find(function (s) { return String(s.id).toLowerCase() === q; }) || null;
  }

  function run(it, E) { return typeof it.a === 'function' ? it.a(E, ctx) : it.a; }

  function reply(input) {
    let raw = String(input || '').trim().slice(0, 500);
    if (!raw) return { text: "Type a question and I'll do my best. 🙂", chips: DEFAULT_CHIPS };

    /* -- ID in message -- */
    let prefix = '', idOnly = false, idMissed = false;
    const m = raw.match(ID_RE);
    if (m && (ctx.data.s1.length + ctx.data.s2.length) > 0) {
      const s = lookup(m[0]);
      if (s) { ctx.student = s; prefix = "Found you, **" + esc(titleCase(s.name)) + "**. "; }
      else idMissed = true;
      raw = raw.replace(m[0], ' ').trim();
      idOnly = raw.replace(/[^a-z]/gi, '').length < 3 || !analyse(raw).content;
    }
    if (idMissed) {
      return { text: "I couldn't find a student with that number. " + INTENTS.find(function (i) { return i.id === 'id_problem'; }).a, chips: ['Who can I speak to for help?'] };
    }
    if (prefix && idOnly) {
      return { text: myInfoAnswer({}, ctx) + "\n\nNow ask me for your **marks** or **timetable**.", chips: ['Show my marks', 'Where is my timetable?'] };
    }

    /* -- entities & clauses -- */
    const fresh = extractEntities(raw);
    const hasFresh = Object.keys(fresh).length > 0;
    const clauses = splitClauses(raw);
    let scored = clauses.map(function (c) { return scoreClause(c, fresh, ctx); });

    let picks = [], alts = [];
    scored.forEach(function (sc) {
      const top = sc.ranked[0], second = sc.ranked[1];
      if (top && top.s >= 3) {
        if (!picks.some(function (p) { return p.it.id === top.it.id; })) picks.push({ it: top.it, s: top.s });
        if (second && second.s >= top.s * 0.9 && second.it.id !== top.it.id) alts.push(second.it);
      }
    });

    // whole-message fallback when clause-splitting lost the meaning
    if (!picks.length) {
      const whole = scoreClause(raw, fresh, ctx);
      scored.push(whole);
      if (whole.ranked[0] && whole.ranked[0].s >= 3) picks.push({ it: whole.ranked[0].it, s: whole.ranked[0].s });
    }

    // drop small talk when there is real content
    const real = picks.filter(function (p) { return !SOCIAL[p.it.id]; });
    if (real.length) picks = real;

    /* -- follow-up: "and for group 1?", "just dp1", "what about 2nd year?" --
       Short, entity-bearing messages continue the previous data question. */
    let followUp = false;
    const FOLLOWABLE = { timetable:1, courses:1, stats:1, my_marks:1, lecturer:1 };
    const shape = /^\s*(and|what about|how about|ok|okay|just|only|same|now|then|for|also)\b/i.test(raw) || analyse(raw).content <= 2;
    if (ctx.last && FOLLOWABLE[ctx.last] && hasFresh && shape && !analyse(raw).concepts.has('define') && !(picks[0] && picks[0].s >= 7)) {
      const lastIt = INTENTS.find(function (i) { return i.id === ctx.last; });
      picks = [{ it: lastIt, s: 5 }]; alts = []; followUp = true;
    }

    /* -- entities: fresh, or carried from last turn only for follow-ups -- */
    const inherited = Object.assign({}, followUp ? ctx.lastEnts : {});
    if (fresh.course && !fresh.year) delete inherited.year;      // "what about technical support?"
    if (fresh.year && !fresh.course) delete inherited.course;
    if ((fresh.year || fresh.course) && !fresh.group) delete inherited.group;
    const E = Object.assign(inherited, fresh);

    /* -- answer -- */
    if (picks.length) {
      picks = picks.slice(0, 3);
      const body = picks.map(function (p) {
        const txt = run(p.it, E);
        return picks.length > 1 ? "**" + labelOf(p.it) + "**\n" + txt : txt;
      }).join('\n\n');
      ctx.last = picks[0].it.id; ctx.lastEnts = E;
      const chips = alts.filter(function (a) { return !picks.some(function (p) { return p.it.id === a.id; }) && a.sample; })
                        .slice(0, 2).map(function (a) { return a.sample; });
      return { text: prefix + body, chips: chips };
    }

    /* -- nothing confident: try a weak match, then out-of-scope, then suggest -- */
    const weak = scored.map(function (s) { return s.ranked[0]; }).filter(Boolean).sort(function (a, b) { return b.s - a.s; });
    if (weak[0] && weak[0].s >= 1.5 && !SOCIAL[weak[0].it.id] && !OUT_OF_SCOPE.some(function (re) { return re.test(raw); })) {
      const guesses = [];
      weak.forEach(function (w) { if (w.it.sample && guesses.indexOf(w.it.sample) < 0) guesses.push(w.it.sample); });
      return { text: prefix + "I'm not fully sure what you mean. Did you want one of these?", chips: guesses.slice(0, 3) };
    }
    if (OUT_OF_SCOPE.some(function (re) { return re.test(raw); })) {
      return { text: prefix + "I can only help with the GCC IT Department and the Student Hub, so I can't help with that one. Anything about your marks, timetable, courses or the portal?", chips: DEFAULT_CHIPS };
    }
    return { text: prefix + "I didn't quite catch that. Try asking about your **marks**, **timetable**, **QR code** or **courses**, or pick one below.", chips: DEFAULT_CHIPS };
  }

  function labelOf(it) {
    return ({ my_marks:'Your marks', timetable:'Timetable', qr:'QR code', find_details:'Finding your details', courses:'Courses',
      dp_info:'DP marks', pending_info:'Result labels', marks_info:'Results', groups:'Groups', nqf:'NQF', lecturer:'Mr Owami',
      id_problem:'ID not found', wrong_info:'Corrections', privacy:'Privacy', mobile:'Mobile', contact:'Contact', my_info:'Your details',
      stats:'Numbers', pass_fail:'Passing', admin:'Admin', brelinx:'Brelinx', capabilities:'What I can do', identity:'About me' })[it.id] || 'Answer';
  }

  return { reply: reply, setData: setData, ctx: ctx };
}

const API = { create: create, _analyse: analyse, _entities: extractEntities };
if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.GCCAssistant = API;

})(typeof window !== 'undefined' ? window : this);
