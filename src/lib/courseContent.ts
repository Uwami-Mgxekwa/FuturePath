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
  /* ── Understanding & Preventing GBV ───────────────────────── */
  7: {
    courseId: 7,
    title: "Understanding & Preventing GBV",
    lessons: [
      {
        id: "gbv-what-is-it",
        title: "What Is Gender-Based Violence?",
        duration: "10 min read",
        summary: "Defining GBV, its many forms, and why South Africa is so severely affected.",
        sections: [
          {
            heading: "Defining gender-based violence",
            body:
              "Gender-based violence (GBV) is any harmful act directed at a person because of their gender. It includes physical, sexual, emotional, psychological, and economic abuse. While anyone can experience GBV, women and girls are disproportionately affected globally and in South Africa. GBV is not a private matter or a family issue. It is a violation of human rights and a public health crisis.",
          },
          {
            heading: "The many forms GBV takes",
            body:
              "GBV is not only physical assault. It includes sexual violence and rape, emotional abuse such as constant humiliation, intimidation, and threats, economic abuse where a partner controls all money and denies access to finances, stalking and harassment, forced marriage, and digital abuse such as sharing intimate images without consent. Many survivors experience several forms at the same time.",
          },
          {
            heading: "Why South Africa is so severely affected",
            body:
              "South Africa has one of the highest rates of gender-based violence in the world. Deep-rooted gender inequality, high unemployment, poverty, alcohol abuse, and the normalisation of violence in some communities all contribute. So do patriarchal attitudes that treat women and children as property. The country declared a 'second pandemic' of GBV alongside COVID-19, acknowledging that femicide and intimate partner violence had reached crisis levels.",
          },
          {
            heading: "The impact on survivors and communities",
            body:
              "The effects of GBV extend far beyond the moment of violence. Survivors experience physical injury, depression, anxiety, post-traumatic stress disorder, and in the worst cases, death. Children who witness abuse in the home are more likely to experience violence in their own adult relationships. Communities affected by high GBV rates suffer reduced economic participation, school dropout, and cycles of trauma that pass from one generation to the next.",
          },
        ],
        takeaways: [
          "GBV includes physical, sexual, emotional, economic, and digital abuse.",
          "Anyone can be a victim, but women and girls are most often targeted.",
          "South Africa faces a GBV crisis rooted in gender inequality and cultural attitudes.",
          "The impact of GBV extends to children, families, and entire communities.",
        ],
      },
      {
        id: "gbv-recognising-abuse",
        title: "Recognising Signs of Abuse",
        duration: "12 min read",
        summary: "How to identify abuse in relationships, including the warning signs that are easy to miss.",
        sections: [
          {
            heading: "Why abuse is often hidden",
            body:
              "Abuse rarely starts with violence. Most abusive relationships begin with what feels like love, attention, and care. Over time, control replaces care. By the time physical violence happens, the survivor has often been emotionally isolated, financially controlled, and made to doubt their own reality. This gradual process, called the cycle of abuse, is designed to trap the victim.",
          },
          {
            heading: "Early warning signs in a relationship",
            body:
              "Watch for a partner who insists on moving very fast, wants to know where you are at all times, becomes angry when you spend time with friends or family, checks your phone without permission, criticises your appearance or intelligence constantly, or tries to make all the financial decisions. These are signs of controlling behaviour, and controlling behaviour almost always escalates.",
          },
          {
            heading: "Physical and visible signs in someone you know",
            body:
              "If someone you know has unexplained injuries, wears clothing to cover bruises in warm weather, flinches at sudden movements, seems nervous or fearful around their partner, or withdraws from social activities they used to enjoy, these can be signs of abuse. They may minimise what is happening, make excuses, or deny it altogether. Do not pressure them, but let them know you are there and that what they are experiencing is not normal.",
          },
          {
            heading: "The cycle of abuse",
            body:
              "Many abusive relationships follow a recognisable cycle: a tension-building phase where the victim feels they are 'walking on eggshells', an explosion of violence or abuse, followed by reconciliation where the abuser apologises, gives gifts, and promises change. This is sometimes called the 'honeymoon phase'. After that comes a calm period before the tension builds again. This cycle makes it very hard to leave because the good times feel real and the abuser seems genuine in their remorse.",
          },
          {
            heading: "Recognising economic and digital abuse",
            body:
              "Economic abuse is when a partner controls all the money, prevents you from working, destroys your property, or puts debts in your name. Digital abuse includes monitoring your messages, demanding your passwords, posting humiliating content about you online, or threatening to share intimate images. These forms of abuse are common and often overlooked, but they are just as harmful as physical violence.",
          },
        ],
        takeaways: [
          "Abuse usually starts with control and isolation, not physical violence.",
          "Constant criticism, monitoring, and jealousy are early red flags.",
          "The cycle of abuse — tension, explosion, reconciliation, calm — keeps survivors trapped.",
          "Economic and digital abuse are real forms of GBV, not less serious than physical abuse.",
        ],
      },
      {
        id: "gbv-legal-rights",
        title: "Your Legal Rights and Protections in South Africa",
        duration: "14 min read",
        summary: "The laws that protect you, what a protection order is, and how to use the legal system.",
        sections: [
          {
            heading: "The laws that protect you",
            body:
              "South Africa has strong laws against GBV. The Domestic Violence Act of 1998 protects people from abuse in domestic relationships, which includes partners, ex-partners, family members, and anyone sharing a home. The Sexual Offences Act criminalises rape and all forms of sexual violence. The Older Persons Act protects elderly people from abuse. In 2021 the government strengthened penalties through the Criminal Law (Sexual Offences and Related Matters) Amendment Act. Knowing these laws exist is the first step in using them.",
          },
          {
            heading: "What is a protection order and how to get one",
            body:
              "A protection order is a court instruction that legally forbids the abuser from contacting, harassing, threatening, or coming near you or your children. You apply for one at your nearest Magistrate's Court. You do not need a lawyer, and it is free. The court can grant an interim (temporary) order the same day you apply if there is immediate danger. Breaching a protection order is a criminal offence and the abuser can be arrested.",
          },
          {
            heading: "Reporting to the police",
            body:
              "You can report GBV at any SAPS station. Ask to speak to a detective or the station's Family Violence, Child Protection and Sexual Offences (FCS) unit if available. Bring any evidence you have, such as photos of injuries, threatening messages, or medical reports. You have the right to a statement-taker of the same gender if you request it. If the police refuse to take your statement, ask for a duty officer and note their name and badge number. You can also escalate to the Independent Police Investigative Directorate (IPID).",
          },
          {
            heading: "Your rights as a survivor",
            body:
              "You have the right to be treated with dignity. The right to access medical care and a post-exposure prophylaxis (PEP) kit within 72 hours of sexual assault, free of charge at any public hospital. The right to a social worker. The right to not be confronted by the accused during the investigation. And the right to legal representation or referral to Legal Aid South Africa if you cannot afford a lawyer.",
          },
          {
            heading: "The National Register for Sex Offenders",
            body:
              "South Africa maintains a National Register for Sex Offenders (NRSO). Convicted sex offenders are placed on this register and are barred from working with children and people with disabilities. If you are an employer hiring for such roles, you can request a clearance check through the Department of Social Development.",
          },
        ],
        takeaways: [
          "The Domestic Violence Act lets you apply for a free protection order at a Magistrate's Court.",
          "A protection order can be issued the same day you apply in urgent cases.",
          "You are entitled to free medical care and a PEP kit within 72 hours of sexual assault.",
          "If the police refuse to help, escalate to IPID and document everything.",
        ],
      },
      {
        id: "gbv-support-services",
        title: "Accessing Support Services and Shelters",
        duration: "12 min read",
        summary: "Where to go and who to call for help in South Africa, including free 24-hour hotlines.",
        sections: [
          {
            heading: "You do not have to face this alone",
            body:
              "One of the most powerful things a survivor can do is reach out. South Africa has a network of government and NGO support services, many of them free and confidential. You do not need to have a case with the police to access most of these services. You do not have to be ready to leave your situation to ask for advice. You only need to make one call.",
          },
          {
            heading: "National hotlines",
            body:
              "The Gender-Based Violence Command Centre operates 24 hours a day, 7 days a week. Call 0800 428 428 or send a please-call-me to 079 693 1553. It is free from any network and available in all 11 official languages. Childline South Africa can be reached on 116 (free from any phone). The South African Depression and Anxiety Group runs a 24-hour helpline on 0800 567 567 for emotional support. TEARS Foundation, specifically for sexual abuse survivors, is reachable on *134*7355# (free from any network).",
          },
          {
            heading: "Thuthuzela Care Centres",
            body:
              "Thuthuzela Care Centres (TCCs) are one-stop facilities at major hospitals across South Africa, designed to reduce the trauma of reporting sexual violence. At a TCC you can receive medical treatment, forensic examination, counselling, police services, and legal assistance all in one place without having to travel between multiple offices. There are over 50 TCCs operating nationally. Ask at your nearest public hospital or call the GBV Command Centre to find the nearest one.",
          },
          {
            heading: "Shelters and safe accommodation",
            body:
              "If you need to leave your home urgently, safe shelters exist in every province. The National Shelter Movement of South Africa can help connect you to accommodation. The GBV Command Centre can also refer you to a shelter in your area. Many shelters are confidential, meaning the address is not public. You can arrive with nothing. Most shelters provide food, clothing, and children's support while you figure out next steps.",
          },
          {
            heading: "Supporting someone else",
            body:
              "If you are trying to help a friend or family member, the most important thing you can do is believe them. Do not push them to leave before they are ready, that can increase their danger. Help them make a safety plan, save emergency numbers, pack a bag with essential documents if possible, and identify a safe person they can call. Never confront the abuser directly, that can escalate the violence.",
          },
        ],
        takeaways: [
          "The GBV Command Centre is free, 24/7, and available in all 11 languages: 0800 428 428.",
          "Thuthuzela Care Centres provide medical, legal, and police support in one place.",
          "Shelters across South Africa provide emergency safe accommodation.",
          "If helping someone, believe them, plan with them, and never confront the abuser yourself.",
        ],
      },
      {
        id: "gbv-community-advocacy",
        title: "Community Advocacy and Prevention Strategies",
        duration: "13 min read",
        summary: "How individuals and communities can actively work to prevent GBV and change culture.",
        sections: [
          {
            heading: "Prevention starts in communities",
            body:
              "GBV cannot be ended by law enforcement and shelters alone. It requires communities to actively challenge the attitudes, behaviours, and norms that make violence seem normal or acceptable. Prevention means teaching boys and girls from a young age about respect, consent, and healthy relationships. It means men and boys calling out toxic behaviour in their social circles, not excusing it.",
          },
          {
            heading: "What every community member can do",
            body:
              "You do not need a platform or a title to make a difference. You can speak up when you hear jokes that trivialise violence against women. You can check on a neighbour you suspect may be in danger. You can volunteer with an NGO or shelter. You can share resources with someone who might need them. You can refuse to be silent when abuse happens in your community. These small actions, multiplied across thousands of people, create real cultural change.",
          },
          {
            heading: "The role of men and boys",
            body:
              "Movements like the White Ribbon Campaign invite men to pledge never to commit, excuse, or stay silent about violence against women. Research consistently shows that male bystander intervention is one of the most effective GBV prevention tools. When men challenge each other's attitudes and hold other men accountable, it sends a message that GBV is not a women's problem, it is everyone's problem.",
          },
          {
            heading: "Using social media responsibly",
            body:
              "Social media is a powerful advocacy tool. Sharing accurate information about GBV, calling out online harassment, reporting and blocking abusers on platforms, and amplifying survivor voices all contribute to awareness and change. At the same time, be careful not to share details that could identify or endanger survivors. Never share intimate images of anyone, even with the person's prior 'consent', unless they actively want it shared. Once an image is online it is very hard to remove.",
          },
          {
            heading: "Organisations doing important work in South Africa",
            body:
              "Organisations like People Opposing Women Abuse (POWA), Sonke Gender Justice, Rape Crisis Cape Town Trust, the Centre for the Study of Violence and Reconciliation (CSVR), and Lifeline Southern Africa are doing critical community-level work. You can donate, volunteer, or simply follow and amplify their work to contribute to national prevention efforts.",
          },
        ],
        takeaways: [
          "GBV prevention requires changing community attitudes, not just individual behaviour.",
          "Every person can act, from calling out harmful jokes to checking on neighbours.",
          "Male bystander intervention is one of the most proven prevention strategies.",
          "Organisations like Sonke Gender Justice and POWA are doing important work you can support.",
        ],
      },
      {
        id: "gbv-supporting-survivors",
        title: "Supporting Survivors: A Practical Guide",
        duration: "12 min read",
        summary: "How to support a GBV survivor in a way that helps rather than harms.",
        sections: [
          {
            heading: "The most important thing: believe them",
            body:
              "False reporting is rare. When a survivor tells you what happened, the most powerful response is to believe them without making them justify or re-explain their experience. Saying 'I believe you, this is not your fault, and I am here for you' can be the first moment of safety a survivor has had in a long time. Do not minimise, question, or compare their experience to others.",
          },
          {
            heading: "Let them lead",
            body:
              "Survivors need to feel in control of their own decisions, because abuse is fundamentally about having control taken from them. Do not tell them what they must do or push them to leave, report, or take legal action before they are ready. Your job is to support, not direct. Ask 'what do you need?' and listen to the answer. Respect that leaving an abusive relationship is dangerous and takes time.",
          },
          {
            heading: "Practical help you can offer",
            body:
              "Help the survivor make a safety plan. This means identifying a safe place they can go to quickly, keeping a bag with essentials like ID documents, a phone charger, and some cash somewhere accessible, and having a code word they can use to call for help without alerting the abuser. Offer to store important documents for them if their partner monitors everything. Be a consistent, non-judgmental presence.",
          },
          {
            heading: "Looking after yourself",
            body:
              "Supporting a survivor can be emotionally draining, especially if you care about them deeply and feel helpless. Secondary trauma, where you absorb the emotional weight of someone else's abuse, is real. Make sure you also speak to someone you trust or a counsellor. You cannot pour from an empty cup. Setting your own emotional limits is not abandonment, it is sustainability.",
          },
          {
            heading: "When a child is involved",
            body:
              "If you suspect a child is experiencing or witnessing abuse, you are legally obligated under South African law to report it. You can call the Department of Social Development on 0800 428 428 or Childline on 116. You do not need to be certain, reasonable suspicion is enough. The child's safety comes first.",
          },
        ],
        takeaways: [
          "Saying 'I believe you, this is not your fault' can be life-changing for a survivor.",
          "Let the survivor lead their own decisions, do not push them to act before they are ready.",
          "Help create a practical safety plan with documents, a bag, and a safe contact.",
          "In South Africa, you are legally required to report suspected child abuse.",
        ],
      },
    ],
    outcomes: [
      "Identify the different forms of gender-based violence",
      "Recognise the early warning signs of abuse in relationships",
      "Know your legal rights and how to access protection orders",
      "Access the right support services, hotlines, and shelters in South Africa",
      "Take practical steps as an individual and community member to prevent GBV",
      "Support survivors in a way that empowers rather than harms",
    ],
  },

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
  7: "GBV", // Understanding & Preventing GBV
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
