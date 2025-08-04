"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { changePassword } from "@/utils/actions/auth/change-password";
import { LogoutButton } from "@/components/auth/logout-button";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      setIsLoading(false);
      return;
    }

    try {
      // Use server action to change password
      const result = await changePassword(currentPassword, newPassword);

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
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error) {
      console.error("Password update error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change Section - Green Theme */}
      <div className="bg-black border border-green-500/30 rounded-xl p-6 shadow-lg hover:shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-5 w-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Change Password</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20 rounded-lg">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-medium text-white">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-black border-green-400/30 text-white placeholder:text-gray-400 focus:border-green-400 focus:ring-green-400/20 hover:bg-black hover:border-green-400/50 focus:bg-black pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium text-white">
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
                className="bg-black border-green-400/30 text-white placeholder:text-gray-400 focus:border-green-400 focus:ring-green-400/20 hover:bg-black hover:border-green-400/50 focus:bg-black pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Password must be at least 6 characters with uppercase, number, and special character
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-white">
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
                className="bg-black border-green-400/30 text-white placeholder:text-gray-400 focus:border-green-400 focus:ring-green-400/20 hover:bg-black hover:border-green-400/50 focus:bg-black pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
            className="w-full h-10 bg-green-500 hover:bg-green-600 text-white font-medium transition-all duration-200 rounded-lg shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Logout Section - Red Theme */}
      <div className="bg-black border border-red-500/30 rounded-xl p-6 shadow-lg hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <h4 className="text-lg font-semibold text-white">Account Actions</h4>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-gray-400">
            Sign out of your account on this device. You will need to log in again to access your account.
          </p>
          <LogoutButton 
            className="w-full h-10 px-4 text-sm font-medium border border-red-500/50 text-red-400 hover:bg-red-900/20 hover:border-red-400 hover:text-red-300 transition-all duration-200 rounded-md bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
