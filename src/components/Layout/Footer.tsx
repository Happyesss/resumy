import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">ResumeBuilder Pro</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Create professional, ATS-friendly resumes with our powerful builder. 
              Choose from expertly designed templates and land your dream job with 
              a resume that stands out.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Resume Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resume Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/resume-builder" className="text-gray-300 hover:text-white transition-colors">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/templates" className="text-gray-300 hover:text-white transition-colors">
                  Resume Templates
                </Link>
              </li>
              <li>
                <Link to="/examples" className="text-gray-300 hover:text-white transition-colors">
                  Resume Examples
                </Link>
              </li>
              <li>
                <Link to="/cover-letter" className="text-gray-300 hover:text-white transition-colors">
                  Cover Letter Builder
                </Link>
              </li>
              <li>
                <Link to="/ats-checker" className="text-gray-300 hover:text-white transition-colors">
                  ATS Resume Checker
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Resume Tips
                </Link>
              </li>
              <li>
                <Link to="/career-advice" className="text-gray-300 hover:text-white transition-colors">
                  Career Advice
                </Link>
              </li>
              <li>
                <Link to="/interview-prep" className="text-gray-300 hover:text-white transition-colors">
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link to="/salary-guide" className="text-gray-300 hover:text-white transition-colors">
                  Salary Guide
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 ResumeBuilder Pro. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};