import React, { useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderBar } from './components/HeaderBar';
import { WeightDisplay } from './components/WeightDisplay';
import { ProductGrid } from './components/ProductGrid';
import { CartList } from './components/CartList';
import { BottomActionBar } from './components/BottomActionBar';
import { ToastContainer } from './components/ToastContainer';
import { ScaleConnectButton } from './components/ScaleConnectButton';

function POSApp() {
  const { weight, weightStatus } = useApp();
  const cartEndRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col bg-background dark:bg-neutral-900 transition-colors duration-200" style={{ height: '100dvh', overflow: 'hidden' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
        <HeaderBar />
        <ScaleConnectButton />
      </div>

      {/* Main scrollable content */}
      <main
        className="flex-1 flex flex-col overflow-hidden"
        role="main"
        aria-label="POS Main Interface"
      >
        {/* Weight Display */}
        <div className="py-3 flex-shrink-0">
          <WeightDisplay weight={weight} status={weightStatus} />
        </div>

        {/* Product + Cart Section */}
        <div className="flex-1 flex flex-col md:flex-row gap-0 md:gap-3 px-3 md:px-4 overflow-hidden min-h-0">
          {/* Product Grid */}
          <div className="md:w-[55%] flex flex-col overflow-hidden min-h-0 md:min-h-0 h-[45%] md:h-auto">
            <ProductGrid
              weight={weight}
              weightStatus={weightStatus}
              cartEndRef={cartEndRef}
            />
          </div>

          {/* Divider on mobile */}
          <div className="md:hidden h-px bg-neutral-200 dark:border-neutral-700 my-2 flex-shrink-0" />

          {/* Cart List */}
          <div className="md:w-[45%] flex flex-col overflow-hidden min-h-0 flex-1 md:flex-none md:h-auto">
            <CartList cartEndRef={cartEndRef} />
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <BottomActionBar />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <POSApp />
    </AppProvider>
  );
}