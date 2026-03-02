import React, { useState } from 'react';
import { X, Tag, DollarSign, Hash } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '../context/AppContext';
import { t, getProductName } from '../utils/i18n';
import { NumericKeypad } from './NumericKeypad';
import { CartItem } from '../types';

type ActiveTab = 'discount' | 'price' | 'manual';

interface DiscountModalProps {
  item: CartItem | null;
  open: boolean;
  onClose: () => void;
}

const PRESETS = [
  { key: 'reduce_1',     label: '-RM 1/kg', colorClass: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700' },
  { key: 'reduce_2',     label: '-RM 2/kg', colorClass: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700' },
  { key: 'reduce_5',     label: '-RM 5/kg', colorClass: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700' },
  { key: 'reduce_10pct', label: '-10%',     colorClass: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700' },
  { key: 'reduce_20pct', label: '-20%',     colorClass: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700' },
  { key: 'round_whole',  label: null,       colorClass: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700' },
];

export function DiscountModal({ item, open, onClose }: DiscountModalProps) {
  const { language, applyDiscount, setItemPrice, setManualTotal, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('discount');
  const [showCustomKeypad, setShowCustomKeypad] = useState(false);

  const handleClose = () => {
    setActiveTab('discount');
    setShowCustomKeypad(false);
    onClose();
  };

  const handlePreset = (key: string) => {
    if (!item) return;

    if (key === 'reduce_1') applyDiscount(item.id, 1, 0);
    else if (key === 'reduce_2') applyDiscount(item.id, 2, 0);
    else if (key === 'reduce_5') applyDiscount(item.id, 5, 0);
    else if (key === 'reduce_10pct') applyDiscount(item.id, 0, 10);
    else if (key === 'reduce_20pct') applyDiscount(item.id, 0, 20);
    else if (key === 'round_whole') {
      // 向下取整（只减不增）
      const raw = item.weight * item.pricePerKg;
      const rounded = Math.floor(raw);
      const discountAmount = raw - rounded;
      const discountPerKg = discountAmount / item.weight;
      applyDiscount(item.id, discountPerKg, 0);
    }

    addToast(t(language, 'discountApplied'), 'success');
    handleClose();
  };

  const handleCustomDiscount = (value: number) => {
    if (!item) return;
    applyDiscount(item.id, value, 0);
    addToast(t(language, 'discountApplied'), 'success');
    handleClose();
  };

  const handleSetPrice = (value: number) => {
    if (!item) return;
    setItemPrice(item.id, value);
    addToast(t(language, 'pricePerKgUpdated'), 'info');
    handleClose();
  };

  const handleSetManualTotal = (value: number) => {
    if (!item) return;
    setManualTotal(item.id, value);
    addToast(t(language, 'manualTotalSet'), 'success');
    handleClose();
  };

  const TABS: { key: ActiveTab; labelKey: 'discountTab' | 'changePriceTab' | 'manualTab'; icon: React.ReactNode }[] = [
    { key: 'discount', labelKey: 'discountTab',    icon: <Tag size={13} strokeWidth={2} /> },
    { key: 'price',    labelKey: 'changePriceTab', icon: <DollarSign size={13} strokeWidth={2} /> },
    { key: 'manual',   labelKey: 'manualTab',      icon: <Hash size={13} strokeWidth={2} /> },
  ];

  const itemName = item ? getProductName(language, item.nameEN, item.nameZH, item.nameBM) : '';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <DialogTitle className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            {t(language, 'priceAdjust')}
          </DialogTitle>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
            aria-label={t(language, 'cancel')}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Item info chip */}
        {item && (
          <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl px-3 py-2 mb-3">
            <span className="text-xl leading-none">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 truncate">{itemName}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {item.weight.toFixed(3)} kg × RM {item.pricePerKg.toFixed(2)}
                {item.manualTotal !== undefined
                  ? <span className="ml-1 text-success font-semibold">→ RM {item.manualTotal.toFixed(2)} ({t(language, 'manualLabel')})</span>
                  : <span className="ml-1 font-medium text-neutral-600 dark:text-neutral-300">= RM {item.subtotal.toFixed(2)}</span>
                }
              </div>
            </div>
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-700 rounded-xl p-1 mb-4">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setShowCustomKeypad(false); }}
              className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-semibold transition-all duration-150 ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-neutral-600 text-neutral-900 dark:text-neutral-100 shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
            >
              {tab.icon}
              <span>{t(language, tab.labelKey)}</span>
            </button>
          ))}
        </div>

        {/* ── Discount tab ── */}
        {activeTab === 'discount' && !showCustomKeypad && (
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map(preset => (
              <button
                key={preset.key}
                onClick={() => handlePreset(preset.key)}
                className={`h-14 rounded-xl font-bold text-sm border-2 transition-all duration-150 active:scale-95 touch-feedback ${preset.colorClass}`}
              >
                {preset.key === 'round_whole' ? t(language, 'roundWhole') : preset.label}
              </button>
            ))}
            <button
              onClick={() => setShowCustomKeypad(true)}
              className="col-span-2 h-12 rounded-xl font-semibold text-sm bg-neutral-800 dark:bg-neutral-600 text-white border-2 border-neutral-700 dark:border-neutral-500 transition-all duration-150 active:scale-95 touch-feedback"
            >
              {t(language, 'customAmount')} →
            </button>
          </div>
        )}

        {activeTab === 'discount' && showCustomKeypad && (
          <NumericKeypad
            label={`${t(language, 'enterAmount')} (RM/kg)`}
            onConfirm={handleCustomDiscount}
            onCancel={() => setShowCustomKeypad(false)}
            confirmLabel={t(language, 'confirm')}
            confirmColor="bg-warning text-warning-foreground"
          />
        )}

        {/* ── Change price/kg tab ── */}
        {activeTab === 'price' && (
          <NumericKeypad
            label={t(language, 'enterNewPrice')}
            onConfirm={handleSetPrice}
            onCancel={handleClose}
            confirmLabel={t(language, 'confirm')}
            confirmColor="bg-primary text-primary-foreground"
          />
        )}

        {/* ── Manual total tab ── */}
        {activeTab === 'manual' && (
          <div>
            <div className="flex items-center gap-2 bg-success/10 dark:bg-success/20 rounded-xl px-3 py-2 mb-3">
              <Hash size={14} className="text-success flex-shrink-0" strokeWidth={2.5} />
              <p className="text-xs text-success font-medium">
                {language === '中文' ? '直接输入总金额，忽略重量计算' :
                 language === 'BM'   ? 'Masukkan jumlah terus, abaikan pengiraan berat' :
                                        'Enter total directly — overrides weight calculation'}
              </p>
            </div>
            <NumericKeypad
              label={t(language, 'enterManualTotal')}
              onConfirm={handleSetManualTotal}
              onCancel={handleClose}
              confirmLabel={t(language, 'confirm')}
              confirmColor="bg-success text-success-foreground"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}