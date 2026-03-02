import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { CartItem } from '../types';

interface RemoveItemModalProps {
  item: CartItem | null;
  open: boolean;
  onClose: () => void;
}

const REASONS = ['wrongItem', 'customerChanged', 'priceError', 'other'] as const;

export function RemoveItemModal({ item, open, onClose }: RemoveItemModalProps) {
  const { language, removeFromCart, addToast } = useApp();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!item || !selectedReason) return;
    removeFromCart(item.id);
    addToast(t(language, 'removeItem'), 'warning');
    setSelectedReason(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedReason(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm mx-auto rounded-3xl p-0 overflow-hidden animate-slide-up border-0">
        <div className="bg-white dark:bg-neutral-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <DialogTitle className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t(language, 'removeItemTitle')}
            </DialogTitle>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
              aria-label={t(language, 'cancel')}
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          <div className="flex items-start gap-2 bg-warning-light dark:bg-yellow-900/30 rounded-xl p-3 mb-4">
            <AlertTriangle size={18} className="text-warning flex-shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-sm text-neutral-700 dark:text-neutral-200">{t(language, 'removeItemNote')}</p>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            {REASONS.map(reason => (
              <button
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={`
                  w-full text-left px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-150 touch-feedback
                  ${selectedReason === reason
                    ? 'border-error bg-red-50 dark:bg-red-900/20 text-error'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600'
                  }
                `}
                aria-pressed={selectedReason === reason}
              >
                {t(language, reason)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleClose}
              className="h-12 rounded-xl bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-all duration-150 touch-feedback text-sm"
            >
              {t(language, 'cancel')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedReason}
              className="h-12 rounded-xl bg-error text-error-foreground font-semibold hover:bg-red-700 transition-all duration-150 touch-feedback text-sm disabled:opacity-50"
            >
              {t(language, 'confirm')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
