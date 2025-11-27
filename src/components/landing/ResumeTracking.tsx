"use client";

import { AnimatedBeam } from '@/components/ui/animated-beam';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    BarChart3, Eye, FileText, Globe,
    Link2, Monitor, Share2, Shield, Smartphone, Sparkles, User, Zap
} from 'lucide-react';
import Image from 'next/image';
import { forwardRef, useEffect, useRef, useState } from 'react';

interface StatCard {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

// Circle component for animated beams
const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex items-center justify-center rounded-full border-2 bg-white/5 border-gray-700 p-3",
        className
      )}
    >
      {children}
    </div>
  );
});
Circle.displayName = "Circle";

// Small compact view card with user icon
export function ResumeTracking() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [animatedViews, setAnimatedViews] = useState(0);

  // Refs for animated beams
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const view1Ref = useRef<HTMLDivElement>(null);
  const view2Ref = useRef<HTMLDivElement>(null);
  const view3Ref = useRef<HTMLDivElement>(null);
  const view4Ref = useRef<HTMLDivElement>(null);
  const view5Ref = useRef<HTMLDivElement>(null);

  // Animate view count
  useEffect(() => {
    const target = 247;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedViews(target);
        clearInterval(timer);
      } else {
        setAnimatedViews(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const stats: StatCard[] = [
    { icon: <Eye className="h-5 w-5" />, value: animatedViews.toString(), label: 'Total Views', color: 'blue' },
    { icon: <User className="h-5 w-5" />, value: '42', label: 'Unique Visitors', color: 'purple' },
    { icon: <Monitor className="h-5 w-5" />, value: '65%', label: 'Desktop', color: 'cyan' },
    { icon: <Smartphone className="h-5 w-5" />, value: '35%', label: 'Mobile', color: 'green' },
  ];



  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative py-16 bg-black overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 rounded-full text-sm text-white mb-4">
            <Share2 className="h-4 w-4" />
            Resume Sharing & Tracking
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">Share Smart. </span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Track Everything.
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            No more wondering if your resume reached the recruiter. Share with a link, 
            track every view, and never lose sleep over whether it was seen.
          </p>
        </motion.div>

        {/* Features Grid - Centered Animation */}
        <motion.div
          className="max-w-5xl mx-auto mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Centered Animation Component */}
          <motion.div
            variants={itemVariants}
            className="group"
          >
            <div className="relative bg-transparent rounded-xl p-6">
              {/* Animated Sharing Visualization - Magic UI Style Layout */}
              <div 
                ref={containerRef}
                className="relative flex h-[200px] sm:h-[240px] md:h-[280px] w-full items-center justify-center overflow-hidden"
              >
                <div className="flex size-full max-w-2xl flex-row items-stretch justify-between gap-4 sm:gap-8 md:gap-16 px-2 sm:px-4">
                  {/* Left - Resume */}
                  <div className="flex flex-col justify-center">
                    <div
                      ref={resumeRef}
                      className="z-10 flex size-10 sm:size-12 md:size-14 items-center justify-center rounded-full border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-2 sm:p-3 shadow-[0_0_20px_-12px_rgba(168,85,247,0.8)]"
                    >
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-purple-400" />
                    </div>
                  </div>

                  {/* Center - Hub with Logo */}
                  <div className="flex flex-col justify-center">
                    <div
                      ref={hubRef}
                      className="z-10 flex size-14 sm:size-16 md:size-20 items-center justify-center rounded-full border-2 border-purple-500/50 bg-gradient-to-br from-purple-600 to-blue-600 p-1.5 sm:p-2 shadow-[0_0_40px_-5px_rgba(168,85,247,0.7)]"
                    >
                      <Image
                        src="/logo.png"
                        alt="Resumy Logo"
                        width={48}
                        height={48}
                        className="rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                      />
                    </div>
                  </div>

                  {/* Right - Viewers */}
                  <div className="flex flex-col justify-center gap-1.5 sm:gap-2 md:gap-3">
                    <div
                      ref={view1Ref}
                      className="z-10 flex size-8 sm:size-10 md:size-12 items-center justify-center rounded-full border-2 border-green-500/50 bg-green-500/10 p-1.5 sm:p-2 md:p-3 shadow-[0_0_20px_-12px_rgba(34,197,94,0.8)]"
                    >
                      <User className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-400" />
                    </div>
                    <div
                      ref={view2Ref}
                      className="z-10 flex size-8 sm:size-10 md:size-12 items-center justify-center rounded-full border-2 border-blue-500/50 bg-blue-500/10 p-1.5 sm:p-2 md:p-3 shadow-[0_0_20px_-12px_rgba(59,130,246,0.8)]"
                    >
                      <Monitor className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-400" />
                    </div>
                    <div
                      ref={view3Ref}
                      className="z-10 flex size-8 sm:size-10 md:size-12 items-center justify-center rounded-full border-2 border-cyan-500/50 bg-cyan-500/10 p-1.5 sm:p-2 md:p-3 shadow-[0_0_20px_-12px_rgba(6,182,212,0.8)]"
                    >
                      <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-cyan-400" />
                    </div>
                    <div
                      ref={view4Ref}
                      className="hidden sm:flex z-10 size-8 sm:size-10 md:size-12 items-center justify-center rounded-full border-2 border-pink-500/50 bg-pink-500/10 p-1.5 sm:p-2 md:p-3 shadow-[0_0_20px_-12px_rgba(236,72,153,0.8)]"
                    >
                      <User className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-pink-400" />
                    </div>
                    <div
                      ref={view5Ref}
                      className="hidden md:flex z-10 size-8 sm:size-10 md:size-12 items-center justify-center rounded-full border-2 border-orange-500/50 bg-orange-500/10 p-1.5 sm:p-2 md:p-3 shadow-[0_0_20px_-12px_rgba(249,115,22,0.8)]"
                    >
                      <Globe className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-orange-400" />
                    </div>
                  </div>
                </div>

                {/* AnimatedBeam: Resume → Hub */}
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={resumeRef}
                  toRef={hubRef}
                  pathColor="gray"
                  pathWidth={2}
                  pathOpacity={0.15}
                  gradientStartColor="#A855F7"
                  gradientStopColor="#3B82F6"
                  duration={4}
                  delay={0}
                />

                {/* AnimatedBeam: Hub → Viewers */}
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={hubRef}
                  toRef={view1Ref}
                  pathColor="gray"
                  pathWidth={2}
                  pathOpacity={0.15}
                  gradientStartColor="#A855F7"
                  gradientStopColor="#22C55E"
                  duration={4}
                  delay={0}
                />
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={hubRef}
                  toRef={view2Ref}
                  pathColor="gray"
                  pathWidth={2}
                  pathOpacity={0.15}
                  gradientStartColor="#A855F7"
                  gradientStopColor="#3B82F6"
                  duration={4}
                  delay={0}
                />
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={hubRef}
                  toRef={view3Ref}
                  pathColor="gray"
                  pathWidth={2}
                  pathOpacity={0.15}
                  gradientStartColor="#A855F7"
                  gradientStopColor="#06B6D4"
                  duration={4}
                  delay={0}
                />
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={hubRef}
                  toRef={view4Ref}
                  pathColor="gray"
                  pathWidth={2}
                  pathOpacity={0.15}
                  gradientStartColor="#A855F7"
                  gradientStopColor="#EC4899"
                  duration={4}
                  delay={0}
                />
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={hubRef}
                  toRef={view5Ref}
                  pathColor="gray"
                  pathWidth={2}
                  pathOpacity={0.15}
                  gradientStartColor="#A855F7"
                  gradientStopColor="#F97316"
                  duration={4}
                  delay={0}
                />
              </div>

              {/* Labels below */}
              <div className="flex justify-between max-w-xs sm:max-w-md md:max-w-2xl mx-auto px-4 sm:px-6 md:px-8 mt-2 text-[10px] sm:text-xs text-gray-500">
                <span>Your Resume</span>
                <span>Tracking Hub</span>
                <span>Viewers</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Cards Row */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Compact Share Link Card */}
          <motion.div
            variants={itemVariants}
            className="group"
          >
            <div className="relative bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 border border-gray-800 rounded-xl p-5 hover:border-blue-500/40 transition-all duration-300 group-hover:-translate-y-1 h-full overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <motion.span 
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/20 p-2.5 ring-2 ring-blue-500/20"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Link2 className="h-5 w-5 text-blue-400" />
                  </motion.span>
                  <div>
                    <h3 className="text-sm font-bold text-white">One-Click Sharing</h3>
                    <p className="text-xs text-gray-400">Generate links instantly</p>
                  </div>
                </div>
                
                {/* Live badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs text-green-400 font-medium">Live Example</span>
                </div>
                
                <a 
                  href="https://share.resumy.live/r/MmcIMC0rMA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg bg-black/60 border border-gray-700/50 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 group/link backdrop-blur-sm"
                >
                  <Globe className="h-4 w-4 text-blue-400 group-hover/link:text-blue-300 flex-shrink-0 transition-colors" />
                  <span className="text-blue-300 group-hover/link:text-blue-200 text-xs truncate flex-1 font-mono transition-colors">
                    share.resumy.live/r/MmcIMC0rMA
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigator.clipboard.writeText('https://share.resumy.live/r/MmcIMC0rMA');
                      handleCopyLink();
                    }}
                    className={cn(
                      "px-3 py-1 rounded-md text-xs font-semibold transition-all shadow-lg",
                      copiedLink
                        ? "bg-green-500/30 text-green-300 shadow-green-500/20"
                        : "bg-blue-500/30 text-blue-300 hover:bg-blue-500/40 shadow-blue-500/20"
                    )}
                  >
                    {copiedLink ? "✓ Copied!" : "Copy"}
                  </motion.button>
                </a>

                {/* Feature tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                    No expiry
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
                    Trackable
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                    Revokable
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Access Card */}
          <motion.div
            variants={itemVariants}
            className="group"
          >
            <div className="relative bg-white/5 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-300 group-hover:-translate-y-1 h-full">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center justify-center rounded-full bg-purple-500/20 p-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-white">Lightning Fast</h3>
                  <p className="text-xs text-gray-400">Share in seconds</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20">
                    <span className="text-purple-400 text-xs font-bold">1</span>
                  </div>
                  <span className="text-gray-300 text-xs">Select your resume</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20">
                    <span className="text-blue-400 text-xs font-bold">2</span>
                  </div>
                  <span className="text-gray-300 text-xs">Click &quot;Create Share Link&quot;</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20">
                    <span className="text-green-400 text-xs font-bold">3</span>
                  </div>
                  <span className="text-gray-300 text-xs">Share anywhere instantly</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Analytics Card */}
          <motion.div
            variants={itemVariants}
            className="group"
          >
            <div className="relative bg-white/5 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-300 group-hover:-translate-y-1 h-full">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-4 w-4 text-green-400" />
                <span className="text-white text-sm font-semibold">Analytics Overview</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className={cn(
                      "p-3 rounded-xl border transition-all duration-300 hover:scale-[1.02]",
                      stat.color === 'blue' && "bg-blue-500/5 border-blue-500/20",
                      stat.color === 'purple' && "bg-purple-500/5 border-purple-500/20",
                      stat.color === 'cyan' && "bg-cyan-500/5 border-cyan-500/20",
                      stat.color === 'green' && "bg-green-500/5 border-green-500/20"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className={cn(
                        "p-1 rounded-lg",
                        stat.color === 'blue' && "bg-blue-500/20 text-blue-400",
                        stat.color === 'purple' && "bg-purple-500/20 text-purple-400",
                        stat.color === 'cyan' && "bg-cyan-500/20 text-cyan-400",
                        stat.color === 'green' && "bg-green-500/20 text-green-400"
                      )}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-[10px] text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
              
              {/* No storage badge */}
              <div className="mt-3 flex items-center justify-center">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30">
                  <Sparkles className="h-3 w-3 text-green-400" />
                  <span className="text-green-300 text-xs font-medium">No storage needed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-500"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            <span>End-to-end encrypted</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
            <span>Real-time tracking</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
            <span>No file storage needed</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
            <span>Instant sharing</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ResumeTracking;
