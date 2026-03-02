import React from 'react';
import { Banknote, CreditCard, Smartphone, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { PaymentMethod } from '../types';
import { generateEInvoice, saveInvoice, formatInvoiceForPrint } from '../utils/einvoice';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

export function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { language, grandTotal, cart, supplierInfo, clearCart, addToast, saveTransaction } = useApp();

  const handlePayment = async (method: PaymentMethod) => {
    console.log('💳 开始处理支付...');
    console.log('支付方式:', method);
    
    // 1. Generate e-Invoice
    const invoice = generateEInvoice(cart, method, supplierInfo);
    
    // 2. Save invoice to localStorage
    saveInvoice(invoice);
    
    // 3. Format and log invoice
    const printableInvoice = formatInvoiceForPrint(invoice, language);
    console.log('=== E-INVOICE GENERATED ===');
    console.log(printableInvoice);
    console.log('Invoice saved:', invoice.invoiceNumber);
    
    // 4. ✅ 保存到数据库（带哈希链）
    try {
      console.log('💾 准备保存交易到数据库...');
      await saveTransaction();
      console.log('✅ 交易已保存到数据库，哈希值已生成');
    } catch (error) {
      console.error('❌ 保存交易失败:', error);
    }
    
    // 5. Clear cart and show success
    addToast(`${t(language, 'paymentSuccess')} (${invoice.invoiceNumber})`, 'success');
    onClose();
  };

  const paymentOptions: { method: PaymentMethod; labelKey: 'cash' | 'cardQr' | 'eWallet'; icon: React.ReactNode; color: string }[] = [
    {
      method: 'cash',
      labelKey: 'cash',
      icon: <Banknote size={28} strokeWidth={1.5} className="text-success-foreground" />,
      color: 'bg-success text-success-foreground hover:bg-green-700',
    },
    {
      method: 'card_qr',
      labelKey: 'cardQr',
      icon: <CreditCard size={28} strokeWidth={1.5} className="text-primary-foreground" />,
      color: 'bg-primary text-primary-foreground hover:bg-primary-hover',
    },
    {
      method: 'ewallet',
      labelKey: 'eWallet',
      icon: <Smartphone size={28} strokeWidth={1.5} className="text-accent-foreground" />,
      color: 'bg-accent text-accent-foreground hover:bg-orange-600',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto rounded-3xl p-0 overflow-hidden animate-slide-up border-0">
        <div className="bg-white dark:bg-neutral-800 p-5">
          <DialogTitle className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            {t(language, 'checkout')}
          </DialogTitle>

          {/* Total */}
          <div className="text-center mb-6 py-4 bg-red-50 dark:bg-red-900/20 rounded-2xl">
            <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">{t(language, 'grandTotal')}</div>
            <div className="text-5xl font-black text-error font-mono tabular-nums">
              RM {grandTotal.toFixed(2)}
            </div>
          </div>

          {/* e-Invoice notice */}
          <div className="flex items-center gap-2 mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <FileText size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {language === 'EN' && 'e-Invoice will be generated automatically'}
              {language === '中文' && '将自动生成电子发票'}
              {language === 'BM' && 'e-Invois akan dijana secara automatik'}
            </p>
          </div>

          {/* Payment options */}
          <div className="flex flex-col gap-3 mb-3">
            {paymentOptions.map(opt => (
              <button
                key={opt.method}
                onClick={() => handlePayment(opt.method)}
                className={`flex items-center gap-3 h-16 px-5 rounded-2xl font-bold text-lg transition-all duration-150 touch-feedback active:scale-95 ${opt.color}`}
                aria-label={t(language, opt.labelKey)}
              >
                {opt.icon}
                <span>{t(language, opt.labelKey)}</span>
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full h-12 rounded-xl bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-all duration-150 touch-feedback text-base"
          >
            {t(language, 'cancel')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}