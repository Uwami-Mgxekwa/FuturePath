'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  writeBatch,
  addDoc,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type NotificationType = 'course' | 'job' | 'cert' | 'info';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;         // formatted display string
  createdAt: number;    // unix ms for sorting
  read: boolean;
  type: NotificationType;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  markAllRead: async () => {},
  markRead: async () => {},
});

/* ── Helpers ─────────────────────────────────────────────── */

function formatTime(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(ms).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function tsToMs(ts: Timestamp | number | null | undefined): number {
  if (!ts) return Date.now();
  if (typeof ts === 'number') return ts;
  return ts.toMillis();
}

/* ── Provider ────────────────────────────────────────────── */

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Track auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
      if (!user) setNotifications([]);
    });
    return () => unsub();
  }, []);

  // Subscribe to Firestore notifications and seed welcome notification for new users
  useEffect(() => {
    if (!userId) return;

    const colRef = collection(db, 'users', userId, 'notifications');
    const q = query(colRef, orderBy('createdAt', 'desc'));

    // Seed welcome notification if this user has no notifications yet
    async function seedWelcome() {
      const snap = await getDocs(q);
      if (snap.empty) {
        await addDoc(colRef, {
          title: 'Welcome to FuturePath!',
          message:
            'You are now part of a community of thousands of South African youth building their futures. Start by exploring a free course or completing your profile.',
          type: 'info',
          read: false,
          createdAt: serverTimestamp(),
        });
      }
    }

    seedWelcome();

    const unsub = onSnapshot(q, (snap) => {
      const items: Notification[] = snap.docs.map((d) => {
        const data = d.data();
        const ms = tsToMs(data.createdAt as Timestamp | number | null);
        return {
          id: d.id,
          title: data.title ?? '',
          message: data.message ?? '',
          time: formatTime(ms),
          createdAt: ms,
          read: data.read ?? false,
          type: (data.type as NotificationType) ?? 'info',
        };
      });
      setNotifications(items);
    });

    return () => unsub();
  }, [userId]);

  async function markRead(id: string) {
    if (!userId) return;
    await updateDoc(doc(db, 'users', userId, 'notifications', id), { read: true });
  }

  async function markAllRead() {
    if (!userId) return;
    const unread = notifications.filter((n) => !n.read);
    if (!unread.length) return;
    const batch = writeBatch(db);
    unread.forEach((n) => {
      batch.update(doc(db, 'users', userId, 'notifications', n.id), { read: true });
    });
    await batch.commit();
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAllRead, markRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
