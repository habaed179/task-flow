import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TaskFlow Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 border border-rose-500/20">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
          <p className="mt-2 text-sm text-slate-400 max-w-md leading-relaxed">
            An unexpected application error occurred. We've captured the traceback.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload TaskFlow Application</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
