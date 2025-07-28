'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Users, 
  Clock, 
  BarChart3, 
  Settings,
  ArrowRight
} from "lucide-react";

const features = [
  {
    title: "Seamless Collaboration",
    description: "Work together with your team effortlessly, share tasks, and update progress in real time.",
    image: "/images/ss1.webp",
    icon: <Users className="h-6 w-6" />,
    color: "from-blue-600 to-cyan-600",
    iconBg: "bg-blue-500/20"
  },
  {
    title: "Time Management Tools", 
    description: "Optimize your time with integrated tools like timers, reminders, and schedules.",
    image: "/images/ss2.webp",
    icon: <Clock className="h-6 w-6" />,
    color: "from-green-600 to-emerald-600",
    iconBg: "bg-green-500/20"
  },
  {
    title: "Advanced task tracking",
    description: "A bird's eye view of your entire behaviour and productivity.",
    image: "/images/ss3.webp",
    icon: <BarChart3 className="h-6 w-6" />,
    color: "from-purple-600 to-pink-600",
    iconBg: "bg-purple-500/20"
  },
  {
    title: "Customizable Workspaces",
    description: "Personalize your workspace with themes, widgets, and custom layouts to match your workflow.",
    image: "/images/ss4.webp",
    icon: <Settings className="h-6 w-6" />,
    color: "from-orange-600 to-red-600",
    iconBg: "bg-orange-500/20"
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

export function KeepEverythingInPlace() {
  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-2 bg-gray-800/50 rounded-full text-sm text-gray-300 mb-6">
            Features
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Keep everything in one place
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Forget complex project management tools.
          </p>
        </motion.div>

        {/* Features Grid - Custom layout with different card sizes */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left Column - Tall rectangular card */}
          <motion.div
            variants={itemVariants}
            className="group lg:row-span-2"
          >
            <div className="relative bg-white/5 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-300 group-hover:-translate-y-1 h-full">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white mb-1">
                  {features[0].title}
                </h3>
                <p className="text-xs text-gray-400">
                  {features[0].description}
                </p>
              </div>
              <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-800/50">
                <Image
                  src={features[0].image}
                  alt={features[0].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
            </div>
          </motion.div>

          {/* Top Right - Wide rectangular card */}
          <motion.div
            variants={itemVariants}
            className="group lg:col-span-2"
          >
            <div className="relative bg-white/5 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-300 group-hover:-translate-y-1">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white mb-1">
                  {features[1].title}
                </h3>
                <p className="text-xs text-gray-400">
                  {features[1].description}
                </p>
              </div>
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-800/50">
                <Image
                  src={features[1].image}
                  alt={features[1].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
            </div>
          </motion.div>

          {/* Bottom Left - Square card */}
          <motion.div
            variants={itemVariants}
            className="group"
          >
            <div className="relative bg-white/5 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-300 group-hover:-translate-y-1">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white mb-1">
                  {features[2].title}
                </h3>
                <p className="text-xs text-gray-400">
                  {features[2].description}
                </p>
              </div>
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-800/50">
                <Image
                  src={features[2].image}
                  alt={features[2].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
            </div>
          </motion.div>

          {/* Bottom Right - Square card */}
          <motion.div
            variants={itemVariants}
            className="group"
          >
            <div className="relative bg-white/5 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-300 group-hover:-translate-y-1">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white mb-1">
                  {features[3].title}
                </h3>
                <p className="text-xs text-gray-400">
                  {features[3].description}
                </p>
              </div>
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-800/50">
                <Image
                  src={features[3].image}
                  alt={features[3].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
