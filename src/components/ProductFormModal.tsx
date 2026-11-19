import React, { useState } from 'react';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { formatUnit, Translations } from '../i18n';
import { Language, Product, UnitType } from '../types';

interface ProductFormModalProps {
  lang: Language;
  t: Translations;
  initialProduct?: Product | null;
  onSave: (data: {
    name: string;
    quantity: number;
    unit: UnitType;
    lowStockThreshold: number;
    price?: number;
  }) => void;
  onDelete?: (productId: string) => void;
  onClose: () => void;
}

const UNITS: UnitType[] = ['pcs', 'kg', 'litre', 'packet'];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  lang,
  t,
  initialProduct,
  onSave,
  onDelete,
  onClose,
}) => {
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name ?? '');
  const [quantityStr, setQuantityStr] = useState(
    initialProduct ? String(initialProduct.quantity) : '0'
  );
  const [unit, setUnit] = useState<UnitType>(initialProduct?.unit ?? 'packet');
  const [thresholdStr, setThresholdStr] = useState(
    initialProduct ? String(initialProduct.lowStockThreshold) : '5'
  );
  const [priceStr, setPriceStr] = useState(
    initialProduct?.price !== undefined ? String(initialProduct.price) : ''
  );
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const adjustNumberField = (
    currentStr: string,
    setter: (v: string) => void,
    delta: number,
    min = 0
  ) => {
    const parsed = Number(currentStr);
    const base = Number.isFinite(parsed) ? parsed : 0;
    const next = Math.max(min, base + delta);
    setter(String(next));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(t.errProductName);
      return;
    }

    const qty = Number(quantityStr);
    if (quantityStr.trim() === '' || !Number.isFinite(qty) || qty < 0) {
      setError(t.errQuantityInvalid);
      return;
    }

    const threshold = Number(thresholdStr);
    if (thresholdStr.trim() === '' || !Number.isFinite(threshold) || threshold < 0) {
      setError(t.errThresholdInvalid);
      return;
    }

    let parsedPrice: number | undefined = undefined;
    if (priceStr.trim() !== '') {
      const p = Number(priceStr);
      if (!Number.isFinite(p) || p < 0) {
        setError(t.errPriceInvalid);
        return;
      }
      parsedPrice = p;
    }

    onSave({
      name: trimmedName,
      quantity: Math.round(qty * 100) / 100,
      unit,
      lowStockThreshold: Math.round(threshold * 100) / 100,
      price: parsedPrice,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-form-title"
    >
      <div className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white border border-slate-200 shadow-xl">
        {/* Grab handle on mobile */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 id="product-form-title" className="text-xl font-bold text-slate-900">
            {isEditing ? t.editProductTitle : t.addProductTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="min-h-[44px] min-w-[44px] rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 flex items-center justify-center"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
            >
              {error}
            </div>
          )}

          {/* Product Name */}
          <div>
            <label
              htmlFor="product-name"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              {t.fieldProductName} <span className="text-red-600">*</span>
            </label>
            <input
              id="product-name"
              type="text"
              autoFocus={!isEditing}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder={t.fieldProductNamePlaceholder}
              className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none"
            />
          </div>

          {/* Unit Picker - 4 Large Touch Buttons */}
          <div>
            <span className="block text-sm font-semibold text-slate-800 mb-2">
              {t.fieldUnit}
            </span>
            <div className="grid grid-cols-4 gap-2">
              {UNITS.map((u) => {
                const selected = unit === u;
                return (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`min-h-[48px] rounded-xl border text-sm sm:text-base font-semibold transition-colors ${
                      selected
                        ? 'border-emerald-700 bg-emerald-700 text-white'
                        : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {formatUnit(u, lang)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Quantity with Quick Steppers */}
          <div>
            <label
              htmlFor="product-qty"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              {t.fieldCurrentQty}
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustNumberField(quantityStr, setQuantityStr, -1, 0)}
                aria-label="Decrease quantity by 1"
                className="min-h-[48px] min-w-[48px] rounded-xl border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 flex items-center justify-center"
              >
                <Minus className="h-5 w-5" />
              </button>
              <input
                id="product-qty"
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                value={quantityStr}
                onChange={(e) => {
                  setQuantityStr(e.target.value);
                  if (error) setError('');
                }}
                className="flex-1 min-h-[48px] rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-center text-xl font-bold text-slate-900 tabular-nums focus:border-emerald-700 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => adjustNumberField(quantityStr, setQuantityStr, 1, 0)}
                aria-label="Increase quantity by 1"
                className="min-h-[48px] min-w-[48px] rounded-xl border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 flex items-center justify-center"
              >
                <Plus className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => adjustNumberField(quantityStr, setQuantityStr, 5, 0)}
                className="min-h-[48px] px-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-semibold hover:bg-emerald-100 tabular-nums"
              >
                +5
              </button>
            </div>
          </div>

          {/* Low-Stock Threshold & Optional Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="product-threshold"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                {t.fieldThreshold}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => adjustNumberField(thresholdStr, setThresholdStr, -1, 0)}
                  aria-label="Decrease threshold by 1"
                  className="min-h-[48px] min-w-[48px] rounded-xl border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 flex items-center justify-center"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <input
                  id="product-threshold"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={thresholdStr}
                  onChange={(e) => {
                    setThresholdStr(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-center text-lg font-bold text-slate-900 tabular-nums focus:border-emerald-700 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => adjustNumberField(thresholdStr, setThresholdStr, 1, 0)}
                  aria-label="Increase threshold by 1"
                  className="min-h-[48px] min-w-[48px] rounded-xl border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 flex items-center justify-center"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500 leading-snug">
                {t.fieldThresholdHelper}
              </p>
            </div>

            <div>
              <label
                htmlFor="product-price"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                {t.fieldPrice}{' '}
                <span className="font-normal text-slate-500">({t.fieldPriceOptional})</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-semibold text-slate-500">
                  ₹
                </span>
                <input
                  id="product-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={priceStr}
                  onChange={(e) => {
                    setPriceStr(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={t.fieldPricePlaceholder}
                  className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-white pl-8 pr-4 py-2.5 text-base font-semibold text-slate-900 placeholder:text-slate-400 tabular-nums focus:border-emerald-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="submit"
              className="flex-1 min-h-[52px] rounded-xl bg-emerald-700 px-6 text-base font-semibold text-white hover:bg-emerald-800 active:scale-[0.98] transition-all"
            >
              {isEditing ? t.updateProduct : t.saveProduct}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] rounded-xl border border-slate-300 bg-white px-5 text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              {t.cancel}
            </button>
          </div>

          {/* Delete Section when editing */}
          {isEditing && initialProduct && onDelete && (
            <div className="pt-3 border-t border-slate-100">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="min-h-[44px] w-full rounded-xl text-sm font-medium text-red-700 hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  <span>{t.deleteProduct}</span>
                </button>
              ) : (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span className="text-sm font-medium text-red-900">
                    {t.deleteConfirmQuestion}
                  </span>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => onDelete(initialProduct.id)}
                      className="flex-1 sm:flex-none min-h-[44px] px-4 rounded-lg bg-red-700 text-white text-sm font-semibold hover:bg-red-800"
                    >
                      {t.deleteConfirmYes}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 sm:flex-none min-h-[44px] px-4 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
