import React from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-20 right-3 z-50 flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map(toast => {
        const config = {
          success: { bg: 'bg-success', text: 'text-success-foreground', icon: <CheckCircle size={18} strokeWidth={2} className="text-success-foreground" /> },
          error: { bg: 'bg-error', text: 'text-error-foreground', icon: <AlertCircle size={18} strokeWidth={2} className="text-error-foreground" /> },
          warning: { bg: 'bg-warning', text: 'text-warning-foreground', icon: <AlertTriangle size={18} strokeWidth={2} className="text-warning-foreground" /> },
          info: { bg: 'bg-primary', text: 'text-primary-foreground', icon: <Info size={18} strokeWidth={2} className="text-primary-foreground" /> },
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-2xl pointer-events-auto
              animate-slide-in-right max-w-[280px]
              ${config.bg}
            `}
            role="alert"
          >
            {config.icon}
            <span className={`text-sm font-semibold flex-1 ${config.text}`}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className={`ml-1 p-0.5 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors ${config.text}`}
              aria-label="Dismiss notification"
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        );
      })}
    </div>
  );
}