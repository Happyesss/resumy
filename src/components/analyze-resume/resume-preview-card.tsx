// components/ResumePreviewCard.jsx
'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

export default function ResumePreviewCard() {
  return (
    <section className="relative w-[98%] h-screen bg-black flex items-center justify-center p-4 ">
      {/* Main resume skeleton card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 60 }}
        className="w-full max-w-2xl h-[700px]"
      >
        <Card className="relative bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-zinc-800">
          {/* Scanning Animation Overlay */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, 650, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute left-0 w-full h-16 bg-gradient-to-b from-purple-500/30 via-purple-400/10 to-transparent pointer-events-none z-20"
            style={{ top: 0 }}
          />
          {/* Unique Resume Analysis Badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg border border-indigo-700">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" /></svg>
              Resume Analysis
            </span>
          </div>

          {/* Indigo header with placeholder tabs */}
          <div className="bg-indigo-600 p-4 space-y-2">
            <div className="h-4 bg-indigo-400 rounded w-1/3"></div>
            <div className="h-6 bg-indigo-300 rounded w-1/2"></div>
          </div>

          {/* Skeleton content */}
          <div className="p-6 space-y-4">
            <div className="h-6 bg-zinc-700 rounded w-2/3"></div>
            <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
            <div className="h-4 bg-zinc-800 rounded w-full"></div>
            <div className="flex gap-2">
              <div className="h-4 bg-zinc-700 rounded w-1/4"></div>
              <div className="h-4 bg-zinc-700 rounded w-1/4"></div>
              <div className="h-4 bg-zinc-700 rounded w-1/4"></div>
            </div>

            <div className="h-6 bg-zinc-700 rounded w-1/2"></div>
            <div className="h-4 bg-zinc-800 rounded w-full"></div>
            <div className="h-4 bg-zinc-800 rounded w-full"></div>
            <div className="h-4 bg-zinc-700 rounded w-5/6"></div>

            <div className="h-6 bg-zinc-700 rounded w-1/3"></div>
            <div className="h-4 bg-zinc-800 rounded w-full"></div>
            <div className="h-4 bg-zinc-800 rounded w-4/5"></div>

            <div className="flex gap-2">
              <div className="h-4 bg-indigo-900 rounded-full w-20"></div>
              <div className="h-4 bg-indigo-900 rounded-full w-20"></div>
              <div className="h-4 bg-indigo-900 rounded-full w-20"></div>
              <div className="h-4 bg-indigo-900 rounded-full w-20"></div>
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  )
}
