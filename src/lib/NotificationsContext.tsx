'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export type NotificationType = 'course' | 'job' | 'cert' | 'info';

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
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: number) => void;
}

const defaultNotifications: Notification[] = [
  { id: 1, title: 'Certificate Ready', message: 'Your Digital Marketing certificate is available to download.', time: 'Just now', read: false, type: 'cert' },
  { id: 2, title: 'New Job Match', message: '3 new jobs matching your skills in Johannesburg.', time: '2 hours ago', read: false, type: 'job' },
  { id: 3, title: 'Course Reminder', message: 'Continue Web Development Basics, you are 45% through.', time: 'Yesterday', read: false, type: 'course' },
  { id: 4, title: 'Welcome to FuturePath', message: 'Complete your profile to get personalised job matches.', time: '2 days ago', read: false, type: 'info' },
  { id: 5, title: 'Achievement Unlocked', message: 'You earned the 7-Day Streak badge.', time: '3 days ago', read: false, type: 'cert' },
];

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: defaultNotifications,
  unreadCount: 5,
  markAllRead: () => {},
  markRead: () => {},
});

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider value={{notifications, unreadCount, markAllRead, markRead}}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() { return useContext(NotificationsContext); }
