import React from 'react';
import { Usb, WifiOff, Wifi } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ScaleConnectButton() {
  const { language, isScaleConnected, connectScale, disconnectScale, isSimulating, toggleSimulation } = useApp();

  const handleClick = async () => {
    if (isScaleConnected) {
      await disconnectScale();
    } else {
      await connectScale();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
          ${isScaleConnected 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-neutral-200'}
        `}
      >
        {isScaleConnected ? <Wifi size={14} /> : <Usb size={14} />}
        {isScaleConnected ? '已连接' : '连接电子秤'}
      </button>

      {/* 模拟模式开关 (测试用) */}
      <button
        onClick={toggleSimulation}
        className={`
          flex items-center gap-1 px-2 py-1 rounded text-[10px] border transition-all
          ${isSimulating 
            ? 'bg-orange-100 border-orange-300 text-orange-700' 
            : 'bg-gray-100 border-gray-300 text-gray-500'}
        `}
        title="没有电子秤时开启此模式测试"
      >
        <WifiOff size={10} />
        模拟
      </button>
    </div>
  );
}