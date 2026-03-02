import React, { useRef } from 'react';
import { AppProvider } from './context/AppContext';
import { HeaderBar } from './components/HeaderBar';
import { WeightDisplay } from './components/WeightDisplay';
import { ProductGrid } from './components/ProductGrid';
import { CartList } from './components/CartList';
import { BottomActionBar } from './components/BottomActionBar';
import { ToastContainer } from './components/ToastContainer';
import { useWeight } from './hooks/useWeight';

function POSApp() {
  const { weight, status } = useWeight();
  const cartEndRef = useRef(null);

  return (
    <div className="flex flex-col bg-background dark:bg-neutral-900 transition-colors duration-200" style={{ height: '100dvh', overflow: 'hidden' }}>
      <HeaderBar />

      <main className="flex-1 flex flex-col overflow-hidden" role="main" aria-label="POS Main Interface">
        <div className="py-3 flex-shrink-0">
          <WeightDisplay weight={weight} status={status} />
        </div>

        <div className="flex-1 flex flex-col md:flex-row gap-0 md:gap-3 px-3 md:px-4 overflow-hidden min-h-0">
          <div className="md:w-[55%] flex flex-col overflow-hidden min-h-0 md:min-h-0 h-[45%] md:h-auto">
            <ProductGrid weight={weight} weightStatus={status} cartEndRef={cartEndRef} />
          </div>

          <div className="md:hidden h-px bg-neutral-200 dark:bg-neutral-700 my-2 flex-shrink-0" />

          <div className="md:w-[45%] flex flex-col overflow-hidden min-h-0 flex-1 md:flex-none md:h-auto">
            <CartList cartEndRef={cartEndRef} />
          </div>
        </div>
      </main>

      <BottomActionBar />
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