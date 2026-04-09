import { ChevronLeft, ChevronRight, Moon, Sun, Radio, LogOut, Activity } from 'lucide-react';
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
  isMissionMode: boolean;
  onMissionModeChange: (v: boolean) => void;
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
  isMissionMode,
  onMissionModeChange,
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
      {/* Top Row: Logo and Toolbar */}
      <div className="calendar-header__left">
        <div className="app-logo">
          <Activity size={18} className="text-red-600 animate-pulse" />
          <span className="app-logo__text hidden sm:inline">TimeForge</span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Navigation for mobile (next to title usually, but putting here for row 1 if needed) */}
          <div className="flex items-center gap-1 mr-2 sm:hidden">
            <button className="icon-btn" onClick={onPrev} id="prev-month-btn-mobile">
              <ChevronLeft size={18} />
            </button>
            <button className="icon-btn" onClick={onNext} id="next-month-btn-mobile">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="app-toolbar pr-2 border-r border-[var(--color-border)]">
            <button className="icon-btn" onClick={onOpenRadar} title="Radar Scanner">
              <Radio size={16} />
            </button>
            <button className="icon-btn" onClick={onToggleTheme} title="Theme">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="icon-btn text-zinc-400" onClick={onLogout} title="Logout">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Middle Row: Title (Month Year) */}
      <div className="calendar-header__title-container flex justify-between items-center w-full">
        <div className="calendar-header__title">
          <h1 className="calendar-header__month text-xl sm:text-2xl">{monthLabel}</h1>
          <select 
            className="calendar-header__year-select text-sm sm:text-lg"
            value={year}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        
        {/* Navigation for desktop (visible on sm+) */}
        <div className="hidden sm:flex items-center gap-1">
          <button className="icon-btn" onClick={onPrev} id="prev-month-btn">
            <ChevronLeft size={20} />
          </button>
          <button className="icon-btn" onClick={onNext} id="next-month-btn">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Bottom Row: View and Mission selectors */}
      <div className="calendar-header__controls">
        <div className="flex flex-wrap items-center gap-2 w-full justify-between">
          <div className="view-selector">
            <button
              className={`view-selector__btn ${view === 'month' ? 'view-selector__btn--active' : ''}`}
              onClick={() => onViewChange('month')}
            >
              Month
            </button>
            <button
              className={`view-selector__btn ${view === 'list' ? 'view-selector__btn--active' : ''}`}
              onClick={() => onViewChange('list')}
            >
              List
            </button>
          </div>

          <div className="view-selector">
            <button
              className={`view-selector__btn ${!isMissionMode ? 'view-selector__btn--active' : ''}`}
              onClick={() => onMissionModeChange(false)}
            >
              Basic
            </button>
            <button
              className={`view-selector__btn ${isMissionMode ? 'view-selector__btn--active' : ''} mission-mode-toggle-btn`}
              onClick={() => onMissionModeChange(true)}
            >
              🎯 Mission
            </button>
          </div>

          <button className="icon-btn-text" onClick={onToday} id="today-btn">
            Today
          </button>
        </div>
      </div>
    </div>
  );
});
