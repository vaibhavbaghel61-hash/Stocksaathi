import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { Calendar, CheckCircle2, Database, Info, LogOut, Trash2 } from 'lucide-react';
import { Translations } from '../i18n';
import { PilotFeedback, YesMaybeNo, YesNo } from '../types';
import { GoogleGIcon } from './GoogleGIcon';

interface FeedbackAndMoreViewProps {
  t: Translations;
  user: User | null;
  authBusy: boolean;
  onSignInGoogle: () => void;
  onSignOut: () => void;
  onSubmitFeedback: (data: Omit<PilotFeedback, 'id' | 'createdAt'>) => void;
  onOpenWelcome: () => void;
  onOpenBookDemo: () => void;
  onLoadSampleData: () => void;
  onClearData: () => void;
  onOpenFounderView: () => void;
}

export const FeedbackAndMoreView: React.FC<FeedbackAndMoreViewProps> = ({
  t,
  user,
  authBusy,
  onSignInGoogle,
  onSignOut,
  onSubmitFeedback,
  onOpenWelcome,
  onOpenBookDemo,
  onLoadSampleData,
  onClearData,
  onOpenFounderView,
}) => {
  const [easyToAdd, setEasyToAdd] = useState<YesNo>('yes');
  const [useDaily, setUseDaily] = useState<YesMaybeNo>('yes');
  const [pay199, setPay199] = useState<YesMaybeNo>('maybe');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFeedback({
      easyToAdd,
      useDaily,
      pay199,
      comment: comment.trim(),
    });
    setSubmitted(true);
    setComment('');
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.feedbackTitle}</h1>
        <p className="mt-1 text-base text-slate-600">{t.feedbackSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Pilot Feedback Form */}
        <section className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{t.feedbackThanksTitle}</h2>
              <p className="text-base text-slate-600">{t.feedbackThanksDesc}</p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="min-h-[48px] px-5 rounded-xl border border-slate-300 bg-white text-base font-semibold text-slate-800 hover:bg-slate-50"
              >
                {t.submitAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Q1 */}
              <div>
                <p className="text-base font-semibold text-slate-900 mb-2">{t.qEasyAdd}</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['yes', 'no'] as YesNo[]).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setEasyToAdd(val)}
                      className={`min-h-[48px] rounded-xl border text-base font-semibold transition-colors ${
                        easyToAdd === val
                          ? 'border-emerald-700 bg-emerald-700 text-white'
                          : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {val === 'yes' ? t.ansYes : t.ansNo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2 */}
              <div>
                <p className="text-base font-semibold text-slate-900 mb-2">{t.qUseDaily}</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['yes', 'maybe', 'no'] as YesMaybeNo[]).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setUseDaily(val)}
                      className={`min-h-[48px] rounded-xl border text-base font-semibold transition-colors ${
                        useDaily === val
                          ? 'border-emerald-700 bg-emerald-700 text-white'
                          : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {val === 'yes' ? t.ansYes : val === 'maybe' ? t.ansMaybe : t.ansNo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3 */}
              <div>
                <p className="text-base font-semibold text-slate-900 mb-2">{t.qPay199}</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['yes', 'maybe', 'no'] as YesMaybeNo[]).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setPay199(val)}
                      className={`min-h-[48px] rounded-xl border text-base font-semibold transition-colors ${
                        pay199 === val
                          ? 'border-emerald-700 bg-emerald-700 text-white'
                          : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {val === 'yes' ? t.ansYes : val === 'maybe' ? t.ansMaybe : t.ansNo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Comment */}
              <div>
                <label
                  htmlFor="feedback-comment"
                  className="block text-base font-semibold text-slate-900 mb-1.5"
                >
                  {t.qComment}
                </label>
                <textarea
                  id="feedback-comment"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t.qCommentPlaceholder}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[52px] rounded-xl bg-emerald-700 px-6 text-base font-semibold text-white hover:bg-emerald-800 active:scale-[0.98] transition-all"
              >
                {t.submitFeedback}
              </button>
            </form>
          )}
        </section>

        {/* Right: Google Account + Store Tools */}
        <div className="lg:col-span-5 space-y-5">
          {/* Google Account & Cloud Backup */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3.5">
            <h2 className="text-base font-bold text-slate-900">{t.accountSectionTitle}</h2>

            {user ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
                  <p className="text-xs font-medium text-emerald-800">{t.signedInAs}</p>
                  {user.displayName && (
                    <p className="text-base font-bold text-slate-900 mt-0.5">
                      {user.displayName}
                    </p>
                  )}
                  <p className="text-sm text-slate-700 break-all">{user.email}</p>
                </div>
                <p className="text-sm text-slate-600">{t.accountCloudSyncedDesc}</p>
                <button
                  type="button"
                  onClick={onSignOut}
                  disabled={authBusy}
                  className="w-full min-h-[48px] px-4 rounded-xl border border-slate-300 bg-white text-base font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4 text-slate-600" aria-hidden="true" />
                  <span>{t.signOut}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t.accountLocalOnlyDesc}
                </p>
                <button
                  type="button"
                  onClick={onSignInGoogle}
                  disabled={authBusy}
                  className="w-full min-h-[48px] px-4 rounded-xl border border-slate-300 bg-white text-base font-semibold text-slate-900 hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <GoogleGIcon className="h-5 w-5 shrink-0" />
                  <span>{authBusy ? t.signingIn : t.signInWithGoogle}</span>
                </button>
              </div>
            )}
          </section>

          {/* Store & Demo Tools */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <h2 className="text-base font-bold text-slate-900 mb-1">{t.storeToolsTitle}</h2>

            <button
              type="button"
              onClick={onLoadSampleData}
              className="w-full min-h-[48px] px-4 rounded-xl border border-slate-300 bg-white text-left text-base font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-3"
            >
              <Database className="h-5 w-5 text-emerald-700 shrink-0" aria-hidden="true" />
              <span>{t.loadSampleData}</span>
            </button>

            <button
              type="button"
              onClick={onOpenBookDemo}
              className="w-full min-h-[48px] px-4 rounded-xl border border-slate-300 bg-white text-left text-base font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-3"
            >
              <Calendar className="h-5 w-5 text-emerald-700 shrink-0" aria-hidden="true" />
              <span>{t.bookDemoFromAppBtn}</span>
            </button>

            <button
              type="button"
              onClick={onOpenWelcome}
              className="w-full min-h-[48px] px-4 rounded-xl border border-slate-300 bg-white text-left text-base font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-3"
            >
              <Info className="h-5 w-5 text-emerald-700 shrink-0" aria-hidden="true" />
              <span>{t.viewWelcomeBtn}</span>
            </button>

            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="w-full min-h-[48px] px-4 rounded-xl border border-red-200 bg-red-50/50 text-left text-base font-medium text-red-700 hover:bg-red-50 flex items-center gap-3"
              >
                <Trash2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{t.resetAllDataBtn}</span>
              </button>
            ) : (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 space-y-2.5">
                <p className="text-sm font-medium text-red-900">{t.resetConfirmText}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClearData();
                      setConfirmClear(false);
                    }}
                    className="flex-1 min-h-[44px] rounded-lg bg-red-700 text-white text-sm font-semibold hover:bg-red-800"
                  >
                    {t.resetConfirmYes}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="flex-1 min-h-[44px] rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            )}

            {/* Subtle Hidden Founder View Link */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={onOpenFounderView}
                className="min-h-[40px] px-3 text-xs font-medium text-slate-400 hover:text-slate-700 underline underline-offset-4 transition-colors"
              >
                {t.founderViewLink}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
