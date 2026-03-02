import React, { useState } from 'react';
import { Scale, Moon, Sun, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useClock } from '../hooks/useClock';
import { Language } from '../types';
import { SettingsModal } from './SettingsModal';

const LANGUAGES: Language[] = ['EN', '中文', 'BM'];

export function HeaderBar() {
  const { language, setLanguage, isDarkMode, toggleDarkMode } = useApp();
  const time = useClock();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const dateStr = time.toLocaleDateString('en-MY', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const timeStr = time.toLocaleTimeString('en-MY', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 bg-primary text-primary-foreground"
      style={{ minHeight: '64px', height: '64px' }}
      role="banner"
    >
      {/* Left: Logo + Store Name */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white bg-opacity-20 flex-shrink-0">
          <Scale size={24} className="text-primary-foreground" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-base text-primary-foreground leading-tight truncate">
            NiagaPro POS
          </div>
          <div className="text-xs text-blue-200 leading-tight truncate hidden sm:block">
            {dateStr}
          </div>
        </div>
      </div>

      {/* Center: Clock */}
      <div className="flex-shrink-0 mx-2 md:mx-4">
        <span
          className="font-mono tabular-nums font-bold text-primary-foreground text-lg md:text-2xl"
          aria-live="polite"
          aria-label={`Current time: ${timeStr}`}
        >
          {timeStr}
        </span>
      </div>

      {/* Right: Settings + Language Buttons + Dark Mode Toggle */}
      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
        {/* Settings Button */}
        <button
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-150 touch-feedback flex-shrink-0"
        >
          <Settings size={20} className="text-primary-foreground" strokeWidth={2} />
        </button>

        {LANGUAGES.map(lang => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            aria-pressed={language === lang}
            aria-label={`Switch language to ${lang}`}
            className={`
              font-bold rounded-lg transition-all duration-150 touch-feedback
              text-sm md:text-base
              px-2 md:px-3 py-1.5
              min-w-[44px] min-h-[40px]
              ${language === lang
                ? 'bg-white text-primary font-bold'
                : 'bg-white bg-opacity-20 text-primary-foreground hover:bg-opacity-30'
              }
            `}
          >
            {lang}
          </button>
        ))}

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-150 touch-feedback flex-shrink-0 ml-1"
        >
          {isDarkMode
            ? <Sun size={20} className="text-primary-foreground" strokeWidth={2} />
            : <Moon size={20} className="text-primary-foreground" strokeWidth={2} />
          }
        </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </header>
  );
}
