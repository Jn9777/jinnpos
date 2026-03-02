import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckoutModal } from '../components/CheckoutModal';
import { ShoppingCart, Settings, Moon, Sun } from 'lucide-react';

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
    applyRoundOff,
    roundOffAdjustment,
    isDarkMode,
    toggleDarkMode,
    weight,
    weightStatus,
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
    // 如果有重量，使用实际重量；否则使用默认重量 1kg
    const weightToUse = weight > 0 ? weight : 1.0;
    addToCart(product, weightToUse);
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* 顶部栏 */}
      <header className="bg-blue-600 text-white p-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚖️</div>
            <div>
              <h1 className="font-bold text-lg">NiagaPro POS</h1>
              <p className="text-xs opacity-80">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 语言切换 */}
            <div className="flex gap-1 bg-blue-700 rounded-lg p-1">
              {(['EN', '中文', 'BM'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                    language === lang
                      ? 'bg-white text-blue-600'
                      : 'text-white hover:bg-blue-600'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* 暗黑模式 */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* 设置按钮 */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* 重量显示区域 */}
      <div className={`p-6 border-b ${
        weightStatus === 'stable' 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200' 
          : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200'
      }`}>
        <div className="text-center">
          <div className={`text-sm mb-1 ${
            weightStatus === 'stable' ? 'text-green-600' : 'text-orange-600'
          }`}>
            {weightStatus === 'stable' ? 'Stable' : 'Unstable'}
          </div>
          <div className="text-6xl font-black font-mono text-neutral-800 dark:text-neutral-100">
            {weight.toFixed(3)}
            <span className="text-2xl text-neutral-400 ml-2">kg</span>
          </div>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：产品网格 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 分类标签 */}
          <div className="flex gap-2 p-3 bg-neutral-100 dark:bg-neutral-800 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* 产品网格 */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-150 active:scale-95 flex flex-col items-center"
                  style={{
                    backgroundColor: product.bgColor || undefined,
                  }}
                >
                  <div className="text-5xl mb-3">
                    {product.image ? (
                      <img src={product.image} alt={product.nameEN} className="w-16 h-16 object-contain" />
                    ) : (
                      product.emoji
                    )}
                  </div>
                  <h3 className="font-bold text-sm mb-1 text-center text-neutral-800 dark:text-neutral-100">
                    {language === 'EN' ? product.nameEN : language === '中文' ? product.nameZH : product.nameBM}
                  </h3>
                  <p className="text-primary font-black text-lg">
                    RM {product.price.toFixed(2)}
                    <span className="text-xs text-neutral-500">/kg</span>
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：购物车 */}
        <div className="w-96 bg-white dark:bg-neutral-800 border-l shadow-2xl flex flex-col">
          {/* 购物车标题 */}
          <div className="p-4 border-b bg-neutral-50 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={24} className="text-primary" />
                <h2 className="font-bold text-lg">Cart</h2>
                <span className="bg-primary text-white px-2 py-1 rounded-full text-sm font-bold">
                  {cart.length}
                </span>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
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
                <ShoppingCart size={64} className="mx-auto mb-4 opacity-50" />
                <p>Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-3 flex items-center gap-3"
                  >
                    <div className="text-3xl">{item.emoji}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.nameEN}</h4>
                      <p className="text-xs text-neutral-500">
                        {item.weight.toFixed(3)} kg × RM {item.pricePerKg.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">
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

          {/* 总计和结账按钮 */}
          <div className="border-t p-4 bg-neutral-50 dark:bg-neutral-900">
            {/* 抹零提示 */}
            {roundOffAdjustment !== 0 && (
              <div className="text-sm text-orange-600 mb-2">
                Round off: RM {roundOffAdjustment.toFixed(2)}
              </div>
            )}
            
            {/* 总计 */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Grand Total</span>
              <span className="text-3xl font-black text-error">
                RM {grandTotal.toFixed(2)}
              </span>
            </div>

            {/* 抹零按钮 */}
            {cart.length > 0 && roundOffAdjustment === 0 && (
              <button
                onClick={applyRoundOff}
                className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold mb-3 hover:bg-purple-700 transition-colors"
              >
                Round Off
              </button>
            )}

            {/* 结账按钮 */}
            <button
              onClick={() => setShowCheckout(true)}
              disabled={cart.length === 0}
              className="w-full py-4 bg-success text-success-foreground rounded-xl font-bold text-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Language</label>
                <div className="flex gap-2">
                  {(['EN', '中文', 'BM'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`flex-1 py-2 rounded-lg font-semibold ${
                        language === lang
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-200 dark:bg-neutral-700'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Dark Mode</label>
                <button
                  onClick={toggleDarkMode}
                  className="w-full py-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg"
                >
                  {isDarkMode ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}