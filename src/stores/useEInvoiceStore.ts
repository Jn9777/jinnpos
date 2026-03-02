import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { generateInvoiceHash } from '../utils/eInvoice';

interface EInvoiceRecord {
  id?: string;
  store_id: string;
  user_id: string;
  invoice_number: string;
  invoice_date: string;
  buyer_name: string;
  buyer_tax_id?: string;
  buyer_email?: string;
  items: any[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  previous_hash: string;
  current_hash: string;
  lhdn_uuid?: string;
  lhdn_submission_status?: string;
}

interface EInvoiceState {
  lastHash: string | null;
  invoiceSequence: number;
  
  // 动作
  createEInvoice: (data: Omit<EInvoiceRecord, 'id' | 'previous_hash' | 'current_hash'>) => Promise<string>;
  loadLastInvoice: () => Promise<void>;
  getNextInvoiceNumber: () => string;
}

export const useEInvoiceStore = create<EInvoiceState>((set, get) => ({
  lastHash: null,
  invoiceSequence: 1,

  createEInvoice: async (data) => {
    const { lastHash } = get();
    
    // 生成哈希
    const currentHash = generateInvoiceHash(lastHash || '', {
      invoice_number: data.invoice_number,
      total_amount: data.total_amount,
      buyer_name: data.buyer_name,
      store_id: data.store_id,
    });

    const newRecord = {
      ...data,
      previous_hash: lastHash || '',
      current_hash: currentHash,
      created_at: new Date().toISOString(),
    };

    // 保存到 Supabase
    const { data: inserted, error } = await supabase
      .from('e_invoices')
      .insert([newRecord])
      .select()
      .single();

    if (error) {
      console.error('保存 E-Invoice 失败:', error);
      throw error;
    }

    // 更新 lastHash
    set({ lastHash: currentHash });

    return inserted.id;
  },

  loadLastInvoice: async () => {
    const { data: invoices } = await supabase
      .from('e_invoices')
      .select('current_hash, invoice_number')
      .order('created_at', { ascending: false })
      .limit(1);

    if (invoices && invoices.length > 0) {
      set({ lastHash: invoices[0].current_hash });
      
      // 提取序列号
      const lastNumber = invoices[0].invoice_number;
      const seq = parseInt(lastNumber.split('-')[2]);
      set({ invoiceSequence: seq + 1 });
    }
  },

  getNextInvoiceNumber: () => {
    const { invoiceSequence } = get();
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const seqStr = invoiceSequence.toString().padStart(4, '0');
    
    // 更新序列号
    set({ invoiceSequence: invoiceSequence + 1 });
    
    return `INV-${dateStr}-${seqStr}`;
  },
}));