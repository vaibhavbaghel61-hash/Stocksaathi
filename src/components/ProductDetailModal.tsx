import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Pencil,
  X,
  XCircle,
} from 'lucide-react';
import { formatHistoryType, formatUnit, Translations } from '../i18n';
import { Language, Product } from '../types';
import { formatDateTime, getStockStatus } from '../utils/stock';

interface ProductDetailModalProps {
  product: Product;
  lang: Language;
  t: Translations;
  onUpdateStock: (
    productId: string,
    mode: 'received' | 'sold',
    amount: number
  ) => string | null;
  onEditProduct: (product: Product) => void;
  onClose: () => void;
}

const PRESET_AMOUNTS = [1, 2, 5, 10];

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  lang,
  t,
  onUpdateStock,
  onEditProduct,
  onClose,
}) => {
  const [activeMode, setActiveMode] = useState<'received' | 'sold' | null>(null);
  const [amountStr, setAmountStr] = useState('1');
  const [error, setError] = useState('');

  const status = getStockStatus(product);
  const unitLabel = formatUnit(product.unit, lang);

  const statusConfig =
    status === 'out'
      ? {
          label: t.statusOut,
          bg: 'bg-red-50 text-red-800 border-red-200',
          Icon: XCircle,
        }
      : status === 'low'
      ? {
          label: t.statusLow,
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          Icon: AlertTriangle,
        }
      : {
          label: t.statusOk,
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          Icon: CheckCircle2,
        };

  const StatusIcon = statusConfig.Icon;

  const openMode = (mode: 'received' | 'sold') => {
    setActiveMode(mode);
    setAmountStr('1');
    setError('');
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMode) return;

    const amount = Number(amountStr);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError(t.errPositiveQty);
      return;
    }

    if (activeMode === 'sold' && amount > product.quantity) {
      setError(
        `${t.errInsufficientStock} (${product.quantity} ${unitLabel})`
      );
      return;
    }

    const err = onUpdateStock(product.id, activeMode, Math.round(amount * 100) / 100);
    if (err) {
      setError(err);
      return;
    }
    setActiveMode(null);
    setError('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      <div className="w-full sm:max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        {/* Grab handle on mobile */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="min-w-0">
            <h2
              id="product-detail-title"
              className="text-xl font-bold text-slate-900 leading-snug break-words"
            >
              {product.name}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${statusConfig.bg}`}
              >
                <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{statusConfig.label}</span>
              </span>
              {typeof product.price === 'number' && product.price > 0 && (
                <span className="font-medium tabular-nums">₹{product.price}</span>
              )}
              <span className="text-slate-400" aria-hidden="true">
                ·
              </span>
              <span className="tabular-nums">
                {t.thresholdShort}: {product.lowStockThreshold} {unitLabel}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="min-h-[44px] min-w-[44px] rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 flex items-center justify-center shrink-0"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 space-y-6">
          {/* Current Stock Display + Edit Button */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-600">{t.currentStockLabel}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums">
                {product.quantity}{' '}
                <span className="text-lg font-semibold text-slate-600">{unitLabel}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => onEditProduct(product)}
              className="min-h-[44px] px-4 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center gap-1.5 shrink-0"
            >
              <Pencil className="h-4 w-4 text-slate-600" aria-hidden="true" />
              <span>{t.editDetails}</span>
            </button>
          </div>

          {/* Two Primary Stock Update Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => openMode('received')}
              className={`min-h-[56px] rounded-2xl px-4 py-3 text-base font-semibold transition-all flex items-center justify-center gap-2 ${
                activeMode === 'received'
                  ? 'bg-emerald-800 text-white ring-2 ring-emerald-700 ring-offset-2'
                  : 'bg-emerald-700 text-white hover:bg-emerald-800'
              }`}
            >
              <ArrowDownLeft className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{t.stockReceived}</span>
            </button>

            <button
              type="button"
              onClick={() => openMode('sold')}
              className={`min-h-[56px] rounded-2xl px-4 py-3 text-base font-semibold transition-all flex items-center justify-center gap-2 ${
                activeMode === 'sold'
                  ? 'bg-slate-900 text-white ring-2 ring-slate-900 ring-offset-2'
                  : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ArrowUpRight className="h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
              <span>{t.stockSold}</span>
            </button>
          </div>

          {/* Inline Quantity Entry Form */}
          {activeMode && (
            <form
              onSubmit={handleConfirm}
              className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <label
                  htmlFor="stock-update-amount"
                  className="text-sm font-semibold text-slate-800"
                >
                  {activeMode === 'received' ? t.stockReceived : t.stockSold} —{' '}
                  {t.enterQuantityLabel}
                </label>
                <span className="text-xs font-medium text-slate-500">{unitLabel}</span>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-800"
                >
                  {error}
                </div>
              )}

              {/* Quick Preset Chips */}
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmountStr(String(preset));
                      setError('');
                    }}
                    className={`min-h-[44px] rounded-xl border text-base font-semibold tabular-nums transition-colors ${
                      amountStr === String(preset)
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="stock-update-amount"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0.01"
                  value={amountStr}
                  onChange={(e) => {
                    setAmountStr(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-28 min-h-[48px] rounded-xl border border-slate-300 bg-white px-3 text-center text-xl font-bold text-slate-900 tabular-nums focus:border-emerald-700 focus:outline-none"
                />
                <button
                  type="submit"
                  className={`flex-1 min-h-[48px] rounded-xl px-4 text-base font-semibold text-white transition-colors ${
                    activeMode === 'received'
                      ? 'bg-emerald-700 hover:bg-emerald-800'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {activeMode === 'received' ? t.confirmReceived : t.confirmSold}
                </button>
              </div>
            </form>
          )}

          {/* History Log */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">{t.historyTitle}</h3>
            {product.history.length === 0 ? (
              <p className="text-sm text-slate-500">{t.historyEmpty}</p>
            ) : (
              <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
                {product.history.map((entry) => {
                  const isPositive = entry.delta > 0;
                  return (
                    <li
                      key={entry.id}
                      className="px-4 py-3 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {formatHistoryType(entry.type, lang)}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatDateTime(entry.timestamp, lang)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={`text-base font-bold tabular-nums ${
                            isPositive
                              ? 'text-emerald-700'
                              : entry.delta < 0
                              ? 'text-amber-700'
                              : 'text-slate-700'
                          }`}
                        >
                          {entry.delta > 0 ? `+${entry.delta}` : entry.delta} {unitLabel}
                        </p>
                        <p className="text-xs text-slate-500 tabular-nums">
                          {t.resultingLabel}: {entry.resultingQuantity} {unitLabel}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
