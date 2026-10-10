# Implementation Plan — Three Frontend Features

## Project Context

- **Framework**: Next.js 14 App Router, TypeScript, `src/` layout
- **Styling**: Tailwind CSS v3.4, `btn-primary`, `btn-secondary`, `card`, `input` utility classes in globals.css
- **Animation**: Framer Motion v11 — containerVariants (staggerChildren 0.1) + itemVariants (opacity+y, duration 0.4)
- **Icons**: Lucide React — flat icons only, no bg-* or rounded-* wrapper divs
- **Brand green**: #00A651 (`text-brand-green`, `bg-brand-green`, `border-brand-green`)
- **Card hover**: `whileHover={{ y: -4, boxShadow: '6px 6px 0px #00A651' }}` + `style={{ boxShadow: '0px 0px 0px #00A651' }}`
- **Build/verify**: `npm run build` from repo root — zero TypeScript errors required
- **No new npm packages**
- **No emojis, no em dashes — use commas**
- **SA provinces**: Eastern Cape, Free State, Gauteng, KwaZulu-Natal, Limpopo, Mpumalanga, North West, Northern Cape, Western Cape

---

## Feature 1: Course Detail Page

- [ ] 1. Create `src/app/(app)/courses/[id]/page.tsx` — extended course data + detail layout

  Copy all 7 courses from `courses/page.tsx` into a local `coursesData` array and add three new fields to each entry:
  - `lessons`: array of 4-6 lesson title strings (topically relevant to each course)
  - `outcomes`: array of 3-4 learning outcome strings
  - `instructor_bio`: one sentence about the instructor

  Use `"use client"`, import `useRouter` and `useParams` from `'next/navigation'`. Read `params.id` via `useParams()`. Find the course by `course.id === Number(params.id)`. If not found, render a centred "Course not found" message with a `router.back()` button.

  Layout (all inside `motion.div initial="hidden" animate="visible" variants={containerVariants}` with `max-w-5xl mx-auto space-y-6`):

  1. Back button row: `<button onClick={() => router.back()}>` with flat `ArrowLeft` icon (`text-gray-500 hover:text-brand-green`), label "Back to Courses".
  2. Hero `motion.div` (card class): course title (`text-3xl font-bold`), category badge, level badge, `Star` rating, `Users` enrolled count, `Clock` duration.
  3. Two-column grid: `lg:grid lg:grid-cols-3 gap-8`.
     - Left col (`lg:col-span-2`): (a) video thumbnail `div h-64 rounded-2xl overflow-hidden border border-gray-100` with same `<video autoPlay muted playsInline disablePictureInPicture controlsList="nodownload">` pattern from `courses/page.tsx`; (b) "Course Lessons" section heading with flat `BookOpen` icon (`text-brand-green`), then ordered list of lesson titles each with flat `BookOpen w-4 h-4 text-brand-green`; (c) "What You Will Learn" section heading with flat `CheckCircle2` icon, then list of outcome strings each with flat `CheckCircle2 w-4 h-4 text-brand-green`.
     - Right col: `sticky top-8 card`. "Enroll Free" `btn-primary` full-width button. Instructor name as `font-semibold text-gray-900`, bio as `text-sm text-gray-500`. Compact stats list (rating, enrolled, duration).

  Each major section is a `motion.div variants={itemVariants}`. No icon background containers anywhere.

  **Files**: `src/app/(app)/courses/[id]/page.tsx` (create)

  **Verify**: `npm run build` — zero TypeScript errors.

---

- [ ] 2. Wire up `courses/page.tsx` — wrap each card in a Link to `/courses/${course.id}`

  Import `Link` from `'next/link'`. Wrap the existing `motion.div` card (the one with `whileHover`) in `<Link href={`/courses/${course.id}`} className="block">`. Keep all card internals unchanged. The "Enroll Free" button inside the card will also navigate — that is acceptable.

  **Files**: `src/app/(app)/courses/page.tsx` (modify)

  **Verify**: `npm run build` — zero TypeScript errors. Dev server: clicking a course card navigates to `/courses/${id}`.

---

## Feature 2: CV Builder Page

- [ ] 3. Add CV Builder to Sidebar navItems

  Import `FileText` from `'lucide-react'` in `Sidebar.tsx`. In the `navItems` array, insert `{ label: 'CV Builder', href: '/cv-builder', icon: FileText }` between the `{ href: '/certificates' }` entry and the `{ href: '/ask-ai' }` entry. No other changes.

  **Files**: `src/components/Sidebar.tsx` (modify)

  **Verify**: `npm run build` — zero TypeScript errors. Dev server: sidebar shows "CV Builder" between Certificates and Ask.

---

