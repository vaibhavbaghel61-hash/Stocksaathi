import React, { useMemo, useState } from 'react';
import { CheckCircle2, Minus, Plus, Search, ShoppingBag, TrendingUp, X } from 'lucide-react';
import { formatUnit, Translations } from '../i18n';
import { Language, Product, SaleRecord } from '../types';
import { formatDateTime, isSameLocalDay, isWithinLastDays } from '../utils/stock';

interface SalesViewProps {
  products: Product[];
  sales: SaleRecord[];
  lang: Language;
  t: Translations;
  onRecordSale: (productId: string, quantity: number) => string | null;
}

const QUICK_QTY = [1, 2, 5, 10];

export const SalesView: React.FC<SalesViewProps> = ({
  products,
  sales,
  lang,
  t,
  onRecordSale,
}) => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [qtyStr, setQtyStr] = useState('1');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const inStockProducts = useMemo(
    () => products.filter((p) => p.quantity > 0),
    [products]
  );

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return inStockProducts;
    return inStockProducts.filter((p) => p.name.toLowerCase().includes(q));
  }, [inStockProducts, search]);

  const selectedProduct = useMemo(
    () => inStockProducts.find((p) => p.id === selectedId) ?? inStockProducts[0] ?? null,
    [inStockProducts, selectedId]
  );

  const todayStats = useMemo(() => {
    const todaySales = sales.filter((s) => isSameLocalDay(s.timestamp));
    const itemsSold = todaySales.reduce((acc, s) => acc + s.quantity, 0);
    return {
      count: todaySales.length,
      itemsSold: Math.round(itemsSold * 100) / 100,
      recent: todaySales.slice(0, 6),
    };
  }, [sales]);

  const fastSellingWeek = useMemo(() => {
    const map = new Map<
      string,
      { productId: string; name: string; unit: Product['unit']; totalQty: number }
    >();
    for (const s of sales) {
      if (!isWithinLastDays(s.timestamp, 7)) continue;
      const existing = map.get(s.productId);
      if (existing) {
        existing.totalQty += s.quantity;
      } else {
        map.set(s.productId, {
          productId: s.productId,
          name: s.productName,
          unit: s.unit,
          totalQty: s.quantity,
        });
      }
    }
    return Array.from(map.values())
      .sort((a, b) => b.totalQty - a.totalQty)
      .slice(0, 5);
  }, [sales]);

  const adjustQty = (delta: number) => {
    const cur = Number(qtyStr);
    const base = Number.isFinite(cur) ? cur : 1;
    const next = Math.max(1, base + delta);
    setQtyStr(String(next));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const amount = Number(qtyStr);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError(t.errPositiveQty);
      return;
    }

    if (amount > selectedProduct.quantity) {
      const unitLabel = formatUnit(selectedProduct.unit, lang);
      setError(
        `${t.errInsufficientStock} (${selectedProduct.quantity} ${unitLabel})`
      );
      return;
    }

    const err = onRecordSale(selectedProduct.id, Math.round(amount * 100) / 100);
    if (err) {
      setError(err);
      return;
    }

    setError('');
    setQtyStr('1');
    setSuccessMsg(
      `${selectedProduct.name} (${amount} ${formatUnit(selectedProduct.unit, lang)}) — ${t.saleSuccessToast}`
    );
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.salesTitle}</h1>
        <p className="mt-1 text-base text-slate-600">{t.salesSubtitle}</p>
      </div>

      {/* Today's Sales Summary Strip */}
      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs sm:text-sm font-medium text-slate-600">
            {t.todaySalesCountLabel}
          </p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {todayStats.count}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs sm:text-sm font-medium text-slate-600">
            {t.todayItemsSoldLabel}
          </p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-emerald-700 tabular-nums">
            {todayStats.itemsSold}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Quick Record Sale Form */}
        <section className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
          {inStockProducts.length === 0 ? (
            <div className="py-6 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
              <p className="mt-3 text-base text-slate-700">{t.noInStockProducts}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {successMsg && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 flex items-center gap-2"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" aria-hidden="true" />
                  <span>{successMsg}</span>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
                >
                  {error}
                </div>
              )}

              {/* Step 1: Pick Product */}
              <div>
                <label
                  htmlFor="sale-product-search"
                  className="block text-sm font-semibold text-slate-800 mb-2"
                >
                  {t.pickProductLabel}
                </label>

                <div className="relative mb-2.5">
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id="sale-product-search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-10 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-700 focus:outline-none"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      aria-label={t.clearSearch}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
                  {visibleProducts.length === 0 ? (
                    <p className="p-4 text-sm text-slate-500 text-center">
                      {t.noSearchMatchTitle}
                    </p>
                  ) : (
                    visibleProducts.map((p) => {
                      const isSelected = selectedProduct?.id === p.id;
                      const unitLabel = formatUnit(p.unit, lang);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedId(p.id);
                            setError('');
                          }}
                          className={`w-full min-h-[52px] px-3.5 py-2.5 text-left flex items-center justify-between gap-3 transition-colors ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-950'
                              : 'bg-white hover:bg-slate-50 text-slate-900'
                          }`}
                        >
                          <span className="font-semibold text-base truncate">{p.name}</span>
                          <span className="text-sm font-medium text-slate-600 tabular-nums shrink-0">
                            {p.quantity} {unitLabel}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Step 2: Quantity */}
              {selectedProduct && (
                <div className="pt-1 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="sale-qty"
                      className="text-sm font-semibold text-slate-800"
                    >
                      {t.saleQtyLabel}
                    </label>
                    <span className="text-sm font-semibold text-emerald-800 truncate max-w-[55%]">
                      {selectedProduct.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {QUICK_QTY.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          setQtyStr(String(n));
                          setError('');
                        }}
                        className={`min-h-[44px] rounded-xl border text-base font-semibold tabular-nums ${
                          qtyStr === String(n)
                            ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => adjustQty(-1)}
                      aria-label="Decrease sale quantity"
                      className="min-h-[48px] min-w-[48px] rounded-xl border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 flex items-center justify-center"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <input
                      id="sale-qty"
                      type="number"
                      inputMode="decimal"
                      step="any"
                      min="0.01"
                      value={qtyStr}
                      onChange={(e) => {
                        setQtyStr(e.target.value);
                        setError('');
                      }}
                      className="flex-1 min-h-[48px] rounded-xl border border-slate-300 bg-white px-3 text-center text-xl font-bold text-slate-900 tabular-nums focus:border-emerald-700 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => adjustQty(1)}
                      aria-label="Increase sale quantity"
                      className="min-h-[48px] min-w-[48px] rounded-xl border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 flex items-center justify-center"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[52px] rounded-xl bg-emerald-700 px-6 text-base font-semibold text-white hover:bg-emerald-800 active:scale-[0.98] transition-all"
                  >
                    {t.recordSaleBtn}
                  </button>
                </div>
              )}
            </form>
          )}
        </section>

        {/* Right: Fast-selling items this week + Recent sales today */}
        <div className="lg:col-span-5 space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              <h2 className="text-base font-bold text-slate-900">{t.fastSellingTitle}</h2>
            </div>
            {fastSellingWeek.length === 0 ? (
              <p className="text-sm text-slate-500 leading-relaxed">{t.fastSellingEmpty}</p>
            ) : (
              <ol className="divide-y divide-slate-100">
                {fastSellingWeek.map((item, idx) => (
                  <li
                    key={item.productId}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <span className="w-6 text-sm font-bold text-slate-400 tabular-nums">
                        {idx + 1}.
                      </span>
                      <span className="font-semibold text-slate-900 truncate">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-emerald-800 tabular-nums shrink-0">
                      {Math.round(item.totalQty * 100) / 100} {formatUnit(item.unit, lang)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-base font-bold text-slate-900 mb-3">
              {t.recentSalesTitle}
            </h2>
            {todayStats.recent.length === 0 ? (
              <p className="text-sm text-slate-500">{t.recentSalesEmpty}</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {todayStats.recent.map((s) => (
                  <li key={s.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {s.productName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDateTime(s.timestamp, lang)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-800 tabular-nums shrink-0">
                      {s.quantity} {formatUnit(s.unit, lang)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
