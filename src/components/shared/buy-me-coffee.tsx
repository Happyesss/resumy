'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Coffee, ExternalLink, Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

interface BuyMeCoffeeProps {
  className?: string;
  variant?: 'widget' | 'button' | 'card';
  showText?: boolean;
}

export function BuyMeCoffee({ className, variant = 'widget', showText = true }: BuyMeCoffeeProps) {
  useEffect(() => {
    if (variant !== 'widget') return;
    
    const script = document.createElement('script');
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
    script.setAttribute('data-name', 'BMC-Widget');
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute('data-id', 'resumy');
    script.setAttribute('data-description', 'Support Resumy development!');
    script.setAttribute('data-message', 'Thanks for using Resumy! Your support helps us keep the platform free and improve it further.');
    script.setAttribute('data-color', '#FFDD00');
    script.setAttribute('data-position', 'Right');
    script.setAttribute('data-x_margin', '18');
    script.setAttribute('data-y_margin', '18');
    
    script.async = true;
    
    // Manually trigger DOMContentLoaded after script loads
    script.onload = function() {
      const evt = document.createEvent('Event');
      evt.initEvent('DOMContentLoaded', false, false);
      window.dispatchEvent(evt);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[data-name="BMC-Widget"]');
      if (existingScript?.parentElement) {
        existingScript.parentElement.removeChild(existingScript);
      }
      const button = document.querySelector('#bmc-wbtn');
      if (button?.parentElement) {
        button.parentElement.removeChild(button);
      }
    };
  }, [variant]);

  if (variant === 'button') {
    return (
      <Link 
        href="https://coff.ee/resumy" 
        target="_blank" 
        rel="noopener noreferrer"
        className={className}
      >
        <Button 
          variant="outline" 
          size="sm"
          className="bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/40 transition-all duration-200"
        >
          <Coffee className="h-4 w-4 mr-2" />
          {showText && "Buy me a coffee"}
          <ExternalLink className="h-3 w-3 ml-2 opacity-60" />
        </Button>
      </Link>
    );
  }

  if (variant === 'card') {
    return (
      <motion.div 
        className={`p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl ${className}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Coffee className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">Support Resumy</h4>
            <p className="text-gray-400 text-xs">Help keep this free</p>
          </div>
        </div>
        <Link 
          href="https://coff.ee/resumy" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button 
            variant="outline" 
            size="sm"
            className="w-full bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all duration-200"
          >
            <Heart className="h-4 w-4 mr-2" />
            Buy me a coffee
            <ExternalLink className="h-3 w-3 ml-2 opacity-60" />
          </Button>
        </Link>
      </motion.div>
    );
  }

  return <div id="bmc-wbtn-container" className={className} />;
} 