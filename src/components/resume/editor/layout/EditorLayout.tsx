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
      <div className="relative py-4 px-6 md:px-8 lg:px-12 mx-auto  w-full h-full  shadow-xl ">
        <ResizablePanels
          isBaseResume={isBaseResume}
          editorPanel={editorPanel}
          previewPanel={previewPanel}
        />
      </div>
    </main>
  );
} 