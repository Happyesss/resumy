"use client"
import React, { useState } from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { SplitContent } from '../ui/split-content';
import { AuthDialog } from "@/components/auth/auth-dialog";

const FeatureHighlights = () => {
  const [selectedAnalyzeImage, setSelectedAnalyzeImage] = useState("/images/analyze.png");

  // Define the result images gallery
  const analyzeResultImages = [
    {
      src: "/images/result/ATS Processing Pipeline.png",
      alt: "ATS Processing Pipeline",
      title: "ATS Processing Pipeline"
    },
    {
      src: "/images/result/Completeness.png",
      alt: "Completeness Analysis",
      title: "Completeness Analysis"
    },
    {
      src: "/images/result/Impact%20%26%20Voice.png",
      alt: "Impact & Voice Analysis",
      title: "Impact & Voice"
    },
    {
      src: "/images/result/Key Improvements.png",
      alt: "Key Improvements",
      title: "Key Improvements"
    },
    {
      src: "/images/result/Resume Preview.png",
      alt: "Resume Preview",
      title: "Resume Preview"
    },
    {
      src: "/images/result/Role Matching.png",
      alt: "Role Matching Analysis",
      title: "Role Matching"
    },
    {
      src: "/images/result/score.png",
      alt: "Score Analysis",
      title: "Score Analysis"
    }
  ];

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
    <section className="pb-12 md:pb-16 px-4 sm:px-6 relative overflow-hidden bg-black">
      {/* Enhanced Features Section with improved card styling */}
      <div className="flex flex-col gap-20 py-16 relative" id="features">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent"></div>
            
            <SplitContent
              imageSrc="/images/SS Chat.png"
              heading="AI-Powered Resume Assistant"
              description="Get instant, smart feedback on your resume. Our AI helps you improve your content, highlight your strengths, and stand out to recruiters."
              imageOnLeft={false}
              imageOverflowRight={true}
              bulletPoints={[
                "Intelligent content suggestions tailored to your unique experience",
                "Real-time optimization feedback with instant improvements",
                "Industry-specific customization for maximum impact"
              ]}
            />

            <SplitContent
              imageSrc={selectedAnalyzeImage}
              heading="Analyze Your Resume"
              description="Reveal your resume’s strengths and hidden gaps with advanced AI analysis. Instantly check ATS compatibility, get a visual performance breakdown, and receive expert tips to boost your chances of landing interviews."
              imageOnLeft={true}
              imageOverflowRight={false}
              bulletPoints={[
                "ATS scan and compatibility check",
                "Instant performance insights",
                "Clear, expert-backed suggestions"
              ]}
              galleryImages={analyzeResultImages}
              onImageSelect={setSelectedAnalyzeImage}
              selectedImage={selectedAnalyzeImage}
            />

            <SplitContent
              imageSrc="/images/templates.png"
              heading="Professional Resume Templates"
              description="Choose from our curated collection of stunning, professionally-designed resume templates. Each template is crafted by design experts and optimized for ATS systems, ensuring your content looks exceptional while maintaining perfect functionality across all recruitment platforms."
              imageOnLeft={false}
              imageOverflowRight={true}
              bulletPoints={[
                "ATS-optimized designs that pass through screening systems",
                "Industry-specific templates for maximum relevance",
                "One-click customization with instant preview"
              ]}
            />

            <SplitContent
              imageSrc="/images/coverletter.png"
              heading="AI Cover Letter Generator"
              description="Create personalized cover letters in minutes with AI. Get tailored content that matches job requirements and highlights your key achievements."
              imageOnLeft={true}
              imageOverflowRight={false}
              bulletPoints={[
                "Intelligently tailored to match specific job requirements",
                "Professional tone with personality that stands out",
                "Strategic highlighting of your most relevant achievements"
              ]}
            />
      </div>
    </section>
  );
};

export default FeatureHighlights;
