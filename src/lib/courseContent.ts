/* ================================================================
   BUILT COURSE CONTENT
   Fully-developed lesson content for courses that are live and
   completable. Each course here drives the learn → complete →
   certificate loop. Courses NOT in this map fall back to the
   "under construction" state on the course detail page.
   ================================================================ */

export interface LessonSection {
  heading?: string;
  body: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;   // e.g. "12 min read"
  summary: string;      // one-line preview
  sections: LessonSection[];
  takeaways: string[];
}

export interface BuiltCourse {
  courseId: number;
  title: string;
  lessons: Lesson[];
  outcomes: string[];
}

export const BUILT_COURSES: Record<number, BuiltCourse> = {
  /* ── Digital Safety and Scam Awareness ────────────────────── */
  8: {
    courseId: 8,
    title: "Digital Safety and Scam Awareness",
    lessons: [
      {
        id: "threat-landscape",
        title: "Understanding the Digital Threat Landscape in South Africa",
        duration: "10 min read",
        summary:
          "Why South Africans are a top target for digital scams, and the mindset that keeps you safe.",
        sections: [
          {
            heading: "Why South Africa is a target",
            body:
              "South Africa has one of the most connected populations on the continent. Millions of us bank, shop, and chat from a phone in our pocket every single day. That convenience is powerful, but it also makes us a prime target. Criminals go where the money and the people are, and right now that is the mobile phone.",
          },
          {
            heading: "The main threats you will face",
            body:
              "The most common digital threats in South Africa are phishing (fake emails and SMS), vishing (scam phone calls pretending to be your bank), SIM swap fraud, social media impersonation, online shopping fraud, romance and investment scams, and fake job offers that ask for a registration fee. They all share one trick: they try to make you act fast on emotion instead of thinking clearly.",
          },
          {
            heading: "The mindset that protects you",
            body:
              "Every scam relies on urgency, fear, or greed. The moment a message makes you feel panicked, lucky, or pressured, slow down. Scams fall apart when you pause and verify. Your first defence is not software, it is scepticism. Treat any unexpected request for money, OTPs, PINs, or personal details as guilty until proven innocent.",
          },
        ],
        takeaways: [
          "South Africans are heavily targeted because of high mobile and banking app usage.",
          "Almost every scam uses urgency, fear, or the promise of easy money to bypass your judgement.",
          "Scepticism is your first line of defence, always verify before you trust.",
          "No legitimate organisation will rush you into handing over money or personal details.",
        ],
      },
      {
        id: "sim-swap",
        title: "How SIM Swap Fraud Works and How to Prevent It",
        duration: "12 min read",
        summary:
          "How criminals hijack your phone number to steal your banking, and the warning signs to watch for.",
        sections: [
          {
            heading: "What SIM swap fraud actually is",
            body:
              "A SIM swap is when a criminal convinces your mobile network to move your phone number onto a SIM card they control. Once that happens, your phone goes silent and every OTP, banking alert, and verification code is routed to them. With your number and a few stolen details, they can empty your bank account in minutes.",
          },
          {
            heading: "How they pull it off",
            body:
              "Attackers usually start by stealing your personal details through phishing, data breaches, or social engineering. They use that information to impersonate you with your network provider, sometimes with a fake ID, sometimes with help from an insider. Then they trigger a SIM swap, often timed for late at night when you are asleep and less likely to notice.",
          },
          {
            heading: "Warning signs to act on immediately",
            body:
              "If your phone suddenly shows 'SIM registration failed', loses signal in a place where it normally works, or stops receiving calls and SMS for no reason, treat it as a possible SIM swap. If you also get an SMS about a number port or SIM swap you did not request, do not ignore it. These are your early warning lights.",
          },
          {
            heading: "How to protect yourself",
            body:
              "Ask your network about SIM swap protection and porting notifications, most major South African networks offer some form of it. Prefer an authenticator app or in-app approval over SMS OTPs for banking wherever it is offered, because those do not depend on your SIM. Use a strong, unique banking password and never share your ID number or banking details freely online.",
          },
          {
            heading: "If it happens to you",
            body:
              "The moment you suspect a SIM swap, call your network from another phone and your bank's fraud line immediately. Ask them to freeze the account and block any new payees. Then change your passwords from a device you trust. Speed is everything, the faster you act, the more you protect.",
          },
        ],
        takeaways: [
          "A SIM swap redirects your OTPs and calls to an attacker's phone.",
          "Sudden signal loss or an unexpected porting SMS is a red alert.",
          "Prefer authenticator apps over SMS for banking verification codes.",
          "If you suspect a swap, call your network and bank immediately.",
        ],
      },
      {
        id: "phishing",
        title: "Recognising Phishing Emails, SMS and WhatsApp Scams",
        duration: "12 min read",
        summary:
          "How to spot fake messages from 'banks', SARS, couriers, and strangers before you click.",
        sections: [
          {
            heading: "What phishing looks like",
            body:
              "Phishing is a fake message designed to look like it comes from a trusted source, your bank, SARS, a courier, your mobile network, or even a friend. The goal is always the same: get you to click a link, enter your details, or hand over an OTP. In South Africa, most phishing arrives by SMS and WhatsApp, not email.",
          },
          {
            heading: "Red flags in every message",
            body:
              "Watch for a sense of urgency ('your account will be blocked in 24 hours'), generic greetings ('Dear Customer') instead of your name, shortened or odd links, spelling mistakes, and any request for a PIN, password, or OTP. Real banks and SARS never ask for these. Also check the sender, a message that claims to be from FNB but comes from a random number is a scam, full stop.",
          },
          {
            heading: "WhatsApp and social scams",
            body:
              "On WhatsApp you will see 'please send me your OTP', fake investment groups promising doubling of money, recruiters asking for a fee, and 'urgent' pleas from a friend's hacked account. If a friend suddenly asks for airtime, data, or money out of nowhere, call them on another line to confirm it is really them before you send anything.",
          },
          {
            heading: "The verify-don't-trust rule",
            body:
              "Never use the phone number or link inside a suspicious message to verify it. Instead, call the official number printed on the back of your bank card or visit the official website by typing the address yourself. A real organisation will never mind you taking a moment to verify. A scammer depends on you not checking.",
          },
        ],
        takeaways: [
          "Banks, SARS, and networks never ask for your PIN, password, or OTP.",
          "Urgency and generic greetings are the two biggest phishing giveaways.",
          "If a 'friend' suddenly asks for money or data, verify on another channel.",
          "Always verify using official contact details, never the ones in the message.",
        ],
      },
      {
        id: "banking-safety",
        title: "Banking App Safety and Secure Online Transactions",
        duration: "13 min read",
        summary:
          "Keep your banking app locked down and shop online without getting burned.",
        sections: [
          {
            heading: "Locking down your banking app",
            body:
              "Use a strong, unique password for banking that you do not reuse anywhere else, and turn on biometric login if your phone supports it. Enable in-app transaction notifications so you see every payment the moment it happens. Keep your banking app updated, updates often close security holes that criminals actively exploit.",
          },
          {
            heading: "The screen-sharing scam",
            body:
              "A common trick is a call from 'your bank's fraud department' asking you to install an app like AnyDesk or TeamViewer, or to turn on screen sharing, so they can 'help secure your account'. This is always a scam. The moment you share your screen, they can see your OTPs and passwords in real time. No real bank will ever ask you to do this. Hang up immediately.",
          },
          {
            heading: "Safe online shopping",
            body:
              "Stick to retailers you recognise or that have real reviews. Look for the padlock and https in the address bar. If a price is unbelievably low, it is probably a fake store designed to capture your card details. Never pay a stranger by EFT, prefer card payments or services with buyer protection so you can reverse a bad transaction.",
          },
          {
            heading: "Public Wi-Fi and shared devices",
            body:
              "Avoid logging into your banking app on public Wi-Fi, it is easy for someone on the same network to intercept your data. Use your mobile data instead. Never do banking on a shared or public computer, and always log out when you are done. A locked phone with biometric banking is your safest setup.",
          },
        ],
        takeaways: [
          "Use a unique banking password plus biometrics, and keep the app updated.",
          "Never install screen-sharing apps for a caller claiming to be your bank.",
          "Prefer card payments with buyer protection over EFT to strangers.",
          "Avoid banking on public Wi-Fi, use mobile data instead.",
        ],
      },
      {
        id: "social-media",
        title: "Social Media Safety and Identity Protection",
        duration: "11 min read",
        summary:
          "Stop oversharing, beat impersonation, and avoid job scams that cost you money.",
        sections: [
          {
            heading: "Lock down your privacy",
            body:
              "Go through the privacy settings on every social account and limit who can see your posts, friends list, and contact details. The less strangers can see about you, the less ammunition scammers have. Treat your profile like a window, not an open door.",
          },
          {
            heading: "What you should never post",
            body:
              "Never post photos of your ID, driver's licence, payslip, bank card, or exam results with your details. Be careful about posting your exact location, daily routine, or 'we are away on holiday' updates, criminals use this to target both your empty home and your identity. Personal details are currency to a fraudster.",
          },
          {
            heading: "Impersonation and fake profiles",
            body:
              "Criminals copy your profile photo and name to create a fake account, then message your friends asking for airtime, data, or money for an 'emergency'. If you hear a friend has been messaged by 'you' asking for money, report and block the fake account immediately, and warn your contacts. Strong passwords and two-factor authentication make it far harder for anyone to take over your real account.",
          },
          {
            heading: "Job and opportunity scams",
            body:
              "A real employer never asks you to pay a registration, uniform, or 'processing' fee to get a job. If a recruiter pressures you to pay, send money for 'equipment', or cash a cheque and send part of it back, it is a scam. Verify the company independently and apply through official channels, not a WhatsApp message from a stranger.",
          },
        ],
        takeaways: [
          "Review privacy settings so strangers cannot see your personal details.",
          "Never post images of your ID, payslip, bank card, or travel plans.",
          "Turn on two-factor authentication on every social account.",
          "No legitimate employer charges you a fee to get hired.",
        ],
      },
      {
        id: "if-scammed",
        title: "What to Do If You Have Been Scammed",
        duration: "12 min read",
        summary:
          "A clear, step-by-step recovery plan for the first critical hour after a scam.",
        sections: [
          {
            heading: "Act in the first hour",
            body:
              "The actions you take in the first hour after a scam matter the most. If money is involved, your first call is to your bank's fraud line using the number on the back of your card, ask them to freeze the account, block the card, and attempt to reverse the transaction. Then change the passwords on your email and banking accounts from a device you trust.",
          },
          {
            heading: "Report it properly",
            body:
              "Open a case at your nearest SAPS station and get a case number, you will need it for insurance and disputes. Contact the Southern African Fraud Prevention Service (SAFPS) on 0860 101 248 to add protective registration against your name so criminals cannot open accounts in your identity. Report the scam on the platform it happened, mark the WhatsApp number, report the Facebook or Instagram page, and forward phishing SMS to your network where supported.",
          },
          {
            heading: "Document everything",
            body:
              "Take screenshots of every message, number, profile, and transaction before the scammer deletes anything. Note dates, times, amounts, and what was said. A clear record makes a police case stronger, helps your bank investigate, and supports any dispute you raise. Keep it all in one folder.",
          },
          {
            heading: "It is not your fault",
            body:
              "Scammers are professionals who study human psychology for a living. Being scammed does not mean you are foolish, it means you encountered a skilled criminal. Talk to someone you trust. If the experience is weighing on you, free confidential counselling is available through the South African Depression and Anxiety Group on 0800 567 567. Recover your money, then recover yourself.",
          },
        ],
        takeaways: [
          "Call your bank's fraud line first, ask them to freeze and reverse.",
          "Open a SAPS case and register with SAFPS on 0860 101 248.",
          "Screenshot and save every message, number, and transaction detail.",
          "Being scammed is not your fault, scammers are professionals.",
        ],
      },
    ],
    outcomes: [
      "Identify and avoid the most common scams targeting South Africans",
      "Protect your banking and personal information online",
      "Recognise SIM swap and phishing attempts before they succeed",
      "Know exactly what steps to take in the first hour if you are scammed",
    ],
  },
};

/* ── Credential ID helper ─────────────────────────────────────── */
const COURSE_CODES: Record<number, string> = {
  8: "DSA", // Digital Safety Awareness
};

/**
 * Generates a human-readable, verifiable credential ID such as
 * "FP-DSA-2026-A4F2K9". Uses crypto.getRandomValues when available.
 */
export function generateCredentialId(courseId: number): string {
  const code = COURSE_CODES[courseId] ?? "FP";
  const year = new Date().getFullYear();
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let random = "";
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = crypto.getRandomValues(new Uint8Array(6));
    for (let i = 0; i < 6; i++) random += alphabet[bytes[i] % alphabet.length];
  } else {
    for (let i = 0; i < 6; i++) random += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `FP-${code}-${year}-${random}`;
}
