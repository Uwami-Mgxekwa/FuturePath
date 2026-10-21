"use client";

import Sidebar from "@/components/Sidebar";
import { ProfileProvider, useProfile } from "@/lib/ProfileContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import { NotificationsProvider } from "@/lib/NotificationsContext";
import NotificationsBell from "@/components/NotificationsBell";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

function AppShell({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkRole() {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists() && snap.data().role === "admin") {
          setIsAdmin(true);
        }
      } catch { /* silently ignore */ }
    }
    // Only check once profile has loaded
    if (profile.email) checkRole();
  }, [profile.email]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 px-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4 bg-white dark:bg-gray-950">
          <NotificationsBell />
        </header>
        <main className="flex-1 overflow-y-auto p-8 dark:bg-gray-950" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <NotificationsProvider>
        <ProfileProvider>
          <AppShell>{children}</AppShell>
        </ProfileProvider>
      </NotificationsProvider>
    </ThemeProvider>
  );
}
