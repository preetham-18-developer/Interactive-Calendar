import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import type { CalendarEvent } from '../types';

interface ReminderBannerProps {
  event: CalendarEvent;
}

export const ReminderBanner = React.memo(function ReminderBanner({ event }: ReminderBannerProps) {
  return (
    <motion.div
      className="reminder-banner"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <Bell size={14} />
      <span>
        <strong>{event.title}</strong> is tomorrow
      </span>
    </motion.div>
  );
});
