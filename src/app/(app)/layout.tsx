import Sidebar from "@/components/Sidebar";
import { ProfileProvider } from "@/lib/ProfileContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8" id="main-content">
          {children}
        </main>
      </div>
    </ProfileProvider>
  );
}
