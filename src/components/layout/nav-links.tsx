'use client'
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function NavLink({ href, children, className, onClick }: NavLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    onClick?.();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "text-sm font-medium transition-all duration-200",
        className
      )}
    >
      {children}
    </a>
  );
}

function DesktopNavLinks() {
  return (
    <div className="flex items-center gap-8">
      <NavLink 
        href="#features" 
        className="text-white hover:text-purple-400 hover:bg-gray-800/50 px-3 py-2 rounded-lg transition-all duration-200"
      >
        Features
      </NavLink>
      <NavLink 
        href="#how-it-works" 
        className="text-white hover:text-purple-400 hover:bg-gray-800/50 px-3 py-2 rounded-lg transition-all duration-200"
      >
        How it Works
      </NavLink>
      <NavLink 
        href="#pricing" 
        className="text-white hover:text-purple-400 hover:bg-gray-800/50 px-3 py-2 rounded-lg transition-all duration-200"
      >
        About
      </NavLink>
    </div>
  );
}

function MobileNavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white hover:text-purple-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-black border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="px-2 py-2 space-y-1">
            <NavLink 
              href="#features" 
              className="block text-white hover:text-purple-400 hover:bg-gray-800/50 px-3 py-2 rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Features
            </NavLink>
            <NavLink 
              href="#how-it-works" 
              className="block text-white hover:text-purple-400 hover:bg-gray-800/50 px-3 py-2 rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              How it Works
            </NavLink>
            <NavLink 
              href="#pricing" 
              className="block text-white hover:text-purple-400 hover:bg-gray-800/50 px-3 py-2 rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              About
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}

export function NavLinks() {
  return <DesktopNavLinks />;
}

export function MobileNavLinks() {
  return <MobileNavMenu />;
} 