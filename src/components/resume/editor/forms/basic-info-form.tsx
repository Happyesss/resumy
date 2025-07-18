'use client';

import { Profile, Resume } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Globe, Github, User, UserCircle2, LucideIcon, Linkedin, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeContext } from '../resume-editor-context';
import { memo, useCallback } from 'react';
import { cn } from "@/lib/utils";

interface BasicInfoFormProps {
  profile: Profile;
}

function areBasicInfoPropsEqual(
  prevProps: BasicInfoFormProps,
  nextProps: BasicInfoFormProps
) {
  return prevProps.profile.id === nextProps.profile.id;
}

// Create memoized field component
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
    <div className={cn("relative group", className)}>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
        <div className={cn(
          "p-1.5 rounded-full transition-all duration-300",
          "bg-indigo-400/10 group-focus-within:bg-indigo-400/20",
          "group-focus-within:scale-110"
        )}>
          <Icon className="h-3.5 w-3.5 text-indigo-400" />
        </div>
      </div>
      <Input
        type={type}
        value={value || ''}
        onChange={handleChange}
        className={cn(
          "pr-12 h-10 text-sm transition-all duration-300",
          "bg-gray-800 border-gray-700 rounded-lg",
          "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20",
          "hover:border-indigo-400/50 hover:bg-gray-800/90",
          "placeholder:text-gray-500 text-white focus:bg-gray-800"
        )}
        placeholder={placeholder}
      />
      <div className={cn(
        "absolute -top-2 left-3 px-2 bg-gray-900 rounded-full",
        "text-[9px] font-medium text-indigo-400 border border-gray-700",
        "transition-colors duration-300"
      )}>
        {label}
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
    
    // List of fields to copy from profile
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

    // Copy each field if it exists in the profile
    fieldsToFill.forEach((field) => {
      if (profile[field]) {
        updateField(field, profile[field] as string);
      }
    });
  };

  return (
    <div className="space-y-4">

      {/* Fill from Profile Button */}
      {profile && (
        <div className="@container">
          <Button
            onClick={handleFillFromProfile}
            className={cn(
              "w-full h-10 transition-all duration-300",
              "bg-gray-900 border-2 border-gray-800",
              "hover:from-indigo-400/10 hover:via-indigo-400/15 hover:to-blue-400/10",
              "border-2 border-dashed border-indigo-400/30 hover:border-indigo-400/40",
              "text-indigo-400 hover:text-indigo-300",
              "rounded-xl text-sm font-medium",
              "hover:shadow-lg hover:shadow-indigo-400/10 hover:-translate-y-0.5"
            )}
          >
            <UserCircle2 className="mr-2 h-4 w-4" />
            Fill from Profile
          </Button>
        </div>
      )}

      {/* Main Form Card */}
      <Card className={cn(
        "relative group transition-all duration-300",
        "bg-gray-900 border-2 border-gray-800",
        "hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-400/10",
        "shadow-sm"
      )}>
        <CardContent className="p-4 space-y-4">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
              <h3 className="text-sm font-semibold text-indigo-400">Personal Details</h3>
            </div>

            {/* Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <BasicInfoField
                field="first_name"
                value={resume.first_name}
                label="FIRST NAME"
                icon={User}
                placeholder="Enter first name"
              />
              <BasicInfoField
                field="last_name"
                value={resume.last_name}
                label="LAST NAME"
                icon={User}
                placeholder="Enter last name"
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <BasicInfoField
                field="email"
                value={resume.email}
                label="EMAIL ADDRESS"
                icon={Mail}
                placeholder="your.email@example.com"
                type="email"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <BasicInfoField
                  field="phone_number"
                  value={resume.phone_number || ''}
                  label="PHONE NUMBER"
                  icon={Phone}
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                />
                <BasicInfoField
                  field="location"
                  value={resume.location || ''}
                  label="LOCATION"
                  icon={MapPin}
                  placeholder="City, State, Country"
                />
              </div>
            </div>
          </div>

          {/* Online Presence Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
              <h3 className="text-sm font-semibold text-indigo-400">Online Presence</h3>
              <span className="text-xs text-gray-500">(Optional)</span>
            </div>

            <div className="space-y-3">
              <BasicInfoField
                field="website"
                value={resume.website || ''}
                label="PERSONAL WEBSITE"
                icon={Globe}
                placeholder="https://your-portfolio.com"
                type="url"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <BasicInfoField
                  field="linkedin_url"
                  value={resume.linkedin_url || ''}
                  label="LINKEDIN PROFILE"
                  icon={Linkedin}
                  placeholder="https://linkedin.com/in/username"
                  type="url"
                />
                <BasicInfoField
                  field="github_url"
                  value={resume.github_url || ''}
                  label="GITHUB PROFILE"
                  icon={Github}
                  placeholder="https://github.com/username"
                  type="url"
                />
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className={cn(
            "mt-6 p-3 rounded-lg",
            "bg-indigo-400/5 border border-indigo-400/20"
          )}>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="text-xs text-gray-400 leading-relaxed">
                <span className="text-indigo-400 font-medium">Pro tip:</span> Include your professional email and ensure all URLs are complete and working. Your online presence helps recruiters learn more about your work.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}, areBasicInfoPropsEqual);
