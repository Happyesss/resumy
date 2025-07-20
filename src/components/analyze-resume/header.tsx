'use client'

import { Sparkles } from 'lucide-react';

export function AnalyzeHeader() {
  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-purple-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
            AI Resume Analyzer
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Upload your resume and get instant, precise feedback on what to remove, add, and optimize for maximum ATS compatibility
          </p>
        </div>
      </div>
    </div>
  );
}
