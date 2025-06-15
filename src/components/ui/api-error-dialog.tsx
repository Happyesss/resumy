import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Settings } from 'lucide-react';
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
  description = "To use this feature, you need to add your API key in settings.",
  actionLabel = "Go to Settings",
  actionHref = "/settings"
}: ApiErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button asChild>
            <Link href={actionHref}>
              <Settings className="h-4 w-4 mr-2" />
              {actionLabel}
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
