import React, { useState } from 'react';
import { FileText, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useEInvoiceStore } from '../stores/useEInvoiceStore';
import { generateEInvoiceData, submitToLHDN } from '../utils/eInvoice';

export function EInvoiceButton() {
  const { language, cart, grandTotal, addToast } = useApp();
  const { createEInvoice, getNextInvoiceNumber, loadLastInvoice } = useEInvoiceStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateEInvoice = async () => {
    if (cart.length === 0) {
      addToast('购物车为空，无法生成发票', 'warning');
      return;
    }

    setIsGenerating(true);

    try {
      // 加载上一个发票
      await loadLastInvoice();

      // 获取下一个发票编号
      const invoiceNumber = getNextInvoiceNumber();

      // 准备买家信息（这里用默认值，实际应该从表单获取）
      const buyerInfo = {
        name: 'Walk-in Customer',
        taxId: '',
        idType: 'NRIC' as const,
        email: '',
        phone: '',
        address: '',
      };

      // 准备商品项目
      const items = cart.map(item => ({
        name: language === 'ZH' ? item.nameZH : language === 'BM' ? item.nameBM : item.nameEN,
        quantity: 1,
        unitPrice: item.pricePerKg,
        amount: item.subtotal,
        taxRate: 0, // 马来西亚 SST 税率，根据实际情况调整
        taxAmount: 0,
      }));

      // 生成 E-Invoice 数据
      const eInvoiceData = generateEInvoiceData(invoiceNumber, buyerInfo, items, {
        sellerName: 'NiagaPro Market',
        sellerTaxId: 'C1234567890', // 你的公司 TIN
        sellerRegistrationNo: 'SST123456', // 你的 SST 注册号
        sellerAddress: '123, Jalan Example, 50000 Kuala Lumpur',
        apiBaseUrl: 'https://api.hasil.gov.my/einvoice', // LHDN API URL
        apiClientId: 'your_client_id',
        apiClientSecret: 'your_client_secret',
      });

      // 保存到数据库
      await createEInvoice({
        store_id: 'temp-store-id', // 实际应该从用户信息获取
        user_id: 'temp-user-id',
        invoice_number: invoiceNumber,
        invoice_date: new Date().toISOString(),
        buyer_name: buyerInfo.name,
        buyer_tax_id: buyerInfo.taxId,
        buyer_email: buyerInfo.email,
        items: items,
        subtotal: grandTotal,
        tax_amount: 0,
        total_amount: grandTotal,
      });

      // 尝试提交到 LHDN（可选）
      // await submitToLHDN(eInvoiceData, {...});

      addToast(`E-Invoice 已生成：${invoiceNumber}`, 'success');

    } catch (error) {
      console.error('生成 E-Invoice 失败:', error);
      addToast('生成 E-Invoice 失败', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGenerateEInvoice}
      disabled={isGenerating || cart.length === 0}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all
        ${isGenerating || cart.length === 0
          ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
          : 'bg-purple-500 hover:bg-purple-600 text-white'
        }
      `}
    >
      {isGenerating ? (
        <Loader size={18} className="animate-spin" />
      ) : (
        <FileText size={18} />
      )}
      <span>{isGenerating ? '生成中...' : 'E-Invoice'}</span>
    </button>
  );
}