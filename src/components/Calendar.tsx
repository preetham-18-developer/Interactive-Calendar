import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, MapPin } from 'lucide-react';
import { 
  getDaysInMonth, 
  getFirstDayOfMonth, 
  getPreviousMonth, 
  getNextMonth,
  isToday
} from '../utils/dateUtils';
import type { CalendarEvent } from '../types';
import { EventModal } from './EventModal';
import { SpecialEffects } from './SpecialEffects';
import { AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audioUtils';

interface CalendarProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent | CalendarEvent[]) => void;
  onDeleteEvent: (id: string) => void;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function Calendar({ currentDate, setCurrentDate, events, onAddEvent, onDeleteEvent }: CalendarProps) {
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [modalDateStr, setModalDateStr] = useState<string | null>(null);

  const [animatingDay, setAnimatingDay] = useState<number | null>(null);

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  // 1926 to 2126 range -> 201 years
  const currentYearOptions = Array.from({ length: 201 }, (_, i) => 1926 + i);

  useEffect(() => {
    const handleMouseUpGlobal = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => window.removeEventListener('mouseup', handleMouseUpGlobal);
  }, []);

  const handlePrevMonth = () => setCurrentDate(getPreviousMonth(currentDate));
  const handleNextMonth = () => setCurrentDate(getNextMonth(currentDate));
  const jumpToToday = () => setCurrentDate(new Date());

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(currentDate.getFullYear(), Number(e.target.value), 1));
  };
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(Number(e.target.value), currentDate.getMonth(), 1));
  };
  const handleJumpDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
       const [y, m, d] = e.target.value.split('-').map(Number);
       setCurrentDate(new Date(y, m - 1, d));
    }
  };

  const createDate = (day: number) => new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

  const handleDayMouseDown = (day: number) => {
    const date = createDate(day);
    setIsDragging(true);
    setRangeStart(date);
    setRangeEnd(null);
  };

  const handleDayMouseEnter = (day: number) => {
    const date = createDate(day);
    if (isDragging && rangeStart) {
      if (date >= rangeStart) setRangeEnd(date);
      else { setRangeStart(date); setRangeEnd(rangeStart); } // Swap logic if dragging backwards
    } else {
      if (rangeStart && !rangeEnd) {
        setHoverDate(date);
      }
    }
  };

  const handleDayMouseUp = (day: number) => {
    const date = createDate(day);
    setIsDragging(false);
    if (rangeStart && rangeStart.getTime() !== date.getTime()) {
      if (date > rangeStart) setRangeEnd(date);
    }
  };

  const handleDayClick = (day: number) => {
    setAnimatingDay(day);
    setTimeout(() => setAnimatingDay(null), 600); // clear animation

    const date = createDate(day);
    const dayEvents = currentMonthEvents.get(day) || [];
    if (dayEvents.length > 0) {
      playSound(dayEvents[0].type);
      setModalDateStr(dayEvents[0].dateStr);
    } else {
       // Open action panel heavily requested by "Single click on any date opens action panel"
       const ds = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
       setModalDateStr(ds);
    }
  };

  const getCellClassName = (day: number) => {
    const date = createDate(day);
    const dTime = date.getTime();
    const stTime = rangeStart?.getTime();
    const edTime = (rangeEnd || hoverDate)?.getTime();

    let classes = ['day-cell'];
    if (isToday(date)) classes.push('today');
    if (day === animatingDay) classes.push('click-burst');

    if (stTime && dTime === stTime) classes.push('selected-start');
    if (rangeEnd && edTime && dTime === edTime) classes.push('selected-end');
    
    if (stTime && edTime && !rangeEnd && dTime > stTime && dTime <= edTime) {
      classes.push('selected-in-between');
    } else if (stTime && edTime && rangeEnd && dTime > stTime && dTime < edTime) {
      classes.push('selected-in-between');
    }

    return classes.join(' ');
  };

  const handleAddClick = () => {
    if (rangeStart) {
      const ds = `${rangeStart.getFullYear()}-${String(rangeStart.getMonth() + 1).padStart(2, '0')}-${String(rangeStart.getDate()).padStart(2, '0')}`;
      setModalDateStr(ds);
    }
  };

  const currentMonthEvents = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    events.forEach(ev => {
      const [y, m, d] = ev.dateStr.split('-').map(Number);
      if (y === currentDate.getFullYear() && (m - 1) === currentDate.getMonth()) {
        const arr = map.get(d) || [];
        arr.push(ev);
        map.set(d, arr);
      }
    });
    return map;
  }, [events, currentDate]);

  return (
    <>
      <div className="calendar-header">
        <div className="date-selector">
          <select className="month-year-select" value={currentDate.getMonth()} onChange={handleMonthChange}>
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select className="month-year-select" value={currentDate.getFullYear()} onChange={handleYearChange}>
            {currentYearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <input type="date" className="jump-to-date" aria-label="Jump to Date" onChange={handleJumpDateChange} title="Quick Jump to Date" />
        </div>
        <div className="calendar-controls">
          <button className="icon-button" onClick={jumpToToday} title="Jump to Today"><MapPin size={18} /></button>
          
          {rangeStart && (
            <button className="primary-btn" style={{ padding: '0.4rem 1rem', width: 'auto' }} onClick={handleAddClick}>
              <Plus size={16} /> Add Event
            </button>
          )}

          <button className="icon-button" onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
          <button className="icon-button" onClick={handleNextMonth}><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(w => (
            <div key={w}>{w}</div>
          ))}
        </div>
        <div className="days-grid">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="day-cell empty" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = currentMonthEvents.get(day) || [];
            const ev = dayEvents[0];
            return (
              <div 
                key={`day-${day}`} 
                className={getCellClassName(day)}
                onMouseDown={() => handleDayMouseDown(day)}
                onMouseEnter={() => handleDayMouseEnter(day)}
                onMouseUp={() => handleDayMouseUp(day)}
                onClick={() => handleDayClick(day)}
                onMouseLeave={() => setHoverDate(null)}
              >
                <span style={{ position: 'relative', zIndex: 10 }}>{day}</span>
                {ev && (
                  <div className="event-indicator" title={dayEvents.map(e => e.title).join(', ')}>
                    {ev.type.slice(0,1)}
                  </div>
                )}
                {ev && <SpecialEffects type={ev.type} />}
                
                {ev?.images && ev.images.length > 0 && (
                  <div className="memory-stack">
                    {ev.images.slice(0, 4).map((_, idx) => (
                      <div key={idx} className="memory-stack-item" />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {modalDateStr && (
          <EventModal 
            dateStr={modalDateStr} 
            onClose={() => setModalDateStr(null)} 
            onSave={(e) => {
              onAddEvent(e);
              playSound(Array.isArray(e) ? e[0].type : e.type); // Play sound on save
            }} 
            onDelete={onDeleteEvent}
            existingEvents={events}
          />
        )}
      </AnimatePresence>
    </>
  );
}
