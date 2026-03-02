import React, { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { CartItem } from '../types';
import { useApp } from '../context/AppContext';
import { t, getProductName } from '../utils/i18n';
import { DiscountModal } from './DiscountModal';
import { RemoveItemModal } from './RemoveItemModal';

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { language } = useApp();
  const [showAdjust, setShowAdjust] = useState(false);
  const [showRemove, setShowRemove] = useState(false);

  const name = getProductName(language, item.nameEN, item.nameZH, item.nameBM);
  const hasDiscount = item.discount > 0 || item.discountPercent > 0;
  const isManual = item.manualTotal !== undefined;
  const originalTotal = item.weight * item.pricePerKg;

  return (
    <>
      <div className={`bg-white dark:bg-neutral-800 border-2 rounded-2xl p-3 animate-slide-in-left transition-colors ${
        isManual
          ? 'border-success dark:border-success/70'
          : hasDiscount
            ? 'border-warning dark:border-warning/70'
            : 'border-neutral-200 dark:border-neutral-700'
      }`}>
        <div className="flex items-start gap-3">
          {/* Emoji */}
          <div className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center bg-neutral-100 dark:bg-neutral-700 rounded-xl">
            {item.emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-neutral-800 dark:text-neutral-100 truncate">{name}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {item.weight.toFixed(3)} kg × RM {item.pricePerKg.toFixed(2)}
            </div>

            {/* Manual total badge */}
            {isManual && (
              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-success/10 dark:bg-success/20 text-success rounded-md text-xs font-semibold">
                <span>手动</span>
                <span>RM {item.manualTotal!.toFixed(2)}</span>
              </div>
            )}

            {/* Discount info */}
            {!isManual && hasDiscount && (
              <div className="text-xs text-warning font-semibold mt-0.5">
                {item.discount > 0 && `-RM ${item.discount.toFixed(2)}/kg`}
                {item.discountPercent > 0 && ` -${item.discountPercent}%`}
              </div>
            )}
          </div>

          {/* Subtotal */}
          <div className="text-right flex-shrink-0">
            <div className="font-bold text-success text-base">
              RM {item.subtotal.toFixed(2)}
            </div>
            {/* Show original price crossed out when manual or discounted */}
            {(isManual || hasDiscount) && Math.abs(originalTotal - item.subtotal) > 0.005 && (
              <div className="text-xs text-neutral-400 dark:text-neutral-500 line-through">
                RM {originalTotal.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setShowAdjust(true)}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/40 transition-all duration-150 touch-feedback hover:brightness-110 active:scale-95"
            aria-label={t(language, 'priceAdjust')}
          >
            <SlidersHorizontal size={16} strokeWidth={2.5} />
            <span>{t(language, 'priceAdjust')}</span>
          </button>

          <button
            onClick={() => setShowRemove(true)}
            className="flex items-center justify-center h-9 px-3 rounded-xl bg-error text-error-foreground font-semibold text-xs transition-all duration-150 touch-feedback hover:bg-red-700 active:scale-95"
            aria-label={t(language, 'delete')}
          >
            <X size={16} strokeWidth={2} className="text-error-foreground" />
          </button>
        </div>
      </div>

      <DiscountModal item={item} open={showAdjust} onClose={() => setShowAdjust(false)} />
      <RemoveItemModal item={item} open={showRemove} onClose={() => setShowRemove(false)} />
    </>
  );
}
