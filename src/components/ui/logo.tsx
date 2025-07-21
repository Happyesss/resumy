'use client';

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { GradientHover } from "./gradient-hover";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface LogoProps {
  className?: string;
  asLink?: boolean;
}

export function Logo({ className, asLink = true }: LogoProps) {
  const logoRef = useRef<HTMLDivElement>(null);

  async function exportAsPNG() {
    try {
      // Create a temporary canvas to render the logo image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = 200;
      canvas.height = 200;

      // Create an image element and load the logo
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Clear canvas with transparent background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the logo centered
        const size = 160; // Logo size
        const x = (canvas.width - size) / 2;
        const y = (canvas.height - size) / 2;
        ctx.drawImage(img, x, y, size, size);

        // Convert to dataURL and download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'resumy-logo.png';
        link.href = dataUrl;
        link.click();
      };
      
      img.src = '/logo.png';
    } catch (error) {
      console.error('Error exporting logo:', error);
    }
  }

  function exportAsSVG() {
    try {
      // Create a simple SVG with Resumy text and reference to the logo
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="50" viewBox="0 0 200 50">
          <defs>
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#7c3aed"/>
              <stop offset="100%" style="stop-color:#4f46e5"/>
            </linearGradient>
          </defs>
          <text x="10" y="35" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="url(#textGradient)">Resumy</text>
        </svg>
      `;

      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'resumy-logo.svg';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting SVG:', error);
    }
  }

  const logoContent = (
    <ContextMenu>
      <ContextMenuTrigger>
        <div ref={logoRef} className="transition-transform duration-500 hover:scale-105 flex items-center gap-2">
          <div className="w-10 h-10 relative">
            <Image
              src="/logo.png"
              alt="Resumy Logo"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <GradientHover className={cn("text-purple-400 font-semibold text-xl", className)}>
            Resumy
          </GradientHover>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={exportAsPNG}>
          <Download className="mr-2 h-4 w-4" />
          Save as PNG
        </ContextMenuItem>
        <ContextMenuItem onClick={exportAsSVG}>
          <Code className="mr-2 h-4 w-4" />
          Save as SVG
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );

  if (asLink) {
    return (
      <Link href="/home">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
} 