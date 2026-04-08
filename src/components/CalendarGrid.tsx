import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { CalendarEvent } from '../types';
import { isToday } from '../utils/dateUtils';

interface CalendarGridProps {
  year: number;
  month: number;
  daysInMonth: number;
  firstDay: number;
  eventsMap: Map<number, CalendarEvent[]>;
  onDayClick: (dateStr: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const EVENT_TYPE_CLASS: Record<string, string> = {
  Meeting: 'event-pill--meeting',
  Birthday: 'event-pill--birthday',
  Festival: 'event-pill--festival',
  Holiday: 'event-pill--holiday',
  Anniversary: 'event-pill--anniversary',
};

export const CalendarGrid = React.memo(function CalendarGrid({
  year,
  month,
  daysInMonth,
  firstDay,
  eventsMap,
  onDayClick,
}: CalendarGridProps) {
  // Build day cells including leading empty cells
  const cells = useMemo(() => {
    const result: Array<{
      day: number;
      isEmpty: boolean;
      isToday: boolean;
      isSunday: boolean;
      dateStr: string;
      events: CalendarEvent[];
    }> = [];

    // Empty cells for offset
    for (let i = 0; i < firstDay; i++) {
      result.push({
        day: 0,
        isEmpty: true,
        isToday: false,
        isSunday: false,
        dateStr: '',
        events: [],
      });
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      result.push({
        day: d,
        isEmpty: false,
        isToday: isToday(date),
        isSunday: date.getDay() === 0,
        dateStr,
        events: eventsMap.get(d) || [],
      });
    }

    return result;
  }, [year, month, daysInMonth, firstDay, eventsMap]);

  return (
    <>
      {/* Weekday labels */}
      <div className="weekday-row">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className="weekday-label"
            style={i === 0 ? { color: '#DC2626' } : undefined}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <motion.div
        className="days-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        key={`${year}-${month}`}
      >
        {cells.map((cell, i) => (
          <DayCell
            key={`${year}-${month}-${i}`}
            day={cell.day}
            isEmpty={cell.isEmpty}
            isTodayCell={cell.isToday}
            isSunday={cell.isSunday}
            dateStr={cell.dateStr}
            events={cell.events}
            onClick={onDayClick}
            index={i}
          />
        ))}
      </motion.div>
    </>
  );
});

interface DayCellProps {
  day: number;
  isEmpty: boolean;
  isTodayCell: boolean;
  isSunday: boolean;
  dateStr: string;
  events: CalendarEvent[];
  onClick: (dateStr: string) => void;
  index: number;
}

const DayCell = React.memo(function DayCell({
  day,
  isEmpty,
  isTodayCell,
  isSunday,
  dateStr,
  events,
  onClick,
  index,
}: DayCellProps) {
  if (isEmpty) {
    return <div className="day-cell day-cell--empty" />;
  }

  const hasEvents = events.length > 0;
  const hasHolidayEvent = events.some((e) => e.type === 'Holiday');

  const cellClasses = [
    'day-cell',
    isTodayCell && 'day-cell--today',
    isSunday && 'day-cell--sunday',
    hasEvents && 'day-cell--has-events',
    hasHolidayEvent && 'day-cell--holiday',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      className={cellClasses}
      onClick={() => onClick(dateStr)}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.008, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      id={`day-cell-${dateStr}`}
    >
      <span className="day-cell__number">{day}</span>

      {/* Event pills */}
      {hasEvents && (
        <div className="event-pills">
          {events.slice(0, 2).map((ev) => (
            <div
              key={ev.id}
              className={`event-pill ${EVENT_TYPE_CLASS[ev.type] || 'event-pill--meeting'}`}
              title={ev.title}
            >
              {ev.title}
            </div>
          ))}
          {events.length > 2 && (
            <div className="event-pill event-pill--more">
              +{events.length - 2}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
});
