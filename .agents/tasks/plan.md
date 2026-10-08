# Implementation Plan — Dark Mode, Loading Skeletons, Notifications Bell

## Project Context

- **Framework**: Next.js 14.2 (`app` router, `src/` layout)
- **Styling**: Tailwind CSS v3.4 (`tailwind.config.ts`), `globals.css` uses `@layer base` / `@layer components`
- **Animation**: Framer Motion v11
- **Icons**: Lucide React v1.53
- **Build**: `npm run build` (Next.js type-check included)
- **Existing providers**: `ProfileProvider` in `src/app/(app)/layout.tsx`
- **Existing patterns**: context in `src/lib/`, `"use client"` at top of every interactive file, Tailwind utility classes inline, no separate CSS modules

**Pre-existing build error** (unrelated to this task but blocks `npm run build`):  
`src/lib/chatEngine.ts` line 319 — `[...new Set(...)]` fails with `target` below es2015. Fixed in step 1 below by converting to `Array.from(new Set(...))` which compiles at any target.

---

## Plan

- [ ] 1. Fix pre-existing TypeScript build error in `chatEngine.ts`

  Line 319 spreads a `Set` with `[...new Set(...)]` which the TypeScript compiler rejects at the current target. Replace it with `Array.from(new Set(...))` which works at any target without changing behaviour.

  **File**: `src/lib/chatEngine.ts`

  **Change**: On line 319, replace:
  ```ts
  const guesses = [...new Set(weak.filter((w) => w.it.sample).map((w) => w.it.sample))].slice(0, 3);
  ```
  with:
  ```ts
  const guesses = Array.from(new Set(weak.filter((w) => w.it.sample).map((w) => w.it.sample))).slice(0, 3);
  ```

  **Verify**: `npm run build` — build should now compile without that error (other errors may still exist until later steps complete).

---

- [ ] 2. Enable Tailwind dark mode (class strategy)

  Add `darkMode: 'class'` to `tailwind.config.ts` so `dark:` variants are activated when the `dark` class is on `<html>`. This must come before any dark-mode Tailwind classes are written.

  **File**: `tailwind.config.ts`

  **Change**: Add `darkMode: 'class'` as a top-level key immediately after the opening of the config object:
  ```ts
  const config: Config = {
    darkMode: 'class',
    content: [ ... ],
    ...
  };
  ```

  **Verify**: `npm run build` — no new TypeScript errors; the `dark:` classes introduced in later steps will compile without Tailwind warnings.

---

- [ ] 3. Create `ThemeContext.tsx` — theme state, localStorage persistence, OS preference, `<html>` class toggle

  This is the single source of truth for light/dark. On first mount, reads `localStorage` key `fp-theme`; if absent falls back to `window.matchMedia('(prefers-color-scheme: dark)')`. Toggles `document.documentElement.classList` to add/remove `dark`. Exports `ThemeProvider` and `useTheme()` hook.

  **File**: `src/lib/ThemeContext.tsx` (create new)

  **Content**:
  ```tsx
  "use client";

  import { createContext, useContext, useEffect, useState, ReactNode } from "react";

  type Theme = "light" | "dark";

  interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
  }

  const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => {},
  });

  export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");

    // Initialise from localStorage or OS preference (runs once on mount)
    useEffect(() => {
      const stored = localStorage.getItem("fp-theme") as Theme | null;
      if (stored === "dark" || stored === "light") {
        setTheme(stored);
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      }
    }, []);

    // Apply / remove the 'dark' class on <html> whenever theme changes
    useEffect(() => {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      localStorage.setItem("fp-theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  export function useTheme() {
    return useContext(ThemeContext);
  }
  ```

  **Verify**: File must type-check (`npm run build` after all steps); no standalone unit test needed — the context is verified by integration in later steps.

---

