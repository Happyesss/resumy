"use client"
import React, { useState } from 'react';
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
    title: string;
  }[];
  onImageSelect: (imageSrc: string) => void;
  selectedImage?: string;
  className?: string;
}

export function ImageGallery({ 
  images, 
  onImageSelect, 
  selectedImage, 
  className 
}: ImageGalleryProps) {
  return (
    <div className={cn("flex flex-wrap gap-2 mt-4", className)}>
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onImageSelect(image.src)}
          className={cn(
            "relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200",
            "hover:scale-105 hover:shadow-lg",
            selectedImage === image.src 
              ? "border-purple-400 shadow-purple-400/50" 
              : "border-gray-600 hover:border-gray-400"
          )}
          title={image.title}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="64px"
          />
          {/* Selected indicator */}
          {selectedImage === image.src && (
            <div className="absolute inset-0 bg-purple-400/20 flex items-center justify-center">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
