import React, { useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { CalendarEvent } from '../types';
import { isToday } from '../utils/dateUtils';

interface CalendarGridProps {
  year: number;
  month: number;
  daysInMonth: number;
  firstDay: number;
  eventsMap: Map<number, CalendarEvent[]>;
  onDayClick: (dateStr: string) => void;
  isMissionMode: boolean;
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
  isMissionMode,
}: CalendarGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

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
      <div className="relative flex-1 overflow-hidden flex flex-col">
        <motion.div
          ref={gridRef}
          className={`days-grid ${isMissionMode ? 'days-grid--mission' : ''}`}
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
              isMissionMode={isMissionMode}
            />
          ))}
        </motion.div>

        {/* Manual Scroll Buttons for Mobile Mission Mode */}
        {isMissionMode && (
          <div className="mission-scroll-controls sm:hidden">
            <button 
              className="mission-scroll-btn" 
              onClick={() => gridRef.current?.scrollBy({ top: -150, behavior: 'smooth' })}
              aria-label="Scroll Up"
            >
              <ChevronUp size={16} />
            </button>
            <button 
              className="mission-scroll-btn" 
              onClick={() => gridRef.current?.scrollBy({ top: 150, behavior: 'smooth' })}
              aria-label="Scroll Down"
            >
              <ChevronDown size={16} />
            </button>
          </div>
        )}
      </div>
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
  isMissionMode: boolean;
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
  isMissionMode,
}: DayCellProps) {
  if (isEmpty) {
    return <div className="day-cell day-cell--empty" />;
  }

  const hasEvents = events.length > 0;
  const hasHolidayEvent = events.some((e) => e.type === 'Holiday');

  const date = new Date(dateStr);
  const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
  
  const missionInfo = useMemo(() => {
    if (!isMissionMode) return null;
    
    const missionEvent = events[0]; // Primary mission event for the day

    if (dayOfWeek === 0) {
      return { 
        label: 'BUILD', 
        color: 'var(--color-growth)', 
        title: missionEvent?.title || 'Build / Explore',
        subtext: missionEvent?.title ? 'Project Session' : 'Project / Contest', 
        tags: missionEvent?.title ? ['Active'] : ['Project', 'Contest', 'AI'] 
      };
    } else if (dayOfWeek === 6) {
      return { 
        label: 'REVISION', 
        color: 'var(--color-revision)', 
        title: missionEvent?.title || 'Revision Day',
        subtext: missionEvent?.title ? 'Review Session' : 'Review this week\'s topics' 
      };
    } else {
      const pCount = missionEvent?.problemCount || 0;
      return { 
        label: 'DSA', 
        color: 'var(--color-execution)', 
        title: missionEvent?.title || 'DSA / Problem Solving',
        subtext: pCount > 0 ? `${pCount} Problems` : 'Pending Problems',
        progress: pCount > 0 ? Math.min(pCount / 5, 1) : 0.1, // Show slight progress if started
        status: pCount >= 3 ? 'done' : 'pending'
      };
    }
  }, [dayOfWeek, isMissionMode, events]);

  const cellClasses = [
    'day-cell',
    isTodayCell && 'day-cell--today',
    isSunday && 'day-cell--sunday',
    hasEvents && 'day-cell--has-events',
    hasHolidayEvent && 'day-cell--holiday',
    isMissionMode && 'day-cell--mission',
    isMissionMode && dayOfWeek === 0 && 'day-cell--growth',
    isMissionMode && dayOfWeek === 6 && 'day-cell--revision',
    isMissionMode && dayOfWeek >= 1 && dayOfWeek <= 5 && 'day-cell--execution',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      className={cellClasses}
      onClick={() => onClick(dateStr)}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.008, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      id={`day-cell-${dateStr}`}
    >
      <div className="day-cell__header">
        <span className="day-cell__number">{day}</span>
        {isMissionMode && missionInfo?.label && (
           <span className="mission-label-mini" style={{ color: missionInfo.color }}>
             {missionInfo.label.split(' ')[0]}
           </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isMissionMode ? (
          <motion.div
            key="normal-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="day-cell__content"
          >
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
        ) : (
          <motion.div
            key="mission-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="day-cell__mission-content"
          >
            <div className="mission-main">
               <span className="mission-title">{missionInfo?.title}</span>
            </div>
            
            {dayOfWeek >= 1 && dayOfWeek <= 5 && (
               <div className="mission-progress-container">
                  <div className="mission-progress-bar">
                     <div className="mission-progress-fill" style={{ width: `${(missionInfo?.progress || 0) * 100}%` }} />
                  </div>
                  <div className="mission-status-icon">
                     {missionInfo?.status === 'done' ? '✔' : '...'}
                  </div>
               </div>
            )}

            {dayOfWeek === 0 && missionInfo?.tags && (
               <div className="mission-tags">
                  {missionInfo.tags.map(tag => (
                    <span key={tag} className="mission-tag">{tag}</span>
                  ))}
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
