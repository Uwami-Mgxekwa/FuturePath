"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "🏠" },
  { label: "My Courses", href: "/courses", icon: "📚" },
  { label: "Job Board", href: "/jobs", icon: "💼" },
  { label: "Profile", href: "/profile", icon: "👤" },
  { label: "Certificates", href: "/certificates", icon: "🏆" },
];

const adminItems = [
  { label: "Admin Panel", href: "/admin", icon: "⚙️" },
];

interface SidebarProps {
  isAdmin?: boolean;
}

export default function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FP</span>
          </div>
          <span className="font-bold text-xl text-gray-900">FuturePath</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? "sidebar-link-active" : "sidebar-link"}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-xl" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-brand-green rounded-r"
                />
              )}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <hr className="my-4 border-gray-100" />
            {adminItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? "sidebar-link-active" : "sidebar-link"}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="text-xl" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="w-9 h-9 bg-brand-green-muted rounded-full flex items-center justify-center">
            <span className="text-brand-green font-semibold text-sm">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Student User</p>
            <p className="text-xs text-gray-400 truncate">student@futurepath.app</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
