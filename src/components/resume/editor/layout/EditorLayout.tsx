import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { ResizablePanels } from "./ResizablePanels";

interface EditorLayoutProps {
  isBaseResume: boolean;
  editorPanel: ReactNode;
  previewPanel: (width: number) => ReactNode;
}

export function EditorLayout({
  isBaseResume,
  editorPanel,
  previewPanel
}: EditorLayoutProps) {
  return (
    <main className={cn(
      "flex h-full",
    )}>
      <div className="relative py-2 sm:py-3 lg:py-4 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 mx-auto w-full h-full shadow-xl">
        <ResizablePanels
          isBaseResume={isBaseResume}
          editorPanel={editorPanel}
          previewPanel={previewPanel}
        />
      </div>
    </main>
  );
} 