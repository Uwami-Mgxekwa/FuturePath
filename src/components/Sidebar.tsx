"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Briefcase, User, Award,
  Settings, Bot, Menu, X, Sun, Moon, GraduationCap,
} from "lucide-react";
import { useProfile } from "@/lib/ProfileContext";
import { useTheme } from "@/lib/ThemeContext";

function SidebarAvatar() {
  const { profile } = useProfile();

  const src = profile.photoUrl
    ? profile.photoUrl
    : profile.gender === "Male"
    ? "https://api.dicebear.com/9.x/adventurer/svg?seed=FuturePathMale&backgroundColor=e6f7ee"
    : profile.gender === "Female"
    ? "https://api.dicebear.com/9.x/adventurer/svg?seed=FuturePathFemale&backgroundColor=e6f7ee"
    : "https://api.dicebear.com/9.x/adventurer/svg?seed=FuturePathNeutral&backgroundColor=e6f7ee";

  return (
    <img
      src={src}
      alt="Profile avatar"
      className="w-full h-full object-cover rounded-full"
    />
  );
}

const navItems = [
  { label: "Dashboard",    href: "/dashboard",      icon: LayoutDashboard },
  { label: "My Courses",   href: "/courses",         icon: BookOpen },
  { label: "Job Board",    href: "/jobs",            icon: Briefcase },
  { label: "Study Further",href: "/study-further",   icon: GraduationCap },
  { label: "Profile",      href: "/profile",         icon: User },
  { label: "Certificates", href: "/certificates",    icon: Award },
  { label: "Ask",          href: "/ask-ai",          icon: Bot },
];

const adminItems = [
  { label: "Admin Panel", href: "/admin", icon: Settings },
];

interface SidebarProps {
  isAdmin?: boolean;
}

export default function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { profile } = useProfile();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-20 md:hidden"
            onClick={() => setCollapsed(true)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative h-screen bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 flex flex-col flex-shrink-0 overflow-hidden z-30"
      >
        {/* Header row: logo + hamburger */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Link href="/">
                  <img src="/logo.png" alt="FuturePath" className="h-7 w-auto" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-lg text-gray-500 hover:text-brand-green hover:bg-gray-50 transition-colors ml-auto"
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium border-l-2 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-brand-green border-brand-green font-semibold"
                    : "text-gray-500 border-transparent hover:text-brand-green"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <hr className="my-3 border-gray-100" />
              {adminItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium border-l-2 transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "text-brand-green border-brand-green font-semibold"
                        : "text-gray-500 border-transparent hover:text-brand-green"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence initial={false}>
                      {!collapsed && (
                        <motion.span
                          key="label"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Theme toggle */}
        <div className="px-2 py-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={toggleTheme}
            title={collapsed ? (theme === 'dark' ? 'Light mode' : 'Dark mode') : undefined}
            className="flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-gray-500 hover:text-brand-green transition-colors w-full"
          >
            {theme === 'dark' ? (
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
                  className="overflow-hidden whitespace-nowrap"
                >
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* User footer */}
        <div className="px-2 py-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden">
              <SidebarAvatar />
            </div>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  key="userinfo"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 min-w-0 overflow-hidden"
                >
                  <p className="text-sm font-semibold text-gray-900 truncate">{profile.name}</p>
                  <p className="text-xs text-gray-400 truncate">{profile.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
