'use client';

import { motion } from "framer-motion";
import { 
  Check, 
  X, 
  Sparkles, 
  Crown, 
  Star,
  ArrowRight,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/auth-dialog";

const plans = [
  {
    name: "Other Platforms",
    price: "$29",
    period: "/month",
    description: "What you'd typically pay elsewhere",
    features: [
      { name: "Basic templates", included: true },
      { name: "PDF download", included: true },
      { name: "Limited AI features", included: true },
      { name: "ATS optimization", included: false },
      { name: "Advanced AI suggestions", included: false },
      { name: "Unlimited resumes", included: false },
      { name: "Premium templates", included: false },
      { name: "Cover letter generator", included: false },
      { name: "Real-time collaboration", included: false },
      { name: "Priority support", included: false }
    ],
    popular: false,
    cta: "Typical Pricing",
    disabled: true,
    color: "from-gray-600 to-gray-700"
  },
  {
    name: "Resumy",
    price: "FREE",
    period: "forever",
    description: "Everything you need, completely free",
    features: [
      { name: "Professional templates", included: true },
      { name: "PDF export support", included: true },
      { name: "Advanced AI optimization", included: true },
      { name: "ATS compatibility check", included: true },
      { name: "Smart content suggestions", included: true },
      { name: "10 resume creation", included: true },
      { name: "All template designs", included: true },
      { name: "Cover letter generator", included: true },
      { name: "Cold Mail generator", included: true },
      { name: "Real-time preview", included: true }
    ],
    popular: true,
    cta: "Get Started Free",
    disabled: false,
    color: "from-purple-600 to-blue-600"
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

export function Pricing() {
  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
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
            <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Why Pay When It's
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> Free</span>?
            </h2>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Compare what you'd pay elsewhere vs. what you get with Resumy - completely free, forever.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                    <Crown className="h-4 w-4" />
                    Best Value
                  </div>
                </div>
              )}

              {/* Card */}
              <div className={`relative bg-gray-900/50 border-2 ${
                plan.popular ? 'border-green-500/50' : 'border-gray-800'
              } rounded-2xl p-8 h-full ${
                plan.popular ? 'shadow-lg shadow-green-500/20' : ''
              } ${plan.disabled ? 'opacity-75' : ''}`}>
                
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className={`text-4xl md:text-5xl font-bold ${
                      plan.popular ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      {plan.price}
                    </span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className={`w-5 h-5 rounded-full ${
                          plan.popular ? 'bg-green-500' : 'bg-blue-500'
                        } flex items-center justify-center flex-shrink-0`}>
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <X className="h-3 w-3 text-gray-500" />
                        </div>
                      )}
                      <span className={`text-sm ${
                        feature.included ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="mt-auto">
                  {plan.disabled ? (
                    <Button 
                      disabled
                      className="w-full bg-gray-700 text-gray-400 cursor-not-allowed"
                    >
                      {plan.cta}
                    </Button>
                  ) : (
                    <AuthDialog defaultTab="signup">
                      <Button 
                        className={`w-full bg-gradient-to-r ${plan.color} hover:shadow-lg transition-all duration-300 text-white font-semibold py-3`}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        {plan.cta}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </AuthDialog>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-green-400" />
              <h3 className="text-2xl font-bold text-white">
                No Hidden Costs, Ever
              </h3>
            </div>
            <p className="text-gray-400 mb-6">
              While others charge premium prices, we believe everyone deserves access to professional resume tools. 
              That's why Resumy is completely free, forever.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                No subscription fees
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                No usage limits
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
