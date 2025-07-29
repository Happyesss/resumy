'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Upload, 
  Bot, 
  FileText, 
  Download,
  Sparkles,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/auth-dialog";

// Trusted by logos
const companies = [
  { name: "Google", logo: "/logos/google.png" },
  { name: "Microsoft", logo: "/logos/microsoft.webp" },
  { name: "Amazon", logo: "/logos/amazon.png" },
  { name: "Meta", logo: "/logos/meta.png" },
  { name: "Netflix", logo: "/logos/netflix.png" },
];

const steps = [
  {
    icon: <Upload className="h-8 w-8" />,
    title: "Upload Your Info",
    description: "Start with your existing resume or enter your details manually. Our AI will analyze and optimize your content.",
    features: ["Smart content parsing", "Auto-fill from Resume"],
    color: "from-blue-600 to-cyan-600",
    iconBg: "bg-blue-500/20",
    number: "01"
  },
  {
    icon: <Bot className="h-8 w-8" />,
    title: "AI Optimization",
    description: "Our advanced AI reviews your content, suggests improvements, and optimizes for ATS systems.",
    features: ["Keyword optimization", "ATS compatibility check"],
    color: "from-purple-600 to-pink-600",
    iconBg: "bg-purple-500/20",
    number: "02"
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Choose Template",
    description: "Select from our collection of professional templates designed by industry experts.",
    features: ["Modern designs", "Industry-specific layouts", "Mobile-responsive"],
    color: "from-green-600 to-emerald-600",
    iconBg: "bg-green-500/20",
    number: "03"
  },
  {
    icon: <Download className="h-8 w-8" />,
    title: "Download & Apply",
    description: "Export your polished resume in multiple formats and start applying to your dream jobs.",
    features: ["PDF & Word formats", "High-quality output", "Print-ready design"],
    color: "from-orange-600 to-red-600",
    iconBg: "bg-orange-500/20",
    number: "04"
  }
];

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

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative pb-24 pt-8 bg-black overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              4 Simple Steps
            </h2>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            From upload to download in just 4 simple steps. 
            Our AI-powered platform makes resume creation effortless and effective.
          </p>
        <style jsx>{`
          p.text-xl {
            font-size: 1rem;
          }
          @media (min-width: 768px) {
            p.text-xl {
              font-size: 1.125rem;
            }
          }
        `}</style>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className="relative group"
            >
              {/* Connection Line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-8 h-0.5 bg-gradient-to-r from-gray-600 to-gray-700 z-0" />
              )}
              
              {/* Step Card */}
              <div className="relative bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group-hover:-translate-y-1">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl ${step.iconBg} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {step.description}
                </p>
                
                {/* Features List */}
                <ul className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
