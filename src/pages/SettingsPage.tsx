import React from 'react';
import { useApp } from '../context/AppContext';

export function SettingsPage() {
  const { language, setLanguage, isDarkMode, toggleDarkMode } = useApp();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 mb-4">
        <h2 className="font-semibold mb-3">Language</h2>
        <div className="flex gap-2">
          {(['EN', '中文', 'BM'] as const).map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 rounded-lg ${language === lang ? 'bg-primary text-white' : 'bg-neutral-200'}`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
        <h2 className="font-semibold mb-3">Dark Mode</h2>
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          {isDarkMode ? 'Disable' : 'Enable'}
        </button>
      </div>
    </div>
  );
}
