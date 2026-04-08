import { ChevronLeft, ChevronRight, Moon, Sun, Radio, LogOut } from 'lucide-react';
import React, { useMemo } from 'react';

interface CalendarHeaderProps {
  monthLabel: string;
  year: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onYearChange: (year: number) => void;
  view: 'month' | 'list';
  onViewChange: (v: 'month' | 'list') => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenRadar: () => void;
  onLogout: () => void;
}

export const CalendarHeader = React.memo(function CalendarHeader({
  monthLabel,
  year,
  onPrev,
  onNext,
  onToday,
  onYearChange,
  view,
  onViewChange,
  isDark,
  onToggleTheme,
  onOpenRadar,
  onLogout,
}: CalendarHeaderProps) {
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const result = [];
    for (let i = currentYear - 100; i <= currentYear + 100; i++) {
        result.push(i);
    }
    return result;
  }, []);

  return (
    <div className="calendar-header">
      {/* Left Toolbar & Title */}
      <div className="calendar-header__left">
        <div className="app-toolbar mr-4 pr-3 border-r border-[var(--color-border)]">
          <button
            className="icon-btn"
            onClick={onOpenRadar}
            title="Radar Scanner"
          >
            <Radio size={18} />
          </button>
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="icon-btn text-zinc-400 hover:text-red-500 transition-colors"
            onClick={onLogout}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>

        <div className="calendar-header__title">
          <h1 className="calendar-header__month">{monthLabel}</h1>
          <select 
            className="calendar-header__year-select"
            value={year}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Controls */}
      <div className="calendar-header__controls">
        {/* View selector */}
        <div className="view-selector">
          <button
            className={`view-selector__btn ${view === 'month' ? 'view-selector__btn--active' : ''}`}
            onClick={() => onViewChange('month')}
            id="view-month-btn"
          >
            Month
          </button>
          <button
            className={`view-selector__btn ${view === 'list' ? 'view-selector__btn--active' : ''}`}
            onClick={() => onViewChange('list')}
            id="view-list-btn"
          >
            List
          </button>
        </div>

        {/* Today button */}
        <button
          className="icon-btn-text"
          onClick={onToday}
          title="Go to today"
          id="today-btn"
        >
          Today
        </button>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button
            className="icon-btn"
            onClick={onPrev}
            title="Previous month"
            id="prev-month-btn"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="icon-btn"
            onClick={onNext}
            title="Next month"
            id="next-month-btn"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
});
