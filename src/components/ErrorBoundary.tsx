import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'Unexpected application error.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('App ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F6F8F6] flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-6 text-center space-y-4">
            <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
            <p className="text-sm text-slate-600 break-words">
              Please reload the page. Your local shop data remains safe on this device.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="min-h-[48px] w-full rounded-xl bg-emerald-700 text-white text-base font-semibold hover:bg-emerald-800"
            >
              Reload StockSaathi
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
