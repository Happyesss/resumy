'use client';

import { DonationBook } from "@/components/shared/donation-book";
import { Logo } from "@/components/ui/logo";
import {
    BarChart3,
    BookOpen, ExternalLink, FileText, Github, Heart, Layout, Linkedin,
    Mail, Shield, Sparkles, Star, Twitter, Zap
} from "lucide-react";
import Link from "next/link";

export function Footer() {

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Resume Builder", href: "/home", icon: <FileText className="h-4 w-4" /> },
        { name: "Templates", href: "/templates", icon: <Layout className="h-4 w-4" /> },
        { name: "Resume Analysis", href: "/analyze-resume", icon: <BarChart3 className="h-4 w-4" /> },
        { name: "Cover Letters", href: "#features", icon: <FileText className="h-4 w-4" /> },
      ]
    },
    {
      title: "Features",
      links: [
        { name: "AI Optimization", href: "#features", icon: <Sparkles className="h-4 w-4" /> },
        { name: "ATS Compatibility", href: "#features", icon: <Shield className="h-4 w-4" /> },
        { name: "PDF Export", href: "#features", icon: <FileText className="h-4 w-4" /> },
        { name: "Real-time Preview", href: "#features", icon: <Zap className="h-4 w-4" /> },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "How It Works", href: "#how-it-works", icon: <BookOpen className="h-4 w-4" /> },
        { name: "Pricing", href: "#pricing", icon: <BarChart3 className="h-4 w-4" /> },
        { name: "About Us", href: "#about", icon: <Heart className="h-4 w-4" /> },
        { name: "Testimonials", href: "#testimonials", icon: <Star className="h-4 w-4" /> },
      ]
    }
  ];

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/Happyesss/resumyy",
      icon: <Github className="h-5 w-5" />,
      color: "hover:text-gray-400"
    },
    {
      name: "Twitter",
      href: "https://twitter.com/resumy",
      icon: <Twitter className="h-5 w-5" />,
      color: "hover:text-blue-400"
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/resumy",
      icon: <Linkedin className="h-5 w-5" />,
      color: "hover:text-blue-500"
    },
    {
      name: "Email",
      href: "mailto:resumy.co@gmail.com",
      icon: <Mail className="h-5 w-5" />,
      color: "hover:text-green-400"
    }
  ];



  return (
    <footer className="bg-black border-t border-gray-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-black pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <Logo asLink={false} />
              </Link>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Create professional, ATS-optimized resumes with AI assistance. 
                Free forever, no hidden fees, no limitations.
              </p>
              
              {/* Social Links
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 transition-all duration-200 hover:border-gray-600 hover:bg-gray-800 ${social.color}`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div> */}
            </div>

            {/* Navigation Sections */}
            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-8">
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm group"
                        >
                          <span className="text-gray-600 group-hover:text-purple-400 transition-colors">
                            {link.icon}
                          </span>
                          {link.name}
                          {link.href.startsWith('http') && (
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Donation Book Section */}
            <div className="lg:col-span-1 flex justify-center lg:justify-end">
              <DonationBook />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Side - Copyright and Links */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
              <p>© {new Date().getFullYear()} Resumy. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            {/* Center - Made with Love */}
            <Link
              href="https://resumy.live"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>resumy.live</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
