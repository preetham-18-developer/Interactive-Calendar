import { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImagePanel } from './components/ImagePanel';
import { FlippingCalendar } from './components/FlippingCalendar';
import { CalendarHeader } from './components/CalendarHeader';
import { EventModal } from './components/EventModal';
import { IntroTransition } from './components/IntroTransition';
import { ReminderBanner } from './components/ReminderBanner';
import { ListView } from './components/ListView';
import { RadarScanner } from './components/RadarScanner';
import { AuthModal } from './components/AuthModal';
import type { CalendarEvent } from './types';


function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isDark, setIsDark] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState<'month' | 'list'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isMissionMode, setIsMissionMode] = useState(false);

  // Refs for tracking direction

  // --- Initialization ---
  useEffect(() => {
    const savedUser = localStorage.getItem('calendar_user_id');
    if (savedUser) {
        setCurrentUser(savedUser);
    } else {
        setShowAuth(true);
    }

    const savedDark = localStorage.getItem('calendar_dark_mode');
    setIsDark(savedDark !== 'false'); // Default to true if null
  }, []);

  // --- Theme Sync ---
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDark]);

  // --- Load events based on user ---
  useEffect(() => {
    if (!currentUser) {
       setEvents([]);
       return;
    }
    const key = `calendar_events_${currentUser}`;
    const savedEvents = localStorage.getItem(key);
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (e) {
        console.error(e);
      }
    } else {
      setEvents([]);
    }
  }, [currentUser]);

  // --- Theme ---
  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('calendar_dark_mode', String(next));
      return next;
    });
  }, []);

  // --- Events CRUD ---
  const handleAddEvent = useCallback(
    (event: CalendarEvent | CalendarEvent[]) => {
      setEvents((prev) => {
        const enrichedEvent = Array.isArray(event) 
           ? event.map(e => ({...e, userId: currentUser || 'guest'})) 
           : [{...event, userId: currentUser || 'guest'}];
        
        const updated = [...prev, ...enrichedEvent];
        if (currentUser) {
           localStorage.setItem(`calendar_events_${currentUser}`, JSON.stringify(updated));
        }
        return updated;
      });
    },
    [currentUser]
  );

  const handleDeleteEvent = useCallback((id: string) => {
    setEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      if (currentUser) {
         localStorage.setItem(`calendar_events_${currentUser}`, JSON.stringify(updated));
      }
      return updated;
    });
  }, [currentUser]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('calendar_user_id');
    setCurrentUser(null);
    setShowAuth(true);
  }, []);

  // --- Calendar Data ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // --- Navigation ---
  const goToPrevMonth = useCallback(() => {
    setDirection(-1);
    setCurrentDate(
      (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)
    );
  }, []);

  const goToNextMonth = useCallback(() => {
    setDirection(1);
    setCurrentDate(
      (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)
    );
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    setDirection(today > currentDate ? 1 : -1);
    setCurrentDate(today);
  }, [currentDate]);

  const handleYearChange = useCallback((newYear: number) => {
    setDirection(newYear > year ? 1 : -1);
    setCurrentDate(new Date(newYear, month, 1));
  }, [year, month]);

  // --- Day Click ---
  const handleDayClick = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
    setModalOpen(true);
  }, []);

  // --- Reminder ---
  const reminderEvent = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tStr = `${tomorrow.getFullYear()}-${String(
      tomorrow.getMonth() + 1
    ).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    return events.find((e) => e.dateStr === tStr) || null;
  }, [events]);
  const monthLabel = currentDate.toLocaleString('default', { month: 'long' });

  // Build events map for current month

  // Filtered events for list view
  const filteredEvents = useMemo(() => {
    if (!searchQuery) return events;
    const q = searchQuery.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q) ||
        e.note?.toLowerCase().includes(q)
    );
  }, [events, searchQuery]);

  // Hero image
  const heroImage = useMemo(() => {
    const dateKey = currentDate.toISOString().split('T')[0];
    const media = localStorage.getItem(`calendar_hero_media_${dateKey}`);
    const globalMedia = localStorage.getItem('calendar_hero_media');
    return media || globalMedia || '/images/hero_landscape.png';
  }, [currentDate]);

  // Season name
  const seasonName = useMemo(() => {
    if (month >= 2 && month <= 5) return 'Summer';
    if (month >= 6 && month <= 8) return 'Monsoon';
    if (month >= 9 && month <= 10) return 'Autumn';
    return 'Winter';
  }, [month]);

  // Next event
  const nextEvent = useMemo(() => {
    const now = new Date();
    const future = events
      .filter((e) => new Date(e.dateStr) >= now)
      .sort((a, b) => a.dateStr.localeCompare(b.dateStr));
    return future[0] || null;
  }, [events]);

  return (
    <>
      {/* SIGNATURE ENTRY ANIMATION */}
      <AnimatePresence>
        {showIntro && (
          <IntroTransition
            onComplete={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      {/* RADAR SCANNER OVERLAY */}
      <RadarScanner
        isOpen={isRadarOpen}
        onClose={() => setIsRadarOpen(false)}
        events={events}
        currentDate={currentDate}
      />

      <AnimatePresence>
        {showAuth && !showIntro && (
          <AuthModal 
            onSuccess={(email) => {
              localStorage.setItem('calendar_user_id', email);
              setCurrentUser(email);
              setShowAuth(false);
            }}
            onGuest={() => {
              localStorage.setItem('calendar_user_id', 'guest');
              setCurrentUser('guest');
              setShowAuth(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* MAIN APPLICATION */}
      {!showIntro && (
        <motion.div
          className="app-shell animate-enter"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* LEFT — Image Panel */}
          <ImagePanel
            imageSrc={heroImage}
            monthLabel={monthLabel}
            year={year}
            currentDate={currentDate}
          />

          {/* RIGHT — Calendar Panel */}
          <motion.div 
            className="calendar-panel"
            animate={{ scale: isMissionMode ? [1, 1.005, 1] : 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Reminder */}
            <AnimatePresence>
              {reminderEvent && (
                <ReminderBanner event={reminderEvent} />
              )}
            </AnimatePresence>

            {/* Header */}
            <CalendarHeader
              monthLabel={monthLabel}
              year={year}
              onPrev={goToPrevMonth}
              onNext={goToNextMonth}
              onToday={goToToday}
              onYearChange={handleYearChange}
              view={view}
              onViewChange={setView}
              isDark={isDark}
              onToggleTheme={toggleTheme}
              onOpenRadar={() => setIsRadarOpen(true)}
              onLogout={handleLogout}
              isMissionMode={isMissionMode}
              onMissionModeChange={setIsMissionMode}
            />

            {/* Header Area Status Cards */}
            <div className="header-cards">
              <div className="status-card">
                <span className="status-card__label">Current Season</span>
                <span className="status-card__value">{seasonName}</span>
              </div>
              <div className="status-card">
                <span className="status-card__label">Total Events</span>
                <span className="status-card__value">{events.length}</span>
              </div>
              <div className="status-card">
                <span className="status-card__label">Next Up</span>
                <span className="status-card__value">
                  {nextEvent ? nextEvent.title : 'No plans'}
                </span>
              </div>
            </div>

            {/* Calendar Content with Transition */}
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                {view === 'month' ? (
                  <motion.div
                    key="month-view-container" // Keep constant key so the container doesn't unmount, letting FlippingCalendar handle changes inside
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      position: 'absolute', 
                      inset: 0,
                      display: 'flex', 
                      flexDirection: 'column',
                    }}
                  >
                    <FlippingCalendar
                      currentDate={currentDate}
                      events={events}
                      onDayClick={handleDayClick}
                      isMissionMode={isMissionMode}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="list-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ height: '100%' }}
                  >
                    <ListView
                      events={filteredEvents}
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      onEventClick={(dateStr) => {
                        setSelectedDate(dateStr);
                        setModalOpen(true);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>


          {/* EVENT MODAL */}
          <AnimatePresence>
            {modalOpen && selectedDate && (
              <EventModal
                dateStr={selectedDate}
                existingEvents={events}
                isMissionMode={isMissionMode}
                onClose={() => {
                  setModalOpen(false);
                  setSelectedDate(null);
                }}
                onSave={(e) => {
                  handleAddEvent(e);
                  setModalOpen(false);
                  setSelectedDate(null);
                }}
                onDelete={(id) => {
                  handleDeleteEvent(id);
                  setModalOpen(false);
                  setSelectedDate(null);
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}

export default App;
