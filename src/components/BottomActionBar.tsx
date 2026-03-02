import React, { useState } from 'react';
import { Trash2, PauseCircle, CreditCard, Scale, Printer, Calculator } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { CheckoutModal } from './CheckoutModal';

export function BottomActionBar() {
  const { language, cart, grandTotal, roundOffAdjustment, clearCart, applyRoundOff, clearRoundOff, addToast } = useApp();
  const [showCheckout, setShowCheckout] = useState(false);
  const itemCount = cart.length;

  const handleClearCart = () => {
    if (cart.length === 0) return;
    clearCart();
    addToast(
      language === 'EN' ? 'Cart cleared' :
      language === '中文' ? '购物车已清空' :
      'Troli dikosongkan',
      'warning'
    );
  };

  const handleHold = () => {
    addToast(
      language === 'EN' ? 'Order on hold' :
      language === '中文' ? '订单已暂停' :
      'Pesanan ditangguhkan',
      'info'
    );
  };

  const handleTare = () => {
    addToast(
      language === 'EN' ? 'Tare applied' :
      language === '中文' ? '已去皮' :
      'Tara diterapkan',
      'info'
    );
  };

  const handlePrint = () => {
    addToast(
      language === 'EN' ? 'Printing receipt...' :
      language === '中文' ? '打印小票中...' :
      'Mencetak resit...',
      'info'
    );
  };

  const handleRoundOff = () => {
    if (roundOffAdjustment !== 0) {
      // Clear existing round off
      clearRoundOff();
      addToast(
        language === 'EN' ? 'Round off cleared' :
        language === '中文' ? '已取消抹零' :
        'Pembundaran dibatalkan',
        'info'
      );
    } else {
      // Apply round off (向下取整)
      const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
      const rounded = Math.floor(cartTotal); // ✅ 向下取整
      const difference = cartTotal - rounded;
      
      if (difference < 0.01) {
        addToast(
          language === 'EN' ? 'Already rounded' : 
          language === '中文' ? '已经是整数' : 
          'Sudah bulat',
          'info'
        );
      } else {
        applyRoundOff();
        addToast(
          language === 'EN' ? `Rounded down to RM ${rounded.toFixed(2)}` : 
          language === '中文' ? `已抹零至 RM ${rounded.toFixed(2)}` : 
          `Dibundarkan ke RM ${rounded.toFixed(2)}`,
          'success'
        );
      }
    }
  };

  const actions = [
    {
      label: t(language, 'clearCart'),
      icon: <Trash2 size={28} strokeWidth={1.5} className="text-error-foreground" />,
      color: 'bg-error text-error-foreground hover:bg-red-700',
      onClick: handleClearCart,
      ariaLabel: t(language, 'clearCart'),
    },
    {
      label: t(language, 'holdOrder'),
      icon: <PauseCircle size={28} strokeWidth={1.5} className="text-accent-foreground" />,
      color: 'bg-accent text-accent-foreground hover:bg-orange-600',
      onClick: handleHold,
      ariaLabel: t(language, 'holdOrder'),
    },
    {
      label: t(language, 'checkout'),
      icon: <CreditCard size={28} strokeWidth={1.5} className="text-success-foreground" />,
      color: 'bg-success text-success-foreground hover:bg-green-700',
      onClick: () => setShowCheckout(true),
      ariaLabel: t(language, 'checkout'),
    },
    {
      label: t(language, 'tare'),
      icon: <Scale size={28} strokeWidth={1.5} className="text-primary-foreground" />,
      color: 'bg-primary text-primary-foreground hover:bg-primary-hover',
      onClick: handleTare,
      ariaLabel: t(language, 'tare'),
    },
    {
      label: t(language, 'print'),
      icon: <Printer size={28} strokeWidth={1.5} className="text-primary-foreground" />,
      color: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
      onClick: handlePrint,
      ariaLabel: t(language, 'print'),
    },
  ];

  return (
    <>
      <footer
        className="bg-white dark:bg-neutral-800 border-t-2 border-neutral-200 dark:border-neutral-700 px-3 md:px-4 py-2 flex items-center gap-2 md:gap-3 transition-colors duration-200"
        style={{ minHeight: '72px' }}
        role="contentinfo"
      >
        {/* Cart summary */}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {itemCount} {t(language, 'items')}
          </div>
          <div className="text-lg md:text-xl font-bold text-neutral-800 dark:text-neutral-100">
            {t(language, 'grandTotal')}
          </div>
          <div className="text-xl md:text-2xl font-black text-error font-mono tabular-nums">
            RM {grandTotal.toFixed(2)}
          </div>
        </div>

        {/* Round Off Button */}
        <button
          onClick={handleRoundOff}
          className={`flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-150 active:scale-95 px-4 py-3 min-w-[80px] shadow-lg ${
            roundOffAdjustment !== 0 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-purple-500 hover:bg-purple-600 text-white'
           }`}
          aria-label={t(language, 'roundOff')}
        >
          <Calculator size={28} strokeWidth={2} />
          <span className="text-xs font-bold leading-tight text-center">
            {t(language, 'roundOff')}
          </span>
          {roundOffAdjustment !== 0 && (
            <span className="text-[10px] font-mono">
              {roundOffAdjustment > 0 ? '+' : ''}{roundOffAdjustment.toFixed(2)}
            </span>
          )}
        </button>

        {/* Action buttons */}
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto flex-shrink-0">
          {actions.map(action => (
            <button
              key={action.label}
              onClick={action.onClick}
              aria-label={action.ariaLabel}
              className={`
                flex flex-col items-center justify-center gap-1 rounded-2xl transition-all duration-150 touch-feedback active:scale-95
                min-w-[64px] md:min-w-[80px] h-[64px] md:h-[80px] px-2
                font-semibold text-xs
                ${action.color}
              `}
            >
              {action.icon}
              <span className="text-[10px] md:text-xs leading-tight text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </footer>

      <CheckoutModal open={showCheckout} onClose={() => setShowCheckout(false)} />
    </>
  );
}