- [ ] 4. Create `src/app/(app)/cv-builder/page.tsx` — two choice cards + 4-step CV form

  `"use client"`. Define TypeScript interfaces: `PersonalDetails`, `EducationEntry` (with `id: number`), `ExperienceEntry` (with `id: number`, `isPresent: boolean`).

  Imports from `lucide-react`: `FileText`, `User`, `Mail`, `Phone`, `MapPin`, `ChevronDown`, `Plus`, `Trash2`, `Download`, `CheckCircle2`, `Briefcase`, `BookOpen`, `X`.

  **Choice cards** (top of page, before step form): two cards in a `grid grid-cols-2 gap-4`. Left card "Build My CV" (selected by default: `border-brand-green bg-brand-green/5`), right card "Download Template" (`border-gray-200`). Use `useState<'build'|'template'>` to track. When "Download Template" is clicked, immediately trigger `downloadWord()` with a blank template and keep the card highlighted. When "Build My CV" is selected, show the step form below.

  **Step indicator**: `useState<number>` for `currentStep` (1-4). Render 4 numbered circles connected by lines. Active/completed circle: `bg-brand-green text-white`. Pending: `border-2 border-gray-200 text-gray-400`. Labels below: "Personal", "Education", "Experience", "Skills".

  **Step 1 — Personal Details**: `card p-6`. Fields using `input` class with left-positioned Lucide icons (same absolute-positioned icon pattern as `profile/page.tsx`): Full Name (required), Email (email, required), Phone (tel, maxLength 10), City, Province (select SA_PROVINCES), LinkedIn (optional, placeholder `https://linkedin.com/in/yourname`).

  **Step 2 — Education**: `card p-6`. `useState<EducationEntry[]>`. Each entry rendered as a bordered sub-card with: Institution, Qualification, Year, Subjects (textarea). Remove button: flat `Trash2` icon (`text-red-400`). "Add Education" button: `btn-secondary` with flat `Plus` icon.

  **Step 3 — Experience**: Same pattern. Each `ExperienceEntry`: Job Title, Company, Start Year, End Year (disabled when `isPresent` is true), "Currently working here" checkbox, Responsibilities (textarea). "Add Experience" button: `btn-secondary` with flat `Plus` icon.

  **Step 4 — Skills and Summary**: (a) Skill chips: text input + `btn-secondary` "Add" button. Chips: `inline-flex items-center gap-1 bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-full px-3 py-1 text-sm`. Each chip has a flat `X` button to remove. (b) Professional Summary: `textarea` with `maxLength={300}` rows={5}. Live counter `"{length} / 300"` right-aligned, `text-sm text-gray-400`.

  **Navigation row**: Steps 1-3: "Back" (`btn-secondary`) left, "Next" (`btn-primary`) right (hidden on step 1). Step 4: "Back" (`btn-secondary`), "Download Word" (`btn-secondary`, flat `Download` icon), "Download PDF" (`btn-primary`, flat `Download` icon).

  **`downloadPDF()`**: Build a complete HTML string with inline CSS (black text, `font-family: Arial`, max-width 700px, `#00A651` for section headings, print-safe layout). Open new window with `window.open()`, `document.write()` the HTML, then call `window.print()` on the new window. CV sections: name as `<h1>`, contact row, Education, Experience, Skills, Summary.

  **`downloadWord()`**: Build same HTML string. Create `new Blob([html], { type: 'application/msword' })`. Create a temp `<a>` element, set `href = URL.createObjectURL(blob)`, `download = 'cv.doc'`, append to body, click, then remove. For the blank template (from choice card), use placeholder text like "Your Name", "your@email.com" etc.

  Wrap entire page in `motion.div initial="hidden" animate="visible" variants={containerVariants}`. Each step card and the choice cards area use `motion.div variants={itemVariants}`.

  **Files**: `src/app/(app)/cv-builder/page.tsx` (create)

  **Verify**: `npm run build` — zero TypeScript errors. Dev server: all 4 steps navigate, add/remove entries work, both download buttons function.

---

## Feature 3: Terms of Service Page

- [ ] 5. Create `src/app/terms/page.tsx` — public Terms of Service page

  Follow `src/app/privacy/page.tsx` exactly for structure, imports, and rendering pattern. Changes from privacy:
  - Replace `Shield` import with `FileText`
  - Heading: "Terms of Service"
  - Subtitle: "Last updated: October 2026"
  - Intro paragraph: "Please read these terms carefully before using FuturePath. By registering or using the platform, you agree to be bound by these terms."
  - Yellow notice content: "Important: These terms form a binding agreement between you and FuturePath. If you do not agree to these terms, you may not use the platform. Continued use of FuturePath after any updates to these terms constitutes your acceptance of the revised terms."
  - Footer note: change "this policy" to "these terms"

  Define `sections` array with 13 entries (same shape: `{ title, content }`). Use commas, not em dashes. No emojis. SA-appropriate content:

  1. Acceptance of Terms
  2. Description of Service
  3. Eligibility
  4. User Accounts and Registration
  5. Acceptable Use
  6. Intellectual Property
  7. User-Generated Content
  8. Third-Party Links and Services
  9. Disclaimer of Warranties
  10. Limitation of Liability
  11. Termination
  12. Changes to These Terms
  13. Governing Law and Jurisdiction — explicitly references South African law and courts

  Render with the identical `sections.map(...)` pattern from `privacy/page.tsx` (`h2` title, `whitespace-pre-line` content div, `border-b` divider after each).

  **Files**: `src/app/terms/page.tsx` (create)

  **Verify**: `npm run build` — zero TypeScript errors. Dev server: `/terms` renders with all 13 sections, visually matches `/privacy`.

---

## File Summary

| Action | Path |
|--------|------|
| Create | `src/app/(app)/courses/[id]/page.tsx` |
| Modify | `src/app/(app)/courses/page.tsx` |
| Modify | `src/components/Sidebar.tsx` |
| Create | `src/app/(app)/cv-builder/page.tsx` |
| Create | `src/app/terms/page.tsx` |
