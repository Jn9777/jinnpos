import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckoutModal } from '../components/CheckoutModal';
import { ShoppingCart, Settings, Sun, Moon, Scale } from 'lucide-react';

export function POSPage() {
  const {
    language,
    setLanguage,
    cart,
    products,
    addToCart,
    removeFromCart,
    clearCart,
    grandTotal,
    roundOffAdjustment,
    applyRoundOff,
    isDarkMode,
    toggleDarkMode,
    weight,
    weightStatus,
    supplierInfo,
  } = useApp();

  const [showCheckout, setShowCheckout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', emoji: '🏪' },
    { id: 'fruits', name: 'Fruits', emoji: '🍎' },
    { id: 'vegetables', name: 'Vegetables', emoji: '🥬' },
    { id: 'herbs', name: 'Herbs', emoji: '🌿' },
    { id: 'meat', name: 'Meat', emoji: '🥩' },
  ];

  const handleProductClick = (product: any) => {
    const weightToUse = weight > 0 ? weight : 1.0;
    addToCart(product, weightToUse);
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const currentTime = new Date().toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* 顶部栏 - 蓝色 */}
      <header className="bg-blue-600 text-white flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo 和时间 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Scale size={28} className="hidden sm:block" />
              <div>
                <h1 className="font-bold text-lg leading-tight">NiagaPro POS</h1>
                <p className="text-xs opacity-90 hidden sm:block">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="ml-4 text-2xl md:text-3xl font-mono font-bold tracking-wider">
              {currentTime}
            </div>
          </div>

          {/* 右侧按钮 */}
          <div className="flex items-center gap-2">
            {/* 设置 */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Settings size={20} />
            </button>

            {/* 暗黑模式 */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* 语言切换 */}
            <div className="flex gap-1 bg-blue-700 rounded-lg p-1 ml-2">
              {(['EN', '中文', 'BM'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded-md text-sm font-semibold transition-all ${
                    language === lang
                      ? 'bg-white text-blue-600'
                      : 'text-white hover:bg-blue-600'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 重量显示区域 - 大字体 */}
      <div className={`flex-shrink-0 border-b-4 border-yellow-400 ${
        isDarkMode ? 'bg-neutral-800' : 'bg-white'
      }`}>
        <div className="p-6 md:p-8 text-center">
          <div className={`text-sm font-semibold mb-2 ${
            weightStatus === 'stable' ? 'text-green-600' : 'text-orange-500'
          }`}>
            {weightStatus === 'stable' ? '✓ Stable' : '⊘ Unstable'}
          </div>
          <div className="flex items-baseline justify-center gap-1">
            <span className={`font-mono font-black ${
              isDarkMode ? 'text-white' : 'text-neutral-900'
            } text-6xl md:text-7xl lg:text-8xl`}>
              {weight.toFixed(3)}
            </span>
            <span className="text-2xl md:text-3xl text-neutral-400 font-semibold">
              kg
            </span>
          </div>
          {weight > 0 && (
            <div className="mt-2 text-lg text-neutral-500">
              RM {(weight * 6.50).toFixed(2)} /kg
            </div>
          )}
        </div>
      </div>

      {/* 主体内容 - 产品和购物车 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：产品区域 */}
        <div className="flex-1 flex flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-900">
          {/* 分类标签 */}
          <div className="flex-shrink-0 px-4 py-3 bg-neutral-200 dark:bg-neutral-800">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600'
                  }`}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="hidden sm:inline">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 产品网格 */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-150 active:scale-95 flex flex-col items-center min-h-[200px] group"
                  style={{ backgroundColor: product.bgColor || undefined }}
                >
                  {/* 产品图片 */}
                  <div className="w-full aspect-square mb-3 flex items-center justify-center">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.nameEN} 
                        className="w-full h-full object-contain rounded-lg" 
                      />
                    ) : (
                      <span className="text-6xl group-hover:scale-110 transition-transform">
                        {product.emoji}
                      </span>
                    )}
                  </div>
                  
                  {/* 产品名称 */}
                  <h3 className="font-bold text-sm md:text-base mb-1 text-center text-neutral-800 dark:text-neutral-100 line-clamp-2">
                    {language === 'EN' ? product.nameEN : language === '中文' ? product.nameZH : product.nameBM}
                  </h3>
                  
                  {/* 产品价格 */}
                  <p className="text-blue-600 dark:text-blue-400 font-black text-lg md:text-xl">
                    RM {product.price.toFixed(2)}
                    <span className="text-xs md:text-sm text-neutral-500 font-normal">/kg</span>
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：购物车 */}
        <div className="w-80 md:w-96 flex-shrink-0 bg-white dark:bg-neutral-800 border-l shadow-2xl flex flex-col">
          {/* 购物车标题 */}
          <div className="flex-shrink-0 p-4 border-b bg-neutral-50 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={24} className="text-blue-600" />
                <h2 className="font-bold text-lg">Cart</h2>
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-bold">
                  {cart.length}
                </span>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* 购物车项目 */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center text-neutral-400 py-12">
                <ShoppingCart size={64} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm">Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-3 flex items-center gap-3 hover:shadow-md transition-shadow"
                  >
                    <div className="text-2xl flex-shrink-0">
                      {item.emoji || '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{item.nameEN}</h4>
                      <p className="text-xs text-neutral-500">
                        {item.weight.toFixed(3)} kg
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-blue-600 dark:text-blue-400">
                        RM {item.subtotal.toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 总计和结账 */}
          <div className="flex-shrink-0 border-t p-4 bg-neutral-50 dark:bg-neutral-900">
            {roundOffAdjustment !== 0 && (
              <div className="text-sm text-orange-600 mb-2 text-center">
                Round off: RM {roundOffAdjustment.toFixed(2)}
              </div>
            )}
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Grand Total</span>
              <span className="text-3xl font-black text-red-600 dark:text-red-500">
                RM {grandTotal.toFixed(2)}
              </span>
            </div>

            {cart.length > 0 && roundOffAdjustment === 0 && (
              <button
                onClick={applyRoundOff}
                className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold mb-3 hover:bg-purple-700 transition-colors shadow-lg"
              >
                Round Off
              </button>
            )}

            <button
              onClick={() => setShowCheckout(true)}
              disabled={cart.length === 0}
              className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* 结账弹窗 */}
      {showCheckout && (
        <CheckoutModal
          open={showCheckout}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {/* 设置弹窗 */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-3 text-neutral-700 dark:text-neutral-300">Language / 语言</label>
                <div className="flex gap-2">
                  {(['EN', '中文', 'BM'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                        language === lang
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-neutral-700 dark:text-neutral-300">Dark Mode</label>
                <button
                  onClick={toggleDarkMode}
                  className="w-full py-3 bg-neutral-200 dark:bg-neutral-700 rounded-xl font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                >
                  {isDarkMode ? '☀️ Disable Dark Mode' : '🌙 Enable Dark Mode'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}