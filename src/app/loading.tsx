import { FileText, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <main 
      className="min-h-screen relative sm:pb-12 pb-40 bg-black"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.4) 1.5px, transparent 1.5px)`,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 -1.2rem',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="relative z-10">
        <div className="pl-2 sm:pl-0 sm:container sm:max-none max-w-7xl mx-auto lg:px-8 md:px-8 sm:px-6 pt-4">
          <div className="mb-6 space-y-4">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
              <div
                className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
                style={{
                  WebkitBackdropFilter: 'blur(12px)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="h-8 w-48 mb-1 bg-white/20 rounded animate-pulse" />
                <div className="h-4 w-56 bg-white/10 rounded animate-pulse" />
              </div>
            </div>

            {/* Resume Sections */}
            <div className="space-y-4">
              {/* Base Resumes Section */}
              <div className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600/10 to-indigo-600/10 backdrop-blur-md">
                      <FileText className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-6 w-32 bg-white/20 rounded animate-pulse" />
                      <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
                    <div className="h-10 w-28 bg-white/20 rounded animate-pulse" />
                  </div>
                </div>

                {/* Resume Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="group relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 rounded-lg">
                      <div className="p-4 space-y-3">
                        {/* Resume preview skeleton */}
                        <div className="aspect-[8.5/11] rounded-lg bg-white/10 border border-white/20 p-3 space-y-2">
                          <div className="h-3 w-3/4 bg-white/20 rounded animate-pulse" />
                          <div className="h-2 w-1/2 bg-white/10 rounded animate-pulse" />
                          <div className="space-y-1 pt-2">
                            <div className="h-2 w-full bg-white/10 rounded animate-pulse" />
                            <div className="h-2 w-5/6 bg-white/10 rounded animate-pulse" />
                            <div className="h-2 w-4/6 bg-white/10 rounded animate-pulse" />
                          </div>
                        </div>
                        
                        {/* Resume info */}
                        <div className="space-y-2">
                          <div className="h-5 w-3/4 bg-white/20 rounded animate-pulse" />
                          <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          <div className="h-8 flex-1 bg-white/20 rounded animate-pulse" />
                          <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
                          <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thin Divider */}
              <div className="relative py-2">
                <div className="h-px bg-gradient-to-r from-transparent via-purple-300/30 to-transparent" />
              </div>

              {/* Tailored Resumes Section */}
              <div className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-pink-600/10 to-rose-600/10 backdrop-blur-md">
                      <Sparkles className="h-5 w-5 text-pink-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-6 w-36 bg-white/20 rounded animate-pulse" />
                      <div className="h-4 w-52 bg-white/10 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
                    <div className="h-10 w-28 bg-white/20 rounded animate-pulse" />
                  </div>
                </div>

                {/* Resume Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="group relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 rounded-lg">
                      <div className="p-4 space-y-3">
                        {/* Resume preview skeleton */}
                        <div className="aspect-[8.5/11] rounded-lg bg-white/10 border border-white/20 p-3 space-y-2">
                          <div className="h-3 w-3/4 bg-white/20 rounded animate-pulse" />
                          <div className="h-2 w-1/2 bg-white/10 rounded animate-pulse" />
                          <div className="space-y-1 pt-2">
                            <div className="h-2 w-full bg-white/10 rounded animate-pulse" />
                            <div className="h-2 w-5/6 bg-white/10 rounded animate-pulse" />
                            <div className="h-2 w-4/6 bg-white/10 rounded animate-pulse" />
                          </div>
                        </div>
                        
                        {/* Resume info */}
                        <div className="space-y-2">
                          <div className="h-5 w-3/4 bg-white/20 rounded animate-pulse" />
                          <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
                          <div className="h-4 w-2/3 bg-white/10 rounded animate-pulse" />
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          <div className="h-8 flex-1 bg-white/20 rounded animate-pulse" />
                          <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
                          <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 