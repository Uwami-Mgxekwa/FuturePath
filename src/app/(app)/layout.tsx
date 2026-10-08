import Sidebar from "@/components/Sidebar";
import { ProfileProvider } from "@/lib/ProfileContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import { NotificationsProvider } from "@/lib/NotificationsContext";
import NotificationsBell from "@/components/NotificationsBell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <NotificationsProvider>
        <ProfileProvider>
          <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="h-14 px-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4 bg-white dark:bg-gray-950">
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
