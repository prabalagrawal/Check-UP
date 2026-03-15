import * as React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends (React.Component as any) {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const { children } = this.props;
    if (this.state.hasError) {
      let errorMessage = "Something went wrong. Please try again later.";
      
      try {
        // Try to parse Firestore error JSON
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            errorMessage = `Ollie encountered a problem: ${parsed.error} during ${parsed.operationType} on ${parsed.path || 'unknown path'}.`;
          }
        }
      } catch (e) {
        // Not a JSON error, use default or message
        if (this.state.error?.message) {
          errorMessage = this.state.error.message;
        }
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-2xl border border-red-100 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-red-600 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Ollie is confused</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {errorMessage}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-owl-blue text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-owl-blue/90 transition-all shadow-lg"
            >
              <RefreshCw size={20} />
              <span>Refresh Nest</span>
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}
