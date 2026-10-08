'use client';
import { useRef, useEffect, useState } from 'react';
import { Bell, BookOpen, Briefcase, Award, Info } from 'lucide-react';
import { useNotifications, NotificationType } from '@/lib/NotificationsContext';
import { motion, AnimatePresence } from 'framer-motion';

const typeIcon: Record<NotificationType, React.ElementType> = {
  course: BookOpen,
  job: Briefcase,
  cert: Award,
  info: Info,
};

const typeColor: Record<NotificationType, string> = {
  course: 'text-blue-500',
  job: 'text-purple-500',
  cert: 'text-brand-green',
  info: 'text-gray-500',
};

export default function NotificationsBell() {
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className='relative'>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications, ${unreadCount} unread`}
        className='relative p-2 rounded-xl text-gray-500 hover:text-brand-green hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
      >
        <Bell className='w-5 h-5' />
        {unreadCount > 0 && (
          <span className='absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-brand-green text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1'>
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{opacity: 0, y: -8, scale: 0.95}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: -8, scale: 0.95}}
            transition={{duration: 0.15}}
            className='absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden'
          >
            <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100'>Notifications</h3>
              <button onClick={markAllRead} className='text-xs text-brand-green font-medium hover:underline'>Mark all read</button>
            </div>
            <div className='max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800'>
              {notifications.map((n) => {
                const Icon = typeIcon[n.type];
                return (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${!n.read ? 'border-l-2 border-brand-green' : ''}`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${typeColor[n.type]}`} />
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between gap-2'>
                        <p className={`text-sm font-semibold truncate ${n.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-gray-100'}`}>{n.title}</p>
                        {!n.read && <span className='w-2 h-2 rounded-full bg-brand-green flex-shrink-0' />}
                      </div>
                      <p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2'>{n.message}</p>
                      <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>{n.time}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
