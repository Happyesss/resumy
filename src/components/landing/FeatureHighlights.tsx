"use client"
import React from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { SplitContent } from '../ui/split-content';
import { AuthDialog } from "@/components/auth/auth-dialog";

const FeatureHighlights = () => {
  // Enhanced features with metrics, testimonials, and benefit-focused language

  console.log("FeatureHighlights component is rendering");





  // Animation variants for scroll reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className=" pb-24 md:pb-32 px-4 sm:px-6 relative overflow-hidden bg-black">
    
      
      {/* Enhanced Features Section with improved card styling */}
      <div className="flex flex-col gap-24 py-24 relative" id="features">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent"></div>
            
            <SplitContent
              imageSrc="/SS Chat.png"
              heading="AI-Powered Resume Assistant"
              description="Get real-time feedback and suggestions from our advanced AI assistant. Optimize your resume content, improve your bullet points, and ensure your skills stand out to recruiters and ATS systems."
              imageOnLeft={false}
              imageOverflowRight={true}
              badgeText="90% more effective bullets"
              badgeGradient="from-purple-600/10 to-indigo-600/10"
              bulletPoints={[
                "Smart content suggestions based on your experience",
                "Real-time feedback on your resume",
                "Industry-specific optimization"
              ]}
            />

            <SplitContent
              imageSrc="/Dashboard Image.png"
              heading="Beautiful Resume Dashboard"
              description="Manage all your resumes in one place with our intuitive dashboard. Create base resumes, generate tailored versions for specific jobs, and track your application progress with ease."
              imageOnLeft={true}
              badgeText="Organize your job search"
              badgeGradient="from-teal-600/10 to-cyan-600/10"
              bulletPoints={[
                "Centralized resume management",
                "Version control for all your resumes",
                "Track application status"
              ]}
            />

            <SplitContent
              imageSrc="/SS Score.png"
              heading="Resume Performance Scoring"
              description="Get detailed insights into your resume's effectiveness with our comprehensive scoring system. Track key metrics, identify areas for improvement, and optimize your resume to stand out to employers and ATS systems."
              imageOnLeft={false}
              imageOverflowRight={true}
              badgeText="3x higher response rates"
              badgeGradient="from-pink-600/10 to-rose-600/10"
              bulletPoints={[
                "ATS compatibility scoring",
                "Keyword optimization insights",
                "Detailed improvement recommendations"
              ]}
            />

            <SplitContent
              imageSrc="/SS Cover Letter.png"
              heading="AI Cover Letter Generator"
              description="Create compelling, personalized cover letters in minutes with our AI-powered generator. Tailor your message to specific job opportunities while maintaining a professional and engaging tone that captures attention."
              imageOnLeft={true}
              badgeText="Save 30+ minutes per application"
              badgeGradient="from-emerald-600/10 to-green-600/10"
              bulletPoints={[
                "Tailored to match job requirements",
                "Professional tone and structure",
                "Highlights your relevant achievements"
              ]}
            />
      </div>
    </section>
  );
};

export default FeatureHighlights;
