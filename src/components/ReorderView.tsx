import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  MessageCircle,
  Plus,
  XCircle,
} from 'lucide-react';
import { formatUnit, Translations } from '../i18n';
import { Language, Product } from '../types';
import { sortForReorder } from '../utils/stock';

interface ReorderViewProps {
  products: Product[];
  lang: Language;
  t: Translations;
  onSelectProduct: (product: Product) => void;
  onNotify: (msg: string) => void;
}

export const ReorderView: React.FC<ReorderViewProps> = ({
  products,
  lang,
  t,
  onSelectProduct,
  onNotify,
}) => {
  const [copied, setCopied] = useState(false);

  const reorderItems = useMemo(() => sortForReorder(products), [products]);

  const whatsappText = useMemo(() => {
    if (reorderItems.length === 0) return '';
    const lines = reorderItems.map((item, idx) => {
      const unitLabel = formatUnit(item.unit, lang);
      return `${idx + 1}. ${item.name} — ${t.whatsappCurrentPrefix}: ${item.quantity} ${unitLabel}`;
    });
    return `${t.whatsappHeader}\n\n${lines.join('\n')}`;
  }, [reorderItems, lang, t]);

  const whatsappHref = useMemo(() => {
    return `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
  }, [whatsappText]);

  const handleCopy = async () => {
    if (!whatsappText) return;
    try {
      await navigator.clipboard.writeText(whatsappText);
      setCopied(true);
      onNotify(t.copiedToast);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback copy via temporary textarea
      const el = document.createElement('textarea');
      el.value = whatsappText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      onNotify(t.copiedToast);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-5 pb-24 md:pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.reorderTitle}</h1>
          <p className="mt-1 text-base text-slate-600">{t.reorderSubtitle}</p>
        </div>
        {reorderItems.length > 0 && (
          <p className="text-sm font-semibold text-slate-700 tabular-nums shrink-0">
            {reorderItems.length} {lang === 'hi' ? 'सामान' : 'items'}
          </p>
        )}
      </div>

      {reorderItems.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{t.reorderEmptyTitle}</h2>
          <p className="mt-1.5 text-base text-slate-600">{t.reorderEmptyDesc}</p>
        </section>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Sorted List (Out-of-stock first) */}
          <section className="lg:col-span-7 space-y-2.5">
            {reorderItems.map((item) => {
              const isOut = item.quantity <= 0;
              const unitLabel = formatUnit(item.unit, lang);
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 break-words">
                      {item.name}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${
                          isOut
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {isOut ? (
                          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        <span>{isOut ? t.statusOut : t.statusLow}</span>
                      </span>

                      <span className="font-bold text-slate-900 tabular-nums">
                        {item.quantity} {unitLabel}
                      </span>
                      <span className="text-slate-400" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-slate-500 text-xs sm:text-sm tabular-nums">
                        {t.thresholdShort}: {item.lowStockThreshold}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectProduct(item)}
                    className="min-h-[48px] px-4 rounded-xl border border-emerald-700 bg-emerald-50 text-emerald-800 text-sm font-semibold hover:bg-emerald-100 flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>{t.quickRestock}</span>
                  </button>
                </div>
              );
            })}
          </section>

          {/* Right: WhatsApp Reorder Share Card */}
          <section className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
            <h2 className="text-base font-bold text-slate-900">{t.listPreviewTitle}</h2>
            <pre className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-800 font-sans leading-relaxed max-h-64 overflow-y-auto">
              {whatsappText}
            </pre>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[52px] w-full rounded-xl bg-emerald-700 px-5 text-base font-semibold text-white hover:bg-emerald-800 flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                <span>{t.shareWhatsApp}</span>
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-5 text-base font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                ) : (
                  <Copy className="h-5 w-5 text-slate-600" aria-hidden="true" />
                )}
                <span>{t.copyList}</span>
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
