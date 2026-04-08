import React from 'react';
import { Search, Calendar } from 'lucide-react';
import type { CalendarEvent } from '../types';

const TYPE_COLORS: Record<string, string> = {
  Meeting: '#3B82F6',
  Birthday: '#EC4899',
  Festival: '#F59E0B',
  Holiday: '#22C55E',
  Anniversary: '#8B5CF6',
};

interface ListViewProps {
  events: CalendarEvent[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onEventClick: (dateStr: string) => void;
}

export const ListView = React.memo(function ListView({
  events,
  searchQuery,
  onSearchChange,
  onEventClick,
}: ListViewProps) {
  // Sort by date
  const sorted = [...events].sort((a, b) =>
    a.dateStr.localeCompare(b.dateStr)
  );

  return (
    <div className="list-view">
      {/* Search */}
      <div className="search-input-wrapper">
        <Search size={14} />
        <input
          className="form-input"
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          id="event-search-input"
        />
      </div>

      {/* Events list */}
      {sorted.length > 0 ? (
        sorted.map((ev, idx) => {
          const [y, m, d] = ev.dateStr.split('-').map(Number);
          const date = new Date(y, m - 1, d);
          const dateLabel = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={`${ev.id}-${idx}`}
              className="list-view__item"
              onClick={() => onEventClick(ev.dateStr)}
              id={`list-event-${ev.id}`}
            >
              <div>
                <div className="list-view__item-title">{ev.title}</div>
                <div className="list-view__item-meta">
                  {dateLabel} · {ev.type}
                </div>
              </div>
              <div
                className="list-view__item-indicator"
                style={{
                  background: TYPE_COLORS[ev.type] || TYPE_COLORS.Meeting,
                }}
              />
            </div>
          );
        })
      ) : (
        <div className="list-view__empty">
          <Calendar size={32} style={{ opacity: 0.2 }} />
          <div className="list-view__empty-text">
            {searchQuery ? 'No matching events' : 'No events yet'}
          </div>
        </div>
      )}
    </div>
  );
});
