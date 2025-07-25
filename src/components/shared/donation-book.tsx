'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Book, Heart, Coffee, Star, Gift, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface DonationBookProps {
  className?: string;
}

export function DonationBook({ className }: DonationBookProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openBook = () => setIsOpen(true);
  const closeBook = () => setIsOpen(false);

  return (
    <>
      {/* Book Component */}
      <motion.div 
        className={`relative cursor-pointer select-none ${className}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={{ 
          scale: 1.03, 
          rotateY: 3,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        onClick={openBook}
      >
        {/* Book Shape Container */}
        <div className="relative">
          {/* Book Cover */}
          <div className="w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 bg-gradient-to-br from-amber-600 via-yellow-600 to-orange-600 rounded-r-lg rounded-l-sm shadow-2xl relative overflow-hidden transition-all duration-300 hover:shadow-3xl">
            {/* Book Spine Effect */}
            <div className="absolute left-0 top-0 w-1.5 sm:w-2 h-full bg-gradient-to-b from-amber-800 to-orange-800 shadow-inner"></div>
            
            {/* Book Cover Design */}
            <div className="p-2 sm:p-3 h-full flex flex-col items-center justify-between text-white relative z-10">
              {/* Top Decoration */}
              <div className="flex flex-col items-center">
                <div className="p-1.5 sm:p-2 bg-white/20 rounded-full backdrop-blur-sm mb-1 sm:mb-2">
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="text-[8px] sm:text-[10px] font-bold text-center leading-tight">
                  SUPPORT
                </div>
              </div>

              {/* Center Icon */}
              <div className="flex-1 flex items-center justify-center">
                <div className="p-2 sm:p-3 bg-white/30 rounded-full backdrop-blur-sm">
                  <Coffee className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>

              {/* Bottom Text */}
              <div className="text-center">
                <div className="text-[8px] sm:text-[10px] font-bold mb-1">RESUMY</div>
                <div className="text-[6px] sm:text-[8px] opacity-90">PROJECT</div>
              </div>
            </div>

            {/* Book Cover Texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
            
            {/* Book Cover Highlights */}
            <div className="absolute top-2 left-2 sm:left-3 w-0.5 sm:w-1 h-6 sm:h-8 bg-white/20 rounded-full"></div>
            <div className="absolute bottom-2 right-2 sm:right-3 w-0.5 sm:w-1 h-4 sm:h-6 bg-white/10 rounded-full"></div>
          </div>

          {/* Book Pages Effect */}
          <div className="absolute -right-0.5 sm:-right-1 top-0.5 sm:top-1 w-0.5 sm:w-1 h-31 sm:h-34 md:h-38 bg-gray-200 rounded-r-sm shadow-sm"></div>
          <div className="absolute -right-0.25 sm:-right-0.5 top-0.25 sm:top-0.5 w-0.25 sm:w-0.5 h-31.5 sm:h-35 md:h-39 bg-white rounded-r-sm shadow-sm"></div>

          {/* Floating Elements */}
          <motion.div 
            className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 text-yellow-400"
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
            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
          </motion.div>

          <motion.div 
            className="absolute -bottom-0.5 sm:-bottom-1 -left-1 sm:-left-2 text-pink-400"
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
            <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
          </motion.div>

          {/* Click Indicator */}
          <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <motion.div 
              className="flex items-center justify-center gap-1 text-gray-400 text-xs opacity-70 px-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="hidden sm:inline text-center -mt-10">Click to open</span>
              <span className="sm:hidden text-center">Tap</span>
              <ChevronRight className="h-3 w-3 shrink-0" />
            </motion.div>
          </div>
        </div>

        {/* Donation Call to Action - Only show on larger screens */}
        <div className="mt-6 text-center hidden lg:block">
          <h4 className="text-white font-semibold text-sm mb-3 leading-relaxed">Support Our Mission</h4>
          <p className="text-gray-400 text-xs leading-relaxed px-2">
            Help us keep Resumy free for everyone
          </p>
        </div>
      </motion.div>

      {/* Book Opening Modal/Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBook}
          >
            {/* Open Book */}
            <motion.div
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-2xl max-w-md sm:max-w-lg md:max-w-2xl w-full mx-4 relative overflow-hidden"
              initial={{ scale: 0.8, rotateY: -15 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeBook}
                className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors z-10"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </button>

              {/* Book Content */}
              <div className="p-6 sm:p-8 md:p-10">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                      <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                      Support Resumy
                    </h2>
                  </div>
                  <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full"></div>
                </div>

                {/* Main Content */}
                <div className="space-y-6 text-gray-700">
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 leading-relaxed">
                      Help Us Keep Resumy Free Forever
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-gray-600 max-w-lg mx-auto">
                      Resumy is a passion project built to help job seekers worldwide create 
                      professional resumes without barriers. Your support helps us:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg shrink-0 mt-1">
                        <Star className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base mb-1">Keep it Free</h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          No hidden fees, no premium tiers
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg shrink-0 mt-1">
                        <Coffee className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base mb-1">Fuel Development</h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          Coffee for late-night coding sessions
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg shrink-0 mt-1">
                        <Gift className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base mb-1">Add Features</h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          New templates and AI improvements
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-100 rounded-lg shrink-0 mt-1">
                        <Heart className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base mb-1">Show Love</h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          Support independent developers
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed max-w-md mx-auto">
                      Every contribution, no matter how small, makes a huge difference. 
                      Thank you for believing in our mission! ❤️
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
                      <Link 
                        href="https://coff.ee/resumy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="order-2 sm:order-1"
                      >
                        <Button 
                          size="lg"
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3"
                        >
                          <Coffee className="h-5 w-5 mr-2" />
                          <span className="font-semibold">Buy me a coffee</span>
                        </Button>
                      </Link>

                      <Link 
                        href="https://coff.ee/resumy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="order-1 sm:order-2"
                      >
                        <Button 
                          variant="outline"
                          size="lg"
                          className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 transition-all duration-200 px-8 py-3"
                        >
                          <Gift className="h-5 w-5 mr-2" />
                          <span className="font-semibold">Donate</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Binding Effect */}
              <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-amber-600 to-orange-600 shadow-inner"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
