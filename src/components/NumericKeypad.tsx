import React, { useState } from 'react';
import { Delete } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';

interface NumericKeypadProps {
  label: string;
  onConfirm: (value: number) => void;
  onCancel: () => void;
  confirmLabel?: string;
  confirmColor?: string;
}

export function NumericKeypad({ label, onConfirm, onCancel, confirmLabel, confirmColor = 'bg-primary text-primary-foreground' }: NumericKeypadProps) {
  const { language } = useApp();
  const [input, setInput] = useState('');

  const handleKey = (key: string) => {
    if (key === '.' && input.includes('.')) return;
    if (input.length >= 8) return;
    setInput(prev => prev + key);
  };

  const handleDelete = () => {
    setInput(prev => prev.slice(0, -1));
  };

  const handleClear = () => setInput('');

  const handleConfirm = () => {
    const val = parseFloat(input);
    if (!isNaN(val) && val >= 0) {
      onConfirm(val);
    }
  };

  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '00'];

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-1">{label}</div>
      <div
        className="bg-neutral-100 dark:bg-neutral-700 rounded-xl px-4 py-3 text-right font-mono tabular-nums text-2xl font-bold text-neutral-900 dark:text-neutral-50 border-2 border-neutral-200 dark:border-neutral-600 min-h-[56px]"
        aria-live="polite"
        aria-label={`Current input: ${input || '0'}`}
      >
        {input || '0'}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {keys.map(key => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            className="h-14 rounded-xl bg-white dark:bg-neutral-700 border-2 border-neutral-200 dark:border-neutral-600 text-xl font-bold text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-600 active:scale-95 transition-all duration-100 touch-feedback"
            aria-label={`Key ${key}`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleDelete}
          className="h-14 rounded-xl bg-neutral-200 dark:bg-neutral-700 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 font-bold hover:bg-neutral-300 dark:hover:bg-neutral-600 active:scale-95 transition-all duration-100 touch-feedback flex items-center justify-center gap-2"
          aria-label="Delete last digit"
        >
          <Delete size={20} strokeWidth={2} />
          <span className="text-base">Del</span>
        </button>
        <button
          onClick={handleClear}
          className="h-14 rounded-xl bg-neutral-200 dark:bg-neutral-700 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 font-bold hover:bg-neutral-300 dark:hover:bg-neutral-600 active:scale-95 transition-all duration-100 touch-feedback text-base"
          aria-label="Clear input"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-1">
        <button
          onClick={onCancel}
          className="h-14 rounded-xl bg-neutral-200 dark:bg-neutral-700 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-600 active:scale-95 transition-all duration-100 touch-feedback text-base"
          aria-label={t(language, 'cancel')}
        >
          {t(language, 'cancel')}
        </button>
        <button
          onClick={handleConfirm}
          disabled={!input}
          className={`h-14 rounded-xl font-semibold active:scale-95 transition-all duration-100 touch-feedback text-base disabled:opacity-50 ${confirmColor}`}
          aria-label={confirmLabel || t(language, 'confirm')}
        >
          {confirmLabel || t(language, 'confirm')}
        </button>
      </div>
    </div>
  );
}
