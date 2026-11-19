import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Minus,
  Package,
  Plus,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import { formatUnit, Translations } from '../i18n';
import { Language, Product } from '../types';
import { getStockStatus } from '../utils/stock';

interface DashboardViewProps {
  products: Product[];
  lang: Language;
  t: Translations;
  onQuickAdjust: (productId: string, delta: 1 | -1) => void;
  onSelectProduct: (product: Product) => void;
  onOpenAddProduct: () => void;
  onLoadSampleData: () => void;
}

type FilterMode = 'all' | 'low' | 'out';

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  lang,
  t,
  onQuickAdjust,
  onSelectProduct,
  onOpenAddProduct,
  onLoadSampleData,
}) => {
  const [query, setQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  const counts = useMemo(() => {
    let low = 0;
    let out = 0;
    for (const p of products) {
      const status = getStockStatus(p);
      if (status === 'low') low++;
      else if (status === 'out') out++;
    }
    return { total: products.length, low, out };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const status = getStockStatus(p);
      if (filterMode === 'low' && status !== 'low') return false;
      if (filterMode === 'out' && status !== 'out') return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, query, filterMode]);

  const toggleFilter = (mode: FilterMode) => {
    setFilterMode((prev) => (prev === mode ? 'all' : mode));
  };

  return (
    <div className="space-y-5 pb-28 md:pb-12">
      {/* Summary Cards */}
      <section aria-label="Inventory summary" className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <button
          type="button"
          onClick={() => setFilterMode('all')}
          className={`min-h-[84px] rounded-2xl border p-3 sm:p-4 text-left transition-colors ${
            filterMode === 'all'
              ? 'border-emerald-700 bg-emerald-50/70'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <p className="text-xs sm:text-sm font-medium text-slate-600 leading-snug">
            {t.summaryTotal}
          </p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {counts.total}
          </p>
        </button>

        <button
          type="button"
          onClick={() => toggleFilter('low')}
          className={`min-h-[84px] rounded-2xl border p-3 sm:p-4 text-left transition-colors ${
            filterMode === 'low'
              ? 'border-amber-600 bg-amber-50'
              : 'border-slate-200 bg-white hover:border-amber-300'
          }`}
        >
          <p className="text-xs sm:text-sm font-medium text-amber-800 leading-snug">
            {t.summaryLow}
          </p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-bold text-amber-700 tabular-nums">
            {counts.low}
          </p>
        </button>

        <button
          type="button"
          onClick={() => toggleFilter('out')}
          className={`min-h-[84px] rounded-2xl border p-3 sm:p-4 text-left transition-colors ${
            filterMode === 'out'
              ? 'border-red-600 bg-red-50'
              : 'border-slate-200 bg-white hover:border-red-300'
          }`}
        >
          <p className="text-xs sm:text-sm font-medium text-red-800 leading-snug">
            {t.summaryOut}
          </p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-bold text-red-700 tabular-nums">
            {counts.out}
          </p>
        </button>
      </section>

      {/* Search & Toolbar */}
      <section className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-white pl-11 pr-11 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t.clearSearch}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-200/70 p-1">
            {(['all', 'low', 'out'] as FilterMode[]).map((mode) => {
              const active = filterMode === mode;
              const label =
                mode === 'all' ? t.filterAll : mode === 'low' ? t.filterLow : t.filterOut;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFilterMode(mode)}
                  className={`min-h-[40px] px-3.5 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Load sample data button */}
          <button
            type="button"
            onClick={onLoadSampleData}
            className="min-h-[44px] px-3.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Database className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            <span>{t.loadSampleData}</span>
          </button>

          {/* Desktop Add Product button */}
          <button
            type="button"
            onClick={onOpenAddProduct}
            className="hidden md:flex min-h-[48px] px-5 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 active:scale-[0.98] transition-all items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            <span>{t.addProduct}</span>
          </button>
        </div>
      </section>

      {/* Product List */}
      {products.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Package className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{t.emptyInventoryTitle}</h2>
          <p className="mx-auto mt-2 max-w-md text-base text-slate-600 leading-relaxed">
            {t.emptyInventoryDesc}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenAddProduct}
              className="w-full sm:w-auto min-h-[48px] px-6 rounded-xl bg-emerald-700 text-white text-base font-semibold hover:bg-emerald-800 flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
              <span>{t.addProduct}</span>
            </button>
            <button
              type="button"
              onClick={onLoadSampleData}
              className="w-full sm:w-auto min-h-[48px] px-6 rounded-xl border border-emerald-700 bg-white text-emerald-800 text-base font-semibold hover:bg-emerald-50 flex items-center justify-center gap-2"
            >
              <Database className="h-5 w-5" aria-hidden="true" />
              <span>{t.loadSampleData}</span>
            </button>
          </div>
        </section>
      ) : filteredProducts.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="text-lg font-bold text-slate-900">{t.noSearchMatchTitle}</h2>
          <p className="mt-1.5 text-base text-slate-600">{t.noSearchMatchDesc}</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setFilterMode('all');
            }}
            className="mt-4 min-h-[48px] px-5 rounded-xl border border-slate-300 bg-white text-base font-medium text-slate-800 hover:bg-slate-50"
          >
            {t.showAllItems}
          </button>
        </section>
      ) : (
        <section
          aria-label="Product list"
          className="grid grid-cols-1 lg:grid-cols-2 gap-3"
        >
          {filteredProducts.map((product) => {
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

            return (
              <div
                key={product.id}
                className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
              >
                {/* Tappable Product Info Area */}
                <button
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className="min-w-0 flex-1 min-h-[52px] text-left focus:outline-none rounded-xl p-1 -m-1 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug break-words">
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm">
                    {/* Explicit Status Marker (color + icon + text) */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${statusConfig.bg}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{statusConfig.label}</span>
                    </span>

                    {typeof product.price === 'number' && product.price > 0 && (
                      <span className="text-slate-600 font-medium tabular-nums">
                        ₹{product.price}
                      </span>
                    )}

                    <span className="text-slate-400" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-slate-500 text-xs sm:text-sm tabular-nums">
                      {t.thresholdShort}: {product.lowStockThreshold}
                    </span>
                  </div>
                </button>

                {/* Quantity & Quick +/- Steppers */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onQuickAdjust(product.id, -1)}
                    aria-label={`${t.stockAdjustedMinus} ${product.name}`}
                    className="min-h-[48px] min-w-[48px] rounded-xl border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center"
                  >
                    <Minus className="h-5 w-5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="min-w-[68px] sm:min-w-[78px] min-h-[48px] px-2 rounded-xl text-center hover:bg-slate-50 transition-colors"
                  >
                    <span
                      className={`block text-xl font-bold tabular-nums leading-none ${
                        status === 'out'
                          ? 'text-red-700'
                          : status === 'low'
                          ? 'text-amber-700'
                          : 'text-slate-900'
                      }`}
                    >
                      {product.quantity}
                    </span>
                    <span className="mt-0.5 block text-xs font-medium text-slate-600">
                      {unitLabel}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onQuickAdjust(product.id, 1)}
                    aria-label={`${t.stockAdjustedPlus} ${product.name}`}
                    className="min-h-[48px] min-w-[48px] rounded-xl border border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800 active:scale-95 transition-all flex items-center justify-center"
                  >
                    <Plus className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Mobile Floating Add Product CTA */}
      <div className="md:hidden fixed bottom-20 right-4 z-30">
        <button
          type="button"
          onClick={onOpenAddProduct}
          className="min-h-[52px] px-5 rounded-2xl bg-emerald-700 text-white text-base font-semibold shadow-lg shadow-emerald-900/20 hover:bg-emerald-800 active:scale-[0.97] transition-all flex items-center gap-2"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          <span>{t.addProduct}</span>
        </button>
      </div>
    </div>
  );
};
