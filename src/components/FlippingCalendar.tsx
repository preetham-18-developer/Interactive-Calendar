import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarGrid } from './CalendarGrid';
import type { CalendarEvent } from '../types';
import { getDaysInMonth, getFirstDayOfMonth } from '../utils/dateUtils';

interface FlippingCalendarProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (dateStr: string) => void;
}

interface PageData {
  year: number;
  month: number;
  id: string; // "YYYY-MM"
}

function computePagesToFlip(oldDate: Date, newDate: Date): { direction: 'forward' | 'backward', pages: PageData[], target: PageData } {
  const oldYear = oldDate.getFullYear();
  const oldMonth = oldDate.getMonth();
  const newYear = newDate.getFullYear();
  const newMonth = newDate.getMonth();

  const diff = (newYear - oldYear) * 12 + (newMonth - oldMonth);
  const target: PageData = { year: newYear, month: newMonth, id: `${newYear}-${newMonth}` };

  if (diff === 0) {
    return { direction: 'forward', pages: [], target };
  }

  const pages: PageData[] = [];
  const limit = Math.min(Math.abs(diff), 5); // limit visible flips to 5

  if (diff > 0) {
    // Forward flip (pages flip UP)
    // Pages to flip: oldDate ... up to newDate-1
    // We want the last one to be newDate - 1, and so on.
    for (let i = 0; i < limit; i++) {
        // We flip oldDate, then oldDate+1, etc.
        // If jump is huge, we start from newDate - limit
        const offset = diff > 5 ? (diff - limit + i) : i;
        const y = oldYear + Math.floor((oldMonth + offset) / 12);
        const m = (oldMonth + offset) % 12;
        pages.push({ year: y, month: m, id: `${y}-${m}-fwd` });
    }
    return { direction: 'forward', pages, target };
  } else {
    // Backward flip (pages flip DOWN)
    // Pages to fall down: oldDate-1 down to newDate
    // If huge jump, we just do newDate+limit-1 down to newDate
    for (let i = 0; i < limit; i++) {
        // First to fall is closest to oldDate, so offset = -1, -2...
        // But if huge jump, first to fall is newDate + limit - 1, then down to newDate
        const offset = Math.abs(diff) > 5 ? (limit - 1 - i) : (Math.abs(diff) - 1 - i);
        // We add this offset to newDate
        const y = newYear + Math.floor((newMonth + offset) / 12);
        const m = (newMonth + offset) % 12;
        pages.push({ year: y, month: m, id: `${y}-${m}-bwd` });
    }
    return { direction: 'backward', pages, target };
  }
}

export function FlippingCalendar({ currentDate, events, onDayClick }: FlippingCalendarProps) {
  const [targetPage, setTargetPage] = useState<PageData>({ 
    year: currentDate.getFullYear(), 
    month: currentDate.getMonth(), 
    id: `${currentDate.getFullYear()}-${currentDate.getMonth()}` 
  });
  
  const [animatingPages, setAnimatingPages] = useState<PageData[]>([]);
  const [direction, setDirection] = useState<'forward'|'backward'>('forward');
  
  const prevDateRef = useRef<Date>(currentDate);

  useEffect(() => {
    if (currentDate.getTime() !== prevDateRef.current.getTime()) {
      const { direction, pages, target } = computePagesToFlip(prevDateRef.current, currentDate);
      
      setDirection(direction);
      setTargetPage(target);
      
      if (pages.length > 0) {
        setAnimatingPages(pages);
      }
      prevDateRef.current = currentDate;
    }
  }, [currentDate]);

  const clearAnimation = (id: string) => {
     setAnimatingPages(prev => prev.filter(p => p.id !== id));
  };

  const getEventsForMonth = (year: number, month: number) => {
    const map = new Map<number, CalendarEvent[]>();
    events.forEach((ev) => {
      const [y, m, d] = ev.dateStr.split('-').map(Number);
      if (y === year && (m - 1) === month) {
        const arr = map.get(d) || [];
        arr.push(ev);
        map.set(d, arr);
      }
    });
    return map;
  };

  return (
    <div className="flipping-calendar-container">
      {/* 1. Underlying target page (always visible, but might be covered by animating pages) */}
      <div className="calendar-page static-target">
         <StaticPage 
           year={targetPage.year} 
           month={targetPage.month} 
           eventsMap={getEventsForMonth(targetPage.year, targetPage.month)} 
           onDayClick={onDayClick} 
           isTarget={true}
         />
      </div>

      {/* 2. Animating pages over it */}
      <AnimatePresence>
        {animatingPages.map((page, index) => {
            const isForward = direction === 'forward';
            
            // For forward: lowest index is on top (flips first). So zIndex is animatingPages.length - index.
            // For backward: lowest index flips down first (from folded state). So it should end up at the bottom of the stacked flipped pages.
            // Actually, for backward: page 0 falls down. Then page 1 falls down *on top* of page 0. Thus, page 1 needs higher zIndex than page 0.
            const zIndex = isForward ? animatingPages.length - index + 10 : index + 10;
            
            // Staggering
            const delay = index * 0.15;
            
            return (
              <motion.div
                key={page.id}
                className="calendar-page animated-page"
                style={{ zIndex }}
                initial={
                  isForward 
                    ? { rotateX: 0, opacity: 1 } 
                    : { rotateX: 180, opacity: 0 } // starts folded up
                }
                animate={
                  isForward 
                    ? { rotateX: 180, opacity: 0 } 
                    : { rotateX: 0, opacity: 1 } 
                }
                transition={{ 
                   duration: 0.6, 
                   delay: delay, 
                   ease: [0.32, 0.72, 0, 1] // Apple-like subtle ease
                }}
                onAnimationComplete={() => clearAnimation(page.id)}
              >
                <StaticPage 
                  year={page.year} 
                  month={page.month} 
                  eventsMap={getEventsForMonth(page.year, page.month)} 
                  onDayClick={onDayClick} 
                />
              </motion.div>
            );
        })}
      </AnimatePresence>
    </div>
  );
}

// A simple wrapper to memoize the render of a specific month grid
const StaticPage = React.memo(function StaticPage({ year, month, eventsMap, onDayClick, isTarget = false }: { year: number, month: number, eventsMap: Map<number, CalendarEvent[]>, onDayClick: (s:string)=>void, isTarget?: boolean }) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  return (
    <div className={`calendar-page-inner ${isTarget ? 'is-target' : ''}`}>
       <CalendarGrid
          year={year}
          month={month}
          daysInMonth={daysInMonth}
          firstDay={firstDay}
          eventsMap={eventsMap}
          onDayClick={onDayClick}
       />
    </div>
  )
});
