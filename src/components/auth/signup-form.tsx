'use client'

import { signup } from "@/app/auth/login/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useAuth } from "./auth-context";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full h-9 bg-purple-400 hover:bg-purple-500 text-white font-medium transition-all duration-200 rounded-lg shadow-lg shadow-purple-400/20"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Account...
        </>
      ) : (
        "Create Account"
      )}
    </Button>
  );
}

interface FormState {
  error?: string;
  success?: boolean;
}

export function SignupForm() {
  const [formState, setFormState] = useState<FormState>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { 
    formData, 
    setFormData, 
    setFieldLoading, 
    validations, 
    validateField,
    touchedFields,
    setFieldTouched 
  } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState({});

    // Mark all fields as touched on submit
    const fields = ['email', 'password', 'name', 'confirmPassword'] as const;
    fields.forEach(field => setFieldTouched(field));

    // Validate all fields
    Object.entries(formData).forEach(([field, value]) => {
      validateField(field as keyof typeof formData, value);
    });

    // Check if all required fields are valid
    const isValid = fields.every(field => validations[field]?.isValid);

    if (!isValid) {
      setFormState({ error: "Please fix the validation errors before submitting" });
      return;
    }

    try {
      setFieldLoading('submit', true);
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('name', formData.name || '');
      
      const result = await signup(formDataToSend);
      if (!result.success) {
        setFormState({ error: result.error || "Failed to create account" });
        return;
      }

      setFormState({ success: true });
    } catch (error: unknown) {
      console.error("Signup error:", error);
      setFormState({ error: "An unexpected error occurred" });
    } finally {
      setFieldLoading('submit', false);
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ [field]: value });
    validateField(field, value);
    setFieldLoading(field, true);
    const timer = setTimeout(() => {
      setFieldLoading(field, false);
    }, 500);
    return () => clearTimeout(timer);
  };

  return (
    <>
      {formState.success ? (
        <Alert className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-lg">
          <AlertDescription>
            Account created successfully! Please check your email to confirm your account. If you don't see the email, please check your spam folder.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {formState.error && (
            <Alert variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20 rounded-lg">
              <AlertDescription>{formState.error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-white">Full Name</Label>
            <div className="relative">
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => setFieldTouched('name')}
                placeholder="John Doe"
                required
                minLength={2}
                maxLength={50}
                validation={validations.name}
                isTouched={touchedFields.name}
                autoFocus
                className="bg-black border-purple-400/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 hover:bg-black hover:border-purple-400/50 focus:bg-black"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-white">Email</Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => setFieldTouched('email')}
                placeholder="you@example.com"
                required
                validation={validations.email}
                isTouched={touchedFields.email}
                className="bg-black border-purple-400/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 hover:bg-black hover:border-purple-400/50 focus:bg-black"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-white">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={() => setFieldTouched('password')}
                placeholder="••••••••"
                required
                minLength={6}
                maxLength={100}
                validation={validations.password}
                isTouched={touchedFields.password}
                className="bg-black border-purple-400/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 hover:bg-black hover:border-purple-400/50 focus:bg-black pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-white">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onBlur={() => setFieldTouched('confirmPassword')}
                placeholder="••••••••"
                required
                minLength={6}
                maxLength={100}
                validation={validations.confirmPassword}
                isTouched={touchedFields.confirmPassword}
                className="bg-black border-purple-400/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 hover:bg-black hover:border-purple-400/50 focus:bg-black pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <SubmitButton />
        </form>
      )}
    </>
  );
}