'use client';

import { AuthDialog } from '@/components/auth/auth-dialog';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight, Award, BookOpen, CheckCircle2, ChevronLeft,
    ChevronRight, FileText, GraduationCap, Heart,
    Lightbulb, Mail, Shield, Sparkles, Star
} from 'lucide-react';
import { useRef, useState } from 'react';

interface PageContent {
  id: number;
  leftPage: React.ReactNode;
  rightPage: React.ReactNode;
}

export function StudentDiary() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mobile: single page navigation (4 pages total)
  const [mobileCurrentPage, setMobileCurrentPage] = useState(0);
  const [mobileIsFlipping, setMobileIsFlipping] = useState(false);
  const [mobileFlipDirection, setMobileFlipDirection] = useState<'forward' | 'backward'>('forward');
  const totalMobilePages = 4;

  const totalPages = 2; // Number of page spreads for desktop

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setFlipDirection('forward');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setTimeout(() => setIsFlipping(false), 600);
      }, 300);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setFlipDirection('backward');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setTimeout(() => setIsFlipping(false), 600);
      }, 300);
    }
  };

  // Mobile navigation handlers
  const handleMobileNextPage = () => {
    if (mobileCurrentPage < totalMobilePages - 1 && !mobileIsFlipping) {
      setMobileFlipDirection('forward');
      setMobileIsFlipping(true);
      setTimeout(() => {
        setMobileCurrentPage(prev => prev + 1);
        setTimeout(() => setMobileIsFlipping(false), 500);
      }, 250);
    }
  };

  const handleMobilePrevPage = () => {
    if (mobileCurrentPage > 0 && !mobileIsFlipping) {
      setMobileFlipDirection('backward');
      setMobileIsFlipping(true);
      setTimeout(() => {
        setMobileCurrentPage(prev => prev - 1);
        setTimeout(() => setMobileIsFlipping(false), 500);
      }, 250);
    }
  };

  // Page 1 Content
  const page1Left = (
    <div className="h-full flex flex-col">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 mb-6 transform -rotate-1 shadow-lg w-fit">
        <GraduationCap className="h-4 w-4 text-blue-400" />
        <span className="text-sm font-medium text-blue-300">Student Program</span>
      </div>

      {/* Heading */}
      <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Wear a badge
        </span>
      </h3>

      <p className="text-gray-400 text-base lg:text-lg mb-6 leading-relaxed">
        We believe every student deserves the best tools to kickstart their career.
      </p>

      {/* Feature List */}
      <div className="space-y-4 flex-1">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-500/20 border-2 border-blue-400/40 flex items-center justify-center transform rotate-1">
            <FileText className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">8 Resume Creations</h4>
            <p className="text-xs text-gray-400">Double the limit for more opportunities</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-purple-500/20 border-2 border-purple-400/40 flex items-center justify-center transform -rotate-1">
            <Mail className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Education Email Verification</h4>
            <p className="text-xs text-gray-400">Use your .edu email to unlock benefits</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-green-500/20 border-2 border-green-400/40 flex items-center justify-center transform rotate-1">
            <Shield className="h-4 w-4 text-green-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">All Premium Features</h4>
            <p className="text-xs text-gray-400">AI optimization, templates & more</p>
          </div>
        </div>
      </div>
    </div>
  );

  const page1Right = (
    <div className="h-full flex flex-col items-center justify-center">
      {/* Decorative doodles */}
      <div className="absolute top-4 right-4 w-16 h-16 border-2 border-dashed border-purple-400/20 rounded-full" />
      <div className="absolute bottom-20 right-8 w-10 h-10 border-2 border-dashed border-blue-400/20 rounded-lg transform rotate-12" />

      {/* Main Stat */}
      <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-dashed border-blue-400/30 mb-6 transform hover:rotate-1 transition-transform">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-3 shadow-xl shadow-purple-500/30 border-4 border-white/10">
          <Award className="h-8 w-8 text-white" />
        </div>
        <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
          8
        </div>
        <div className="text-gray-300 font-medium">Resumes for Students</div>
      </div>

      {/* Supported Emails */}
      <div className="w-full max-w-xs p-4 rounded-xl bg-yellow-500/5 border-2 border-yellow-500/20 transform -rotate-1">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-semibold text-yellow-300">Supported Emails</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['.edu', '.ac.in', '.ac.uk', '.edu.au'].map((domain, _i) => (
            <span
              key={domain}
              className="px-2 py-1 rounded-md bg-slate-800/80 border border-slate-600/50 text-slate-300 text-xs font-mono"
            >
              {domain}
            </span>
          ))}
          <span className="px-2 py-1 rounded-md bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs">
            + more
          </span>
        </div>
      </div>

      {/* Turn page hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs text-gray-500 animate-pulse">
        <span>Turn page</span>
        <ChevronRight className="h-3 w-3" />
      </div>
    </div>
  );

  // Page 2 Content
  const page2Left = (
    <div className="h-full flex flex-col">
      {/* Header with star decoration */}
      <div className="flex items-center gap-2 mb-6">
        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        <h3 className="text-xl lg:text-2xl font-bold text-white">Why Students Love Us</h3>
      </div>

      {/* Testimonial style cards */}
      <div className="space-y-4 flex-1">
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 transform -rotate-1">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
              AS
            </div>
            <div>
              <p className="text-sm text-gray-300 italic">&quot;Got my dream internship with a resume I made here!&quot;</p>
              <p className="text-xs text-gray-500 mt-1">- CS Student, IIT Kanpur</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 transform rotate-1">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              RK
            </div>
            <div>
              <p className="text-sm text-gray-300 italic">&quot;The AI suggestions helped me stand out from the crowd.&quot;</p>
              <p className="text-xs text-gray-500 mt-1">- MBA Student</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 transform -rotate-1">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
              NU
            </div>
            <div>
              <p className="text-sm text-gray-300 italic">&quot;8 resumes let me tailor for every company!&quot;</p>
              <p className="text-xs text-gray-500 mt-1">- Engineering, IIT BHU</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const page2Right = (
    <div className="h-full flex flex-col items-center justify-center">
      {/* Decorative elements */}
      <div className="absolute top-6 left-6">
        <Heart className="h-6 w-6 text-pink-400/30" />
      </div>
      <div className="absolute top-8 right-8">
        <Lightbulb className="h-5 w-5 text-yellow-400/30" />
      </div>

      {/* Main CTA Section */}
      <div className="text-center max-w-xs">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-2xl shadow-purple-500/40 border-4 border-white/10">
          <GraduationCap className="h-10 w-10 text-white" />
        </div>

        <h4 className="text-xl font-bold text-white mb-3">Ready to Start?</h4>
        <p className="text-sm text-gray-400 mb-6">
          Join thousands of students building their future with Resumy.
        </p>

        {/* Checklist */}
        <div className="space-y-2 mb-6 text-left">
          {['100% Free for students', 'No credit card needed', 'Instant verification'].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span className="text-gray-300">{item}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <AuthDialog defaultTab="signup">
          <Button
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-6 py-5 text-base rounded-xl shadow-xl shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:-translate-y-1 w-full"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Get Started Free
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </AuthDialog>
      </div>
    </div>
  );

  const pages: PageContent[] = [
    { id: 0, leftPage: page1Left, rightPage: page1Right },
    { id: 1, leftPage: page2Left, rightPage: page2Right },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="mt-20"
    >
      <div className="relative max-w-5xl mx-auto px-4">
        {/* Decorative gradient blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />

        {/* Diary Container */}
        <div
          ref={containerRef}
          className="relative mx-auto"
          style={{ perspective: '2000px' }}
        >
          {/* Navigation Buttons - Desktop only */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0 || isFlipping}
            className={`absolute left-0 lg:-left-16 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-800/80 border border-slate-600/50 hidden lg:flex items-center justify-center text-white transition-all duration-300 ${currentPage === 0 || isFlipping
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-slate-700 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20'
              }`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1 || isFlipping}
            className={`absolute right-0 lg:-right-16 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-800/80 border border-slate-600/50 hidden lg:flex items-center justify-center text-white transition-all duration-300 ${currentPage === totalPages - 1 || isFlipping
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-slate-700 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20'
              }`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Book Spine Shadow */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-4 bg-gradient-to-r from-black/40 via-black/60 to-black/40 z-10 hidden lg:block" />

          {/* Spiral Binding */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-10 z-20 hidden lg:flex flex-col items-center justify-around py-6">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="relative group">
                {/* Ring shadow */}
                <div className="absolute inset-0 w-7 h-7 rounded-full bg-black/60 translate-x-0.5 translate-y-0.5" />
                {/* Outer ring */}
                <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 border border-gray-400/50 shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
                  {/* Inner hole */}
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-gray-900 to-black border border-gray-700" />
                  {/* Shine effect */}
                  <div className="absolute top-0.5 left-1 w-2 h-1 bg-white/30 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Book Pages Container - Desktop only */}
          <div className="relative hidden lg:grid lg:grid-cols-2 gap-0" style={{ transformStyle: 'preserve-3d' }}>
            {/* Left Page (Static) */}
            <div className="relative">
              {/* Page shadow layers for depth */}
              <div className="absolute -bottom-3 -left-3 right-4 top-3 bg-gray-800/30 rounded-l-xl" />
              <div className="absolute -bottom-2 -left-2 right-3 top-2 bg-gray-800/50 rounded-l-xl" />
              <div className="absolute -bottom-1 -left-1 right-2 top-1 bg-gray-800/70 rounded-l-xl" />

              {/* Main left page */}
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-l-xl border-2 border-r-0 border-slate-700/50 overflow-hidden shadow-2xl h-[520px]">
                {/* Paper texture */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                  }}
                />

                {/* Ruled lines */}
                <div className="absolute inset-0 opacity-[0.07]">
                  {[...Array(22)].map((_, i) => (
                    <div key={i} className="h-px bg-blue-300 w-full" style={{ marginTop: `${24 + i * 24}px` }} />
                  ))}
                </div>

                {/* Red margin line */}
                <div className="absolute left-10 top-0 bottom-0 w-px bg-red-400/20" />

                {/* Content */}
                <div className="relative z-10 p-6 lg:p-8 pl-14 h-full pb-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`left-${currentPage}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      {pages[currentPage].leftPage}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Page Number - Bottom of left page */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <span className="text-xs text-gray-500 font-medium bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                    Page {currentPage * 2 + 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Page with Flip Animation */}
            <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
              {/* Page shadow layers */}
              <div className="absolute -bottom-3 -right-3 left-0 lg:left-4 top-3 bg-gray-800/30 rounded-r-xl lg:rounded-l-none rounded-l-xl" />
              <div className="absolute -bottom-2 -right-2 left-0 lg:left-3 top-2 bg-gray-800/50 rounded-r-xl lg:rounded-l-none rounded-l-xl" />
              <div className="absolute -bottom-1 -right-1 left-0 lg:left-2 top-1 bg-gray-800/70 rounded-r-xl lg:rounded-l-none rounded-l-xl" />

              {/* Flipping Page Overlay */}
              <AnimatePresence>
                {isFlipping && (
                  <motion.div
                    className="absolute inset-0 z-30 rounded-r-xl lg:rounded-l-none rounded-l-xl overflow-hidden"
                    initial={{
                      rotateY: flipDirection === 'forward' ? 0 : -180,
                      transformOrigin: 'left center',
                    }}
                    animate={{
                      rotateY: flipDirection === 'forward' ? -180 : 0,
                    }}
                    exit={{
                      rotateY: flipDirection === 'forward' ? -180 : 0,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.645, 0.045, 0.355, 1.0], // Custom easing for realistic flip
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      transformOrigin: 'left center',
                    }}
                  >
                    {/* Front of flipping page */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 border-2 border-l-0 border-slate-600/50 rounded-r-xl"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent" />
                    </div>

                    {/* Back of flipping page */}
                    <div
                      className="absolute inset-0 bg-gradient-to-bl from-slate-900 via-slate-900 to-slate-800 border-2 border-l-0 border-slate-600/50 rounded-r-xl"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                      {/* Ruled lines on back */}
                      <div className="absolute inset-0 opacity-[0.05]">
                        {[...Array(22)].map((_, i) => (
                          <div key={i} className="h-px bg-blue-300 w-full" style={{ marginTop: `${24 + i * 24}px` }} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main right page */}
              <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 rounded-r-xl lg:rounded-l-none rounded-l-xl border-2 lg:border-l-0 border-slate-700/50 overflow-hidden shadow-2xl h-[520px]">
                {/* Paper texture */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                  }}
                />

                {/* Ruled lines */}
                <div className="absolute inset-0 opacity-[0.07]">
                  {[...Array(22)].map((_, i) => (
                    <div key={i} className="h-px bg-blue-300 w-full" style={{ marginTop: `${24 + i * 24}px` }} />
                  ))}
                </div>

                {/* Page fold shadow */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent hidden lg:block" />

                {/* Content */}
                <div className="relative z-10 p-6 lg:p-8 h-full pb-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`right-${currentPage}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: isFlipping ? 0.4 : 0 }}
                      className="h-full relative"
                    >
                      {pages[currentPage].rightPage}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Page Number - Bottom of right page */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <span className="text-xs text-gray-500 font-medium bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                    Page {currentPage * 2 + 2}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Page Indicator Dots - Desktop */}
          <div className="hidden lg:flex items-center justify-center gap-2 mt-6">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index !== currentPage && !isFlipping) {
                    setFlipDirection(index > currentPage ? 'forward' : 'backward');
                    setIsFlipping(true);
                    setTimeout(() => {
                      setCurrentPage(index);
                      setTimeout(() => setIsFlipping(false), 600);
                    }, 300);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentPage
                    ? 'bg-blue-500 w-6'
                    : 'bg-gray-600 hover:bg-gray-500'
                  }`}
              />
            ))}
          </div>

          {/* Mobile: Single page at a time with page flip animation */}
          <div className="lg:hidden">
            {/* Mobile Page Container */}
            <div className="relative" style={{ perspective: '1200px' }}>
              {/* Navigation Buttons for Mobile */}
              <button
                onClick={handleMobilePrevPage}
                disabled={mobileCurrentPage === 0 || mobileIsFlipping}
                className={`absolute -left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-800/90 border border-slate-600/50 flex items-center justify-center text-white transition-all duration-300 ${
                  mobileCurrentPage === 0 || mobileIsFlipping
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-slate-700 active:scale-95'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={handleMobileNextPage}
                disabled={mobileCurrentPage === totalMobilePages - 1 || mobileIsFlipping}
                className={`absolute -right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-800/90 border border-slate-600/50 flex items-center justify-center text-white transition-all duration-300 ${
                  mobileCurrentPage === totalMobilePages - 1 || mobileIsFlipping
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-slate-700 active:scale-95'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Mobile Page with Flip Animation */}
              <div className="relative mx-6" style={{ transformStyle: 'preserve-3d' }}>
                {/* Page shadow layers */}
                <div className="absolute -bottom-2 -left-1 -right-1 top-2 bg-gray-800/40 rounded-xl" />
                <div className="absolute -bottom-1 left-0 right-0 top-1 bg-gray-800/60 rounded-xl" />

                {/* Flipping Page Overlay for Mobile */}
                <AnimatePresence>
                  {mobileIsFlipping && (
                    <motion.div
                      className="absolute inset-0 z-20 rounded-xl overflow-hidden"
                      initial={{
                        rotateY: mobileFlipDirection === 'forward' ? 0 : -180,
                      }}
                      animate={{
                        rotateY: mobileFlipDirection === 'forward' ? -180 : 0,
                      }}
                      exit={{
                        rotateY: mobileFlipDirection === 'forward' ? -180 : 0,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: [0.645, 0.045, 0.355, 1.0],
                      }}
                      style={{
                        transformStyle: 'preserve-3d',
                        transformOrigin: 'left center',
                      }}
                    >
                      {/* Front of flipping page */}
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 border-2 border-slate-600/50 rounded-xl"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent rounded-xl" />
                        {/* Ruled lines */}
                        <div className="absolute inset-0 opacity-[0.05]">
                          {[...Array(18)].map((_, i) => (
                            <div key={i} className="h-px bg-blue-300 w-full" style={{ marginTop: `${20 + i * 22}px` }} />
                          ))}
                        </div>
                      </div>

                      {/* Back of flipping page */}
                      <div
                        className="absolute inset-0 bg-gradient-to-bl from-slate-900 via-slate-900 to-slate-800 border-2 border-slate-600/50 rounded-xl"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent rounded-xl" />
                        {/* Ruled lines on back */}
                        <div className="absolute inset-0 opacity-[0.05]">
                          {[...Array(18)].map((_, i) => (
                            <div key={i} className="h-px bg-blue-300 w-full" style={{ marginTop: `${20 + i * 22}px` }} />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main Mobile Page */}
                <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-xl border-2 border-slate-700/50 overflow-hidden shadow-2xl min-h-[420px]">
                  {/* Paper texture */}
                  <div
                    className="absolute inset-0 opacity-[0.03] rounded-xl"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                    }}
                  />

                  {/* Ruled lines */}
                  <div className="absolute inset-0 opacity-[0.07]">
                    {[...Array(18)].map((_, i) => (
                      <div key={i} className="h-px bg-blue-300 w-full" style={{ marginTop: `${20 + i * 22}px` }} />
                    ))}
                  </div>

                  {/* Red margin line */}
                  <div className="absolute left-8 top-0 bottom-0 w-px bg-red-400/20" />

                  {/* Content */}
                  <div className="relative z-10 p-5 pl-10 pb-14 h-full">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`mobile-page-${mobileCurrentPage}`}
                        initial={{ 
                          opacity: 0, 
                          x: mobileFlipDirection === 'forward' ? 30 : -30,
                          scale: 0.95
                        }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          scale: 1
                        }}
                        exit={{ 
                          opacity: 0, 
                          x: mobileFlipDirection === 'forward' ? -30 : 30,
                          scale: 0.95
                        }}
                        transition={{ duration: 0.3, delay: mobileIsFlipping ? 0.3 : 0 }}
                        className="h-full"
                      >
                        {mobileCurrentPage === 0 && page1Left}
                        {mobileCurrentPage === 1 && (
                          <div className="h-full flex flex-col items-center justify-center relative">
                            {/* Decorative doodles */}
                            <div className="absolute top-0 right-0 w-12 h-12 border-2 border-dashed border-purple-400/20 rounded-full" />
                            
                            {/* Main Stat */}
                            <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-dashed border-blue-400/30 mb-5">
                              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-3 shadow-xl shadow-purple-500/30 border-4 border-white/10">
                                <Award className="h-7 w-7 text-white" />
                              </div>
                              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                                8
                              </div>
                              <div className="text-gray-300 font-medium text-sm">Resumes for Students</div>
                            </div>

                            {/* Supported Emails */}
                            <div className="w-full p-4 rounded-xl bg-yellow-500/5 border-2 border-yellow-500/20">
                              <div className="flex items-center gap-2 mb-3">
                                <BookOpen className="h-4 w-4 text-yellow-400" />
                                <span className="text-sm font-semibold text-yellow-300">📧 Supported Emails</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {['.edu', '.ac.in', '.ac.uk', '.edu.au'].map((domain) => (
                                  <span
                                    key={domain}
                                    className="px-2 py-1 rounded-md bg-slate-800/80 border border-slate-600/50 text-slate-300 text-xs font-mono"
                                  >
                                    {domain}
                                  </span>
                                ))}
                                <span className="px-2 py-1 rounded-md bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs">
                                  + more
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        {mobileCurrentPage === 2 && page2Left}
                        {mobileCurrentPage === 3 && (
                          <div className="h-full flex flex-col items-center justify-center relative">
                            {/* Decorative elements */}
                            <div className="absolute top-2 left-2">
                              <Heart className="h-5 w-5 text-pink-400/30" />
                            </div>
                            <div className="absolute top-4 right-4">
                              <Lightbulb className="h-4 w-4 text-yellow-400/30" />
                            </div>

                            {/* Main CTA Section */}
                            <div className="text-center w-full">
                              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-5 shadow-2xl shadow-purple-500/40 border-4 border-white/10">
                                <GraduationCap className="h-8 w-8 text-white" />
                              </div>

                              <h4 className="text-lg font-bold text-white mb-2">Ready to Start?</h4>
                              <p className="text-sm text-gray-400 mb-5">
                                Join thousands of students building their future.
                              </p>

                              {/* Checklist */}
                              <div className="space-y-2 mb-5 text-left max-w-xs mx-auto">
                                {['100% Free for students', 'No credit card needed', 'Instant verification'].map((item, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                                    <span className="text-gray-300">{item}</span>
                                  </div>
                                ))}
                              </div>

                              {/* CTA Button */}
                              <AuthDialog defaultTab="signup">
                                <Button
                                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-5 py-4 text-sm rounded-xl shadow-xl shadow-blue-500/25 transition-all duration-300 w-full"
                                >
                                  <Sparkles className="h-4 w-4 mr-2" />
                                  Get Started Free
                                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                              </AuthDialog>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Page Number - Bottom center */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <span className="text-xs text-gray-500 font-medium bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                      Page {mobileCurrentPage + 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Page Indicator Dots */}
              <div className="flex items-center justify-center gap-2 mt-5">
                {[...Array(totalMobilePages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (index !== mobileCurrentPage && !mobileIsFlipping) {
                        setMobileFlipDirection(index > mobileCurrentPage ? 'forward' : 'backward');
                        setMobileIsFlipping(true);
                        setTimeout(() => {
                          setMobileCurrentPage(index);
                          setTimeout(() => setMobileIsFlipping(false), 500);
                        }, 250);
                      }
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === mobileCurrentPage
                        ? 'bg-blue-500 w-5'
                        : 'bg-gray-600 hover:bg-gray-500 w-2'
                    }`}
                  />
                ))}
              </div>

              {/* Swipe hint for first page */}
              {mobileCurrentPage === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-1 mt-3 text-xs text-gray-500"
                >
                  <span>Tap arrows to turn pages</span>
                  <ChevronRight className="h-3 w-3 animate-pulse" />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
