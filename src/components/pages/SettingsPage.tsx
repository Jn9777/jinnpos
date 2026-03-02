import React from 'react';
import { useApp } from '../context/AppContext';

export function SettingsPage() {
  const { 
    language, 
    setLanguage, 
    isDarkMode, 
    toggleDarkMode,
    supplierInfo,
    updateSupplierInfo
  } = useApp();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-4">
      <h1 className="text-2xl font-bold mb-6">设置</h1>

      {/* 语言设置 */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 mb-4 shadow">
        <h2 className="font-semibold mb-3">语言 / Language</h2>
        <div className="flex gap-2">
          {(['EN', '中文', 'BM'] as const).map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                language === lang
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-neutral-200 dark:bg-neutral-700'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* 暗黑模式 */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 mb-4 shadow">
        <h2 className="font-semibold mb-3">外观</h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleDarkMode}
            className="w-5 h-5 rounded"
          />
          <span>暗黑模式</span>
        </label>
      </div>

      {/* 供应商信息 */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow">
        <h2 className="font-semibold mb-3">供应商信息</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">公司名称</label>
            <input
              type="text"
              value={supplierInfo.name || ''}
              onChange={(e) => updateSupplierInfo({ name: e.target.value })}
              className="input w-full"
              placeholder="输入公司名称"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">注册号</label>
            <input
              type="text"
              value={supplierInfo.registrationNo || ''}
              onChange={(e) => updateSupplierInfo({ registrationNo: e.target.value })}
              className="input w-full"
              placeholder="输入注册号"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">税号</label>
            <input
              type="text"
              value={supplierInfo.taxId || ''}
              onChange={(e) => updateSupplierInfo({ taxId: e.target.value })}
              className="input w-full"
              placeholder="输入税号"
            />
          </div>
        </div>
      </div>
    </div>
  );
}