'use client';

import { cn } from '@/lib/utils';
import { useCallback, useRef, useState } from 'react';

interface TemplatePreviewProps {
  templateId: string;
  className?: string;
  enableZoom?: boolean;
}

export function TemplatePreview({ templateId, className, enableZoom = false }: TemplatePreviewProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPinchDistance, setLastPinchDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchRef = useRef({ x: 0, y: 0 });

  const getDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length === 1) {
      return { x: touches[0].clientX, y: touches[0].clientY };
    }
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enableZoom) return;

    const touches = e.touches;
    
    if (touches.length === 2) {
      // Pinch gesture
      const distance = getDistance(touches);
      setLastPinchDistance(distance);
      setIsDragging(false);
    } else if (touches.length === 1) {
      // Pan gesture
      const touch = getTouchCenter(touches);
      lastTouchRef.current = touch;
      setIsDragging(true);
    }
  }, [enableZoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enableZoom) return;

    const touches = e.touches;
    
    if (touches.length === 2 && lastPinchDistance > 0) {
      // Pinch zoom
      const distance = getDistance(touches);
      const scaleChange = distance / lastPinchDistance;
      const newScale = Math.max(0.5, Math.min(3, scale * scaleChange));
      
      setScale(newScale);
      setLastPinchDistance(distance);
    } else if (touches.length === 1 && isDragging && scale > 1) {
      // Pan when zoomed
      const touch = getTouchCenter(touches);
      const deltaX = touch.x - lastTouchRef.current.x;
      const deltaY = touch.y - lastTouchRef.current.y;
      
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      lastTouchRef.current = touch;
    }
  }, [enableZoom, lastPinchDistance, scale, isDragging]);

  const handleTouchEnd = useCallback((_e: React.TouchEvent) => {
    if (!enableZoom) return;

    setIsDragging(false);
    setLastPinchDistance(0);
    
    // Reset position if zoomed out completely
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
      setScale(1);
    }
  }, [enableZoom, scale]);

  const handleDoubleClick = useCallback((_e: React.MouseEvent) => {
    if (!enableZoom) return;

    if (scale === 1) {
      setScale(2);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [enableZoom, scale]);
  // This would render different template previews based on templateId
  const getTemplatePreview = (id: string) => {
    switch (id) {
      case 'default':
        return (
          <div className="w-full h-full bg-white p-3 text-xs">
            <div className="text-center border-b pb-1 mb-2">
              <div className="h-2 bg-gray-800 w-3/4 mx-auto mb-1"></div>
              <div className="h-1 bg-gray-600 w-1/2 mx-auto"></div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="h-1 bg-gray-700 w-1/4 mb-1"></div>
                <div className="h-0.5 bg-gray-500 w-full"></div>
                <div className="h-0.5 bg-gray-500 w-4/5"></div>
              </div>
              <div>
                <div className="h-1 bg-gray-700 w-1/3 mb-1"></div>
                <div className="h-0.5 bg-gray-500 w-full"></div>
                <div className="h-0.5 bg-gray-500 w-3/4"></div>
              </div>
            </div>
          </div>
        );
      case 'modern-1':
        return (
          <div className="w-full h-full bg-white p-2 text-xs">
            {/* Header */}
            <div className="text-center mb-2">
              <div className="h-2 bg-gray-800 w-3/4 mx-auto mb-1"></div>
              <div className="h-1 bg-blue-500 w-1/2 mx-auto mb-1"></div>
              <div className="flex justify-center gap-1 text-[0.3rem]">
                <div className="h-0.5 bg-gray-500 w-6"></div>
                <div className="h-0.5 bg-gray-500 w-8"></div>
                <div className="h-0.5 bg-blue-500 w-6"></div>
              </div>
            </div>
            
            {/* Section with blue accent */}
            <div className="space-y-1">
              <div className="h-0.5 bg-blue-500 w-1/3 border-b border-blue-500"></div>
              <div className="bg-gray-50 p-1 border-l-2 border-blue-200">
                <div className="flex justify-between items-start mb-0.5">
                  <div className="h-0.5 bg-gray-700 w-2/3"></div>
                  <div className="h-0.5 bg-gray-500 w-1/4"></div>
                </div>
                <div className="h-0.5 bg-blue-500 w-1/2 mb-0.5"></div>
                <div className="h-0.5 bg-gray-600 w-full"></div>
              </div>
            </div>
          </div>
        );
      case 'modern-2':
        return (
          <div className="w-full h-full bg-white text-xs">
            {/* Header */}
            <div className="bg-slate-800 text-white p-2 mb-1">
              <div className="h-1.5 bg-white w-3/4 mx-auto mb-1"></div>
              <div className="flex justify-center gap-1 text-[0.3rem]">
                <div className="h-0.5 bg-gray-300 w-6"></div>
                <div className="h-0.5 bg-gray-300 w-8"></div>
                <div className="h-0.5 bg-blue-400 w-6"></div>
              </div>
            </div>
            
            {/* Skills cards */}
            <div className="flex gap-0.5 mb-1 px-1">
              <div className="bg-gray-100 border border-gray-300 p-0.5 rounded flex-1">
                <div className="h-0.5 bg-blue-500 w-full mb-0.5 rounded"></div>
                <div className="h-0.5 bg-gray-700 w-2/3 mb-0.5"></div>
                <div className="flex gap-0.5">
                  <div className="bg-blue-500 text-white text-[0.25rem] px-1 py-0.5 rounded w-4 h-1"></div>
                  <div className="bg-blue-500 text-white text-[0.25rem] px-1 py-0.5 rounded w-6 h-1"></div>
                </div>
              </div>
              <div className="bg-gray-100 border border-gray-300 p-0.5 rounded flex-1">
                <div className="h-0.5 bg-blue-500 w-full mb-0.5 rounded"></div>
                <div className="h-0.5 bg-gray-700 w-3/4 mb-0.5"></div>
                <div className="flex gap-0.5">
                  <div className="bg-blue-500 text-white text-[0.25rem] px-1 py-0.5 rounded w-8 h-1"></div>
                </div>
              </div>
            </div>
            
            {/* Experience section */}
            <div className="px-1">
              <div className="border-l-2 border-blue-500 pl-1 mb-1 bg-gray-50">
                <div className="h-0.5 bg-blue-500 w-1/3 mb-0.5"></div>
                <div className="bg-white border border-gray-200 p-0.5 rounded shadow-sm">
                  <div className="flex justify-between items-start mb-0.5">
                    <div className="h-0.5 bg-gray-800 w-2/3"></div>
                    <div className="bg-blue-100 border border-blue-300 text-blue-700 text-[0.25rem] px-1 py-0.5 rounded w-6 h-1"></div>
                  </div>
                  <div className="h-0.5 bg-blue-600 w-1/2 mb-0.5"></div>
                  <div className="flex items-start gap-0.5">
                    <div className="w-0.5 h-0.5 bg-blue-500 rounded-full mt-0.5"></div>
                    <div className="h-0.5 bg-gray-600 w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'classic-1':
        return (
          <div className="w-full h-full bg-white p-3 text-xs font-serif">
            {/* Header */}
            <div className="text-center border-b border-black pb-2 mb-2">
              <div className="h-1.5 bg-gray-900 w-2/3 mx-auto mb-1"></div>
              <div className="flex justify-center gap-2 mb-1 text-[0.3rem]">
                <div className="h-0.5 bg-gray-600 w-6"></div>
                <div className="h-0.5 bg-gray-600 w-8"></div>
                <div className="h-0.5 bg-gray-600 w-6"></div>
              </div>
            </div>
            
            {/* Sections with traditional styling */}
            <div className="space-y-2">
              {/* Education section */}
              <div>
                <div className="h-0.5 bg-black w-1/4 mb-1 border-b border-black"></div>
                <div className="flex justify-between items-start mb-1">
                  <div className="w-2/3">
                    <div className="h-0.5 bg-gray-800 w-4/5 mb-0.5"></div>
                    <div className="h-0.5 bg-gray-600 w-3/4 italic"></div>
                  </div>
                  <div className="w-1/3 text-right">
                    <div className="h-0.5 bg-gray-600 w-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Experience section */}
              <div>
                <div className="h-0.5 bg-black w-1/3 mb-1 border-b border-black"></div>
                <div className="flex justify-between items-start">
                  <div className="w-2/3">
                    <div className="h-0.5 bg-gray-800 w-4/5 mb-0.5"></div>
                    <div className="h-0.5 bg-gray-600 w-3/4"></div>
                    <div className="space-y-0.5 mt-1">
                      <div className="flex items-start gap-1">
                        <div className="w-0.5 h-0.5 bg-gray-600 rounded-full mt-0.5"></div>
                        <div className="h-0.5 bg-gray-500 w-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="w-1/3 text-right">
                    <div className="h-0.5 bg-gray-600 w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'creative-modern':
        return (
          <div className="w-full h-full flex text-xs">
            {/* Left sidebar - darker gray */}
            <div className="w-1/3 bg-gray-600 p-1.5 text-white">
              <div className="text-center mb-2">
                <div className="h-1 bg-white w-3/4 mx-auto mb-0.5"></div>
                <div className="h-0.5 bg-gray-300 w-1/2 mx-auto"></div>
              </div>
              
              {/* Contact section */}
              <div className="mb-2">
                <div className="h-0.5 bg-gray-300 w-2/3 mb-1"></div>
                <div className="space-y-0.5">
                  <div className="h-0.5 bg-white w-3/4"></div>
                  <div className="h-0.5 bg-white w-2/3"></div>
                  <div className="h-0.5 bg-blue-300 w-4/5"></div>
                </div>
              </div>
              
              {/* Skills section */}
              <div>
                <div className="h-0.5 bg-gray-300 w-1/2 mb-1"></div>
                <div className="space-y-1">
                  <div>
                    <div className="h-0.5 bg-gray-200 w-2/3 mb-0.5"></div>
                    <div className="h-0.5 bg-gray-400 w-full"></div>
                  </div>
                  <div>
                    <div className="h-0.5 bg-gray-200 w-1/2 mb-0.5"></div>
                    <div className="h-0.5 bg-gray-400 w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right content */}
            <div className="flex-1 p-1.5 bg-white">
              {/* Experience section with red accent */}
              <div className="mb-2">
                <div className="h-0.5 bg-gray-800 w-1/3 border-b-2 border-red-500 pb-0.5 mb-1"></div>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <div className="h-0.5 bg-gray-800 w-2/3 mb-0.5"></div>
                    <div className="h-0.5 bg-red-500 w-1/2"></div>
                  </div>
                  <div className="bg-red-100 border border-red-300 text-red-700 text-[0.25rem] px-1 py-0.5 rounded w-6 h-1"></div>
                </div>
                <div className="flex items-start gap-0.5">
                  <div className="w-0.5 h-0.5 bg-red-500 rounded-sm mt-0.5"></div>
                  <div className="h-0.5 bg-gray-600 w-full"></div>
                </div>
              </div>
              
              {/* Projects section */}
              <div>
                <div className="h-0.5 bg-gray-800 w-1/4 border-b-2 border-red-500 pb-0.5 mb-1"></div>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="h-0.5 bg-gray-800 w-1/2 mb-0.5"></div>
                    <div className="flex gap-0.5 mb-0.5">
                      <div className="bg-gray-100 border border-gray-300 text-[0.25rem] px-1 py-0.5 rounded w-6 h-1"></div>
                      <div className="bg-gray-100 border border-gray-300 text-[0.25rem] px-1 py-0.5 rounded w-4 h-1"></div>
                    </div>
                  </div>
                  <div className="bg-red-100 border border-red-300 text-red-700 text-[0.25rem] px-1 py-0.5 rounded w-6 h-1"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'creative-minimal':
        return (
          <div className="w-full h-full bg-white p-2 text-xs">
            {/* Header with decorative line */}
            <div className="relative mb-2">
              <div className="h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-600 w-full mb-1"></div>
              <div className="text-center">
                <div className="h-1.5 bg-gray-800 w-1/2 mx-auto mb-0.5"></div>
                <div className="h-0.5 bg-emerald-600 w-1/3 mx-auto mb-1"></div>
                <div className="flex justify-center gap-1">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-teal-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Two column layout */}
            <div className="flex gap-2">
              <div className="w-1/3 space-y-1">
                <div className="h-0.5 bg-gray-800 w-3/4 mb-1"></div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <div className="w-0.5 h-0.5 bg-emerald-400 rounded-full"></div>
                    <div className="h-0.5 bg-gray-600 w-full"></div>
                  </div>
                  <div className="ml-1 h-0.5 bg-emerald-400 w-3/4"></div>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="bg-gray-50 p-1 rounded border-l-2 border-emerald-400">
                  <div className="h-0.5 bg-gray-700 w-2/3 mb-0.5"></div>
                  <div className="h-0.5 bg-emerald-600 w-1/2 mb-0.5"></div>
                  <div className="h-0.5 bg-gray-500 w-full"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'minimal-1':
        return (
          <div className="w-full h-full bg-white p-2 text-xs">
            {/* Header with bottom border */}
            <div className="text-center border-b border-black pb-2 mb-2">
              <div className="h-2 bg-black w-2/3 mx-auto mb-1"></div>
              <div className="flex justify-center gap-2 text-[0.3rem]">
                <div className="h-0.5 bg-black w-6"></div>
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="h-0.5 bg-black w-8"></div>
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="h-0.5 bg-black w-6"></div>
              </div>
            </div>
            
            {/* Simple sections */}
            <div className="space-y-2">
              <div>
                <div className="h-0.5 bg-black w-1/4 mb-1 font-bold"></div>
                <div className="flex justify-between mb-0.5">
                  <div className="h-0.5 bg-black w-1/2"></div>
                  <div className="h-0.5 bg-black w-1/5"></div>
                </div>
                <div className="h-0.5 bg-gray-600 w-full"></div>
                <div className="h-0.5 bg-gray-600 w-4/5"></div>
              </div>
              <div>
                <div className="h-0.5 bg-black w-1/3 mb-1"></div>
                <div className="h-0.5 bg-gray-600 w-full"></div>
                <div className="h-0.5 bg-gray-600 w-3/4"></div>
              </div>
            </div>
          </div>
        );
      case 'ca-professional':
        return (
          <div className="w-full h-full bg-white p-2 text-xs">
            {/* Header with green accent for CA */}
            <div className="text-center border-b-2 border-green-700 pb-2 mb-2">
              <div className="h-2 bg-green-700 w-3/4 mx-auto mb-2"></div>
              <div className="flex justify-center gap-1 text-[0.3rem]">
                <div className="h-0.5 bg-gray-600 w-6"></div>
                <div className="h-0.5 bg-gray-600 w-8"></div>
                <div className="h-0.5 bg-gray-600 w-6"></div>
              </div>
            </div>
            
            {/* Education Table */}
            <div className="mb-2">
              <div className="h-0.5 bg-green-700 w-1/4 mb-1 font-bold"></div>
              <div className="border border-gray-400">
                <div className="grid grid-cols-4 gap-0.5 text-[0.25rem]">
                  <div className="h-0.5 bg-gray-600 border-r border-gray-400 p-0.5"></div>
                  <div className="h-0.5 bg-gray-600 border-r border-gray-400 p-0.5"></div>
                  <div className="h-0.5 bg-gray-600 border-r border-gray-400 p-0.5"></div>
                  <div className="h-0.5 bg-gray-600 p-0.5"></div>
                </div>
              </div>
            </div>
            
            {/* Experience section */}
            <div className="mb-2">
              <div className="h-0.5 bg-green-700 w-1/3 mb-1"></div>
              <div className="flex justify-between mb-0.5">
                <div className="h-0.5 bg-green-700 w-1/2"></div>
                <div className="h-0.5 bg-gray-600 w-1/5"></div>
              </div>
              <div className="h-0.5 bg-gray-600 w-full"></div>
              <div className="h-0.5 bg-gray-600 w-4/5"></div>
            </div>
            
            {/* Skills section */}
            <div>
              <div className="h-0.5 bg-green-700 w-1/4 mb-1"></div>
              <div className="h-0.5 bg-gray-600 w-full"></div>
              <div className="h-0.5 bg-gray-600 w-3/4"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-gray-100 p-2 flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>
        );
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn("overflow-hidden relative", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
      style={{ 
        touchAction: enableZoom ? 'none' : 'auto',
        userSelect: 'none'
      }}
    >
      <div
        className="w-full h-full transition-transform duration-200 ease-out origin-center"
        style={{
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
        }}
      >
        {getTemplatePreview(templateId)}
      </div>
      
      {/* Zoom indicator */}
      {enableZoom && scale > 1 && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
          {Math.round(scale * 100)}%
        </div>
      )}
    </div>
  );
}
