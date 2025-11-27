// components/ResumePreviewCard.jsx
'use client'

import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ResumePreviewCardProps {
  resumeText?: string;
}

export default function ResumePreviewCard({ resumeText }: ResumePreviewCardProps) {
  return (
    <section className="relative w-[98%] h-screen bg-black flex flex-col items-center justify-start p-4 pt-8">
      {/* Two small CTA boxes connected by a dotted line */}
      <div className="w-full flex flex-row items-center justify-center gap-4 mb-4 -mt-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 60 }}
          className="flex-1 max-w-xs rounded-lg p-3 bg-gradient-to-br from-indigo-900/60 via-black/80 to-indigo-700/40 border border-indigo-700 shadow text-center"
        >
          <span className="text-xs font-semibold text-indigo-300 tracking-wide uppercase block mb-1">Step 1</span>
          <div className="font-bold text-white text-lg mb-1">Upload Resume</div>
          <div className="text-gray-300 text-xs">PDF or DOCX, max 2MB</div>
        </motion.div>
        {/* Dotted line connector */}
        <div className="flex items-center h-12">
          <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="6" x2="40" y2="6" stroke="#6366f1" strokeDasharray="4 4" strokeWidth="2" />
          </svg>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 60 }}
          className="flex-1 max-w-xs rounded-lg p-3 bg-gradient-to-br from-indigo-900/60 via-black/80 to-indigo-700/40 border border-indigo-700 shadow text-center"
        >
          <span className="text-xs font-semibold text-indigo-300 tracking-wide uppercase block mb-1">Step 2</span>
          <div className="font-bold text-white text-lg mb-1">Get AI Feedback</div>
          <div className="text-gray-300 text-xs">Instant, actionable insights</div>
        </motion.div>
      </div>

      {/* Main resume skeleton card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 60 }}
        className="w-full max-w-2xl h-[600px]"
      >
        <Card className="relative bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-zinc-800">
          {/* Scanning Animation Overlay */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, 550, 0] }}
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

      {/* Additional static components to fill the page */}
      <div className="w-full max-w-2xl mt-6 space-y-4">
        {/* Why Use Our Analyzer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 60 }}
          className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4"
        >
          <h3 className="text-white text-lg font-semibold mb-3 text-center">Why Use Our Analyzer?</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" />
                </svg>
              </div>
              <div>
                <span className="text-white text-sm font-medium">ATS-Friendly Analysis</span>
                <p className="text-gray-400 text-xs">Optimized for applicant tracking systems</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <span className="text-white text-sm font-medium">Instant Results</span>
                <p className="text-gray-400 text-xs">Get feedback in real-time</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <span className="text-white text-sm font-medium">Industry Standards</span>
                <p className="text-gray-400 text-xs">Based on hiring manager feedback</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <span className="text-white text-sm font-medium">Secure & Private</span>
                <p className="text-gray-400 text-xs">Your resume data is processed securely and never stored on our servers.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
