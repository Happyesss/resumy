'use client';

import { useRef } from "react";
import Link from "next/link";
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
      // Create canvas with device pixel ratio for better quality
      const scale = window.devicePixelRatio || 1;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size (larger base size * device pixel ratio)
      canvas.width = 200 * scale;
      canvas.height = 200 * scale;

      // Scale context according to device pixel ratio
      ctx.scale(scale, scale);

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 200, 0);
      gradient.addColorStop(0, '#7c3aed');
      gradient.addColorStop(1, '#4f46e5');

      // Draw circle logo
      ctx.beginPath();
      ctx.arc(100, 100, 80, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Export
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'logo.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting logo:', error);
    }
  }

  function exportAsSVG() {
    try {
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#7c3aed"/>
              <stop offset="100%" style="stop-color:#4f46e5"/>
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="url(#logoGradient)" />
        </svg>
      `;

      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'logo.svg';
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
          <GradientHover className={cn("text-2xl font-bold", className)}>
            {/* Logo with text */}
            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-500"></span>
          </GradientHover>
          <span className="text-purple-400 font-semibold text-xl">Resumy</span>
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