- [ ] 4. Create `NotificationsContext.tsx` — notifications state, markRead, markAllRead

  Holds 5 default notifications (cert, job, course, info, cert as specified). Exports `NotificationsProvider` and `useNotifications()`. All notification data is SA-locale.

  **File**: `src/lib/NotificationsContext.tsx` (create new)

  **Content**:
  ```tsx
  "use client";

  import { createContext, useContext, useState, ReactNode } from "react";

  export type NotificationType = "course" | "job" | "cert" | "info";

  export interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: NotificationType;
  }

  interface NotificationsContextType {
    notifications: Notification[];
    markRead: (id: number) => void;
    markAllRead: () => void;
  }

  const defaultNotifications: Notification[] = [
    { id: 1, type: "cert",   title: "Certificate Ready",       message: "Your Digital Marketing certificate is available to download.",         time: "Just now",   read: false },
    { id: 2, type: "job",    title: "New Job Match",            message: "3 new jobs matching your skills in Johannesburg.",                     time: "2 hours ago", read: false },
    { id: 3, type: "course", title: "Course Reminder",          message: "Continue Web Development Basics, you are 45% through.",                time: "Yesterday",  read: false },
    { id: 4, type: "info",   title: "Welcome to FuturePath",    message: "Complete your profile to get personalised job matches.",               time: "2 days ago", read: false },
    { id: 5, type: "cert",   title: "Achievement Unlocked",     message: "You earned the 7-Day Streak badge.",                                   time: "3 days ago", read: false },
  ];

  const NotificationsContext = createContext<NotificationsContextType>({
    notifications: defaultNotifications,
    markRead: () => {},
    markAllRead: () => {},
  });

  export function NotificationsProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);

    const markRead = (id: number) =>
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );

    const markAllRead = () =>
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    return (
      <NotificationsContext.Provider value={{ notifications, markRead, markAllRead }}>
        {children}
      </NotificationsContext.Provider>
    );
  }

  export function useNotifications() {
    return useContext(NotificationsContext);
  }
  ```

  **Verify**: Type-checks in the full build.

---

