import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, getProductName } from '../utils/i18n';
import { ProductCard } from './ProductCard';
import { WeightStatus } from '../hooks/useWeight';
import { ProductCategory } from '../types';

interface ProductGridProps {
  weight: number;
  weightStatus: WeightStatus;
  cartEndRef: React.RefObject<HTMLDivElement>;
}

type CategoryFilter = 'all' | ProductCategory;

type CategoryLabelKey = 'categoryAll' | 'categoryFruits' | 'categoryVegetables' | 'categoryHerbs' | 'categoryMeat';

const CATEGORIES: { id: CategoryFilter; emoji: string; labelKey: CategoryLabelKey }[] = [
  { id: 'all',        emoji: '🛒', labelKey: 'categoryAll' },
  { id: 'fruits',     emoji: '🍎', labelKey: 'categoryFruits' },
  { id: 'vegetables', emoji: '🥦', labelKey: 'categoryVegetables' },
  { id: 'herbs',      emoji: '🌿', labelKey: 'categoryHerbs' },
  { id: 'meat',       emoji: '🥩', labelKey: 'categoryMeat' },
];

export function ProductGrid({ weight, weightStatus, cartEndRef }: ProductGridProps) {
  const { language, products } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const name = getProductName(language, product.nameEN, product.nameZH, product.nameBM).toLowerCase();
      const matchesSearch = searchQuery === '' || name.includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery, language]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          {t(language, 'products')}
          <span className="ml-1.5 font-normal normal-case tracking-normal text-neutral-400 dark:text-neutral-500">
            ({filteredProducts.length})
          </span>
        </h2>
      </div>

      {/* Search bar */}
      <div className="relative mb-2 flex-shrink-0">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none"
          strokeWidth={2}
        />
        <input
          type="search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={t(language, 'searchPlaceholder')}
          className="
            w-full h-10 pl-9 pr-9 rounded-xl
            bg-white dark:bg-neutral-800
            border-2 border-neutral-200 dark:border-neutral-700
            text-sm text-neutral-800 dark:text-neutral-100
            placeholder-neutral-400 dark:placeholder-neutral-500
            focus:outline-none focus:border-primary dark:focus:border-primary
            transition-colors
          "
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
            aria-label="Clear search"
          >
            <X size={15} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto mb-2 flex-shrink-0 pb-1 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            aria-pressed={selectedCategory === cat.id}
            className={`
              flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold
              whitespace-nowrap transition-all duration-150 touch-feedback flex-shrink-0
              ${selectedCategory === cat.id
                ? 'bg-primary text-white shadow-sm scale-[1.03]'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
              }
            `}
          >
            <span role="img" aria-hidden="true">{cat.emoji}</span>
            <span>{t(language, cat.labelKey)}</span>
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 overflow-y-auto flex-1 pb-2 pr-1">
        {filteredProducts.length === 0 ? (
          <div className="col-span-2 md:col-span-3 flex flex-col items-center justify-center py-12 text-neutral-400 dark:text-neutral-500">
            <span className="text-4xl mb-2" role="img" aria-hidden="true">🔍</span>
            <p className="text-sm font-medium">{t(language, 'noProducts')}</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              weight={weight}
              weightStatus={weightStatus}
              cartEndRef={cartEndRef}
            />
          ))
        )}
      </div>
    </div>
  );
}
