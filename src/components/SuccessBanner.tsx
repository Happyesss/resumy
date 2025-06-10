import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessBannerProps {
  message: string;
  onDismiss?: () => void;
}

export const SuccessBanner: React.FC<SuccessBannerProps> = ({ message, onDismiss }) => {
  if (!message) return null;
  
  return (
    <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <CheckCircle className="w-5 h-5 mr-2" />
        <p>{message}</p>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss} 
          className="text-green-500 hover:text-green-700"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
