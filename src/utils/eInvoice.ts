import { Invoice, InvoiceItem, PaymentMethod, SupplierInfo } from '../types';

export const DEFAULT_SUPPLIER_INFO: SupplierInfo = {
  name: 'NiagaPro Market',
  registrationNumber: '',
  address: '',
  city: '',
  postcode: '',
  state: '',
  phone: '',
  email: '',
};

export const generateEInvoice = (
  items: any[],
  paymentMethod: PaymentMethod,
  supplierInfo: SupplierInfo
): Invoice => {
  const invoiceItems: InvoiceItem[] = items.map(item => ({
    name: item.nameEN,
    quantity: 1,
    unitPrice: item.pricePerKg,
    amount: item.subtotal,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.06; // 6% SST
  const total = subtotal + tax;

  const date = new Date();
  const invoiceNumber = `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`;

  return {
    invoiceNumber,
    date: date.toISOString(),
    items: invoiceItems,
    subtotal,
    tax,
    total,
    paymentMethod,
  };
};

export const saveInvoice = (invoice: Invoice) => {
  const invoices = JSON.parse(localStorage.getItem('e_invoices') || '[]');
  invoices.push(invoice);
  localStorage.setItem('e_invoices', JSON.stringify(invoices));
};

export const formatInvoiceForPrint = (invoice: Invoice, language: string) => {
  let text = `
================================
         E-INVOICE
================================
Invoice No: ${invoice.invoiceNumber}
Date: ${new Date(invoice.date).toLocaleString()}
--------------------------------
`;

  invoice.items.forEach(item => {
    text += `${item.name}
  Qty: ${item.quantity} x RM ${item.unitPrice.toFixed(2)}
  Amount: RM ${item.amount.toFixed(2)}
--------------------------------
`;
  });

  text += `
Subtotal: RM ${invoice.subtotal.toFixed(2)}
Tax (6%): RM ${invoice.tax.toFixed(2)}
TOTAL: RM ${invoice.total.toFixed(2)}
--------------------------------
Payment: ${invoice.paymentMethod.toUpperCase()}
================================
   `;

  return text;
};