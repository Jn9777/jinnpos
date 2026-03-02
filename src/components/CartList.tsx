import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { CartItemCard } from './CartItemCard';

interface CartListProps {
  cartEndRef: React.RefObject<HTMLDivElement>;
}

export function CartList({ cartEndRef }: CartListProps) {
  const { language, cart } = useApp();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          {t(language, 'cart')} ({cart.length})
        </h2>
        <ShoppingCart size={18} className="text-neutral-400 dark:text-neutral-500" strokeWidth={1.5} />
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pb-2 pr-1">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400 dark:text-neutral-500 py-8">
            <ShoppingCart size={40} strokeWidth={1} className="text-neutral-300 dark:text-neutral-600 mb-2" />
            <p className="text-sm text-neutral-400 dark:text-neutral-500">{t(language, 'cart')} (0)</p>
          </div>
        ) : (
          cart.map(item => (
            <CartItemCard key={item.id} item={item} />
          ))
        )}
        <div ref={cartEndRef} />
      </div>
    </div>
  );
}