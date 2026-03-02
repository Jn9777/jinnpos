import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { NumericKeypad } from './NumericKeypad';

interface ChangePriceModalProps {
  productId: string | null;
  open: boolean;
  onClose: () => void;
}

export function ChangePriceModal({ productId, open, onClose }: ChangePriceModalProps) {
  const { language, updateProductPrice, addToast } = useApp();

  const handleConfirm = (value: number) => {
    if (!productId) return;
    updateProductPrice(productId, value);
    addToast(t(language, 'priceUpdated'), 'info');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto rounded-3xl p-0 overflow-hidden animate-slide-up border-0">
        <div className="bg-white dark:bg-neutral-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {t(language, 'changePrice')}
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
              aria-label={t(language, 'cancel')}
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>
          <NumericKeypad
            label={t(language, 'enterNewPrice')}
            onConfirm={handleConfirm}
            onCancel={onClose}
            confirmLabel={t(language, 'confirm')}
            confirmColor="bg-primary text-primary-foreground"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
