import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Translations } from '../i18n';

interface DemoBookingModalProps {
  t: Translations;
  onSaveBooking: (data: {
    shopName: string;
    ownerName: string;
    phone: string;
    locality: string;
  }) => void;
  onClose: () => void;
}

export const DemoBookingModal: React.FC<DemoBookingModalProps> = ({
  t,
  onSaveBooking,
  onClose,
}) => {
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) {
      setError(t.demoErrShop);
      return;
    }
    if (!ownerName.trim()) {
      setError(t.demoErrOwner);
      return;
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError(t.demoErrPhone);
      return;
    }
    if (!locality.trim()) {
      setError(t.demoErrLocality);
      return;
    }

    onSaveBooking({
      shopName: shopName.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      locality: locality.trim(),
    });
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
    >
      <div className="w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white border border-slate-200 shadow-xl">
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <div>
            <h2 id="demo-modal-title" className="text-xl font-bold text-slate-900">
              {t.demoModalTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{t.demoModalSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="min-h-[44px] min-w-[44px] rounded-xl text-slate-500 hover:bg-slate-100 flex items-center justify-center shrink-0"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t.demoSuccessTitle}</h3>
            <p className="text-base text-slate-600">{t.demoSuccessDesc}</p>
            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[48px] rounded-xl bg-emerald-700 text-white text-base font-semibold hover:bg-emerald-800"
            >
              {t.close}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="demo-shop"
                className="block text-sm font-semibold text-slate-800 mb-1"
              >
                {t.demoShopName}
              </label>
              <input
                id="demo-shop"
                type="text"
                value={shopName}
                onChange={(e) => {
                  setShopName(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t.demoShopPlaceholder}
                className="w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="demo-owner"
                className="block text-sm font-semibold text-slate-800 mb-1"
              >
                {t.demoOwnerName}
              </label>
              <input
                id="demo-owner"
                type="text"
                value={ownerName}
                onChange={(e) => {
                  setOwnerName(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t.demoOwnerPlaceholder}
                className="w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="demo-phone"
                className="block text-sm font-semibold text-slate-800 mb-1"
              >
                {t.demoPhone}
              </label>
              <input
                id="demo-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t.demoPhonePlaceholder}
                className="w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 tabular-nums focus:border-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="demo-locality"
                className="block text-sm font-semibold text-slate-800 mb-1"
              >
                {t.demoLocality}
              </label>
              <input
                id="demo-locality"
                type="text"
                value={locality}
                onChange={(e) => {
                  setLocality(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t.demoLocalityPlaceholder}
                className="w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="submit"
                className="flex-1 min-h-[52px] rounded-xl bg-emerald-700 px-5 text-base font-semibold text-white hover:bg-emerald-800"
              >
                {t.demoSubmit}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[48px] rounded-xl border border-slate-300 bg-white px-5 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                {t.demoCancel}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
