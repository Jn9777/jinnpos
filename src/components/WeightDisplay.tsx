import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { WeightStatus } from '../hooks/useWeight';

interface WeightDisplayProps {
  weight: number;
  status: WeightStatus;
}

export function WeightDisplay({ weight, status }: WeightDisplayProps) {
  const { language, products, selectedProductId } = useApp();

  const selectedProduct = selectedProductId
    ? products.find(p => p.id === selectedProductId)
    : null;

  const isStable = status === 'stable';
  const borderColor = isStable ? '#00AA66' : '#FF9500';

  const subtotal = selectedProduct
    ? Math.round(weight * selectedProduct.price * 100) / 100
    : null;

  return (
    <div
      className="bg-white dark:bg-neutral-800 rounded-3xl p-4 md:p-6 mx-3 md:mx-4 transition-all duration-300"
      style={{ border: `3px solid ${borderColor}` }}
      role="region"
      aria-label="Weight display"
    >
      <div className="flex flex-col items-center">
        {/* Status Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full mb-2 ${
          isStable
            ? 'bg-green-100 dark:bg-green-900/30'
            : 'bg-orange-100 dark:bg-orange-900/30'
        }`}>
          {isStable
            ? <CheckCircle size={16} className="text-success" strokeWidth={2} />
            : <AlertCircle size={16} className="text-warning" strokeWidth={2} />
          }
          <span className={`text-sm font-semibold ${isStable ? 'text-success' : 'text-warning'}`}>
            {t(language, isStable ? 'stable' : 'unstable')}
          </span>
        </div>

        {/* Weight Number */}
        <div className="flex items-end gap-2 leading-none">
          <span
            className="font-black font-mono tabular-nums text-neutral-900 dark:text-neutral-50"
            style={{ fontSize: 'clamp(56px, 10vw, 96px)', lineHeight: 1 }}
            aria-live="polite"
            aria-label={`Weight: ${weight.toFixed(3)} kilograms`}
          >
            {weight.toFixed(3)}
          </span>
          <span className="text-neutral-500 dark:text-neutral-400 font-semibold mb-2 text-xl md:text-2xl">kg</span>
        </div>

        {/* Price per kg */}
        <div className="mt-2 text-neutral-600 dark:text-neutral-300 text-base md:text-lg font-medium">
          {selectedProduct
            ? `RM ${selectedProduct.price.toFixed(2)} /kg`
            : 'RM --.-- /kg'
          }
        </div>

        {/* Equation line */}
        {selectedProduct && isStable && subtotal !== null && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1 text-sm md:text-base font-medium text-neutral-700 dark:text-neutral-200">
            <span className="font-mono tabular-nums">{weight.toFixed(3)} kg</span>
            <span>×</span>
            <span>RM {selectedProduct.price.toFixed(2)}</span>
            <span>=</span>
            <span className="font-bold text-success text-base md:text-lg">
              RM {subtotal.toFixed(2)}
            </span>
          </div>
        )}

        {/* Unstable hint */}
        {!isStable && (
          <div className="mt-1 text-xs text-warning font-medium">
            {t(language, 'weightUnstable')}
          </div>
        )}
      </div>
    </div>
  );
}
