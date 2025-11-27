'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { TemplatePreview } from './template-preview';

interface FullscreenTemplatePreviewProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: string;
  templateName: string;
}

export function FullscreenTemplatePreview({ 
  isOpen, 
  onOpenChange, 
  templateId, 
  templateName 
}: FullscreenTemplatePreviewProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPinchDistance, setLastPinchDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });

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

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setScale(prev => Math.min(3, prev * 1.2));
  };

  const zoomOut = () => {
    const newScale = Math.max(0.5, scale * 0.8);
    setScale(newScale);
    if (newScale === 0.5) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touches = e.touches;
    
    if (touches.length === 2) {
      const distance = getDistance(touches);
      setLastPinchDistance(distance);
      setIsDragging(false);
    } else if (touches.length === 1) {
      const touch = getTouchCenter(touches);
      lastTouchRef.current = touch;
      setIsDragging(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touches = e.touches;
    
    if (touches.length === 2 && lastPinchDistance > 0) {
      const distance = getDistance(touches);
      const scaleChange = distance / lastPinchDistance;
      const newScale = Math.max(0.5, Math.min(3, scale * scaleChange));
      
      setScale(newScale);
      setLastPinchDistance(distance);
    } else if (touches.length === 1 && isDragging && scale > 1) {
      const touch = getTouchCenter(touches);
      const deltaX = touch.x - lastTouchRef.current.x;
      const deltaY = touch.y - lastTouchRef.current.y;
      
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      lastTouchRef.current = touch;
    }
  }, [lastPinchDistance, scale, isDragging]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    setIsDragging(false);
    setLastPinchDistance(0);
    
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
      setScale(1);
    }
  }, [scale]);

  // Mouse handlers for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    }
  }, [scale]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const deltaX = e.clientX - lastMouseRef.current.x;
      const deltaY = e.clientY - lastMouseRef.current.y;
      
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    }
  }, [isDragging, scale]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(3, scale * delta));
    setScale(newScale);
    
    if (newScale <= 1) {
      setPosition({ x: 0, y: 0 });
      setScale(1);
    }
  }, [scale]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 m-0 bg-gray-950 border-none">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Preview: {templateName}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={zoomOut}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={resetZoom}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={zoomIn}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Container */}
        <div 
          ref={containerRef}
          className="flex-1 flex items-center justify-center pt-16 pb-4 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ 
            touchAction: 'none',
            userSelect: 'none',
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}
        >
          <div
            className="transition-transform duration-200 ease-out origin-center bg-white rounded-lg shadow-2xl"
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              width: '80vh',
              height: '100vh',
              maxWidth: '600px',
              maxHeight: '800px'
            }}
          >
            <TemplatePreview 
              templateId={templateId}
              className="w-full h-full border-none rounded-lg"
            />
          </div>
        </div>

        {/* Zoom indicator */}
        {scale !== 1 && (
          <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm px-3 py-2 rounded-lg z-20">
            {Math.round(scale * 100)}%
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-2 rounded-lg z-20 max-w-xs">
          <div className="space-y-1">
            <div>• Pinch to zoom on touch devices</div>
            <div>• Scroll wheel to zoom on desktop</div>
            <div>• Drag to pan when zoomed in</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}