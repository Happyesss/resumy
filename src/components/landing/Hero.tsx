"use client";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { CheckCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function Hero() {
  // Animated score state
  const [score, setScore] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = 95;
    if (score < end) {
      const timer = setInterval(() => {
        setScore((prev) => {
          if (prev < end) return prev + 1;
          clearInterval(timer);
          return end;
        });
      }, 12);
      return () => clearInterval(timer);
    }
  }, [score]);

  return (
    <section className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 py-6 md:py-10 lg:py-14 w-full">
      {/* Left Content */}
      <div className="w-full lg:w-1/2 space-y-4">
        {/* Tagline with gradient text and subtle animation */}
        <div className="relative">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            <span className="block text-gray-200">Open source</span>
            <span className="block text-purple-400">
              Resumy
            </span>
            <span className="block text-gray-200">that lands you tech jobs</span>
          </h1>
          <div className="absolute -top-4 -right-4">
            <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
          </div>
        </div>
        
        {/* Description with animated underline */}
        <p className="text-lg md:text-xl text-gray-300 max-w-lg relative group">
          Create ATS-optimized tech resumes in under 10 minutes.
          <span className="block">3x your interview chances with AI-powered resume tailoring.</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-500 group-hover:w-full"></span>
        </p>
        
        {/* CTAs with glass morphism effect */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <AuthDialog>
            <button 
              className="relative px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1 flex items-center justify-center group overflow-hidden"
              aria-label="Create your resume now"
            >
              <span className="relative z-10 flex items-center">
                Create Resume
                <svg className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </AuthDialog>
          
          <button className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            See Examples
          </button>
        </div>
        
        {/* Feature badges with hover effects */}
        <div className="flex flex-wrap gap-3 mt-8">
          <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-sm text-indigo-300 border border-indigo-400/20 hover:bg-indigo-500/20 transition-colors cursor-default flex items-center">
            <Sparkles className="h-4 w-4 mr-1.5" />
            AI-Powered
          </span>
          <span className="px-4 py-1.5 rounded-full bg-teal-500/10 text-sm text-teal-300 border border-teal-400/20 hover:bg-teal-500/20 transition-colors cursor-default">
            ATS-Optimized
          </span>
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-sm text-emerald-300 border border-emerald-400/20 hover:bg-emerald-500/20 transition-colors cursor-default">
            100% Free
          </span>
          <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-sm text-blue-300 border border-blue-400/20 hover:bg-blue-500/20 transition-colors cursor-default">
            Privacy-First
          </span>
        </div>
        
        {/* Social proof with animated avatars */}
        <div className="mt-10">
          <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
            <div className="absolute -top-3 -left-3 h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              500+
            </div>
            
            <div className="pl-12">
              <h3 className="font-semibold text-lg text-white">Join our growing community</h3>
              <p className="text-sm text-gray-300 mt-1">Trusted by tech professionals worldwide</p>
              
              <p className="text-sm italic mt-3 text-purple-300">
                "Landed 3 interviews in my first week using ResumeLM" — Sarah K.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Content - 3D Resume Mockup */}
      <div className="w-full lg:w-1/2 relative h-[600px]">
        {/* Main resume mockup with 3D effect */}
        <div className="absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-2xl transform rotate-3 transition-all duration-500 hover:rotate-0 hover:shadow-purple-500/20">
          {/* Resume header with gradient */}
          <div className="absolute top-0 left-0 w-full h-[15%] bg-gradient-to-r from-purple-600 to-purple-800 rounded-t-2xl">
            <div className="absolute top-6 left-8 w-[50%] h-2 bg-white/90 rounded-sm"></div>
            <div className="absolute bottom-4 left-8 w-[30%] h-2.5 bg-white/80 rounded-full"></div>
          </div>
          
          {/* Resume content with subtle animation */}
          <div className="absolute top-[20%] left-8 w-[80%] h-2 bg-gray-600 rounded-full animate-pulse"></div>
          <div className="absolute top-[26%] left-8 w-[60%] h-1.5 bg-gray-600 rounded-full animate-pulse delay-100"></div>
          <div className="absolute top-[30%] left-8 w-[70%] h-1.5 bg-gray-600 rounded-full animate-pulse delay-200"></div>
          
          {/* Experience Section */}
          <div className="absolute top-[36%] left-8 w-[35%] h-2 bg-purple-500/30 rounded-full"></div>
          <div className="absolute top-[42%] left-8 w-[80%] h-1.5 bg-gray-600 rounded-full"></div>
          <div className="absolute top-[46%] left-8 w-[75%] h-1.5 bg-gray-600 rounded-full"></div>
          <div className="absolute top-[50%] left-8 w-[70%] h-1.5 bg-gray-600 rounded-full"></div>
          
          {/* Skills Section */}
          <div className="absolute top-[56%] left-8 w-[35%] h-2 bg-purple-500/30 rounded-full"></div>
          <div className="absolute top-[62%] right-8 flex flex-wrap gap-3 w-[80%]">
            {['React', 'Node.js', 'Python', 'AWS', 'TypeScript'].map((skill, i) => (
              <div 
                key={i}
                className="px-3 py-1 rounded-full bg-purple-500/10 text-xs text-purple-300 border border-purple-500/20"
              >
                {skill}
              </div>
            ))}
          </div>
          
          {/* Education Section */}
          <div className="absolute top-[70%] left-8 w-[35%] h-2 bg-purple-500/30 rounded-full"></div>
          <div className="absolute top-[76%] left-8 w-[80%] h-1.5 bg-gray-600 rounded-full"></div>
          <div className="absolute top-[80%] left-8 w-[75%] h-1.5 bg-gray-600 rounded-full"></div>
          <div className="absolute top-[84%] left-8 w-[70%] h-1.5 bg-gray-600 rounded-full"></div>
          
          {/* AI optimization indicator floating */}
          <div className="absolute bottom-6 right-6 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs text-purple-300 flex items-center shadow-lg animate-float">
            <Sparkles className="h-3 w-3 mr-1.5" />
            AI Optimized
          </div>
        </div>
        
        {/* Floating resume variants */}
        <div className="absolute -bottom-8 -left-8 w-[40%] h-[50%] rounded-xl bg-gray-800 border border-gray-700 shadow-lg overflow-hidden rotate-[-8deg] z-10 transition-all duration-500 hover:rotate-[-5deg] hover:shadow-purple-500/10">
          <div className="w-full h-[12%] bg-gradient-to-r from-pink-500 to-pink-600">
            <div className="absolute top-3 left-3 w-[40%] h-1.5 bg-white/80 rounded-sm"></div>
          </div>
          <div className="p-4 h-[88%] flex flex-col gap-2">
            <div className="h-2 w-[80%] bg-gray-600 rounded-full"></div>
            <div className="h-2 w-[70%] bg-gray-600 rounded-full"></div>
            <div className="h-2 w-[50%] bg-pink-500/20 rounded-full mt-3"></div>
            <div className="h-2 w-[80%] bg-gray-600 rounded-full"></div>
            <div className="h-2 w-[75%] bg-gray-600 rounded-full"></div>
          </div>
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-[10px] text-pink-300">
            Tailored
          </div>
        </div>
        
        {/* Resume Score Circle */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-gray-800 border-4 border-purple-500/30 shadow-lg z-10 transition-all duration-500 hover:scale-105 hover:shadow-purple-500/20 flex flex-col items-center justify-center group cursor-pointer">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Circular progress */}
            <svg className="w-full h-full drop-shadow-[0_0_12px_rgba(168,85,247,0.25)]" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#3f3f46"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={283 - 283 * 0.92}
                transform="rotate(-90 50 50)"
                className="transition-all duration-700"
                style={{ filter: "drop-shadow(0 0 8px #a855f6aa)" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
            {/* Score text and checkmark */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-purple-200 drop-shadow-[0_1px_4px_rgba(168,85,247,0.25)] flex items-center gap-0.5">
                {score}
                <CheckCircle className="ml-1 text-green-400 w-4 h-4 drop-shadow" />
              </span>
              <span className="text-[10px] font-semibold text-purple-400 mt-1 tracking-widest bg-gray-900/70 px-1.5 py-0.5 rounded uppercase text-center break-words">
                ATS SCORE
              </span>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full pointer-events-none animate-pulse bg-purple-500/10 blur"></div>
          </div>
          {/* Tooltip */}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 pointer-events-none transition bg-gray-900 text-purple-100 text-[11px] rounded px-2 py-1.5 shadow-lg border border-purple-700 z-20 w-36 text-center break-words">
            Your resume is better optimized than 95% of applicants.<br />
            <span className="text-purple-400 font-semibold">High ATS Score!</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1 text-center px-1 break-words">
            Better than 95% of resumes
          </div>
        </div>
      </div>
    </section>
  );
}