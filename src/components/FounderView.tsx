import React, { useMemo } from 'react';
import { ArrowLeft, Copy } from 'lucide-react';
import { Translations } from '../i18n';
import { DemoBooking, Language, PilotFeedback } from '../types';
import { formatDateTime } from '../utils/stock';

interface FounderViewProps {
  feedbackList: PilotFeedback[];
  demoBookings: DemoBooking[];
  lang: Language;
  t: Translations;
  onBack: () => void;
  onNotify: (msg: string) => void;
}

export const FounderView: React.FC<FounderViewProps> = ({
  feedbackList,
  demoBookings,
  lang,
  t,
  onBack,
  onNotify,
}) => {
  const stats = useMemo(() => {
    const total = feedbackList.length;
    if (total === 0) {
      return { total: 0, easyPct: 0, dailyPct: 0, payPct: 0 };
    }
    const easyYes = feedbackList.filter((f) => f.easyToAdd === 'yes').length;
    const dailyYes = feedbackList.filter((f) => f.useDaily === 'yes').length;
    const payYes = feedbackList.filter((f) => f.pay199 === 'yes').length;

    return {
      total,
      easyPct: Math.round((easyYes / total) * 100),
      dailyPct: Math.round((dailyYes / total) * 100),
      payPct: Math.round((payYes / total) * 100),
    };
  }, [feedbackList]);

  const handleCopyReport = async () => {
    const lines = [
      `StockSaathi Pilot Report (${new Date().toLocaleDateString()})`,
      `Feedback Responses: ${stats.total}`,
      `Easy to add product (Yes): ${stats.easyPct}%`,
      `Use daily (Yes): ${stats.dailyPct}%`,
      `Pay ₹199/mo (Yes): ${stats.payPct}%`,
      '',
      '--- Feedback ---',
      ...feedbackList.map(
        (f, i) =>
          `${i + 1}. Easy:${f.easyToAdd} | Daily:${f.useDaily} | Pay199:${f.pay199}${
            f.comment ? ` | "${f.comment}"` : ''
          }`
      ),
      '',
      '--- Demo Requests ---',
      ...demoBookings.map(
        (d, i) =>
          `${i + 1}. ${d.shopName} (${d.ownerName}) · ${d.phone} · ${d.locality}`
      ),
    ];
    const report = lines.join('\n');
    try {
      await navigator.clipboard.writeText(report);
      onNotify(t.founderCopiedToast);
    } catch {
      onNotify(t.founderCopiedToast);
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-2 min-h-[40px] inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>{t.backToFeedback}</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900">{t.founderTitle}</h1>
          <p className="mt-1 text-base text-slate-600">{t.founderSubtitle}</p>
        </div>

        <button
          type="button"
          onClick={handleCopyReport}
          className="min-h-[44px] px-4 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center gap-2 self-start sm:self-auto"
        >
          <Copy className="h-4 w-4 text-emerald-700" aria-hidden="true" />
          <span>{t.founderCopySummary}</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-600">{t.founderResponsesCount}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">
            {stats.total}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-600">{t.founderEasyAddPct}</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700 tabular-nums">
            {stats.easyPct}%
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-600">{t.founderDailyUsePct}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">
            {stats.dailyPct}%
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-600">{t.founderPay199Pct}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">
            {stats.payPct}%
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Feedback Responses */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-bold text-slate-900 mb-3">
            {t.founderFeedbackListTitle}
          </h2>
          {feedbackList.length === 0 ? (
            <p className="text-sm text-slate-500">{t.founderNoFeedback}</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {feedbackList.map((f) => (
                <li key={f.id} className="py-3.5 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-slate-800">
                    <span>
                      {t.qEasyAdd}: <strong className="uppercase">{f.easyToAdd}</strong>
                    </span>
                    <span className="text-slate-300" aria-hidden="true">
                      ·
                    </span>
                    <span>
                      {t.qUseDaily}: <strong className="uppercase">{f.useDaily}</strong>
                    </span>
                    <span className="text-slate-300" aria-hidden="true">
                      ·
                    </span>
                    <span>
                      ₹199/mo: <strong className="uppercase">{f.pay199}</strong>
                    </span>
                  </div>
                  {f.comment && (
                    <p className="text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
                      {f.comment}
                    </p>
                  )}
                  <p className="text-xs text-slate-400">
                    {formatDateTime(f.createdAt, lang)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Demo Booking Requests */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-bold text-slate-900 mb-3">
            {t.founderDemoLeadsTitle}
          </h2>
          {demoBookings.length === 0 ? (
            <p className="text-sm text-slate-500">{t.founderNoDemos}</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {demoBookings.map((d) => (
                <li key={d.id} className="py-3.5 space-y-1">
                  <p className="text-base font-semibold text-slate-900">{d.shopName}</p>
                  <p className="text-sm text-slate-700">
                    {d.ownerName} · <span className="tabular-nums">{d.phone}</span> ·{' '}
                    {d.locality}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatDateTime(d.createdAt, lang)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
