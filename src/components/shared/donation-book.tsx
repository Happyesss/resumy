'use client';

import { motion } from 'framer-motion';
import { Book, Heart, Coffee, Star, Gift } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DonationBookProps {
  className?: string;
}

export function DonationBook({ className }: DonationBookProps) {
  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
    >
      {/* Book Shape Container */}
      <div className="relative">
        {/* Book Cover */}
        <div className="w-32 h-40 bg-gradient-to-br from-amber-600 via-yellow-600 to-orange-600 rounded-r-lg rounded-l-sm shadow-2xl relative overflow-hidden">
          {/* Book Spine Effect */}
          <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-amber-800 to-orange-800 shadow-inner"></div>
          
          {/* Book Cover Design */}
          <div className="p-3 h-full flex flex-col items-center justify-between text-white relative z-10">
            {/* Top Decoration */}
            <div className="flex flex-col items-center">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm mb-2">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <div className="text-[10px] font-bold text-center leading-tight">
                SUPPORT
              </div>
            </div>

            {/* Center Icon */}
            <div className="flex-1 flex items-center justify-center">
              <div className="p-3 bg-white/30 rounded-full backdrop-blur-sm">
                <Coffee className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Bottom Text */}
            <div className="text-center">
              <div className="text-[10px] font-bold mb-1">RESUMY</div>
              <div className="text-[8px] opacity-90">PROJECT</div>
            </div>
          </div>

          {/* Book Cover Texture */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
          
          {/* Book Cover Highlights */}
          <div className="absolute top-2 left-3 w-1 h-8 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-2 right-3 w-1 h-6 bg-white/10 rounded-full"></div>
        </div>

        {/* Book Pages Effect */}
        <div className="absolute -right-1 top-1 w-1 h-38 bg-gray-200 rounded-r-sm shadow-sm"></div>
        <div className="absolute -right-0.5 top-0.5 w-0.5 h-39 bg-white rounded-r-sm shadow-sm"></div>

        {/* Floating Elements */}
        <motion.div 
          className="absolute -top-2 -right-2 text-yellow-400"
          animate={{ 
            y: [0, -5, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Star className="h-4 w-4 fill-current" />
        </motion.div>

        <motion.div 
          className="absolute -bottom-1 -left-2 text-pink-400"
          animate={{ 
            y: [0, -3, 0],
            x: [0, 2, 0]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <Heart className="h-3 w-3 fill-current" />
        </motion.div>
      </div>

      {/* Donation Call to Action */}
      <div className="mt-4 text-center">
        <h4 className="text-white font-semibold text-sm mb-2">Support Our Mission</h4>
        <p className="text-gray-400 text-xs mb-3 leading-relaxed">
          Help us keep Resumy free for everyone
        </p>
        
        <Link 
          href="https://coff.ee/resumy" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button 
            size="sm"
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Gift className="h-4 w-4 mr-2" />
            <span className="text-xs font-semibold">Donate</span>
          </Button>
        </Link>

        {/* Small Coffee Link */}
        <Link 
          href="https://coff.ee/resumy" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-xs text-gray-500 hover:text-yellow-400 transition-colors"
        >
          <Coffee className="h-3 w-3" />
          <span>Buy me a coffee</span>
        </Link>
      </div>
    </motion.div>
  );
}
