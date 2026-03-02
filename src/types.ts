// 定义支持的三种语言
export type Language = 'EN' | '中文' | 'BM';

// 产品类别
export type ProductCategory = 'fruits' | 'vegetables' | 'herbs' | 'meat' | 'other';

// 支付方式
export type PaymentMethod = 'cash' | 'card_qr' | 'ewallet';

// 产品定义 (必须包含三语名称)
export interface Product {
  id: string;
  nameEN: string;
  nameZH: string;
  nameBM: string;
  price: number;
  emoji: string;
  image: string;
  bgColor: string;
  category: ProductCategory;
}

// 购物车项
export interface CartItem {
  id: string;
  productId: string;
  nameEN: string;
  nameZH: string;
  nameBM: string;
  emoji: string;
  weight: number;
  pricePerKg: number;
  discount: number;
  discountPercent: number;
  subtotal: number;
  manualTotal?: number;
}

// 供应商信息 (E-Invoice)
export interface SupplierInfo {
  name: string;
  registrationNumber: string;
  address: string;
  city: string;
  postcode: string;
  state: string;
  phone: string;
  email: string;
}

// 发票项
export interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

// 发票
export interface Invoice {
  invoiceNumber: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
}