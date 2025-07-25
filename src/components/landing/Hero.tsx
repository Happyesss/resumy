"use client";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { Sparkles, ArrowRight, Star, Rocket, Brain, Globe2, Trophy, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { DotPattern } from "@/components/magicui/dot-pattern";

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black"
    >
      <DotPattern
        className="absolute inset-0 text-white/20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
        width={40}
        height={40}
        cx={1.5}
        cy={1.5}
        cr={1.5}
      />
      <div className="relative mt-20 z-10 max-w-6xl mx-auto px-6 lg:px-8 py-16">
        {/* Hero Content */}
        <div className="text-center space-y-10">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="block text-white">
                Resumes That Work
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Work as Hard
              </span>
              <span className="block text-white">
                As You Do
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mt-6">
              Tell your story. Highlight your strengths. Get hired — with
              <span className="text-purple-400 font-medium"> AI-crafted resumes </span>
              tailored to fit your goals.
            </p>
          </div>

          {/* CTA Section */}
          <div className="space-y-6 mt-10">
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <AuthDialog>
                <button className="flex group relative px-4 py-2 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-200 items-center text-sm sm:text-base">
                  <Brain className="mr-2 w-4 h-4" />
                  Start Creating Now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </AuthDialog>

              {/* Desktop/tablet Explore Features button */}
              <button
                className="hidden sm:flex px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg border border-white/20 backdrop-blur-sm transition-all duration-200 items-center"
                onClick={() => {
                  const el = document.getElementById("features");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <Sparkles className="mr-2 w-4 h-4 text-gray-400" />
                Explore Features
              </button>

              {/* Mobile Explore Features button */}
              <button
                className="flex sm:hidden px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg border border-white/20 backdrop-blur-sm transition-all duration-200 items-center text-sm"
                onClick={() => {
                  const el = document.getElementById("features");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <Sparkles className="mr-2 w-4 h-4 text-gray-400" />
                Explore Features
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 mt-6">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span>Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>


        {/* Resume Preview Section */}
        <div className="mt-16 relative">
          {/* Preview Container */}
          <div className="relative max-w-5xl mx-auto">
            {/* Main Resume Card */}
            <div className="relative group">
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-300">
                <div className="grid lg:grid-cols-3 gap-6">

                  {/* Resume Template 1 */}
                  <div className="group cursor-pointer">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform group-hover:-translate-y-1 transition-all duration-200">
                      <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                          <div className="space-y-1">
                            <div className="h-2 bg-gray-800 rounded w-20"></div>
                            <div className="h-1.5 bg-gray-600 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
                          <div className="h-1.5 bg-gray-300 rounded w-3/5"></div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-2 bg-blue-500 rounded w-12"></div>
                          <div className="space-y-1">
                            <div className="h-1.5 bg-gray-400 rounded w-full"></div>
                            <div className="h-1.5 bg-gray-400 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded">
                        Modern
                      </div>
                    </div>
                  </div>

                  {/* Resume Template 2 */}
                  <div className="group cursor-pointer">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform group-hover:-translate-y-1 transition-all duration-200 delay-75">
                      <div className="grid grid-cols-3 h-full">
                        <div className="bg-gradient-to-b from-purple-600 to-pink-600 p-3 space-y-2">
                          <div className="w-10 h-10 bg-white/20 rounded-full mx-auto"></div>
                          <div className="space-y-1">
                            <div className="h-1.5 bg-white/80 rounded w-full"></div>
                            <div className="h-1.5 bg-white/60 rounded w-3/4"></div>
                          </div>
                        </div>
                        <div className="col-span-2 p-3 space-y-2">
                          <div className="space-y-1">
                            <div className="h-2 bg-gray-800 rounded w-3/4"></div>
                            <div className="h-1.5 bg-gray-600 rounded w-1/2"></div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                            <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
                            <div className="h-1.5 bg-gray-300 rounded w-3/5"></div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-purple-500 text-white text-xs rounded">
                        Creative
                      </div>
                    </div>
                  </div>

                  {/* Resume Template 3 */}
                  <div className="group cursor-pointer">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform group-hover:-translate-y-1 transition-all duration-200 delay-150">
                      <div className="p-4 space-y-3">
                        <div className="text-center space-y-1.5">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto"></div>
                          <div className="h-2 bg-gray-800 rounded w-20 mx-auto"></div>
                          <div className="h-1.5 bg-gray-600 rounded w-16 mx-auto"></div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                          <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="h-1.5 bg-green-400 rounded"></div>
                          <div className="h-1.5 bg-teal-400 rounded"></div>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-green-500 text-white text-xs rounded">
                        Classic
                      </div>
                    </div>
                  </div>

                </div>

                {/* AI Enhancement Badge */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg shadow-md text-sm">
                    <Sparkles className="w-3 h-3" />
                    <span className="font-medium">AI-Enhanced Templates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section - Now below template cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto mt-16">
            {[
              { value: "10K+", label: "Success Stories", icon: Trophy },
              { value: "95%", label: "Interview Rate", icon: Star },
              { value: "3x", label: "Faster Hiring", icon: Rocket },
              { value: "50+", label: "Industries", icon: Globe2 }
            ].map((stat, index) => (
              <div key={index} className="group text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 mb-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 group-hover:bg-white/10 transition-all duration-300">
                  <stat.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-5 h-5 text-white/40" />
        </div>
      </div>
    </section>
  );
}