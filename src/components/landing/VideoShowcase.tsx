"use client"
import { useRef, useState, useEffect } from "react"
import { Play, Maximize2 } from "lucide-react"

export function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
      } else {
        document.exitFullscreen()
      }
    }
  }

  useEffect(() => {
    const handleVideoEnd = () => {
      setIsPlaying(false)
    }
    
    const video = videoRef.current
    if (video) {
      video.addEventListener('ended', handleVideoEnd)
    }
    
    return () => {
      if (video) {
        video.removeEventListener('ended', handleVideoEnd)
      }
    }
  }, [])

  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-black" id="how-it-works">
      {/* Purple lamp effect (static, no animation) */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/3">
        <div className="relative w-80 h-80">
          <div className="absolute inset-0 bg-purple-500 rounded-full filter blur-[160px] opacity-40"></div>
          <div className="absolute inset-8 bg-purple-600 rounded-full filter blur-[120px] opacity-50"></div>
        </div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            See Resumy in Action
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Watch how our AI-powered platform transforms your resume in minutes
          </p>
        </div>
        
        {/* Video container with enhanced styling */}
        <div className="relative mx-auto group">
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          
          {/* Video card */}
          <div className="relative rounded-2xl bg-black border border-gray-800 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-purple-500/20 z-10">
            {/* Video placeholder */}
            <div 
              className="relative aspect-video w-full cursor-pointer" 
              onClick={togglePlay}
            >
              <video 
                ref={videoRef}
                className="w-full h-full max-h-[550px] object-fill"
                src="/resumy.mp4"
                poster="/images/ss1.png"
                onEnded={() => setIsPlaying(false)}
              />

              {!isPlaying && (
                <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
              )}
              {!isPlaying && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-purple-600 text-white transition-all duration-300 hover:scale-110 hover:bg-purple-500 z-20 shadow-lg shadow-purple-500/30"
                  aria-label="Play video"
                >
                  <Play className="w-8 h-8 ml-1" />
                </button>
              )}
              
              {/* Controls overlay - bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-sm bg-purple-900/80 text-purple-100 px-3 py-1 rounded-full border border-purple-700/50 backdrop-blur-sm">
                  Resumy Demo
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="text-white bg-black/40 p-2 rounded-full border border-white/10 transition-all duration-300 hover:bg-purple-600/80 hover:border-purple-400/30"
                  aria-label="Toggle fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Feature badges below video */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <span className="px-3 py-1 rounded-full bg-purple-900/30 text-sm border border-purple-700/50 text-purple-200 backdrop-blur-sm">
              AI-Powered Magic
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-900/30 text-sm border border-purple-700/50 text-purple-200 backdrop-blur-sm">
              User-friendly Interface
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-900/30 text-sm border border-purple-700/50 text-purple-200 backdrop-blur-sm">
              Smart Resume Builder
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}