"use client"

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Key, Download, Zap } from "lucide-react";
import { AuthDialog } from "@/components/auth/auth-dialog";

export function FreeAnnouncement() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const features = [
    {
      icon: <Check className="h-6 w-6" />,
      title: "Completely Free",
      description: "No subscriptions, no hidden fees, no limitations"
    },
    {
      icon: <Key className="h-6 w-6" />,
      title: "Just Add Your API Key",
      description: "Bring your own Gemini API key for AI-powered features"
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Unlimited Usage",
      description: "Create unlimited resumes, export to PDF anytime"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "All Features Included",
      description: "AI optimization, custom templates, and more"
    }
  ];

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.1)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1)_0%,transparent_50%)] pointer-events-none" />
      
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Heading */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6">
            100% Free & Open Source
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ResumeLM is completely free to use. No subscriptions, no payments, no limitations. 
            Just bring your own API key and start building amazing resumes today.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Sign up now and start building professional resumes with AI assistance. 
              Add your Gemini API key in settings to unlock all AI features.
            </p>
            <AuthDialog>
              <button className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Start Building Free
              </button>
            </AuthDialog>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default FreeAnnouncement;
