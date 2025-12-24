import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useRef, useState } from "react";

interface ResizablePanelsProps {
  isBaseResume: boolean;
  editorPanel: ReactNode;
  previewPanel: (width: number) => ReactNode;
}

export function ResizablePanels({
  isBaseResume,
  editorPanel,
  previewPanel
}: ResizablePanelsProps) {
  const [previewSize, setPreviewSize] = useState(60);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPercentageRef = useRef(60); // Store last percentage

  // Add function to calculate pixel width
  const updatePixelWidth = () => {
    const containerWidth = containerRef.current?.clientWidth || 0;
    const pixelWidth = Math.floor((containerWidth * lastPercentageRef.current) / 100);
    setPreviewSize(pixelWidth);
  };

  // Check if screen is mobile size
  const checkMobileSize = () => {
    const width = window.innerWidth;
    setIsMobile(width < 768); // Tailwind's md breakpoint
  };

  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      updatePixelWidth();
      checkMobileSize();
    };
    
    window.addEventListener('resize', handleResize);

    // Initial calculation
    updatePixelWidth();
    checkMobileSize();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="h-full relative">
      {isMobile ? (
        // Mobile Layout: Stack panels vertically without resizer
        <div className="h-full flex flex-col">
          {/* Editor Panel - Fixed height on mobile */}
          <div className={cn(
            "flex-none h-1/2 border-b-2",
            isBaseResume
              ? "border-purple-200/40"
              : "border-pink-300/50"
          )}>
            {editorPanel}
          </div>

          {/* Preview Panel - Remaining height */}
          <div className={cn(
            "flex-1 overflow-y-auto",
            "shadow-[0_0_20px_-5px_rgba(0,0,0,0.2)]",
            isBaseResume
              ? "shadow-purple-200/50"
              : "shadow-pink-200/50"
          )}>
            {previewPanel(containerRef.current?.clientWidth || 300)}
          </div>
        </div>
      ) : (
        // Desktop Layout: Horizontal resizable panels
        <ResizablePanelGroup
          direction="horizontal"
          className={cn(
            "relative h-full rounded-lg",
            isBaseResume
              ? "border-purple-200/40"
              : "border-pink-300/50"
          )}
        >
          {/* Editor Panel */}
          <ResizablePanel defaultSize={40} minSize={20} maxSize={75}>
            {editorPanel}
          </ResizablePanel>

          {/* Resize Handle */}
          <ResizableHandle 
            withHandle 
            className={cn(
              isBaseResume
                ? "bg-purple-100/50 hover:bg-purple-200/50"
                : "bg-pink-200/50 hover:bg-pink-300/50 shadow-sm shadow-pink-200/20"
            )}
          />

          {/* Preview Panel */}
          <ResizablePanel 
            defaultSize={60} 
            minSize={25} 
            maxSize={80}
            onResize={(size) => {
              lastPercentageRef.current = size; // Store current percentage
              updatePixelWidth();
            }}
            className={cn(
              "shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)] overflow-y-scroll",
              isBaseResume
                ? "shadow-purple-200/50"
                : "shadow-pink-200/50"
            )}
          >
            {previewPanel(previewSize)}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}