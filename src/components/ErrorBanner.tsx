import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        <p>{message}</p>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss} 
          className="text-red-500 hover:text-red-700"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
