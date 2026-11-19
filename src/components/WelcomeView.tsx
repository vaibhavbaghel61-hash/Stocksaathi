import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { ArrowRight, Calendar, Check, Globe, LogOut, Store } from 'lucide-react';
import { Translations } from '../i18n';
import { Language } from '../types';
import { GoogleGIcon } from './GoogleGIcon';

interface WelcomeViewProps {
  lang: Language;
  t: Translations;
  user: User | null;
  authBusy: boolean;
  onToggleLanguage: () => void;
  onSignInGoogle: () => void;
  onSignOut: () => void;
  onStartUsing: () => void;
  onOpenBookDemo: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  t,
  user,
  authBusy,
  onToggleLanguage,
  onSignInGoogle,
  onSignOut,
  onStartUsing,
  onOpenBookDemo,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F8F6] text-slate-900">
      {/* Top Bar (3-zone contract) */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <span className="text-lg sm:text-xl font-bold tracking-tight text-emerald-800 whitespace-nowrap shrink-0">
            {t.brandName}
          </span>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#benefits" className="hover:text-slate-900 whitespace-nowrap shrink-0">
              {t.welcomeBenefit1Title}
            </a>
            <a href="#pricing" className="hover:text-slate-900 whitespace-nowrap shrink-0">
              {t.pricingTitle}
            </a>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleLanguage}
              className="min-h-[40px] px-3.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Globe className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              <span>{t.langToggleLabel}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-12 space-y-12 sm:space-y-16">
        {/* Hero Split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] text-balance">
              {t.welcomeHeadline}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              {t.welcomeSubhead}
            </p>

            {/* Primary Auth & Start Actions */}
            <div className="pt-1 space-y-3">
              {user ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-emerald-800">{t.signedInAs}</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onSignOut}
                    disabled={authBusy}
                    className="min-h-[40px] px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shrink-0"
                  >
                    <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t.signOut}</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onSignInGoogle}
                  disabled={authBusy}
                  className="w-full sm:w-auto min-h-[52px] px-6 rounded-xl border border-slate-300 bg-white text-slate-900 text-base font-semibold hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 whitespace-nowrap"
                >
                  <GoogleGIcon className="h-5 w-5 shrink-0" />
                  <span>{authBusy ? t.signingIn : t.signInWithGoogle}</span>
                </button>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onStartUsing}
                  className="min-h-[52px] px-6 rounded-xl bg-emerald-700 text-white text-base font-semibold hover:bg-emerald-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>{t.welcomeStartFree}</span>
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={onOpenBookDemo}
                  className="min-h-[52px] px-6 rounded-xl border border-slate-300 bg-white text-slate-900 text-base font-semibold hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Calendar className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                  <span>{t.welcomeBookDemo}</span>
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-500">{t.welcomeLocationNote}</p>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[240px] sm:min-h-[320px] rounded-2xl overflow-hidden border border-slate-200 bg-emerald-50">
              {!imgFailed ? (
                <img
                  src="/src/assets/images/welcome_kirana_store_1795078077546.jpg"
                  alt="Neighbourhood kirana store counter in Dehradun with grocery shelves and ledger"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-emerald-50 to-slate-100">
                  <Store className="h-12 w-12 text-emerald-700 mb-3" aria-hidden="true" />
                  <p className="text-base font-semibold text-slate-800">{t.brandName}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Three Benefits */}
        <section id="benefits" className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <p className="text-xs font-semibold text-emerald-800">01</p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">
              {t.welcomeBenefit1Title}
            </h2>
            <p className="mt-2 text-base text-slate-600 leading-relaxed">
              {t.welcomeBenefit1Desc}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <p className="text-xs font-semibold text-emerald-800">02</p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">
              {t.welcomeBenefit2Title}
            </h2>
            <p className="mt-2 text-base text-slate-600 leading-relaxed">
              {t.welcomeBenefit2Desc}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <p className="text-xs font-semibold text-emerald-800">03</p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">
              {t.welcomeBenefit3Title}
            </h2>
            <p className="mt-2 text-base text-slate-600 leading-relaxed">
              {t.welcomeBenefit3Desc}
            </p>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {t.pricingTitle}
            </h2>
            <p className="mt-1.5 text-base text-slate-600">{t.pricingSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Free Basic Plan */}
            <div className="rounded-2xl border-2 border-emerald-700 bg-white p-6 flex flex-col justify-between space-y-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{t.planFreeTitle}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900 tabular-nums">
                    {t.planFreePrice}
                  </span>
                  <span className="text-sm text-slate-600">{t.planFreePeriod}</span>
                </div>

                <ul className="mt-5 space-y-3 text-base text-slate-700">
                  {[
                    t.planFreeFeature1,
                    t.planFreeFeature2,
                    t.planFreeFeature3,
                    t.planFreeFeature4,
                  ].map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check
                        className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={onStartUsing}
                className="w-full min-h-[48px] rounded-xl bg-emerald-700 text-white text-base font-semibold hover:bg-emerald-800 transition-colors"
              >
                {t.welcomeStartFree}
              </button>
            </div>

            {/* StockSaathi Plus (Proposed Price Under Validation) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xl font-bold text-slate-900">{t.planPlusTitle}</h3>
                  <span className="text-xs font-semibold text-amber-800">
                    {t.planPlusComingSoon}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900 tabular-nums">
                    {t.planPlusPrice}
                  </span>
                  <span className="text-sm text-slate-600">{t.planPlusPeriod}</span>
                </div>

                <p className="mt-1.5 text-xs font-medium text-slate-500">
                  {t.planPlusValidationNote}
                </p>

                <ul className="mt-5 space-y-3 text-base text-slate-700">
                  {[t.planPlusFeature1, t.planPlusFeature2, t.planPlusFeature3].map(
                    (feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <Check
                          className="h-5 w-5 text-slate-400 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{feat}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <button
                type="button"
                onClick={onOpenBookDemo}
                className="w-full min-h-[48px] rounded-xl border border-slate-300 bg-white text-slate-900 text-base font-semibold hover:bg-slate-50 transition-colors"
              >
                {t.welcomeBookDemo}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
