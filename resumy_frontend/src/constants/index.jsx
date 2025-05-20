import { FileText, Sparkles, ShieldCheck, Zap, BarChart2, Users } from "lucide-react";

import user1 from "../assets/profile-pictures/user1.jpg";
import user2 from "../assets/profile-pictures/user2.jpg";
import user3 from "../assets/profile-pictures/user3.jpg";
import user4 from "../assets/profile-pictures/user4.jpg";
import user5 from "../assets/profile-pictures/user5.jpg";
import user6 from "../assets/profile-pictures/user6.jpg";

export const navItems = [
  { label: "Analyze", href: "/resume" },
  { label: "Make Yours", href: "/resume-preview" },
  { label: "About", href: "#" },
  { label: "Quick-guide", href: "#" },
];

export const testimonials = [
  {
    user: "John Doe",
    company: "Stellar Solutions",
    image: user1,
    text: "I am extremely satisfied with the services provided. The team was responsive, professional, and delivered results beyond my expectations.",
  },
  {
    user: "Jane Smith",
    company: "Blue Horizon Technologies",
    image: user2,
    text: "I couldn't be happier with the outcome of our project. The team's creativity and problem-solving skills were instrumental in bringing our vision to life",
  },
  {
    user: "David Johnson",
    company: "Quantum Innovations",
    image: user3,
    text: "Working with this company was a pleasure. Their attention to detail and commitment to excellence are commendable. I would highly recommend them to anyone looking for top-notch service.",
  },
  {
    user: "Ronee Brown",
    company: "Fusion Dynamics",
    image: user4,
    text: "Working with the team at XYZ Company was a game-changer for our project. Their attention to detail and innovative solutions helped us achieve our goals faster than we thought possible. We are grateful for their expertise and professionalism!",
  },
  {
    user: "Michael Wilson",
    company: "Visionary Creations",
    image: user5,
    text: "I am amazed by the level of professionalism and dedication shown by the team. They were able to exceed our expectations and deliver outstanding results.",
  },
  {
    user: "Emily Davis",
    company: "Synergy Systems",
    image: user6,
    text: "The team went above and beyond to ensure our project was a success. Their expertise and dedication are unmatched. I look forward to working with them again in the future.",
  },
];

export const features = [
  {
    icon: <Sparkles size={24} />,
    text: "Smart Content Analysis",
    description: "Our AI scans your resume for weaknesses and suggests impactful improvements.",
  },
  {
    icon: <FileText size={24} />,
    text: "Industry-Specific Templates",
    description: "Professionally designed layouts optimized for different career fields.",
  },
  {
    icon: <ShieldCheck size={24} />,
    text: "ATS Score Checker",
    description: "See exactly how applicant tracking systems read your resume before you submit.",
  },
  {
    icon: <Zap size={24} />,
    text: "One-Click Formatting",
    description: "Instantly reformat your resume for different job applications with perfect spacing.",
  },
  {
    icon: <BarChart2 size={24} />,
    text: "Competitive Benchmarking",
    description: "Compare your resume against successful ones in your target role.",
  },
  {
    icon: <Users size={24} />,
    text: "HR-Approved Phrases",
    description: "Access a database of power phrases that resonate with hiring managers.",
  },
];
export const checklistItems = [
  {
    icon: <Sparkles size={24} />,
    title: "AI-Powered Optimization",
    description: "Our algorithms analyze and enhance your resume to beat applicant tracking systems.",
  },
  {
    icon: <FileText size={24} />,
    title: "Professional Templates",
    description: "Choose from 50+ industry-specific designs that impress recruiters.",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "ATS Compliance Check",
    description: "Get instant feedback on how well your resume parses through automated systems.",
  },
  {
    icon: <Zap size={24} />,
    title: "Quick Customization",
    description: "Tailor your resume for different jobs in minutes with smart suggestions.",
  },
  {
    icon: <BarChart2 size={24} />,
    title: "Performance Analytics",
    description: "See how your resume compares to others in your field and where to improve.",
  },
  {
    icon: <Users size={24} />,
    title: "Expert Review Option",
    description: "Get personalized feedback from professional resume writers.",
  },
];


export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];
