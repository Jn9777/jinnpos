export type Language = 'EN' | '中文' | 'BM';

export type ProductCategory = 'fruits' | 'vegetables' | 'herbs' | 'meat';

export interface Product {
  id: string;
  nameEN: string;
  nameZH: string;
  nameBM: string;
  price: number; // RM per kg
  emoji: string;
  bgColor: string;
  image?: string;
  category: ProductCategory;
}

export interface CartItem {
  id: string;
  productId: string;
  nameEN: string;
  nameZH: string;
  nameBM: string;
  emoji: string;
  weight: number; // kg
  pricePerKg: number;
  discount: number; // RM off per kg
  discountPercent: number; // % off
  subtotal: number;
  manualTotal?: number; // if set, overrides weight-based calculation
}

export type DiscountType =
  | 'reduce_1'
  | 'reduce_2'
  | 'reduce_10pct'
  | 'reduce_20pct'
  | 'round_whole'
  | 'custom';

export type RemoveReason =
  | 'wrong_item'
  | 'customer_changed'
  | 'price_error'
  | 'other';

export type PaymentMethod = 'cash' | 'card_qr' | 'ewallet';
