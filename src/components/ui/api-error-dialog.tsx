import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ApiErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function ApiErrorDialog({
  open,
  onOpenChange,
  title = "API Key Required",
  description = "To use this feature, you need to add your API key.",
  actionLabel = "Got It",
  actionHref = "#"
}: ApiErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto rounded-full w-12 h-12 bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold text-red-600">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-3 mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="min-w-[100px] border-gray-300 bg-white hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => onOpenChange(false)}
            className="min-w-[100px] bg-red-600 hover:bg-red-700 text-white"
          >
            {actionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
