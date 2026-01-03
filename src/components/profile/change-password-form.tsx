"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/utils/actions/auth/change-password";
import { deleteAccount, redirectAfterDeletion } from "@/utils/actions/auth/delete-account";
import { Eye, EyeOff, Loader2, Lock, AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Delete account states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setIsLoading(true);

    // Validate new password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Use server action to change password
      const result = await changePassword(newPassword);

      if (!result.success) {
        setError(result.error || "Failed to update password");
        setIsLoading(false);
        return;
      }

      // Success
      toast.success("Password updated successfully!", {
        position: "bottom-right",
        className: "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-none",
      });

      // Clear form
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error) {
      console.error("Password update error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError(undefined);
    
    // Validate confirmation text
    if (deleteConfirmText !== "DELETE") {
      setDeleteError('Please type "DELETE" to confirm');
      return;
    }

    // Validate password is provided
    if (!deletePassword) {
      setDeleteError("Please enter your password to confirm");
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteAccount(deletePassword);

      if (!result.success) {
        setDeleteError(result.error || "Failed to delete account");
        setIsDeleting(false);
        return;
      }

      // Success - show toast and redirect
      toast.success("Account deleted successfully", {
        position: "bottom-right",
        className: "bg-gradient-to-r from-red-500 to-red-600 text-white border-none",
      });

      // Wait a moment for the toast to show
      setTimeout(async () => {
        await redirectAfterDeletion();
      }, 1000);
      
    } catch (error) {
      console.error("Account deletion error:", error);
      setDeleteError("An unexpected error occurred. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
          <Lock className="h-4 w-4 text-zinc-400" />
          <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">Change Password</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive" className="bg-red-950/50 text-red-400 border-red-900/50 rounded-lg">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium text-zinc-400">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600
                  focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20
                  hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              Password must be at least 6 characters with uppercase, number, and special character
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-400">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600
                  focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20
                  hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !newPassword || !confirmPassword}
            className="w-full h-10 bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors rounded-lg 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </div>

      {/* Danger Zone - Delete Account */}
      <div className="space-y-4 pt-4 border-t border-red-900/30">
        <div className="flex items-center gap-2 pb-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h3 className="text-sm font-medium text-red-400 uppercase tracking-wide">Danger Zone</h3>
        </div>
        
        <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4 space-y-3">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-red-300">Delete Account</h4>
            <p className="text-xs text-red-400/80 leading-relaxed">
              Permanently delete your account and all associated data. This action cannot be undone.
              All your resumes, jobs, and profile information will be permanently removed.
            </p>
          </div>

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-10 border-red-800 bg-red-950/30 text-red-400 
                  hover:bg-red-950/50 hover:border-red-700 hover:text-red-300 
                  transition-colors rounded-lg font-medium"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete My Account
              </Button>
            </AlertDialogTrigger>
            
            <AlertDialogContent className="bg-zinc-950 border-red-900/50 max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Delete Account Permanently
                </AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400 space-y-3 pt-2">
                  <p className="text-sm leading-relaxed">
                    This will permanently delete your account and all associated data including:
                  </p>
                  <ul className="text-xs space-y-1 list-disc list-inside text-zinc-500 pl-2">
                    <li>Your profile information</li>
                    <li>All resumes and cover letters</li>
                    <li>Job listings and applications</li>
                    <li>All other personal data</li>
                  </ul>
                  <p className="text-sm font-semibold text-red-400">
                    This action cannot be undone.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4 py-4">
                {deleteError && (
                  <Alert variant="destructive" className="bg-red-950/50 text-red-400 border-red-900/50">
                    <AlertDescription className="text-xs">{deleteError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="deletePassword" className="text-xs font-medium text-zinc-400">
                    Confirm your password
                  </Label>
                  <div className="relative">
                    <Input
                      id="deletePassword"
                      type={showDeletePassword ? "text" : "password"}
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-10 bg-zinc-900/50 border-red-900/50 text-zinc-100 placeholder:text-zinc-600
                        focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 pr-10"
                      disabled={isDeleting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                      disabled={isDeleting}
                    >
                      {showDeletePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deleteConfirm" className="text-xs font-medium text-zinc-400">
                    Type <span className="font-bold text-red-400">DELETE</span> to confirm
                  </Label>
                  <Input
                    id="deleteConfirm"
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE"
                    className="h-10 bg-zinc-900/50 border-red-900/50 text-zinc-100 placeholder:text-zinc-600
                      focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                    disabled={isDeleting}
                  />
                </div>
              </div>

              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel 
                  disabled={isDeleting}
                  onClick={() => {
                    setDeletePassword("");
                    setDeleteConfirmText("");
                    setDeleteError(undefined);
                  }}
                  className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-900"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteConfirmText !== "DELETE" || !deletePassword}
                  className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Forever
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
