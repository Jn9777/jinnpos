import React, { useState } from 'react';
import { X, Save, Building2, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { SupplierInfo } from '../types';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { language, supplierInfo, updateSupplierInfo, addToast } = useApp();
  const [formData, setFormData] = useState<SupplierInfo>(supplierInfo);
  const [activeTab, setActiveTab] = useState<'supplier' | 'invoices'>('supplier');

  const handleChange = (field: keyof SupplierInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateSupplierInfo(formData);
    addToast(
      language === 'EN' ? 'Settings saved!' : 
      language === '中文' ? '设置已保存！' : 
      'Tetapan disimpan!',
      'success'
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto rounded-3xl p-0 overflow-hidden animate-slide-up border-0 max-h-[90vh]">
        <div className="bg-white dark:bg-neutral-800 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {t(language, 'settings')}
              </DialogTitle>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
                aria-label={t(language, 'cancel')}
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setActiveTab('supplier')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeTab === 'supplier'
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                <Building2 size={16} />
                {t(language, 'supplierInfo')}
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeTab === 'invoices'
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                <FileText size={16} />
                {t(language, 'invoiceHistory')}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'supplier' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t(language, 'companyName')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t(language, 'registrationNo')}
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => handleChange('registrationNumber', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t(language, 'address')}
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {t(language, 'city')}
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {t(language, 'postcode')}
                    </label>
                    <input
                      type="text"
                      value={formData.postcode}
                      onChange={(e) => handleChange('postcode', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t(language, 'state')}
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t(language, 'phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t(language, 'email')}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                <FileText size={48} className="mx-auto mb-3 opacity-50" />
                <p>{t(language, 'invoiceHistory')}</p>
                <p className="text-sm mt-2">{t(language, 'noInvoices')}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {activeTab === 'supplier' && (
            <div className="p-5 border-t border-neutral-200 dark:border-neutral-700 flex-shrink-0">
              <button
                onClick={handleSave}
                className="w-full h-12 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {t(language, 'save')}
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
