import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Language, CartItem, Product, SupplierInfo } from '../types';
import { PRODUCTS } from '../data/products';
import { DEFAULT_SUPPLIER_INFO } from '../utils/einvoice';
import { usePosStore } from '../stores/usePosStore';
import { supabase } from '../lib/supabase';
import { useWeight } from '../hooks/useWeight';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  cart: CartItem[];
  addToCart: (product: Product, weight: number) => void;
  removeFromCart: (itemId: string) => void;
  applyDiscount: (itemId: string, discountPerKg: number, discountPercent: number) => void;
  clearCart: () => void;
  products: Product[];
  updateProductPrice: (productId: string, newPrice: number) => void;
  setItemPrice: (itemId: string, newPricePerKg: number) => void;
  setManualTotal: (itemId: string, amount: number) => void;
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  grandTotal: number;
  roundOffAdjustment: number;
  applyRoundOff: () => void;
  clearRoundOff: () => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  supplierInfo: SupplierInfo;
  updateSupplierInfo: (info: Partial<SupplierInfo>) => void;
  // 电子秤相关
  weight: number;
  weightStatus: 'stable' | 'unstable';
  isScaleConnected: boolean;
  connectScale: () => Promise<void>;
  disconnectScale: () => Promise<void>;
  isSimulating: boolean;
  toggleSimulation: () => void;
  // 保存交易
  saveTransaction: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [roundOffAdjustment, setRoundOffAdjustment] = useState(0);
  const [supplierInfo, setSupplierInfo] = useState<SupplierInfo>(() => {
    const saved = localStorage.getItem('supplier_info');
    return saved ? JSON.parse(saved) : DEFAULT_SUPPLIER_INFO;
  });

  // ✅ 引入数据库状态
  const { saveWeighingRecord, loadRecords } = usePosStore();

  // ✅ 引入电子秤 Hook
  const {
    weight,
    weightStatus,
    isConnected: isScaleConnected,
    connect: connectScale,
    disconnect: disconnectScale,
    isSimulating,
    toggleSimulation
  } = useWeight();

  // 加载本地记录
  useEffect(() => {
    loadRecords();
  }, []);

  // 暗黑模式
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToCart = useCallback((product: Product, weight: number) => {
    const subtotal = Math.round(weight * product.price * 100) / 100;
    const newItem: CartItem = {
      id: Math.random().toString(36).slice(2),
      productId: product.id,
      nameEN: product.nameEN,
      nameZH: product.nameZH,
      nameBM: product.nameBM,
      emoji: product.emoji,
      weight,
      pricePerKg: product.price,
      discount: 0,
      discountPercent: 0,
      subtotal,
    };
    setCart(prev => [...prev, newItem]);
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const applyDiscount = useCallback((itemId: string, discountPerKg: number, discountPercent: number) => {
    setCart(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const effectivePricePerKg = Math.max(0, item.pricePerKg - discountPerKg);
      const afterPercent = effectivePricePerKg * (1 - discountPercent / 100);
      const subtotal = Math.round(item.weight * afterPercent * 100) / 100;
      return { ...item, discount: discountPerKg, discountPercent, subtotal, manualTotal: undefined };
    }));
  }, []);

  const setItemPrice = useCallback((itemId: string, newPricePerKg: number) => {
    setCart(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const subtotal = Math.round(item.weight * newPricePerKg * 100) / 100;
      return { ...item, pricePerKg: newPricePerKg, discount: 0, discountPercent: 0, subtotal, manualTotal: undefined };
    }));
  }, []);

  const setManualTotal = useCallback((itemId: string, amount: number) => {
    setCart(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      return { ...item, manualTotal: amount, subtotal: amount };
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setRoundOffAdjustment(0);
  }, []);

  const updateProductPrice = useCallback((productId: string, newPrice: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, price: newPrice } : p));
  }, []);

  const updateSupplierInfo = useCallback((info: Partial<SupplierInfo>) => {
    setSupplierInfo(prev => {
      const updated = { ...prev, ...info };
      localStorage.setItem('supplier_info', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 抹零（向下取整）
  const applyRoundOff = useCallback(() => {
    const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const rounded = Math.floor(cartTotal);
    const adjustment = rounded - cartTotal;
    setRoundOffAdjustment(adjustment);
  }, [cart]);

  const clearRoundOff = useCallback(() => {
    setRoundOffAdjustment(0);
  }, []);

  // ✅ 核心：保存交易到数据库（带哈希链）
  const saveTransaction = useCallback(async () => {
    if (cart.length === 0) {
      addToast('购物车为空', 'warning');
      return;
    }
    try {
      console.log('💾 开始保存交易...');
      console.log('购物车商品:', cart);
      
      // 获取用户信息
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'temp-user-id';
      const storeId = user?.id || 'temp-store-id';
      
      // 计算总重量和总金额
      const totalWeight = cart.reduce((sum, item) => sum + item.weight, 0);
      const totalPrice = cart.reduce((sum, item) => sum + item.subtotal, 0);
      const productNames = cart.map(item =>
        language === 'EN' ? item.nameEN : language === '中文' ? item.nameZH : item.nameBM
      ).join(', ');

      console.log('准备保存到数据库:', {
        store_id: storeId,
        user_id: userId,
        weight: totalWeight,
        price: totalPrice,
        product_name: productNames
      });

      // 保存到数据库（带哈希链）
      await saveWeighingRecord({
        store_id: storeId,
        user_id: userId,
        weight: totalWeight,
        price: totalPrice,
        product_name: productNames,
      });

      console.log('✅ 交易保存成功！哈希值已生成');
      addToast('交易已保存！✅', 'success');
      clearCart();
    } catch (error) {
      console.error('❌ 保存失败:', error);
      addToast('保存失败，已存本地', 'error');
    }
  }, [cart, language, saveWeighingRecord, addToast, clearCart]);

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const grandTotal = cartTotal + roundOffAdjustment;

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      cart,
      addToCart,
      removeFromCart,
      applyDiscount,
      clearCart,
      products,
      updateProductPrice,
      setItemPrice,
      setManualTotal,
      toasts,
      addToast,
      removeToast,
      grandTotal,
      roundOffAdjustment,
      applyRoundOff,
      clearRoundOff,
      selectedProductId,
      setSelectedProductId,
      isDarkMode,
      toggleDarkMode,
      supplierInfo,
      updateSupplierInfo,
      // 电子秤
      weight,
      weightStatus,
      isScaleConnected,
      connectScale,
      disconnectScale,
      isSimulating,
      toggleSimulation,
      // 保存交易
      saveTransaction,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}