- [ ] 5. Create `Skeleton.tsx` — reusable skeleton base + DashboardSkeleton, CoursesSkeleton, JobsSkeleton

  `Skeleton` base accepts optional `className` prop and uses `animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl`. Named exports for each page skeleton. No external dependencies beyond React and Tailwind.

  **File**: `src/components/Skeleton.tsx` (create new)

  **Content**:
  ```tsx
  import React from "react";

  interface SkeletonProps {
    className?: string;
  }

  export function Skeleton({ className = "" }: SkeletonProps) {
    return (
      <div
        className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`}
        aria-hidden="true"
      />
    );
  }

  // ── Dashboard ──────────────────────────────────────────────
  export function DashboardSkeleton() {
    return (
      <div className="max-w-7xl mx-auto space-y-8" aria-label="Loading dashboard">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active courses */}
          <div className="lg:col-span-2 card p-6 space-y-5">
            <Skeleton className="h-6 w-40" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-1.5 w-full rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>

          {/* Job matches */}
          <div className="card p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="p-3 rounded-xl border border-gray-100 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Courses ────────────────────────────────────────────────
  export function CoursesSkeleton() {
    return (
      <div className="max-w-7xl mx-auto space-y-8" aria-label="Loading courses">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-5 w-64" />
        </div>
        {/* Filters */}
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <Skeleton className="h-44 rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Jobs ───────────────────────────────────────────────────
  export function JobsSkeleton() {
    return (
      <div className="max-w-7xl mx-auto space-y-8" aria-label="Loading jobs">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-5 w-56" />
        </div>
        {/* Filters */}
        <div className="flex gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        {/* Job rows */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 flex gap-5">
              <Skeleton className="h-7 w-7 flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-40" />
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-5 w-16 rounded-md" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  ```

  **Verify**: Type-checks in the full build. Visual check: run dev server and temporarily add `<DashboardSkeleton />` to the dashboard to confirm pulse animation and dark-mode colouring.

---

- [ ] 6. Create `NotificationsBell.tsx` — bell icon, unread badge, dropdown panel

  The dropdown is `position: absolute` relative to a wrapping `div` set to `relative`. `useEffect` + `useRef` on the wrapper closes the dropdown on outside click. Each notification row shows a flat Lucide icon (no background wrapper), title, message, time, and an unread green dot. Clicking a row calls `markRead(n.id)`. "Mark all read" button at the top calls `markAllRead()`. No emojis.

  **File**: `src/components/NotificationsBell.tsx` (create new)

  **Content**:
  ```tsx
  "use client";

  import { useRef, useState, useEffect } from "react";
  import { Bell, BookOpen, Briefcase, Award, Info } from "lucide-react";
  import { useNotifications, NotificationType } from "@/lib/NotificationsContext";

  const typeIcon: Record<NotificationType, React.ElementType> = {
    course: BookOpen,
    job:    Briefcase,
    cert:   Award,
    info:   Info,
  };

  export default function NotificationsBell() {
    const { notifications, markRead, markAllRead } = useNotifications();
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    // Close dropdown when clicking outside
    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      }
      if (open) document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
      <div ref={wrapperRef} className="relative">
        {/* Bell button */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={`Notifications, ${unreadCount} unread`}
          aria-expanded={open}
          aria-haspopup="dialog"
          className="relative p-2 rounded-xl text-gray-500 hover:text-brand-green hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span
              className="absolute top-1 right-1 w-4 h-4 bg-brand-green text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
              aria-hidden="true"
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown panel */}
        {open && (
          <div
            role="dialog"
            aria-label="Notifications"
            className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-xl border border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</p>
              <button
                onClick={markAllRead}
                className="text-xs text-brand-green hover:underline font-medium"
              >
                Mark all read
              </button>
            </div>

            {/* List */}
            <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
              {notifications.map((n) => {
                const Icon = typeIcon[n.type];
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => markRead(n.id)}
                      className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {/* Flat icon — no background container */}
                      <Icon className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-semibold truncate ${n.read ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"}`}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="w-2 h-2 bg-brand-green rounded-full flex-shrink-0" aria-label="Unread" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{n.time}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }
  ```

  **Verify**: Type-checks in the full build.

---

- [ ] 7. Add dark mode CSS overrides to `globals.css`

  Appended at the bottom of the file. Covers body background/text, `.card`, `.input`, `.sidebar-link`, `.sidebar-link-active` in dark mode using Tailwind's `@layer` directives so specificity is handled correctly.

  **File**: `src/app/globals.css`

  **Append** the following at the bottom (after the last closing brace):
  ```css
  /* ── Dark mode overrides ────────────────────────────────── */
  @layer base {
    .dark body {
      @apply bg-gray-950 text-gray-100;
    }
  }

  @layer components {
    .dark .card {
      @apply bg-gray-900 border-gray-800;
    }

    .dark .input {
      @apply bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500;
    }

    .dark .sidebar-link {
      @apply text-gray-400 hover:text-brand-green;
    }

    .dark .sidebar-link-active {
      @apply text-brand-green border-brand-green;
    }
  }
  ```

  **Verify**: After integrating ThemeProvider in the next step, toggling dark mode in the browser should show the dark surface colours on body, cards, and inputs.

---

- [ ] 8. Update root layout — add `suppressHydrationWarning` to `<html>`

  The theme is applied client-side (class toggled in `useEffect`), so the server will render without the `dark` class. `suppressHydrationWarning` prevents React from logging a hydration mismatch for this attribute.

  **File**: `src/app/layout.tsx`

  **Change**: Add `suppressHydrationWarning` to the `<html>` tag:
  ```tsx
  <html lang="en" suppressHydrationWarning>
  ```

  **Verify**: No React hydration warnings in the browser console when toggling dark mode.

---

- [ ] 9. Update app layout — add `ThemeProvider`, `NotificationsProvider`, header with `NotificationsBell`, dark background

  Wraps the existing tree in both new providers. Adds a `<header>` bar (h-14, border-b, flex, justify-end) containing `NotificationsBell`. Changes the outer `div` to `flex-col` so the header sits above `main`. Adds `dark:bg-gray-950` to the `aside` equivalent (Sidebar is self-contained) and to `main`.

  **File**: `src/app/(app)/layout.tsx`

  **Replace entire file** with:
  ```tsx
  import Sidebar from "@/components/Sidebar";
  import NotificationsBell from "@/components/NotificationsBell";
  import { ProfileProvider } from "@/lib/ProfileContext";
  import { ThemeProvider } from "@/lib/ThemeContext";
  import { NotificationsProvider } from "@/lib/NotificationsContext";

  export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
      <ThemeProvider>
        <NotificationsProvider>
          <ProfileProvider>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
              <Sidebar />
              <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <header className="h-14 px-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4 bg-white dark:bg-gray-900 flex-shrink-0">
                  <NotificationsBell />
                </header>
                <main className="flex-1 overflow-y-auto p-8 dark:bg-gray-950" id="main-content">
                  {children}
                </main>
              </div>
            </div>
          </ProfileProvider>
        </NotificationsProvider>
      </ThemeProvider>
    );
  }
  ```

  **Verify**: `npm run build` — no TypeScript errors; dev server shows the header bar with the bell icon.

---

- [ ] 10. Update `Sidebar.tsx` — add dark backgrounds, theme toggle button

  Two changes:
  1. Add `dark:bg-gray-900` to the `<motion.aside>` className so the sidebar surface responds to dark mode.
  2. Add a theme toggle button above the user footer. Import `Sun` and `Moon` from `lucide-react` and `useTheme` from `@/lib/ThemeContext`. When collapsed, render only the icon; when expanded, render icon + label ("Dark mode" when currently light, "Light mode" when currently dark).

  **File**: `src/components/Sidebar.tsx`

  **Changes**:

  a) Add `Sun, Moon` to the lucide-react import line.

  b) Add `useTheme` import:
  ```tsx
  import { useTheme } from "@/lib/ThemeContext";
  ```

  c) Inside `Sidebar` component, destructure `useTheme`:
  ```tsx
  const { theme, toggleTheme } = useTheme();
  ```

  d) On `<motion.aside>`, add `dark:bg-gray-900` to the className (alongside the existing `bg-white`).

  e) Insert the theme toggle button between the closing `</nav>` tag and the existing user footer `<div>`. The button must follow the same collapsed/expanded pattern used by all nav labels:
  ```tsx
  {/* Theme toggle */}
  <div className="px-2 pb-1">
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={collapsed ? (theme === "dark" ? "Light mode" : "Dark mode") : undefined}
      className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:text-brand-green dark:hover:text-brand-green hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 w-full"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 flex-shrink-0" />
      ) : (
        <Moon className="w-5 h-5 flex-shrink-0" />
      )}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            key="theme-label"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden whitespace-nowrap text-sm font-medium"
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  </div>
  ```

  **Verify**: `npm run build` — no errors. Dev server: sidebar shows Moon icon in light mode, Sun icon in dark mode; clicking toggles the theme.

---

- [ ] 11. Update `dashboard/page.tsx` — add loading skeleton and fix SA job data

  Two changes in one file:
  1. Add `useState<boolean>(true)` for `loading` and a `useEffect` that sets it to `false` after 1500ms.
  2. Replace `recentJobs` data with SA companies matching the jobs page: `Digital Hustle Agency` in `Johannesburg, GP` and `TechBridge SA` `Remote`.
  3. Render `<DashboardSkeleton />` while `loading` is true; render the real page content otherwise.

  **File**: `src/app/(app)/dashboard/page.tsx`

  **Changes**:

  a) Add imports at the top:
  ```tsx
  import { useState, useEffect } from "react";
  import { DashboardSkeleton } from "@/components/Skeleton";
  ```

  b) Fix `recentJobs`:
  ```tsx
  const recentJobs = [
    { id: 1, title: "Junior Social Media Manager", company: "Digital Hustle Agency", type: "Full-time", location: "Johannesburg, GP" },
    { id: 2, title: "Web Developer Intern", company: "TechBridge SA", type: "Internship", location: "Remote" },
  ];
  ```

  c) Inside `DashboardPage`, add loading state and conditional render:
  ```tsx
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <DashboardSkeleton />;
  ```
  (Place the `if` check before the `return` for the real content.)

  **Verify**: `npm run build` — no errors. Dev server: dashboard shows skeleton for ~1.5 s then fades in real content.

---

- [ ] 12. Update `courses/page.tsx` — add loading skeleton

  Same pattern as step 11 but with `CoursesSkeleton` at 1200ms.

  **File**: `src/app/(app)/courses/page.tsx`

  **Changes**:

  a) Adjust the existing `import { useState } from "react"` to `import { useState, useEffect } from "react"`.

  b) Add skeleton import:
  ```tsx
  import { CoursesSkeleton } from "@/components/Skeleton";
  ```

  c) Inside `CoursesPage`, add:
  ```tsx
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <CoursesSkeleton />;
  ```

  **Verify**: `npm run build` — no errors. Dev server: courses page shows 6-card skeleton grid for ~1.2 s.

---

- [ ] 13. Update `jobs/page.tsx` — add loading skeleton

  Same pattern with `JobsSkeleton` at 1200ms.

  **File**: `src/app/(app)/jobs/page.tsx`

  **Changes**:

  a) Adjust the existing `import { useState } from "react"` to `import { useState, useEffect } from "react"`.

  b) Add skeleton import:
  ```tsx
  import { JobsSkeleton } from "@/components/Skeleton";
  ```

  c) Inside `JobsPage`, add:
  ```tsx
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <JobsSkeleton />;
  ```

  **Verify**: `npm run build` — no errors.

---

- [ ] 14. Final build verification

  Run a clean production build and confirm zero TypeScript / lint errors.

  **Command**: `npm run build`

  **Expected output**: `✓ Compiled successfully` with no type errors and a successful page generation table.

---

## File Summary

| Action | Path |
|--------|------|
| Modify | `tailwind.config.ts` |
| Modify | `src/app/layout.tsx` |
| Modify | `src/app/(app)/layout.tsx` |
| Modify | `src/app/globals.css` |
| Modify | `src/components/Sidebar.tsx` |
| Modify | `src/app/(app)/dashboard/page.tsx` |
| Modify | `src/app/(app)/courses/page.tsx` |
| Modify | `src/app/(app)/jobs/page.tsx` |
| Modify | `src/lib/chatEngine.ts` |
| Create | `src/lib/ThemeContext.tsx` |
| Create | `src/lib/NotificationsContext.tsx` |
| Create | `src/components/Skeleton.tsx` |
| Create | `src/components/NotificationsBell.tsx` |
