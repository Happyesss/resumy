'use client';

import { motion } from "framer-motion";
import { Star, Quote, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Google",
    image: "/testimonials/sarah.jpg", // Add these images to public folder
    content: "Resumy's AI suggestions helped me highlight my achievements perfectly. I got 3 interview calls within a week of updating my resume!",
    rating: 5,
    linkedin: "https://linkedin.com/in/sarah-johnson",
    featured: true
  },
  {
    name: "Michael Chen",
    role: "Product Manager", 
    company: "Microsoft",
    image: "/testimonials/michael.jpg",
    content: "The ATS optimization feature is game-changing. My resume now passes through all applicant tracking systems effortlessly.",
    rating: 5,
    twitter: "https://twitter.com/michael_chen",
    featured: true
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "Netflix",
    image: "/testimonials/emily.jpg", 
    content: "I loved how easy it was to customize templates. The final result looked incredibly professional and landed me my dream job!",
    rating: 5,
    linkedin: "https://linkedin.com/in/emily-rodriguez",
    featured: true
  },
  {
    name: "David Kim",
    role: "Data Scientist",
    company: "Meta",
    image: "/testimonials/david.jpg",
    content: "The AI-powered content suggestions were spot-on for my field. Resumy understood exactly what tech recruiters are looking for.",
    rating: 5,
    featured: false
  },
  {
    name: "Lisa Thompson",
    role: "UX Designer",
    company: "Apple",
    image: "/testimonials/lisa.jpg",
    content: "Beautiful templates and seamless editing experience. The real-time preview saved me so much time during the creation process.",
    rating: 5,
    featured: false
  },
  {
    name: "James Wilson",
    role: "Sales Manager",
    company: "Amazon",
    image: "/testimonials/james.jpg",
    content: "From zero to hero! Resumy helped me transform my outdated resume into a modern, compelling document that gets results.",
    rating: 5,
    featured: false
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
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

function TestimonialCard({ testimonial, featured = false }: { testimonial: typeof testimonials[0], featured?: boolean }) {
  return (
    <motion.div
      variants={itemVariants}
      className={`relative bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 ${
        featured ? 'md:col-span-1 lg:col-span-1' : ''
      }`}
    >
      {/* Quote Icon */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
        <Quote className="h-4 w-4 text-white" />
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
        ))}
      </div>

      {/* Content */}
      <blockquote className="text-gray-300 mb-6 leading-relaxed italic">
        "{testimonial.content}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
          {/* Placeholder for profile image */}
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-lg">
            {testimonial.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white">{testimonial.name}</div>
          <div className="text-sm text-gray-400">{testimonial.role}</div>
          <div className="text-sm text-purple-400 font-medium">{testimonial.company}</div>
        </div>
        {/* Social Links */}
        <div className="flex items-center gap-2">
          {testimonial.linkedin && (
            <Link
              href={testimonial.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-200"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
          )}
          {testimonial.twitter && (
            <Link
              href={testimonial.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-blue-400 hover:border-blue-400/30 transition-all duration-200"
            >
              <Twitter className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const featuredTestimonials = testimonials.filter(t => t.featured);
  const otherTestimonials = testimonials.filter(t => !t.featured);

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Loved by <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">10,000+</span> Professionals
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            See how Resumy has helped professionals from top companies land their dream jobs.
          </p>
        </motion.div>

        {/* Featured Testimonials */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featuredTestimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} featured />
          ))}
        </motion.div>

        {/* Other Testimonials */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {otherTestimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </motion.div>


      </div>
    </section>
  );
}
