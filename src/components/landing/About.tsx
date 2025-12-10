'use client';

import { motion } from "framer-motion";
import { CheckCircle, Target, Zap } from "lucide-react";
import Image from "next/image";

export function About() {
  return (
    <section id="about" className="relative py-20 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-72 h-72 mx-auto lg:max-w-none">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl transform rotate-3" />
              
              {/* Main image container */}
              <div className="relative w-72 h-72 bg-gray-900/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <Image
                    src="/logo.png"
                    alt="Resumy - AI Resume Builder Platform"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Header */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                About <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Resumy</span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Resumy is revolutionizing the way professionals create resumes. Our AI-powered platform combines cutting-edge technology with expert career insights to help you craft the perfect resume that gets noticed by recruiters and passes through ATS systems.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Born from the frustration of traditional resume builders, Resumy uses advanced artificial intelligence to analyze job descriptions, optimize keywords, and suggest improvements that dramatically increase your chances of landing interviews. We&apos;ve helped thousands of professionals from top companies like Google, Microsoft, Meta, and Amazon advance their careers.
              </p>
            </div>

            {/* Mission statement */}
            <motion.div
              className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Our Mission</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    To democratize career opportunities by providing everyone with access to professional-grade resume building tools, powered by AI and backed by career expertise.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
