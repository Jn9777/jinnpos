import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { t, getProductName } from '../utils/i18n';
import { WeightStatus } from '../hooks/useWeight';

interface ProductCardProps {
  product: Product;
  weight: number;
  weightStatus: WeightStatus;
  cartEndRef: React.RefObject<HTMLDivElement>;
}

export function ProductCard({ product, weight, weightStatus, cartEndRef }: ProductCardProps) {
  const { language, addToCart, addToast, selectedProductId, setSelectedProductId, isDarkMode } = useApp();
  const [showCheck, setShowCheck] = useState(false);

  const isSelected = selectedProductId === product.id;
  // const isStable = weightStatus === 'stable'; // 注释掉稳定检查

  const handleClick = () => {
    setSelectedProductId(isSelected ? null : product.id);

    // 去掉 isStable 检查，只要有重量就能添加（方便测试）
    if (weight > 0) {
      addToCart(product, weight);
      addToast(t(language, 'addedToCart'), 'success');
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 600);
      setTimeout(() => {
        cartEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // 重量为 0 时提示
      addToast(t(language, 'weightUnstable'), 'warning');
    }
  };

  const name = getProductName(language, product.nameEN, product.nameZH, product.nameBM);

  return (
    <button
      onClick={handleClick}
      aria-label={`${name} - RM ${product.price.toFixed(2)} per kg`}
      aria-pressed={isSelected}
      className={`
        relative w-full text-left rounded-xl p-2 md:p-3 transition-all duration-150 touch-feedback
        border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
        dark:bg-neutral-800
        ${isSelected
          ? 'border-primary dark:border-primary'
          : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
        }
        ${weight <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}
      `}
      style={isDarkMode ? {} : { backgroundColor: product.bgColor }}
    >
      {/* Product Image */}
      <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5">
        <img
          src={product.image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name */}
      <div className="font-bold text-[10px] md:text-xs text-neutral-800 dark:text-neutral-100 leading-tight mb-0.5 line-clamp-2">
        {name}
      </div>

      {/* Price */}
      <div className="text-primary font-bold text-xs md:text-sm">
        RM {product.price.toFixed(2)}/kg
      </div>

      {/* Weight indicator (显示当前重量) */}
      {weight > 0 && (
        <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
          {weight.toFixed(3)} kg
        </div>
      )}

      {/* Checkmark animation */}
      {showCheck && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-success bg-opacity-20 animate-checkmark-pop">
          <div className="bg-success rounded-full p-2">
            <Check size={28} className="text-success-foreground" strokeWidth={2.5} />
          </div>
        </div>
      )}
    </button>
  );
}