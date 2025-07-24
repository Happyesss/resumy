'use client';

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  MessageCircle, 
  Heart,
  ArrowRight,
  ExternalLink,
  Shield,
  Zap,
  Users,
  Sparkles,
  FileText,
  Layout,
  User,
  BarChart3,
  BookOpen,
  HelpCircle,
  Star
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Resume Builder", href: "/home", icon: <FileText className="h-4 w-4" /> },
        { name: "Templates", href: "/templates", icon: <Layout className="h-4 w-4" /> },
        { name: "Resume Analysis", href: "/analyze-resume", icon: <BarChart3 className="h-4 w-4" /> },
        { name: "Cover Letters", href: "/cover-letter", icon: <FileText className="h-4 w-4" /> },
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
        { name: "FAQ", href: "#faq", icon: <HelpCircle className="h-4 w-4" /> },
        { name: "Career Tips", href: "/blog", icon: <Star className="h-4 w-4" /> },
        { name: "Resume Examples", href: "/examples", icon: <Layout className="h-4 w-4" /> },
      ]
    },
    {
      title: "Account",
      links: [
        { name: "Sign Up", href: "/auth/signup", icon: <User className="h-4 w-4" /> },
        { name: "Login", href: "/auth/login", icon: <User className="h-4 w-4" /> },
        { name: "Profile", href: "/profile", icon: <User className="h-4 w-4" /> },
        { name: "My Resumes", href: "/resumes", icon: <FileText className="h-4 w-4" /> },
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
      href: "mailto:support@resumy.live",
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
        {/* Newsletter Section */}
        <div className="py-12 border-b border-gray-800">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Stay Updated
              </h3>
            </div>
            <p className="text-gray-400 mb-6 text-lg">
              Get career tips, resume advice, and product updates delivered to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                required
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white whitespace-nowrap"
                disabled={isSubscribed}
              >
                {isSubscribed ? (
                  <>
                    <Heart className="h-4 w-4 mr-2" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>


        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <Logo asLink={false} />
              </Link>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Create professional, ATS-optimized resumes with AI assistance. 
                Free forever, no hidden fees, no limitations.
              </p>
              
              {/* Social Links */}
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
              </div>
            </div>

            {/* Navigation Sections */}
            {footerSections.map((section) => (
              <div key={section.title} className="lg:col-span-1">
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
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for job seekers worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
