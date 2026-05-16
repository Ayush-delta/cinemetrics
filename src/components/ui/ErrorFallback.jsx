import React from 'react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-24 h-24 mb-6 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Oops! Something went wrong</h2>
      <p className="text-slate-400 max-w-md mx-auto mb-8">
        We encountered an unexpected error. Please try refreshing the page or navigating back home.
      </p>
      
      <div className="bg-black/30 border border-white/10 rounded-lg p-4 max-w-2xl w-full mb-8 text-left overflow-auto">
        <p className="text-sm text-red-400 font-mono whitespace-pre-wrap">{error?.message}</p>
      </div>

      <div className="flex gap-4">
        <button onClick={resetErrorBoundary} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Try Again
        </button>
        <button onClick={() => window.location.href = '/'} className="btn-ghost">
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
