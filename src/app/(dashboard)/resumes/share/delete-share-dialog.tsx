"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Link2, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteShareDialogProps {
  shareId: string;
  resumeName: string;
  onConfirm: (shareId: string) => Promise<void>;
  isLoading?: boolean;
}

export function DeleteShareDialog({
  shareId,
  resumeName,
  onConfirm,
  isLoading = false,
}: DeleteShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm(shareId);
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          disabled={isLoading}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className=" border-black max-w-md">
        <AlertDialogHeader className="space-y-4">
          {/* Warning Icon */}
          <div className="mx-auto w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          
          <AlertDialogTitle className="text-xl text-center text-white">
            Delete Share Link
          </AlertDialogTitle>
          
          <AlertDialogDescription asChild>
            <div className="text-center space-y-3">
              <p className="text-slate-300">
                Are you sure you want to delete this share link?
              </p>
            
              {/* Resume name card */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Link2 className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white truncate max-w-[200px]">
                    {resumeName}
                  </p>
                  <p className="text-xs text-slate-500">Share link will be removed</p>
                </div>
              </div>
            
              {/* Warning message */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-left">
                <p className="text-xs text-amber-300/80 leading-relaxed">
                  <span className="font-semibold">Warning:</span> Anyone with the existing link will no longer be able to view this resume. This action cannot be undone.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="sm:space-x-3 mt-2">
          <AlertDialogCancel 
            className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
            disabled={deleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-red-600 hover:bg-red-700 text-white border-0"
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Link
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
