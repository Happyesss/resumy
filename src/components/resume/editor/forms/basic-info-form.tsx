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
            "h-8 sm:h-9 lg:h-10 pl-2.5 sm:pl-3 pr-8 sm:pr-10",
            "bg-zinc-900/50 border-zinc-800",
            "text-white text-[10px] sm:text-xs lg:text-sm",
            "rounded-lg",
            "transition-all duration-200",
            "hover:border-zinc-700 hover:bg-zinc-900/70",
            "focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20",
            "focus:bg-zinc-900",
            "placeholder:text-zinc-600"
          )}
          placeholder={placeholder}
        />
        <div className={cn(
          "absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2",
          "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex items-center justify-center",
          "rounded-md lg:rounded-lg",
          "bg-zinc-800/80",
          "transition-all duration-200",
          "group-focus-within:bg-emerald-500/20",
          "group-focus-within:scale-105"
        )}>
          <Icon className={cn(
            "h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5",
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
    <div className="space-y-3 sm:space-y-6">
      {/* Fill from Profile Button */}
      {profile && (
        <Button
          onClick={handleFillFromProfile}
          variant="outline"
          className={cn(
            "w-full h-8 sm:h-10 lg:h-11",
            "bg-gradient-to-r from-emerald-500/5 to-teal-500/5",
            "border border-dashed border-emerald-500/30",
            "hover:border-emerald-500/50 hover:from-emerald-500/10 hover:to-teal-500/10",
            "text-emerald-400 hover:text-emerald-300",
            "rounded-lg",
            "font-medium text-[10px] sm:text-xs lg:text-sm",
            "transition-all duration-200",
            "hover:shadow-lg hover:shadow-emerald-500/10",
            "group"
          )}
        >
          <UserCircle2 className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:scale-110 transition-transform" />
          Fill from Profile
          <Sparkles className="ml-1 sm:ml-1.5 h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-60" />
        </Button>
      )}

      {/* Personal Details Section */}
      <div className={cn(
        "rounded-xl lg:rounded-2xl",
        "bg-zinc-900/50",
        "border border-zinc-800/80",
        "p-2 sm:p-3 lg:p-4",
        "space-y-2 sm:space-y-3 lg:space-y-4"
      )}>
        {/* Section Header */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className={cn(
            "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-md lg:rounded-lg",
            "bg-emerald-500/10",
            "flex items-center justify-center"
          )}>
            <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-[10px] sm:text-xs lg:text-sm font-semibold text-white">Personal Details</h3>
            <p className="text-[8px] sm:text-[10px] lg:text-xs text-zinc-500">Your basic contact information</p>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 lg:gap-3">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 lg:gap-3">
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
        "rounded-xl lg:rounded-2xl",
        "bg-zinc-900/50",
        "border border-zinc-800/80",
        "p-2 sm:p-3 lg:p-4",
        "space-y-2 sm:space-y-3 lg:space-y-4"
      )}>
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className={cn(
              "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-md lg:rounded-lg",
              "bg-violet-500/10",
              "flex items-center justify-center"
            )}>
              <Globe className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-[10px] sm:text-xs lg:text-sm font-semibold text-white">Online Presence</h3>
              <p className="text-[8px] sm:text-[10px] lg:text-xs text-zinc-500">Your professional profiles</p>
            </div>
          </div>
          <span className={cn(
            "text-[9px] sm:text-[10px] font-medium uppercase tracking-wider",
            "text-zinc-600 bg-zinc-800/80",
            "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 lg:gap-3">
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
        "rounded-lg lg:rounded-xl",
        "bg-gradient-to-br from-emerald-500/5 to-teal-500/5",
        "border border-emerald-500/20",
        "p-2 sm:p-3 lg:p-4"
      )}>
        <div className="flex gap-2 sm:gap-2.5">
          <div className={cn(
            "w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-md lg:rounded-lg shrink-0",
            "bg-emerald-500/20",
            "flex items-center justify-center"
          )}>
            <Sparkles className="h-2.5 w-2.5 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 text-emerald-400" />
          </div>
          <p className="text-[10px] sm:text-[10px] lg:text-xs text-zinc-400 leading-relaxed">
            <span className="text-emerald-400 font-medium">Pro tip:</span>{' '}
            Include your professional email and ensure all URLs are complete and working. 
            Your online presence helps recruiters learn more about your work.
          </p>
        </div>
      </div>
    </div>
  );
}, areBasicInfoPropsEqual);
