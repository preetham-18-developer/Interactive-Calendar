import { Moon, Sun, Radio } from 'lucide-react';

interface AppToolbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenRadar: () => void;
}

export function AppToolbar({ isDark, onToggleTheme, onOpenRadar }: AppToolbarProps) {
  return (
    <div className="app-toolbar">
      <button
        className="icon-btn"
        onClick={onOpenRadar}
        title="Radar Scanner"
        id="radar-btn"
        aria-label="Open Radar Scanner"
      >
        <Radio size={14} />
      </button>
      <button
        className="icon-btn"
        onClick={onToggleTheme}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        id="theme-toggle-btn"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </div>
  );
}
