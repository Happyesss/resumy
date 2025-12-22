'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile, Resume } from "@/lib/types";
import { cn } from "@/lib/utils";
import { 
  Github, 
  Globe, 
  Linkedin, 
  LucideIcon, 
  Mail, 
  MapPin, 
  Phone, 
  Sparkles, 
  User, 
  UserCircle2 
} from "lucide-react";
import { memo, useCallback } from 'react';
import { useResumeContext } from '../resume-editor-context';

interface BasicInfoFormProps {
  profile: Profile;
}

function areBasicInfoPropsEqual(
  prevProps: BasicInfoFormProps,
  nextProps: BasicInfoFormProps
) {
  return prevProps.profile.id === nextProps.profile.id;
}

// Enhanced field component with modern styling
const BasicInfoField = memo(function BasicInfoField({ 
  field, 
  value, 
  label, 
  icon: Icon,
  placeholder,
  type = 'text',
  className
}: {
  field: keyof Resume;
  value: string;
  label: string;
  icon: LucideIcon;
  placeholder: string;
  type?: string;
  className?: string;
}) {
  const { dispatch } = useResumeContext();
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_FIELD', field, value: e.target.value });
  }, [dispatch, field]);

  return (
    <div className={cn("group relative", className)}>
      <Label 
        htmlFor={String(field)}
        className={cn(
          "absolute -top-2.5 left-3 z-10",
          "px-2 py-0.5",
          "text-[10px] font-semibold uppercase tracking-wider",
          "bg-zinc-900 text-zinc-400",
          "rounded-md",
          "transition-colors duration-200",
          "group-focus-within:text-emerald-400"
        )}
      >
        {label}
      </Label>
      <div className="relative">
        <Input
          id={String(field)}
          type={type}
          value={value || ''}
          onChange={handleChange}
          className={cn(
            "h-12 pl-4 pr-12",
            "bg-zinc-900/50 border-zinc-800",
            "text-white text-sm",
            "rounded-xl",
            "transition-all duration-200",
            "hover:border-zinc-700 hover:bg-zinc-900/70",
            "focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20",
            "focus:bg-zinc-900",
            "placeholder:text-zinc-600"
          )}
          placeholder={placeholder}
        />
        <div className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2",
          "w-8 h-8 flex items-center justify-center",
          "rounded-lg",
          "bg-zinc-800/80",
          "transition-all duration-200",
          "group-focus-within:bg-emerald-500/20",
          "group-focus-within:scale-105"
        )}>
          <Icon className={cn(
            "h-4 w-4",
            "text-zinc-500",
            "transition-colors duration-200",
            "group-focus-within:text-emerald-400"
          )} />
        </div>
      </div>
    </div>
  );
});

export const BasicInfoForm = memo(function BasicInfoFormComponent({
  profile
}: BasicInfoFormProps) {
  const { state, dispatch } = useResumeContext();
  const { resume } = state;

  const updateField = (field: keyof typeof resume, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const handleFillFromProfile = () => {
    if (!profile) return;
    
    const fieldsToFill: (keyof Profile)[] = [
      'first_name',
      'last_name',
      'email',
      'phone_number',
      'location',
      'website',
      'linkedin_url',
      'github_url'
    ];

    fieldsToFill.forEach((field) => {
      if (profile[field]) {
        updateField(field, profile[field] as string);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Fill from Profile Button */}
      {profile && (
        <Button
          onClick={handleFillFromProfile}
          variant="outline"
          className={cn(
            "w-full h-12",
            "bg-gradient-to-r from-emerald-500/5 to-teal-500/5",
            "border border-dashed border-emerald-500/30",
            "hover:border-emerald-500/50 hover:from-emerald-500/10 hover:to-teal-500/10",
            "text-emerald-400 hover:text-emerald-300",
            "rounded-xl",
            "font-medium text-sm",
            "transition-all duration-200",
            "hover:shadow-lg hover:shadow-emerald-500/10",
            "group"
          )}
        >
          <UserCircle2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
          Fill from Profile
          <Sparkles className="ml-2 h-3 w-3 opacity-60" />
        </Button>
      )}

      {/* Personal Details Section */}
      <div className={cn(
        "rounded-2xl",
        "bg-zinc-900/50",
        "border border-zinc-800/80",
        "p-5",
        "space-y-5"
      )}>
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg",
            "bg-emerald-500/10",
            "flex items-center justify-center"
          )}>
            <User className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Personal Details</h3>
            <p className="text-xs text-zinc-500">Your basic contact information</p>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BasicInfoField
            field="first_name"
            value={resume.first_name}
            label="First Name"
            icon={User}
            placeholder="John"
          />
          <BasicInfoField
            field="last_name"
            value={resume.last_name}
            label="Last Name"
            icon={User}
            placeholder="Doe"
          />
        </div>

        {/* Email */}
        <BasicInfoField
          field="email"
          value={resume.email}
          label="Email Address"
          icon={Mail}
          placeholder="john.doe@example.com"
          type="email"
        />

        {/* Phone & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BasicInfoField
            field="phone_number"
            value={resume.phone_number || ''}
            label="Phone Number"
            icon={Phone}
            placeholder="+1 (555) 000-0000"
            type="tel"
          />
          <BasicInfoField
            field="location"
            value={resume.location || ''}
            label="Location"
            icon={MapPin}
            placeholder="San Francisco, CA"
          />
        </div>
      </div>

      {/* Online Presence Section */}
      <div className={cn(
        "rounded-2xl",
        "bg-zinc-900/50",
        "border border-zinc-800/80",
        "p-5",
        "space-y-5"
      )}>
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-lg",
              "bg-violet-500/10",
              "flex items-center justify-center"
            )}>
              <Globe className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Online Presence</h3>
              <p className="text-xs text-zinc-500">Your professional profiles</p>
            </div>
          </div>
          <span className={cn(
            "text-[10px] font-medium uppercase tracking-wider",
            "text-zinc-600 bg-zinc-800/80",
            "px-2 py-1 rounded-md"
          )}>
            Optional
          </span>
        </div>

        {/* Website */}
        <BasicInfoField
          field="website"
          value={resume.website || ''}
          label="Personal Website"
          icon={Globe}
          placeholder="https://yourportfolio.com"
          type="url"
        />

        {/* LinkedIn & GitHub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BasicInfoField
            field="linkedin_url"
            value={resume.linkedin_url || ''}
            label="LinkedIn Profile"
            icon={Linkedin}
            placeholder="linkedin.com/in/username"
            type="url"
          />
          <BasicInfoField
            field="github_url"
            value={resume.github_url || ''}
            label="GitHub Profile"
            icon={Github}
            placeholder="github.com/username"
            type="url"
          />
        </div>
      </div>

      {/* Pro Tip Card */}
      <div className={cn(
        "rounded-xl",
        "bg-gradient-to-br from-emerald-500/5 to-teal-500/5",
        "border border-emerald-500/20",
        "p-4"
      )}>
        <div className="flex gap-3">
          <div className={cn(
            "w-6 h-6 rounded-lg shrink-0",
            "bg-emerald-500/20",
            "flex items-center justify-center"
          )}>
            <Sparkles className="h-3 w-3 text-emerald-400" />
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            <span className="text-emerald-400 font-medium">Pro tip:</span>{' '}
            Include your professional email and ensure all URLs are complete and working. 
            Your online presence helps recruiters learn more about your work.
          </p>
        </div>
      </div>
    </div>
  );
}, areBasicInfoPropsEqual);
