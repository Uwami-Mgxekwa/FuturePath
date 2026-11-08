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

  /* ── Web Development Basics ───────────────────────────────────── */
  1: {
    courseId: 1,
    title: "Web Development Basics",
    lessons: [
      {
        id: "html-structure",
        title: "Introduction to HTML and Document Structure",
        duration: "11 min read",
        summary: "Learn how HTML forms the skeleton of every web page and how to write clean, semantic markup.",
        sections: [
          {
            heading: "What HTML is and why it matters",
            body:
              "HTML stands for HyperText Markup Language and it is the standard language used to create web pages. Every website you visit, from a local South African news site to a global e-commerce platform, is built on HTML at its core. HTML tells the browser what content exists on a page: headings, paragraphs, images, links, and forms. Without HTML there is no web page, only a blank screen.",
          },
          {
            heading: "The basic structure of an HTML document",
            body:
              "Every HTML document follows the same skeleton. It begins with a doctype declaration, followed by an html element that wraps everything. Inside you have a head section for metadata such as the page title and character encoding, and a body section for the visible content. Getting this structure right from the start means your page will display correctly across all browsers and devices.",
          },
          {
            heading: "Semantic HTML and why it is important",
            body:
              "Semantic HTML means using the right tag for the right purpose. Use a header element for the top of the page, nav for navigation links, main for the primary content, article for independent content blocks, and footer for the bottom. Using semantic elements makes your site more accessible to screen readers, improves your ranking in search engines like Google, and makes your code easier for other developers to read and maintain.",
          },
          {
            heading: "Common HTML elements you will use every day",
            body:
              "The most frequently used HTML elements include h1 through h6 for headings, p for paragraphs, a for links, img for images, ul and ol for lists, div and span for grouping content, and form elements like input, select, and button for user interaction. Learning these elements well gives you the foundation to build almost any static web page.",
          },
        ],
        takeaways: [
          "HTML is the foundational structure language of every web page on the internet.",
          "Every HTML document needs a doctype, html, head, and body section.",
          "Semantic tags like header, main, and footer improve accessibility and search engine visibility.",
          "Mastering core elements like headings, paragraphs, links, and forms covers most real-world needs.",
        ],
      },
      {
        id: "css-layouts",
        title: "Styling with CSS: Layouts and Responsive Design",
        duration: "13 min read",
        summary: "Control colour, typography, and layout with CSS, and make your site look great on any screen size.",
        sections: [
          {
            heading: "What CSS does and how it connects to HTML",
            body:
              "CSS stands for Cascading Style Sheets and it controls the visual presentation of your HTML. You can write CSS inside a style tag in the head of your HTML file, or in a separate .css file that you link to. Using a separate file is the professional approach because it keeps your structure and your design code cleanly separated, making both easier to update.",
          },
          {
            heading: "The box model: the foundation of all CSS layout",
            body:
              "Every HTML element is treated as a box. The box model defines four layers around any element: the content itself, padding (space inside the border), border (the line around the element), and margin (space outside the border). Understanding and controlling these four values is the key to spacing and positioning elements precisely on any page.",
          },
          {
            heading: "Flexbox and Grid for modern layouts",
            body:
              "Flexbox is ideal for one-dimensional layouts, arranging items in a row or a column, such as a navigation bar or a set of cards. CSS Grid is ideal for two-dimensional layouts, arranging items into rows and columns simultaneously, like a full page layout. Both are supported in all modern browsers and have replaced older float-based techniques. Knowing both gives you the tools to build any layout you can design.",
          },
          {
            heading: "Responsive design with media queries",
            body:
              "More than 80 percent of South African internet users access the web from a mobile phone. Responsive design means your website adapts its layout to fit any screen size. You achieve this with media queries, CSS rules that apply only when the screen is below or above a certain width. A common approach is mobile-first: design for the smallest screen first, then add media queries to adapt for larger screens.",
          },
          {
            heading: "Typography and colour for a professional look",
            body:
              "Choosing readable fonts and consistent colours makes your site look professional without expensive design work. Use Google Fonts to add free, web-optimised fonts to any project. Limit your palette to two or three colours and maintain strong contrast between text and background, this is both a design best practice and an accessibility requirement under WCAG guidelines.",
          },
        ],
        takeaways: [
          "CSS connects to HTML via a linked stylesheet and controls all visual presentation.",
          "The box model (content, padding, border, margin) is the foundation of all layout.",
          "Flexbox handles row and column layouts; Grid handles full page two-dimensional layouts.",
          "Media queries make your site responsive for South Africa's predominantly mobile audience.",
        ],
      },
      {
        id: "js-fundamentals",
        title: "JavaScript Fundamentals: Variables and Functions",
        duration: "12 min read",
        summary: "Write your first JavaScript code, understand variables, data types, and reusable functions.",
        sections: [
          {
            heading: "Why JavaScript and what it does",
            body:
              "JavaScript is the programming language of the web. While HTML provides structure and CSS provides style, JavaScript adds behaviour. It lets you respond to user actions, validate forms, fetch data from servers, and update the page without a reload. Every interactive feature you use on a website, from a search bar that shows suggestions as you type to a checkout button, is powered by JavaScript.",
          },
          {
            heading: "Variables and data types",
            body:
              "A variable is a named container that stores a value. In modern JavaScript you declare variables using let (for values that can change) or const (for values that stay the same). The main data types are strings for text, numbers for numeric values, booleans for true or false, arrays for lists of values, and objects for structured collections of related data. Understanding data types prevents most beginner bugs.",
          },
          {
            heading: "Writing and calling functions",
            body:
              "A function is a reusable block of code that performs a specific task. You define a function once and call it as many times as needed. Functions can accept input values called parameters and return an output value. Breaking your code into small, focused functions makes it easier to read, test, and debug. Modern JavaScript also supports arrow functions, a shorter syntax that is widely used in professional codebases.",
          },
          {
            heading: "Conditional logic and loops",
            body:
              "Conditional statements using if, else if, and else let your code make decisions based on whether conditions are true or false. For example, showing a discount message only to logged-in users. Loops using for or while let your code repeat a task a set number of times, such as printing every item in a shopping cart. These two building blocks, conditions and loops, power most of the logic in any JavaScript application.",
          },
        ],
        takeaways: [
          "JavaScript adds behaviour and interactivity to HTML and CSS pages.",
          "Use const for values that do not change and let for values that do.",
          "Functions let you write code once and reuse it across your entire project.",
          "Conditional statements and loops are the core logic tools in any programming language.",
        ],
      },
      {
        id: "dom-events",
        title: "DOM Manipulation and Events",
        duration: "12 min read",
        summary: "Use JavaScript to read, change, and respond to interactions in the browser's Document Object Model.",
        sections: [
          {
            heading: "What the DOM is",
            body:
              "When a browser loads an HTML page, it creates an internal tree-like representation of all the elements called the Document Object Model, or DOM. JavaScript can read and modify this tree at any time, which is what makes web pages dynamic. When you click a button and the page changes without reloading, that is JavaScript manipulating the DOM in response to an event.",
          },
          {
            heading: "Selecting and reading elements",
            body:
              "To interact with an HTML element in JavaScript you first have to select it. The most useful methods are document.getElementById, which selects a single element by its unique id, and document.querySelector, which accepts any CSS selector and returns the first matching element. Once selected, you can read the element's text, attributes, and styles, or store it in a variable to use later.",
          },
          {
            heading: "Changing content and styles",
            body:
              "After selecting an element you can change its content using the textContent or innerHTML property, change its CSS classes using classList.add, classList.remove, or classList.toggle, or directly update its style through the style property. These operations let you build anything from a dark mode toggle to a live character counter in a text field.",
          },
          {
            heading: "Listening for and responding to events",
            body:
              "Events are things that happen in the browser: a user clicking a button, submitting a form, pressing a key, or scrolling the page. You use addEventListener to attach a function to an element that runs when a specific event occurs. The function receives an event object with details about what happened, such as which key was pressed or which element was clicked. Mastering events is what separates static pages from interactive applications.",
          },
        ],
        takeaways: [
          "The DOM is the browser's live tree of all HTML elements, and JavaScript can change any part of it.",
          "querySelector is the most flexible way to select an element using any CSS selector.",
          "classList lets you add, remove, and toggle CSS classes to change appearance dynamically.",
          "addEventListener connects any user action to a JavaScript function that responds to it.",
        ],
      },
      {
        id: "first-website",
        title: "Building Your First Website Project",
        duration: "14 min read",
        summary: "Bring HTML, CSS, and JavaScript together to build a complete, functional web project from scratch.",
        sections: [
          {
            heading: "Planning before you code",
            body:
              "Before writing a single line of code, decide on the purpose, audience, and pages of your site. Sketch a rough wireframe on paper showing where the header, navigation, content, and footer will sit. Identify the two or three colours and fonts you will use. This planning step saves hours of rework later. A portfolio site, a local business landing page, or a simple to-do app are all ideal first projects.",
          },
          {
            heading: "Structuring your project files",
            body:
              "Create a project folder with a clear structure: an index.html file at the root, a css folder containing your stylesheet, a js folder for your JavaScript file, and an images folder for any graphics. Keeping files organised makes your project easy to maintain and easy to deploy. Name files in lowercase with hyphens instead of spaces, for example, about-us.html, not About Us.html.",
          },
          {
            heading: "Building the layout step by step",
            body:
              "Start with the HTML structure for every page before adding any CSS. Write all the semantic elements, headings, paragraphs, navigation links, and sections first, then link your stylesheet and begin applying styles. Add JavaScript last, after the visual layout is working. This order prevents confusion about whether a problem is caused by your HTML, your CSS, or your JavaScript.",
          },
          {
            heading: "Testing across devices and browsers",
            body:
              "Use your browser's built-in developer tools (press F12 in Chrome or Edge) to preview your site at different screen sizes. Test in at least two browsers, Chrome and Firefox are free and widely available. Check that all links work, all images load, and text is readable on a small screen. South African users frequently browse on older Android phones with slower connections, so keep image file sizes small.",
          },
        ],
        takeaways: [
          "Plan your site's purpose, pages, and visual style before writing any code.",
          "Keep a clean folder structure: one folder each for css, js, and images.",
          "Build HTML first, then CSS, then JavaScript to keep debugging straightforward.",
          "Use browser developer tools (F12) to test responsiveness across screen sizes.",
        ],
      },
      {
        id: "web-deployment",
        title: "Deploying to the Web",
        duration: "11 min read",
        summary: "Take your finished website live using free hosting platforms accessible from South Africa.",
        sections: [
          {
            heading: "How websites get from your computer to the internet",
            body:
              "A web host is a server that stores your files and makes them accessible to anyone with a browser. When you type a web address, your browser connects to that server, downloads the HTML, CSS, and JavaScript files, and renders the page. For a basic static website (no server-side code) there are excellent free hosting options that require no credit card and are very beginner-friendly.",
          },
          {
            heading: "Free hosting options for beginners",
            body:
              "GitHub Pages lets you host a static website directly from a GitHub repository for free. Netlify and Vercel both offer free tiers with drag-and-drop deployment where you simply drop your project folder onto their dashboard and your site is live in seconds. These platforms also give you a free subdomain like yourname.netlify.app. All three services are used by professional developers, not just beginners.",
          },
          {
            heading: "Buying a custom domain",
            body:
              "A custom domain like yourname.co.za makes your site look professional. South African .co.za domains are registered through accredited registrars such as Afrihost, XNEELO (formerly Hetzner), or Domains.co.za, and typically cost between R80 and R150 per year. Once you have a domain, you can connect it to your Netlify or GitHub Pages hosting in a few steps by updating your DNS records.",
          },
          {
            heading: "Making your site findable on Google",
            body:
              "After deploying, submit your site to Google Search Console so Google can discover and index your pages. Add a descriptive title tag and meta description to each page, these are what appear in search results. Compress your images before uploading, tools like Squoosh are free and work in the browser. A fast-loading, mobile-friendly site ranks better and gives South African users on limited data plans a better experience.",
          },
        ],
        takeaways: [
          "Netlify and GitHub Pages offer free, beginner-friendly hosting for static websites.",
          "A .co.za domain costs around R80 to R150 per year from registrars like Afrihost or XNEELO.",
          "Submit your site to Google Search Console to get it indexed in search results.",
          "Compress images before uploading to keep load times fast for mobile users.",
        ],
      },
    ],
    outcomes: [
      "Write semantic HTML to structure web pages correctly and accessibly",
      "Apply CSS layouts and media queries to build responsive, mobile-first designs",
      "Use JavaScript variables, functions, and DOM events to add interactivity",
      "Deploy a complete website to the internet using free hosting tools",
    ],
  },

  /* ── Digital Marketing Fundamentals ──────────────────────────── */
  2: {
    courseId: 2,
    title: "Digital Marketing Fundamentals",
    lessons: [
      {
        id: "digital-marketing-intro",
        title: "Introduction to Digital Marketing",
        duration: "10 min read",
        summary: "Understand what digital marketing is, why it matters for South African businesses, and how its channels work together.",
        sections: [
          {
            heading: "What digital marketing is and why it matters",
            body:
              "Digital marketing is the promotion of products, services, or brands through internet-connected channels such as search engines, social media, email, and websites. In South Africa, more than 45 million people have internet access and most of them are reachable through a smartphone. For any business, whether a spaza shop in Soweto or a professional services firm in Sandton, digital marketing offers the ability to reach exactly the right people at a fraction of the cost of traditional print or TV advertising.",
          },
          {
            heading: "The main digital marketing channels",
            body:
              "The primary channels are search engine optimisation (getting found on Google organically), paid search advertising (paying to appear at the top of Google results), social media marketing (building audiences on Facebook, Instagram, TikTok, and LinkedIn), email marketing (reaching people directly in their inbox), and content marketing (attracting customers through useful articles, videos, and guides). Most successful campaigns use several channels together because different customers prefer different platforms.",
          },
          {
            heading: "Understanding your target audience",
            body:
              "Before any campaign, you must define who you are trying to reach. Build a customer persona: a description of your ideal customer including their age range, location, income level, problems they want solved, and where they spend time online. South Africa's diverse demographics mean that a campaign aimed at urban professionals on LinkedIn will look very different from one aimed at young township consumers on Facebook and WhatsApp. The more precisely you define your audience, the less money you waste.",
          },
          {
            heading: "Setting goals and measuring results",
            body:
              "Digital marketing's greatest advantage over traditional advertising is measurability. Every click, view, and purchase can be tracked. Set clear goals before any campaign: increase website visits by 30 percent, generate 50 new leads per month, or sell 200 units of a product. Then measure your results against these goals using free tools like Google Analytics and the built-in analytics dashboards on each social media platform. If something is not working, you can change it quickly without wasting the rest of your budget.",
          },
        ],
        takeaways: [
          "Digital marketing lets South African businesses reach millions of smartphone users cost-effectively.",
          "The main channels are SEO, paid ads, social media, email, and content marketing.",
          "Define your target customer persona before spending a single rand on advertising.",
          "Set measurable goals and use free analytics tools to track every campaign.",
        ],
      },
      {
        id: "social-media-strategy",
        title: "Social Media Strategy and Content Creation",
        duration: "12 min read",
        summary: "Build a consistent social media presence that attracts followers and turns them into customers.",
        sections: [
          {
            heading: "Choosing the right platforms for your audience",
            body:
              "Not every platform suits every business. Facebook remains the largest social network in South Africa and works well for community building and local advertising. Instagram is strong for visual brands such as food, fashion, and beauty. TikTok is growing rapidly among younger South Africans and rewards creative short-form video. LinkedIn is the platform of choice for B2B businesses and professional services. Choose one or two platforms where your target audience actually spends time and do them well before spreading yourself too thin.",
          },
          {
            heading: "The content mix: what to post and when",
            body:
              "Effective social media content is not only promotional. Follow the 80-20 rule: 80 percent of your posts should educate, entertain, or add value to your audience, and only 20 percent should be direct sales messages. Content ideas include how-to tips related to your industry, behind-the-scenes glimpses of your business, customer testimonials, relevant local news, and interactive content like polls and questions. Posting three to five times a week on a consistent schedule builds audience trust and algorithmic reach.",
          },
          {
            heading: "Creating content that looks professional without a big budget",
            body:
              "You do not need expensive equipment to create compelling content. A modern smartphone camera is sufficient for high-quality photos and video. Free tools like Canva allow you to design professional-looking graphics using templates. Good natural lighting, a clean background, and clear audio make more difference than expensive gear. Batch-create content one day per week and schedule it in advance using free tools like Buffer or Meta Business Suite to maintain consistency without daily effort.",
          },
          {
            heading: "Community management and responding to followers",
            body:
              "Social media is a two-way conversation, not a broadcast channel. Reply to every comment and direct message promptly, even if only to acknowledge receipt. South African consumers are highly social and word-of-mouth, both positive and negative, travels fast. A business that engages warmly with its community builds loyalty that paid advertising cannot buy. Handle complaints publicly with professionalism, then take the conversation to a private channel for resolution.",
          },
        ],
        takeaways: [
          "Focus on one or two platforms where your specific audience is most active.",
          "Use the 80-20 rule: 80 percent value and education, 20 percent promotion.",
          "Canva and smartphone cameras are enough to create professional-looking content for free.",
          "Replying to every comment and message builds loyalty that paid ads cannot replicate.",
        ],
      },
      {
        id: "seo-basics",
        title: "Search Engine Optimisation Basics",
        duration: "12 min read",
        summary: "Get your website found on Google by real South African customers searching for what you offer.",
        sections: [
          {
            heading: "How search engines decide what to show",
            body:
              "When someone searches on Google, the algorithm scans billions of pages and ranks them based on relevance, authority, and user experience. Relevance means your content closely matches what the user searched for. Authority is built through other reputable websites linking to yours. User experience includes page loading speed, mobile-friendliness, and how long visitors stay on your page. SEO is the practice of improving all three of these factors.",
          },
          {
            heading: "Keyword research: finding what people actually search for",
            body:
              "Keywords are the words and phrases people type into Google. Research which keywords your target customers use, how many people search for them each month, and how competitive they are. Free tools like Google Keyword Planner and Ubersuggest help with this. Focus on long-tail keywords, phrases of three or more words, such as 'affordable car insurance Johannesburg', which are more specific, less competitive, and more likely to convert to a real customer than a broad term like 'insurance'.",
          },
          {
            heading: "On-page SEO: optimising your own pages",
            body:
              "On-page SEO means making changes directly to your website. Include your target keyword in the page title, the first heading, and naturally throughout the body text. Write a compelling meta description of 150 to 160 characters that summarises the page and encourages clicks. Use descriptive alt text on all images. Ensure every page loads in under three seconds, as Google penalises slow sites and South African mobile users on limited data plans will leave before the page finishes loading.",
          },
          {
            heading: "Local SEO and Google Business Profile",
            body:
              "If your business serves customers in a specific South African city or neighbourhood, local SEO is critical. Create and verify a free Google Business Profile so your business appears in Google Maps and the local search results panel. Fill in every field: address, phone number, opening hours, photos, and a description. Encourage satisfied customers to leave Google reviews. A well-maintained Business Profile is often the single highest-return SEO action for a local South African business.",
          },
        ],
        takeaways: [
          "Google ranks pages based on relevance, authority, and user experience.",
          "Target long-tail keywords that match exactly what your South African customers search for.",
          "Include your keyword in the page title, first heading, and meta description.",
          "Claim and fully complete your Google Business Profile to dominate local search results.",
        ],
      },
      {
        id: "paid-advertising",
        title: "Paid Advertising: Google and Meta Ads",
        duration: "13 min read",
        summary: "Run targeted paid campaigns on Google Search and Facebook or Instagram to generate leads and sales quickly.",
        sections: [
          {
            heading: "When to use paid advertising",
            body:
              "SEO takes months to show results. Paid advertising shows results from day one. Use paid ads when you need leads or sales quickly, when you are launching a new product, or when you want to target a very specific audience that organic content may not reach efficiently. Paid advertising is also useful for testing messages and offers before committing to a full campaign, because you can see within days what language and images resonate with your audience.",
          },
          {
            heading: "Google Search Ads explained",
            body:
              "Google Search Ads appear at the top of search results when someone searches for a keyword you have bid on. You only pay when someone clicks your ad, which is why the model is called pay-per-click (PPC). Set a daily budget, choose your keywords, write your ad copy, and point the ad to a specific landing page on your website. Start with a small budget of R50 to R100 per day, monitor the results daily, and increase spending only on campaigns that are generating a return.",
          },
          {
            heading: "Meta Ads on Facebook and Instagram",
            body:
              "Meta Ads allow you to target users based on age, location, language, interests, and behaviour. You can reach 'people in Durban aged 25 to 40 who are interested in home improvement'. Create your campaigns in Meta Business Manager. The two most common ad formats for beginners are single image or video ads for awareness, and lead generation ads that collect name and phone number directly within the Facebook app without the user needing to visit your website.",
          },
          {
            heading: "Reading your results and improving",
            body:
              "The most important metrics for paid ads are click-through rate (CTR, the percentage of people who saw your ad and clicked it), cost per click (CPC, what each click costs you), conversion rate (the percentage of clicks that become leads or sales), and return on ad spend (ROAS, revenue generated divided by advertising cost). If your CTR is low, test a different image or headline. If your conversion rate is low, improve your landing page. Always run at least two variations of any ad to compare performance.",
          },
        ],
        takeaways: [
          "Paid ads generate results immediately, making them ideal for launches and time-sensitive campaigns.",
          "Google Search Ads target people actively searching for your keywords with pay-per-click billing.",
          "Meta Ads target users by demographics and interests, including specific South African cities.",
          "Monitor CTR, CPC, and conversion rate weekly and test two ad variations at a time.",
        ],
      },
      {
        id: "email-marketing",
        title: "Email Marketing and Audience Building",
        duration: "11 min read",
        summary: "Build an owned audience through email and create campaigns that convert subscribers into loyal customers.",
        sections: [
          {
            heading: "Why email marketing still delivers the best ROI",
            body:
              "Despite social media's popularity, email marketing consistently delivers the highest return on investment of any digital marketing channel, typically R36 or more for every R1 spent according to industry research. Unlike followers on social media, your email list is an asset you own. A platform can change its algorithm or close down, but your email list remains yours. Building a quality email list is one of the most valuable long-term marketing activities for any South African business.",
          },
          {
            heading: "Building your list ethically and legally",
            body:
              "In South Africa, email marketing is governed by the Protection of Personal Information Act (POPIA), which came into full effect in 2021. You must have explicit consent from every person on your list before emailing them. Collect email addresses through a sign-up form on your website, a lead magnet (a free resource offered in exchange for an address), or at events. Never buy email lists. Purchased lists have poor engagement, damage your sender reputation, and are illegal under POPIA.",
          },
          {
            heading: "Writing emails that people actually open",
            body:
              "The subject line is the single most important element of any email. Keep it under 50 characters, make it specific, and create genuine curiosity or clear value, for example 'Your 3-step guide to cutting your electricity bill' outperforms 'Our Monthly Newsletter' every time. The preview text, which appears next to the subject in most email clients, should complement the subject. Personalise the opening with the subscriber's first name. Keep the email focused on one idea and end with a single clear call to action.",
          },
          {
            heading: "Tools, automation, and measuring success",
            body:
              "Mailchimp, Brevo (formerly Sendinblue), and MailerLite all offer free plans suitable for small South African businesses. Use automation to send a welcome sequence to every new subscriber, a series of three to five emails that introduces your business and delivers value before any sales message. Measure open rate (aim for above 20 percent) and click rate (aim for above 2 percent). Clean your list every six months by removing subscribers who have not opened an email in 90 days to maintain deliverability.",
          },
        ],
        takeaways: [
          "Email marketing delivers the highest ROI of any digital channel and the list is an asset you own.",
          "POPIA requires explicit consent from every subscriber, never buy email lists.",
          "A specific, curiosity-driven subject line under 50 characters dramatically increases open rates.",
          "Free tools like Mailchimp and MailerLite include automation for welcome sequences.",
        ],
      },
    ],
    outcomes: [
      "Plan a digital marketing strategy across the right channels for a South African audience",
      "Create and manage a consistent social media presence that builds community",
      "Optimise web pages for Google search and set up a Google Business Profile",
      "Run and measure paid advertising campaigns on Google and Meta platforms",
    ],
  },

  /* ── Financial Literacy & Savings ────────────────────────────── */
  3: {
    courseId: 3,
    title: "Financial Literacy & Savings",
    lessons: [
      {
        id: "income-expenses-networth",
        title: "Understanding Income, Expenses, and Net Worth",
        duration: "10 min read",
        summary: "Get a clear picture of your financial position by understanding what flows in, what flows out, and what you own.",
        sections: [
          {
            heading: "The difference between income and expenses",
            body:
              "Income is all the money that comes into your life: your salary, freelance earnings, rental income, social grants, or any other source. Expenses are all the money that leaves: rent, food, transport, school fees, data, airtime, and entertainment. The gap between your income and your expenses is what you have left to save, invest, or pay off debt. Understanding this gap honestly is the starting point of every healthy financial life.",
          },
          {
            heading: "Gross versus net income",
            body:
              "Your gross income is the full amount you earn before any deductions. Your net income, often called take-home pay, is what you actually receive after SARS has taken income tax, your employer has deducted UIF contributions, and any medical aid or pension contributions have been removed. Always base your budget on your net income, not your gross, because you cannot spend money that has not reached your bank account.",
          },
          {
            heading: "Fixed and variable expenses",
            body:
              "Fixed expenses stay the same every month: rent, insurance premiums, school fees, and hire-purchase agreements. Variable expenses change month to month: groceries, petrol, electricity, and entertainment. Knowing which of your expenses are fixed helps you identify where you do and do not have flexibility. When times are tight, variable expenses are where you find room to cut, not fixed ones that carry contractual penalties.",
          },
          {
            heading: "Calculating your net worth",
            body:
              "Net worth is the total picture of your financial health. Add up everything you own (your assets): the money in your bank accounts, the value of your car, any property you own, and any savings or investments. Then subtract everything you owe (your liabilities): home loan balance, car finance, personal loans, credit card debt, and store account balances. The result is your net worth. It may be negative right now and that is fine, most young South Africans start with a negative net worth. What matters is that it grows over time.",
          },
        ],
        takeaways: [
          "Always budget using net (take-home) income, not gross salary.",
          "Fixed expenses are predictable, variable expenses are where you have flexibility to save.",
          "Net worth equals everything you own minus everything you owe.",
          "A negative net worth is a starting point, not a life sentence.",
        ],
      },
      {
        id: "personal-budget",
        title: "Building a Personal Budget That Works",
        duration: "11 min read",
        summary: "Create a practical monthly budget that covers your needs, trims waste, and leaves room to save.",
        sections: [
          {
            heading: "Why most budgets fail and how to avoid it",
            body:
              "Most budgets fail because they are built on aspirations rather than reality. People underestimate how much they spend on small daily purchases and set savings targets that are too aggressive to maintain. A budget that works acknowledges your real spending, makes deliberate choices about priorities, and allows for small pleasures so you do not feel deprived. Deprivation leads to spending binges that destroy months of progress.",
          },
          {
            heading: "The 50-30-20 framework",
            body:
              "A widely used starting framework is the 50-30-20 rule: spend 50 percent of your net income on needs (rent, food, transport, utilities, insurance), 30 percent on wants (eating out, entertainment, clothing beyond necessities), and put 20 percent toward savings and debt repayment. These are starting guidelines, not rigid rules. If you have high debt, you may need to put 30 or 40 percent toward debt repayment temporarily by cutting wants significantly.",
          },
          {
            heading: "Tracking your spending honestly",
            body:
              "You cannot improve what you do not measure. Track every purchase for at least one month before making any changes. Use a free budgeting app like 22seven (built specifically for South Africans and connects to major SA banks) or simply record everything in a spreadsheet or a notes app. Most people are surprised to discover how much they spend on impulse purchases, takeaways, and digital subscriptions they barely use.",
          },
          {
            heading: "Adjusting and sticking to your budget",
            body:
              "Review your budget at the end of every month. Compare what you planned to spend with what you actually spent. Do not judge yourself harshly over overspending, understand what triggered it. Adjust the following month's budget based on what you learned. Pay yourself first: set up an automatic transfer to your savings account on the same day your salary arrives, before you have a chance to spend it. Treat savings as a non-negotiable expense, not a leftover.",
          },
        ],
        takeaways: [
          "Build your budget on real historical spending, not on what you wish you spent.",
          "Start with 50 percent needs, 30 percent wants, 20 percent savings and debt repayment.",
          "Use 22seven or a spreadsheet to track every rand you spend for one full month.",
          "Pay yourself first by automating a savings transfer on your salary date.",
        ],
      },
      {
        id: "saving-emergency-fund",
        title: "Saving Strategies and Emergency Funds",
        duration: "11 min read",
        summary: "Build the savings habit, choose the right accounts, and protect yourself from financial emergencies.",
        sections: [
          {
            heading: "Why an emergency fund is your financial foundation",
            body:
              "An emergency fund is money set aside to cover unexpected, unavoidable expenses: a car repair, a medical bill, temporary job loss, or a broken appliance. Without one, any unexpected cost goes straight onto a credit card or loan, creating debt that can take years to clear. Financial experts recommend saving three to six months of living expenses in your emergency fund. For most South Africans, even one month of expenses saved is a transformative buffer.",
          },
          {
            heading: "Where to keep your emergency fund",
            body:
              "Your emergency fund should be accessible, but not so accessible that you dip into it for non-emergencies. A 32-day notice account at a South African bank pays better interest than a current account but still allows you to access the money within a month. Money Market accounts offered by major banks like Investec, Absa, and Standard Bank also offer competitive rates with reasonable liquidity. Avoid keeping your emergency fund in an investment account tied to the stock market, the value could drop exactly when you need it most.",
          },
          {
            heading: "Practical strategies to save consistently",
            body:
              "Automate your savings so that a fixed amount moves to a separate account the day your salary arrives. Use the round-up method: some South African banking apps let you automatically round up every purchase to the nearest R10 and save the difference. Use a separate account with no debit card linked to it, making it slightly inconvenient to access funds creates a natural barrier to impulse withdrawals. Challenge yourself to a no-spend week every quarter to boost your savings by an extra month's contribution.",
          },
          {
            heading: "Government savings tools available in South Africa",
            body:
              "The Tax-Free Savings Account (TFSA) allows South Africans to invest up to R36,000 per year (R500,000 lifetime limit) without paying tax on interest, dividends, or capital gains. This is one of the best financial products available to ordinary South Africans and is offered by banks, asset managers, and platforms like Easy Equities. Every employed South African also contributes to UIF (Unemployment Insurance Fund), which provides a payout if you lose your job, register with the Department of Employment and Labour to claim when needed.",
          },
        ],
        takeaways: [
          "Build an emergency fund covering at least one month of living expenses before investing.",
          "Keep your emergency fund in a notice or money market account, not in the stock market.",
          "Automate savings transfers on salary day to make saving effortless and consistent.",
          "A Tax-Free Savings Account (TFSA) is one of the best financial tools available to South Africans.",
        ],
      },
      {
        id: "investing-compound-interest",
        title: "Introduction to Investing and Compound Interest",
        duration: "12 min read",
        summary: "Understand how money grows over time and take your first steps into the South African investment landscape.",
        sections: [
          {
            heading: "The power of compound interest",
            body:
              "Compound interest means you earn interest not only on the money you deposit but also on the interest you have already earned. Over time this creates exponential growth. A person who starts saving R500 per month at age 22 will retire with significantly more than someone who starts saving R1,000 per month at age 35, even though the second person saves more money in total. Time in the market is the single most powerful variable in long-term wealth building, and starting early matters more than the amount.",
          },
          {
            heading: "Investment options available to South Africans",
            body:
              "Unit trusts (also called mutual funds) pool money from many investors to buy a diversified portfolio of shares, bonds, and other assets. They are regulated by the Financial Sector Conduct Authority (FSCA) and available from all major South African asset managers including Allan Gray, Coronation, and Ninety One. Exchange-Traded Funds (ETFs) are low-cost funds that track an index like the JSE Top 40 and are available on platforms like Easy Equities with minimum investments as low as R10. Both are appropriate starting points for beginner investors.",
          },
          {
            heading: "Understanding risk and return",
            body:
              "Higher potential returns come with higher risk. Cash in a savings account has near-zero risk but low returns. A JSE-listed share can grow dramatically but can also lose value. A diversified portfolio, one that spreads money across different asset classes and geographies, reduces the risk that any single bad investment destroys your wealth. As a general rule, money you may need within five years should not be in the stock market, as markets can take years to recover from a downturn.",
          },
          {
            heading: "Getting started with small amounts",
            body:
              "You do not need thousands of rands to start investing. Easy Equities allows you to buy fractional shares with as little as R1. FNB, Capitec, and other major banks offer automated investment products within their apps. The best investment account to start with in South Africa is a Tax-Free Savings Account (TFSA) because the returns are entirely tax-free for life. Open one, invest into a broad-market ETF, and add to it consistently every month.",
          },
        ],
        takeaways: [
          "Compound interest rewards those who start early, even small amounts grow significantly over decades.",
          "ETFs and unit trusts regulated by the FSCA are suitable, accessible starting points for new investors.",
          "Diversify across asset classes to protect yourself from the risk of any single investment failing.",
          "Start with a Tax-Free Savings Account on a platform like Easy Equities with as little as R10.",
        ],
      },
      {
        id: "debt-credit-scores",
        title: "Debt Management and Credit Scores",
        duration: "12 min read",
        summary: "Take control of your debt, understand how your credit score is calculated, and protect your financial reputation.",
        sections: [
          {
            heading: "Good debt versus bad debt",
            body:
              "Not all debt is equally harmful. A home loan builds an asset over time while also providing shelter, making it a form of good debt when managed responsibly. A student loan increases your earning capacity. Bad debt is borrowing to fund consumption: using a credit card to buy clothes, taking a personal loan to pay for a holiday, or using a store account to buy a new phone you cannot afford. Bad debt costs you money without building anything of lasting value.",
          },
          {
            heading: "How credit scores work in South Africa",
            body:
              "Your credit score is a number between 0 and 999 calculated by credit bureaus such as TransUnion, Experian, Compuscan, and XDS. It reflects how reliably you repay money you borrow. Payment history is the most important factor, followed by how much of your available credit you are using, the length of your credit history, and how many new credit applications you have made recently. A score above 670 is generally considered good by South African lenders. Under the National Credit Act (NCA), you are entitled to one free credit report per year from each bureau.",
          },
          {
            heading: "Strategies for paying off debt faster",
            body:
              "The debt avalanche method: list all your debts and pay the minimum on all of them, then put every extra rand toward the debt with the highest interest rate. Once it is paid off, roll that payment to the next highest rate. This is mathematically the fastest way to become debt-free and saves the most money in interest. The debt snowball method focuses on smallest balances first to build psychological momentum. Both work, choose the one you will actually stick to.",
          },
          {
            heading: "Avoiding over-indebtedness and the NCR",
            body:
              "If you are struggling with too much debt, the National Credit Regulator (NCR) oversees debt counselling in South Africa. A registered debt counsellor can negotiate reduced payments with your creditors and create a consolidated repayment plan. This goes on your credit report but protects you from legal action and asset repossession. Avoid unregistered 'debt rescue' companies that charge upfront fees without results. Verify any debt counsellor on the NCR's website at ncr.org.za.",
          },
        ],
        takeaways: [
          "Bad debt is borrowing for consumption, good debt builds assets or earning capacity.",
          "Your credit score is calculated by TransUnion, Experian, Compuscan, and XDS, and you get one free report per year.",
          "The debt avalanche method (highest interest rate first) saves the most money in interest.",
          "The NCR regulates debt counsellors in South Africa who can help if you are over-indebted.",
        ],
      },
    ],
    outcomes: [
      "Calculate your personal net worth and understand where your money actually goes",
      "Build and maintain a realistic monthly budget using proven frameworks",
      "Grow an emergency fund and choose appropriate savings accounts",
      "Start investing with small amounts using JSE ETFs and tax-free savings accounts",
    ],
  },

  /* ── Modern Agribusiness ──────────────────────────────────────── */
  4: {
    courseId: 4,
    title: "Modern Agribusiness",
    lessons: [
      {
        id: "agribusiness-overview",
        title: "Overview of Modern Agribusiness",
        duration: "11 min read",
        summary: "Understand the full agribusiness value chain in South Africa and the opportunities available to new and emerging farmers.",
        sections: [
          {
            heading: "What agribusiness means today",
            body:
              "Agribusiness refers to all activities related to agriculture as a commercial enterprise, from input supply (seeds, fertilisers, equipment) through primary production (farming) to processing, packaging, distribution, and retail. South Africa's agricultural sector contributes around two percent of GDP directly but supports far more economic activity through related industries. Understanding the full value chain helps a farmer or entrepreneur identify where the best opportunities lie, which is often not in primary production but in value-added processing and direct-to-consumer sales.",
          },
          {
            heading: "The state of South African agriculture",
            body:
              "South Africa is a net exporter of agricultural products including citrus, wine, maize, and stone fruit. Agri SA and the Agricultural Business Chamber (Agbiz) represent large commercial farmers, while the National African Farmers Union (NAFU) and the African Farmers Association of South Africa (AFASA) support smallholder and emerging farmers. The government's land reform programme and the Comprehensive Agricultural Support Programme (CASP) provide funding and infrastructure support to new farmers, though access to these resources requires proper registration and business planning.",
          },
          {
            heading: "Opportunities for small and emerging farmers",
            body:
              "Contract farming, where a processor or retailer agrees to buy your produce at a set price before planting, dramatically reduces market risk for small farmers. Niche markets such as organic produce, indigenous vegetables, and specialty herbs command premium prices and have less competition from large commercial farms. Urban agriculture including roof gardens, container farming, and aquaponics is growing rapidly in South African cities as consumers seek locally grown, fresh produce. The key is matching your production system to a real, accessible market.",
          },
          {
            heading: "Technology transforming African agriculture",
            body:
              "Precision agriculture uses sensors, drones, and satellite data to optimise irrigation, fertiliser application, and pest management, reducing input costs while improving yields. Weather forecasting apps and agricultural decision-support tools are now available in local languages. The Department of Agriculture, Land Reform and Rural Development (DALRRD) runs extension services that provide free technical advice to registered farmers. Mobile technology has made market price information, weather data, and financial services available to farmers in remote rural areas for the first time.",
          },
        ],
        takeaways: [
          "Agribusiness covers the full chain from input supply through production to retail, not just farming.",
          "Organisations like NAFU, AFASA, and CASP support emerging farmers with funding and training.",
          "Contract farming reduces market risk by securing a buyer before you plant.",
          "Precision agriculture tools and extension services from DALRRD help optimise farm decisions.",
        ],
      },
      {
        id: "soil-health",
        title: "Soil Health and Sustainable Farming",
        duration: "12 min read",
        summary: "Learn why healthy soil is a farmer's most valuable asset and how to build and protect it sustainably.",
        sections: [
          {
            heading: "Why soil health is the foundation of profitable farming",
            body:
              "Healthy soil is teeming with microorganisms, fungi, insects, and organic matter that work together to make nutrients available to plants, retain water, and resist erosion. Degraded soil produces lower yields, requires more fertiliser and water to achieve the same output, and eventually becomes unproductive. South Africa loses millions of tonnes of topsoil to erosion every year, a trend that threatens the long-term productivity of farmland. Protecting and building soil health is both an environmental responsibility and a sound business investment.",
          },
          {
            heading: "The role of organic matter and composting",
            body:
              "Organic matter, the remains of plants, animals, and microorganisms, is the single most important indicator of soil health. It improves water retention, provides slow-release nutrients, and feeds the soil life that drives a healthy growing environment. Composting crop residues, animal manure, kitchen waste, and cover crop material returns organic matter to the soil. Even small improvements in organic matter content significantly improve crop yields and reduce the need for expensive synthetic fertilisers.",
          },
          {
            heading: "Conservation tillage and cover crops",
            body:
              "Conventional tillage (ploughing) destroys soil structure, kills soil organisms, and exposes topsoil to wind and water erosion. Conservation tillage, including minimum tillage and no-till farming, leaves crop residues on the surface as a protective mulch and disturbs the soil as little as possible. Cover crops planted between main crop seasons suppress weeds, fix atmospheric nitrogen, prevent erosion, and feed soil microbes. Legume cover crops like cowpeas and vetch are particularly valuable in South African conditions because they fix free nitrogen that replaces costly fertiliser applications.",
          },
          {
            heading: "Managing soil pH and fertility",
            body:
              "Most crops grow best at a soil pH between 6.0 and 6.8. South African soils, particularly in higher-rainfall areas, tend to be acidic. Agricultural lime (calcium carbonate) is applied to raise soil pH and is one of the most cost-effective inputs a farmer can use. Soil testing, which can be done through Fertasa (the Fertiliser Association of Southern Africa) or private laboratories, tells you exactly what nutrients your soil lacks so you can apply only what is needed, saving money and preventing the pollution caused by over-fertilisation.",
          },
        ],
        takeaways: [
          "Healthy soil reduces input costs and is the most important long-term asset of any farm.",
          "Composting crop residues and manure builds organic matter and replaces costly fertiliser.",
          "No-till farming protects soil structure and reduces erosion, improving long-term productivity.",
          "Test your soil pH before applying lime or fertiliser to avoid wasting money on the wrong inputs.",
        ],
      },
      {
        id: "irrigation-water",
        title: "Irrigation Systems and Water Management",
        duration: "12 min read",
        summary: "Choose the right irrigation system for your farm, use water efficiently, and comply with South African water law.",
        sections: [
          {
            heading: "South Africa's water scarcity context",
            body:
              "South Africa is a water-scarce country, receiving less than half the global average annual rainfall. Agriculture accounts for roughly 60 percent of the country's total water use. Efficient irrigation is therefore both a legal obligation and a commercial necessity. The National Water Act of 1998 requires any person who uses water for irrigation to hold a water use licence issued by the Department of Water and Sanitation (DWS). Operating without a licence is illegal and can result in fines or forced cessation of operations.",
          },
          {
            heading: "Types of irrigation systems",
            body:
              "Flood irrigation, the oldest method, delivers water by flooding the field and is the least efficient, losing up to 50 percent of water to evaporation and deep percolation. Sprinkler irrigation mimics rainfall and is suitable for most field crops and pastures. Drip irrigation delivers water directly to the root zone of each plant through a network of pipes and emitters, reducing water use by 30 to 50 percent compared to sprinklers. Drip systems require higher upfront investment but typically pay for themselves within two to three seasons through water and fertiliser savings.",
          },
          {
            heading: "Scheduling and monitoring irrigation",
            body:
              "Irrigating at the wrong time or in the wrong amount wastes water and harms crops. Irrigate during the early morning or evening to minimise evaporation losses. Use soil moisture sensors or tensiometers to measure actual soil water content and irrigate only when the crop needs it, not on a fixed schedule. Weather-based irrigation scheduling tools that account for evapotranspiration are available through the South African Weather Service and ARC (Agricultural Research Council) crop guides.",
          },
          {
            heading: "Water harvesting and storage",
            body:
              "Rainwater harvesting, the collection and storage of runoff from roofs, roads, and land, can significantly supplement irrigation water on a farm. Farm dams and storage tanks allow rainfall captured during the wet season to be used during the dry season. Proper dam design including spillways and vegetation on embankments prevents structural failure during heavy rainfall. The ARC and local extension officers can assist with planning appropriate water storage systems that comply with water use regulations.",
          },
        ],
        takeaways: [
          "A water use licence from the Department of Water and Sanitation is legally required for irrigation.",
          "Drip irrigation reduces water use by 30 to 50 percent compared to sprinklers.",
          "Schedule irrigation based on soil moisture sensors, not a fixed calendar.",
          "Rainwater harvesting and farm dams reduce dependence on rivers and boreholes.",
        ],
      },
      {
        id: "agricultural-markets",
        title: "Accessing Agricultural Markets and Supply Chains",
        duration: "12 min read",
        summary: "Learn how to get your produce from farm to buyer at the best possible price through South Africa's market channels.",
        sections: [
          {
            heading: "Understanding South Africa's fresh produce markets",
            body:
              "The National Fresh Produce Market system, managed by the National Agricultural Marketing Council (NAMC), operates major markets in Johannesburg (the Joburg Market is the largest in Africa), Cape Town, Durban, Pretoria, and other centres. These markets operate through a commission agent system: you deliver your produce, a licensed agent sells it on your behalf to buyers, and you receive the sale price minus a commission of roughly 7.5 percent. Markets operate daily and prices are transparent, which protects sellers from individual buyer manipulation.",
          },
          {
            heading: "Selling directly to retailers and processors",
            body:
              "Large retailers such as Pick n Pay, Woolworths, Checkers, and SPAR have formal supplier programmes. They require consistent volume, strict quality and food safety standards (including GLOBALG.A.P. certification in many cases), regular delivery schedules, and sometimes extended payment terms of 30 to 60 days. This channel commands better prices than the fresh produce market but requires greater production reliability. Starting with smaller independent retailers, farm stalls, and direct-to-consumer models while building capacity is a sensible path for emerging farmers.",
          },
          {
            heading: "Agri-parks and cooperative models",
            body:
              "The Department of Agriculture's Agri-Parks programme aims to create rural infrastructure hubs where smallholder farmers can access mechanisation, storage, processing, and markets. Forming or joining an agricultural cooperative allows small farmers to aggregate production, negotiate better input prices, share equipment costs, and meet the volume requirements of large buyers that no individual farmer could satisfy alone. The Companies and Intellectual Property Commission (CIPC) registers cooperatives under the Co-operatives Act.",
          },
          {
            heading: "Export opportunities and certification",
            body:
              "South Africa exports agricultural products to the EU, UK, Middle East, and Asia. Access to most export markets requires compliance with the Perishable Products Export Control Board (PPECB) regulations, which enforce grading, packaging, and cold chain standards. Organic certification through bodies accredited by the South African National Accreditation System (SANAS) opens premium export markets. Citrus, avocados, macadamias, and table grapes are among South Africa's highest-earning export crops, and new market access agreements continue to be negotiated by the Department of Agriculture.",
          },
        ],
        takeaways: [
          "Fresh produce markets like the Joburg Market offer transparent daily pricing through licensed commission agents.",
          "Retailer supply programmes pay better prices but require consistent quality, volume, and delivery.",
          "Agricultural cooperatives help small farmers aggregate produce to meet large buyer requirements.",
          "PPECB certification and compliance is required to access most South African agricultural export markets.",
        ],
      },
      {
        id: "agribusiness-finance",
        title: "Agribusiness Finance and Record Keeping",
        duration: "12 min read",
        summary: "Access funding, manage farm cash flow, and keep the records that lenders and markets require.",
        sections: [
          {
            heading: "Sources of agricultural finance in South Africa",
            body:
              "The Land Bank is a state-owned development finance institution that provides loans specifically for agricultural development, land purchase, and working capital to farmers. ABSA's AgriFinance, Nedbank Agriculture, and FNB Agri-Business all offer commercial farm finance products. For emerging farmers, the Micro Agricultural Financial Institutions of South Africa (MAFISA), channelled through the Land Bank and development agencies, provides small production loans at subsidised rates. DALRRD's CASP programme provides grants for infrastructure development that do not need to be repaid.",
          },
          {
            heading: "Understanding the agricultural cash flow cycle",
            body:
              "Farming has a unique financial challenge: you spend money for months before you earn anything. Input costs for planting, irrigation, and labour all occur before harvest. This creates a cash flow gap that is typically funded by a production loan (also called a seasonal loan). Plan your cash flow on a monthly basis for the full growing season, knowing exactly when money goes out and when sales income arrives. A lender will always want to see this plan before approving a production loan.",
          },
          {
            heading: "Basic record keeping every farmer must do",
            body:
              "Keep records of all income and all expenditure with receipts or invoices. Record input quantities and costs (seeds, fertiliser, chemicals, fuel), equipment maintenance, labour costs including UIF contributions, and the quantity and price of every sale. These records serve multiple purposes: they allow you to calculate your profit or loss accurately, they support your tax return to SARS, they are required by most lenders before they will extend credit, and they help you identify which crops or activities are profitable and which are not.",
          },
          {
            heading: "Tax obligations for farmers",
            body:
              "Commercial farmers who earn above the SARS tax threshold (currently R95,750 per year for individuals under 65) must register as taxpayers with SARS. Farmers can elect to be taxed on an averaging basis, which smooths income tax liability over multiple years to account for the variable nature of agricultural income. VAT registration is required if your annual taxable turnover exceeds R1 million. Farm inputs including most agricultural chemicals and certain animal feeds are zero-rated for VAT purposes. Consult a registered tax practitioner familiar with agricultural tax to avoid costly mistakes.",
          },
        ],
        takeaways: [
          "The Land Bank and MAFISA are key sources of agricultural finance for emerging farmers.",
          "Plan a monthly cash flow for the full growing season before applying for a production loan.",
          "Keep every receipt and sales record because they support your tax return and loan applications.",
          "Farmers can use income tax averaging to smooth liability across good and bad harvest years.",
        ],
      },
    ],
    outcomes: [
      "Understand the full South African agribusiness value chain and identify opportunities",
      "Apply sustainable soil and water management practices to improve farm productivity",
      "Access fresh produce markets, retail channels, and export opportunities",
      "Manage farm cash flow, access agricultural finance, and maintain records for SARS",
    ],
  },

  /* ── Community Health Worker Training ────────────────────────── */
  5: {
    courseId: 5,
    title: "Community Health Worker Training",
    lessons: [
      {
        id: "chw-role",
        title: "The Role of a Community Health Worker",
        duration: "10 min read",
        summary: "Understand what a CHW does, their place in South Africa's health system, and the values that guide their work.",
        sections: [
          {
            heading: "Who community health workers are",
            body:
              "Community Health Workers (CHWs) are lay members of the community who are trained to promote health, provide basic care, and connect people to health services. In South Africa, CHWs are part of the Ward-Based Outreach Team (WBOT) model, which deploys teams of trained CHWs under the supervision of a professional nurse to serve a defined geographic area. CHWs are typically women from the communities they serve, which builds the trust that is essential for effective health promotion.",
          },
          {
            heading: "What CHWs do day to day",
            body:
              "A CHW conducts regular household visits to screen for common health conditions, monitor people on chronic medication, support pregnant women and mothers with young children, provide health education, identify sick or vulnerable people who need referral to a clinic or hospital, and report community health trends to their supervising nurse. They also play a vital role during disease outbreaks, including contact tracing and community education, as demonstrated powerfully during the COVID-19 pandemic.",
          },
          {
            heading: "CHWs in the South African health system",
            body:
              "South Africa's National Health Insurance (NHI) framework explicitly includes community-based services delivered by CHWs as part of the primary healthcare package. The National Department of Health has published training standards for CHWs. CHWs receive a stipend from provincial health departments, though advocacy organisations continue to push for formalisation of CHW employment and fair compensation. The South African Community Epidemiology Network (SACEN) and partners are working to improve training, supervision, and support for CHWs nationally.",
          },
          {
            heading: "Core values and professional conduct",
            body:
              "Confidentiality is non-negotiable: information shared by community members during a home visit must never be shared with others. Respect for patient autonomy means informing people of their options and supporting their decisions, not making decisions for them. Non-discrimination means providing the same quality of care regardless of a person's HIV status, sexual orientation, religion, or political affiliation. CHWs must also maintain their own health and seek support when they feel overwhelmed, because burnout in the CHW workforce is a real and documented challenge.",
          },
        ],
        takeaways: [
          "CHWs conduct household visits, screen for illness, and connect community members to health services.",
          "CHWs work under the supervision of a professional nurse as part of a Ward-Based Outreach Team.",
          "The NHI framework includes community-based CHW services as part of the national healthcare package.",
          "Confidentiality, respect, and non-discrimination are the foundational values of a CHW.",
        ],
      },
      {
        id: "first-aid-emergency",
        title: "Basic First Aid and Emergency Response",
        duration: "13 min read",
        summary: "Respond confidently to medical emergencies in the community, from bleeding to choking to cardiac arrest.",
        sections: [
          {
            heading: "The principles of first aid: DR ABC",
            body:
              "DR ABC stands for Danger, Response, Airway, Breathing, and Circulation. Before assisting anyone, check for Danger to yourself. Then check the person's Response: are they conscious? Open and clear the Airway by tilting the head back and lifting the chin. Check for Breathing by looking for chest rise, listening, and feeling for breath on your cheek. Check for Circulation by looking for severe bleeding. This systematic approach prevents you from missing critical steps in a panic.",
          },
          {
            heading: "Cardiopulmonary resuscitation (CPR)",
            body:
              "CPR is used when a person has no signs of breathing or pulse. Call for help or send someone to call 10177 (EMS) immediately, then begin chest compressions. Press down firmly in the centre of the chest, about 5 to 6 centimetres deep, at a rate of 100 to 120 compressions per minute. If trained in rescue breaths, give 30 compressions followed by 2 rescue breaths. If not trained or unwilling to give rescue breaths, hands-only CPR (continuous compressions) is still highly effective. Do not stop until professional help arrives or the person recovers.",
          },
          {
            heading: "Controlling bleeding",
            body:
              "Apply direct, firm pressure to a bleeding wound using the cleanest material available, a bandage, a cloth, or even a gloved hand. Do not remove the material if it soaks through, add more material on top and maintain pressure. For a limb wound with life-threatening bleeding that cannot be controlled with direct pressure, a tourniquet applied high on the limb above the wound is appropriate. Note the time the tourniquet was applied and inform emergency medical services immediately.",
          },
          {
            heading: "Managing choking and shock",
            body:
              "For a conscious adult who is choking and cannot cough or speak, give up to five firm back blows between the shoulder blades, then up to five abdominal thrusts (Heimlich manoeuvre). Alternate between the two until the obstruction clears. Shock is a life-threatening condition where organs are deprived of blood flow, caused by severe bleeding, dehydration, or allergic reaction. Signs include pale cool skin, rapid weak pulse, confusion, and rapid breathing. Lay the patient flat, keep them warm, and call for emergency services immediately.",
          },
          {
            heading: "Emergency numbers in South Africa",
            body:
              "Every CHW must know and have saved the key emergency numbers: 10177 for Emergency Medical Services (EMS), 10111 for Police, 112 from any mobile phone for all emergencies (this works even without airtime or a SIM card). Many rural communities are served by specific provincial EMS numbers. The Netcare 911 private ambulance service is reachable on 082 911. Know which number serves your community and ensure the people you visit also know it.",
          },
        ],
        takeaways: [
          "Use DR ABC (Danger, Response, Airway, Breathing, Circulation) to systematically assess every emergency.",
          "Hands-only CPR at 100 to 120 compressions per minute is effective even without rescue breaths.",
          "Control bleeding with firm, continuous direct pressure and do not remove soaked dressings.",
          "Save 10177 (EMS) and 112 (all emergencies from any mobile) for immediate access.",
        ],
      },
      {
        id: "maternal-child-health",
        title: "Maternal and Child Health",
        duration: "13 min read",
        summary: "Support healthy pregnancies, safe births, and child development through the critical first 1,000 days of life.",
        sections: [
          {
            heading: "The first 1,000 days",
            body:
              "The period from conception to a child's second birthday is known as the first 1,000 days, and it is the most critical window for physical and cognitive development. Nutrition, healthcare, stimulation, and safety during this period have lifelong consequences. CHWs who support families during this time can prevent stunting, malnutrition, developmental delays, and deaths that cost children and communities enormously. South Africa's child malnutrition rates remain a significant public health challenge despite economic development.",
          },
          {
            heading: "Supporting pregnant women",
            body:
              "Encourage pregnant women to register for antenatal care (ANC) at a public clinic as early as possible, ideally in the first trimester. South African public health guidelines recommend at least eight ANC visits. Remind pregnant women about the importance of taking folic acid and iron supplements, attending all scheduled visits, and recognising danger signs that require immediate medical attention: severe headache, visual disturbances, swelling of hands and face, reduced fetal movement, bleeding, and severe abdominal pain. Women with danger signs should go to the nearest facility immediately, not wait for a scheduled visit.",
          },
          {
            heading: "Newborn care and breastfeeding",
            body:
              "Breastfeeding is the single most effective nutritional intervention for newborns. The World Health Organisation and South African guidelines recommend exclusive breastfeeding for the first six months, meaning no water, formula, or food other than breast milk. Breast milk protects against infections, promotes healthy brain development, and strengthens the bond between mother and child. CHWs should support mothers to initiate breastfeeding within the first hour after birth, help troubleshoot common challenges, and address cultural beliefs that discourage breastfeeding.",
          },
          {
            heading: "Childhood vaccination and the Road to Health Booklet",
            body:
              "The Road to Health Booklet (RTHB) is the official health record given to every child at birth in South Africa. It tracks vaccinations, growth measurements, developmental milestones, and medical history. CHWs should check that every child they visit has a RTHB, that it is up to date, and that the child has received all scheduled vaccines through the Expanded Programme on Immunisation (EPI). Common vaccines include BCG at birth, polio, DTP-Hib-HepB, rotavirus, PCV, MMR, and varicella. Vaccine-preventable diseases continue to cause preventable childhood deaths in South Africa.",
          },
        ],
        takeaways: [
          "The first 1,000 days from conception to age two are the most critical for lifelong health.",
          "Encourage early ANC registration (first trimester) and adherence to all eight scheduled visits.",
          "Exclusive breastfeeding for six months is the single most effective newborn nutrition intervention.",
          "Check every child has an up-to-date Road to Health Booklet and all EPI vaccines.",
        ],
      },
      {
        id: "hiv-tb-communicable",
        title: "HIV, TB, and Communicable Disease Awareness",
        duration: "13 min read",
        summary: "Support prevention, testing, treatment adherence, and stigma reduction for HIV and TB in your community.",
        sections: [
          {
            heading: "HIV in South Africa: context and transmission",
            body:
              "South Africa has the largest HIV epidemic in the world, with approximately 7.8 million people living with HIV. HIV is transmitted through unprotected sexual intercourse, sharing needles, from mother to child during pregnancy, birth, or breastfeeding, and through blood transfusions (though blood is now screened). HIV is not transmitted through casual contact such as shaking hands, sharing food, hugging, or using the same toilet. Correcting misconceptions about transmission is a critical part of every CHW's work in reducing stigma.",
          },
          {
            heading: "Prevention and testing",
            body:
              "Consistent and correct condom use is the most effective way to prevent sexual transmission of HIV. Pre-Exposure Prophylaxis (PrEP) is a daily pill available free at public clinics that prevents HIV infection in HIV-negative people at high risk. HIV testing is available free at all public clinics and CHWs can facilitate community-based testing. Knowing your status allows people who are HIV-positive to start treatment immediately, preventing illness and reducing transmission to others.",
          },
          {
            heading: "Treatment adherence and the U=U message",
            body:
              "Antiretroviral therapy (ART) is available free to all HIV-positive South Africans through the public health system. When taken correctly every day, ART suppresses the HIV viral load to undetectable levels. A person with an undetectable viral load cannot sexually transmit HIV to a partner, a concept known as Undetectable equals Untransmittable (U=U). CHWs play a critical role in supporting ART adherence through regular home visits, tracking defaulters, addressing side effects, and helping people navigate the public clinic system.",
          },
          {
            heading: "Tuberculosis: South Africa's other epidemic",
            body:
              "South Africa has one of the highest TB incidence rates in the world, driven by overcrowding, poverty, malnutrition, and the HIV epidemic (HIV weakens immunity, making people far more susceptible to TB). TB is spread through the air when an infectious person coughs, sneezes, or speaks. Symptoms include a persistent cough lasting two or more weeks, night sweats, unexplained weight loss, and fever. CHWs should refer anyone with these symptoms for sputum testing at the nearest clinic and support TB patients to complete their full 6-month treatment course, as incomplete treatment leads to drug-resistant TB.",
          },
        ],
        takeaways: [
          "HIV is transmitted through sex, blood, and mother-to-child, not through casual contact.",
          "PrEP is a free, highly effective daily pill for HIV-negative people at high risk.",
          "An undetectable viral load on ART means a person cannot sexually transmit HIV (U=U).",
          "Refer anyone with a cough for two or more weeks for TB testing, and support full treatment completion.",
        ],
      },
      {
        id: "mental-health-first-aid",
        title: "Mental Health First Aid",
        duration: "12 min read",
        summary: "Recognise mental health crises in your community and respond with compassion and practical support.",
        sections: [
          {
            heading: "Mental health in the South African context",
            body:
              "South Africa has a significant mental health burden, with depression, anxiety, substance use disorders, and PTSD being among the most common conditions. The Mental Health Care Act of 2002 provides a legal framework for mental health services, but the reality is that psychiatrists, psychologists, and social workers are severely under-resourced in the public sector, particularly in rural areas. CHWs are often the first and sometimes only point of contact for people experiencing mental health difficulties, which makes basic mental health first aid a critical competency.",
          },
          {
            heading: "Recognising depression and anxiety",
            body:
              "Depression is more than sadness. It includes persistent low mood, loss of interest in activities once enjoyed, fatigue, difficulty concentrating, changes in sleep and appetite, feelings of worthlessness, and in severe cases, thoughts of suicide. Anxiety disorders involve excessive, persistent worry or fear that interferes with daily functioning. Both conditions are common, treatable, and nothing to be ashamed of. CHWs should screen for depression using validated tools like the PHQ-9 and refer those who screen positive to the clinic's primary healthcare nurse or social worker.",
          },
          {
            heading: "Responding to someone in crisis",
            body:
              "If someone tells you they are thinking about suicide or harming themselves, take it seriously. Do not dismiss it, argue with it, or promise not to tell anyone. Ask directly: 'Are you thinking about suicide?' Asking the question does not plant the idea. Listen without judgment. Remove or help secure any means of harm if possible. Do not leave the person alone. Refer to the South African Depression and Anxiety Group (SADAG) on 0800 456 789 or to the nearest emergency services. Your role is to be present, listen, and connect, not to provide therapy.",
          },
          {
            heading: "Substance use and referring to help",
            body:
              "Alcohol and drug misuse is a major contributor to mental health problems, GBV, accidents, and communicable disease transmission in South Africa. The South African National Council on Alcoholism and Drug Dependence (SANCA) operates treatment centres and a helpline at 0800 126 394. CHWs should approach substance use without judgment, understanding it as a health condition rather than a moral failing. Motivational conversations that explore the person's own goals can be more effective than lectures. Refer people who want help to SANCA or to the local clinic's social worker.",
          },
        ],
        takeaways: [
          "CHWs are often the first contact for mental health difficulties in under-resourced communities.",
          "Screen for depression using the PHQ-9 and refer those who screen positive to a clinic nurse.",
          "Ask directly about suicidal thoughts, take every disclosure seriously, and do not leave the person alone.",
          "SADAG (0800 456 789) and SANCA (0800 126 394) are free mental health support resources.",
        ],
      },
      {
        id: "health-education-outreach",
        title: "Health Education and Community Outreach",
        duration: "11 min read",
        summary: "Plan and deliver effective health education sessions that change behaviour and improve community health outcomes.",
        sections: [
          {
            heading: "Principles of effective health education",
            body:
              "Health education works best when it is relevant to people's daily lives, delivered in their home language, and presented in a way that respects their existing knowledge and beliefs. Lecturing people about what they should do rarely changes behaviour. The most effective approach is participatory: ask questions, listen to what community members already know, build on that knowledge, and address misconceptions respectfully. People change behaviour when they understand the personal relevance of the change and feel capable of making it.",
          },
          {
            heading: "Planning a community health education session",
            body:
              "Define one clear, specific message or behaviour change you want the session to achieve. Identify your audience: mothers of young children, elderly men, adolescent girls. Choose a time and location that is convenient for your target group. Prepare simple, clear materials in the local language. Plan an interactive activity, a role play, a demonstration, a group discussion, or a case study, not a one-way presentation. Prepare for questions and know in advance which health messages you are confident about and which ones to refer to a professional nurse.",
          },
          {
            heading: "Household visits and motivational interviewing",
            body:
              "The household visit is the CHW's most powerful tool. Unlike a clinic appointment, it reaches people in their own environment, where the real determinants of their health are visible. During visits, use motivational interviewing: ask open questions about the person's own goals, reflect back what you hear, and explore the gap between their goals and their current behaviour. Avoid lecturing, threatening, or using guilt. People who feel respected and heard are far more likely to make and sustain health behaviour changes than those who feel judged.",
          },
          {
            heading: "Recording and reporting health information",
            body:
              "Accurate records are the foundation of a functional community health programme. Record every household visit, including the health conditions identified, referrals made, and advice given. Use the standard registers and forms provided by your supervising facility. These records feed into the District Health Information System (DHIS2), which the National Department of Health uses to track disease trends, allocate resources, and plan interventions. Incomplete records undermine the evidence base that supports more resources and better services for your community.",
          },
        ],
        takeaways: [
          "Participatory, locally relevant education delivered in the home language changes behaviour most effectively.",
          "Plan every session around one specific behaviour change with an interactive activity, not a lecture.",
          "Use motivational interviewing during household visits: ask, listen, and reflect rather than lecture.",
          "Accurate visit records feed into DHIS2 and support better resource allocation for your community.",
        ],
      },
    ],
    outcomes: [
      "Describe the CHW's role within the South African Ward-Based Outreach Team model",
      "Apply basic first aid and emergency response procedures confidently in community settings",
      "Support maternal and child health, HIV, and TB prevention and treatment adherence",
      "Plan and deliver effective health education sessions using participatory methods",
    ],
  },

  /* ── Starting a Small Business ───────────────────────────────── */
  6: {
    courseId: 6,
    title: "Starting a Small Business",
    lessons: [
      {
        id: "business-idea-validation",
        title: "Identifying a Business Idea and Validating It",
        duration: "11 min read",
        summary: "Find a business idea worth pursuing, test it with real customers before investing, and avoid the most common startup mistakes.",
        sections: [
          {
            heading: "Where real business ideas come from",
            body:
              "The best business ideas solve a problem that a specific group of people experiences and is willing to pay to have solved. Start by identifying problems in your own life, community, or industry. Look at what people complain about, what gaps exist in local markets, and what services are unavailable or poorly served in your area. In South Africa, opportunities exist across township commerce, digital services, agricultural value addition, healthcare support, and education. The idea does not need to be revolutionary, executing a familiar business better than competitors is a completely valid strategy.",
          },
          {
            heading: "Testing your idea before spending money",
            body:
              "Validation means finding evidence that real people will pay for your idea before you invest significant time and money. Talk to at least twenty potential customers and ask about their problems, not about your solution. Offer a pre-sale or deposit at a discounted price and see if anyone commits. Create a simple one-page website describing the product or service and see how many people click an 'order now' button. Build a minimal version of the product (a minimum viable product or MVP) and charge someone for it. Any actual payment is the strongest possible validation.",
          },
          {
            heading: "Researching your market in South Africa",
            body:
              "Free market research resources include Stats SA (statssa.gov.za), which publishes data on population, income levels, and economic activity by province and municipality. The Small Enterprise Development Agency (SEDA) and Small Enterprise Finance Agency (SEFA) both publish sector research and can connect you to free business advisors. Trade associations often share market data with prospective members. Visiting competitors, counting customers entering a competitor's premises for an hour, and talking to suppliers are all low-cost ways to understand a market before entering it.",
          },
          {
            heading: "The most common idea mistakes and how to avoid them",
            body:
              "The most common mistake is building a product for months without speaking to a single customer. Another is confusing personal passion with market demand, you may love something that nobody else wants to pay for. A third is targeting everyone: a business that tries to serve all customers typically ends up serving none well. Define a specific, reachable customer segment and solve their specific problem better than anyone else. Start small, learn quickly, and adapt rather than planning for years and launching once.",
          },
        ],
        takeaways: [
          "Start with a real problem experienced by a specific group of people who will pay to have it solved.",
          "Get at least one actual payment from a real customer before investing significantly.",
          "Use Stats SA and SEDA for free South African market data and business advisory support.",
          "Target a specific customer segment first, not the entire market.",
        ],
      },
      {
        id: "business-plan",
        title: "Writing a Simple Business Plan",
        duration: "12 min read",
        summary: "Write a practical business plan that guides your decisions and satisfies lenders, investors, and grant committees.",
        sections: [
          {
            heading: "Why you need a business plan",
            body:
              "A business plan forces you to think through every aspect of your business in writing: who your customers are, how you will reach them, what it will cost to operate, and how you will make a profit. Almost every South African funder, including SEFA, IDC, NEF, and most banks, requires a business plan before approving finance. Beyond funding, the discipline of writing a plan reduces surprises and helps you spot problems before they cost you money. Your plan does not need to be long, a clear, honest 10-page plan beats a padded 50-page one every time.",
          },
          {
            heading: "Key sections of a business plan",
            body:
              "A standard South African business plan includes an executive summary (a one-page overview of the entire plan), a company description (what you do, where, and for whom), a market analysis (who your customers are and how big the market is), a competitive analysis (who your competitors are and what your advantage is), a marketing and sales plan (how you will find and keep customers), an operations plan (how you will deliver the product or service), a management section (who leads the business and what their experience is), and a financial plan (startup costs, projected income and expenses, and break-even analysis).",
          },
          {
            heading: "Building realistic financial projections",
            body:
              "Start with your costs, not your desired revenue. List every expense you will incur in the first 12 months: rent, salaries, stock, equipment, marketing, insurance, accounting, and registration fees. Then estimate how many units you can realistically sell each month based on your validation research, not optimism. Apply a conservative estimate and then halve it for your planning: real revenue is almost always lower and real costs are almost always higher than a first-time entrepreneur expects. This gives you a realistic sense of how much startup capital you need.",
          },
          {
            heading: "Free business plan support in South Africa",
            body:
              "SEDA operates 52 enterprise development centres across South Africa offering free business advisory services including help writing a business plan. The Small Business Development Ministry's enterprise portal at smmesa.gov.za aggregates support resources from across government. The NYDA (National Youth Development Agency) provides free business training, mentorship, and access to finance for entrepreneurs between 14 and 35 years of age. Universities of Technology and business schools often offer free clinics where students and lecturers provide business planning assistance.",
          },
        ],
        takeaways: [
          "A business plan is required by most SA funders including SEFA, IDC, and NEF before approving finance.",
          "Include these core sections: executive summary, market analysis, operations, management, and financials.",
          "Estimate costs first, then conservative revenue, and halve your revenue projection for realistic planning.",
          "SEDA's 52 enterprise development centres offer free business plan support across South Africa.",
        ],
      },
      {
        id: "business-registration-sa",
        title: "Registering Your Business in South Africa",
        duration: "11 min read",
        summary: "Register your business correctly with CIPC, SARS, and other relevant authorities to operate legally and access opportunities.",
        sections: [
          {
            heading: "Why formal registration matters",
            body:
              "Operating informally closes the door to most government contracts, formal retail supply agreements, development finance, and many business banking products. Formal registration also protects your personal assets by separating them legally from the business, limits your personal liability for business debts, and allows you to open a business bank account which builds a financial track record. For many South Africans, registering a business is a significant milestone in transitioning from the informal to the formal economy.",
          },
          {
            heading: "Registering with CIPC",
            body:
              "The Companies and Intellectual Property Commission (CIPC) is the government agency responsible for registering companies and cooperatives. The most common business structure for a small business is a Private Company (Pty) Ltd, which requires at least one director and one shareholder. Registration is done online through the CIPC eServices portal at eservices.cipc.co.za and costs R175. You will receive a company registration number (CK number), a Memorandum of Incorporation (MOI), and a certificate of incorporation. The process takes two to five business days if your chosen name is available.",
          },
          {
            heading: "Tax registration with SARS",
            body:
              "Once registered with CIPC, register your company with SARS for income tax using eFiling at efiling.sars.gov.za. If your turnover will exceed R1 million per year, VAT registration is compulsory. If you have employees, you must also register as an employer for PAYE (Pay As You Earn) withholding, UIF (Unemployment Insurance Fund) contributions, and possibly SDL (Skills Development Levy). The Small Business Corporation (SBC) tax regime offers reduced tax rates for businesses with annual turnover below R20 million, so discuss this with a tax practitioner.",
          },
          {
            heading: "Other important registrations",
            body:
              "Depending on your industry, additional registrations may be required. Food businesses need registration with the local municipality's environmental health department. Businesses with employees must register with the Department of Employment and Labour for Compensation for Occupational Injuries and Diseases (COID or Workmen's Compensation). Some sectors require specific licences: liquor, construction, financial services, and healthcare all have sector-specific regulatory bodies. Failing to obtain required licences exposes you to fines, forced closure, and personal liability.",
          },
        ],
        takeaways: [
          "Formal registration unlocks government contracts, development finance, and business banking accounts.",
          "Register a Pty Ltd online at CIPC eServices for R175 with one director and one shareholder.",
          "Register for income tax with SARS via eFiling, and for VAT if turnover exceeds R1 million.",
          "Check whether your specific industry requires additional licences before starting to trade.",
        ],
      },
      {
        id: "pricing-sales-customers",
        title: "Pricing, Sales, and Customer Acquisition",
        duration: "12 min read",
        summary: "Set prices that are competitive and profitable, and build a repeatable process for finding and keeping customers.",
        sections: [
          {
            heading: "How to price your product or service correctly",
            body:
              "Many small businesses price too low, believing it will attract customers, but low prices without sufficient margin guarantee failure. Start with cost-plus pricing: calculate the total cost of producing or delivering one unit, then add your desired profit margin. Next check that your price is competitive with alternatives in your market. Finally consider value-based pricing for premium or differentiated products, where the price reflects the value to the customer rather than just the cost to you. A price that is too low undervalues your work and attracts price-sensitive customers who have no loyalty.",
          },
          {
            heading: "Understanding your break-even point",
            body:
              "Your break-even point is the number of units you need to sell each month to cover all your costs and make zero profit. Calculate it by dividing your total monthly fixed costs by your gross margin per unit (selling price minus variable cost per unit). Knowing your break-even point tells you exactly how much you need to sell before you make a profit. It also tells you the commercial viability of the business at your current pricing and cost structure. If the break-even point is unrealistically high, you must either reduce costs or increase your price.",
          },
          {
            heading: "Finding your first customers",
            body:
              "Your first customers will almost certainly come from your personal network: friends, family, former colleagues, and community members. Be explicit that you have started a business and ask them to support you and to refer you to others. Join a local business chamber, BNI chapter, or industry association where referrals flow freely. Use WhatsApp broadcast lists, Facebook groups specific to your area or industry, and community notice boards. Government portals like the CSD (Central Supplier Database at csd.gov.za) register suppliers for government procurement opportunities.",
          },
          {
            heading: "Turning one-time buyers into loyal customers",
            body:
              "Customer retention is far cheaper than customer acquisition. A satisfied customer who returns spends more, costs less to serve, and refers others. Follow up after every purchase or service to ask if they were satisfied. Resolve complaints quickly and generously, a customer whose complaint is handled well often becomes more loyal than one who never had a problem. Create a simple loyalty programme, even just a stamp card, to reward repeat purchases. Ask satisfied customers for a Google review or a WhatsApp testimonial you can share.",
          },
        ],
        takeaways: [
          "Price above cost and above what the market will bear, never below your break-even margin.",
          "Calculate your monthly break-even point before committing to a pricing structure.",
          "Your first customers come from your network and referrals, be explicit that you need their support.",
          "Retaining a customer costs far less than acquiring a new one, invest in follow-up and complaints resolution.",
        ],
      },
      {
        id: "cashflow-accounting",
        title: "Managing Cash Flow and Basic Accounting",
        duration: "12 min read",
        summary: "Keep your business financially healthy by managing the timing of cash, maintaining records, and understanding your numbers.",
        sections: [
          {
            heading: "Why cash flow kills more businesses than lack of profit",
            body:
              "A business can be profitable on paper while running out of cash at the same time. This happens when customers owe you money (debtors) but you owe your suppliers money (creditors) right now. Cash flow management is the art of ensuring that money arrives in your account before you need to pay your obligations. South African research consistently identifies poor cash flow management as the primary cause of small business failure within the first two years of operation.",
          },
          {
            heading: "Building a monthly cash flow forecast",
            body:
              "A cash flow forecast lists the actual cash you expect to receive and the actual cash you expect to pay out in each future month. It is not the same as a profit forecast: a sale made in January but paid in March appears in March on a cash flow forecast, not January. Build a rolling 3-month cash flow forecast and update it every week. When the forecast shows an upcoming cash shortfall, you have time to act: speed up collections, delay discretionary spending, draw on an overdraft, or approach a lender before the crisis hits.",
          },
          {
            heading: "Basic bookkeeping every business must do",
            body:
              "Issue a numbered invoice for every sale. Keep every supplier invoice and receipt. Record every transaction (income and expenditure) in a simple cashbook using a spreadsheet or accounting software. Reconcile your cashbook against your bank statement every month to catch errors and identify any unauthorised transactions. Separate your business and personal money completely by operating through a business bank account. Mixing personal and business funds makes accounting impossible, undermines your tax position, and can expose you to personal liability for business debts.",
          },
          {
            heading: "Affordable accounting tools and SARS compliance",
            body:
              "Accounting software like Sage Business Cloud Accounting, QuickBooks, and Xero are used by thousands of South African small businesses and offer cloud-based bookkeeping at reasonable monthly costs. Many offer free trials and local support. Sage Pastel was built in South Africa and is widely used by SA accountants. File your company's annual tax return with SARS within 12 months of the end of your financial year, or sooner if SARS issues an assessment. Late filing attracts penalties. If your turnover is below R1 million, you may qualify for the Turnover Tax (TT) system which replaces income tax, VAT, CGT, and dividends tax with a single simplified payment.",
          },
        ],
        takeaways: [
          "A profitable business can still fail if cash runs out while waiting for customers to pay.",
          "Build and update a 3-month rolling cash flow forecast weekly to anticipate shortfalls.",
          "Issue numbered invoices for every sale, keep all receipts, and reconcile monthly against your bank statement.",
          "File your annual company tax return with SARS within 12 months and consider the Turnover Tax option if under R1 million.",
        ],
      },
    ],
    outcomes: [
      "Validate a business idea with real customers before investing significant money",
      "Write a business plan and register a company with CIPC and SARS in South Africa",
      "Set profitable prices and build a repeatable customer acquisition process",
      "Manage cash flow, maintain basic books, and meet SARS compliance obligations",
    ],
  },
};

/* ── Credential ID helper ─────────────────────────────────────── */
const COURSE_CODES: Record<number, string> = {
  1: "WDB", // Web Development Basics
  2: "DMF", // Digital Marketing Fundamentals
  3: "FLS", // Financial Literacy & Savings
  4: "MAB", // Modern Agribusiness
  5: "CHW", // Community Health Worker Training
  6: "SSB", // Starting a Small Business
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
