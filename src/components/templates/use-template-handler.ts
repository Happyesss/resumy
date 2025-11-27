'use client';

import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface UseTemplateOptions {
  templateId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useTemplateHandler() {
  const router = useRouter();

  const handleUseTemplate = async ({ templateId, onSuccess, onError }: UseTemplateOptions) => {
    try {
      // Always redirect to home page with template parameter to trigger base resume dialog
      router.push(`/home?createBase=true&template=${templateId}`);
      
      toast({
        title: "Template Selected",
        description: "Create your resume with the selected template",
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Error handling template usage:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to use template";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      onError?.(errorMessage);
    }
  };

  return { handleUseTemplate };
}
