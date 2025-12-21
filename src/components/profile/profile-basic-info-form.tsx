'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile } from "@/lib/types";
import { Github, Globe, Linkedin, Mail, MapPin, Phone, User } from "lucide-react";

interface ProfileBasicInfoFormProps {
  profile: Profile;
  onChange: (field: keyof Profile, value: string) => void;
}

export function ProfileBasicInfoForm({ profile, onChange }: ProfileBasicInfoFormProps) {
  return (
    <div className="space-y-8">
      {/* Personal Details Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
          <User className="h-4 w-4 text-zinc-400" />
          <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">Contact Details</h3>
        </div>
        
        {/* Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="first_name" className="text-sm font-medium text-zinc-400">
              First Name
            </Label>
            <Input
              id="first_name"
              value={profile.first_name || ''}
              onChange={(e) => onChange('first_name', e.target.value)}
              className="h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100 
                focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 focus:bg-zinc-900/70
                hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors
                placeholder:text-zinc-600"
              placeholder="Enter your first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name" className="text-sm font-medium text-zinc-400">
              Last Name
            </Label>
            <Input
              id="last_name"
              value={profile.last_name || ''}
              onChange={(e) => onChange('last_name', e.target.value)}
              className="h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100 
                focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 focus:bg-zinc-900/70
                hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors
                placeholder:text-zinc-600"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Email & Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={profile.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              disabled
              className="h-11 bg-zinc-900/30 border-zinc-800/50 text-zinc-500 
                cursor-not-allowed placeholder:text-zinc-600"
              placeholder="email@example.com"
            />
            <p className="text-xs text-zinc-600">Email cannot be changed</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={profile.phone_number || ''}
              onChange={(e) => onChange('phone_number', e.target.value)}
              className="h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100 
                focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 focus:bg-zinc-900/70
                hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors
                placeholder:text-zinc-600"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            Location
          </Label>
          <Input
            id="location"
            value={profile.location || ''}
            onChange={(e) => onChange('location', e.target.value)}
            className="h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100 
              focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 focus:bg-zinc-900/70
              hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors
              placeholder:text-zinc-600"
            placeholder="City, State, Country"
          />
        </div>
      </div>

      {/* Online Presence Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
          <Globe className="h-4 w-4 text-zinc-400" />
          <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">Online Presence</h3>
        </div>

        {/* Website & LinkedIn Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Globe className="h-3.5 w-3.5" />
              Website
            </Label>
            <Input
              id="website"
              type="url"
              value={profile.website || ''}
              onChange={(e) => onChange('website', e.target.value)}
              className="h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100 
                focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 focus:bg-zinc-900/70
                hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors
                placeholder:text-zinc-600"
              placeholder="https://your-website.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              type="url"
              value={profile.linkedin_url || ''}
              onChange={(e) => onChange('linkedin_url', e.target.value)}
              className="h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100 
                focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 focus:bg-zinc-900/70
                hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors
                placeholder:text-zinc-600"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </div>

        {/* GitHub */}
        <div className="space-y-2">
          <Label htmlFor="github" className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <Github className="h-3.5 w-3.5" />
            GitHub
          </Label>
          <Input
            id="github"
            type="url"
            value={profile.github_url || ''}
            onChange={(e) => onChange('github_url', e.target.value)}
            className="h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100 
              focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 focus:bg-zinc-900/70
              hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors
              placeholder:text-zinc-600"
            placeholder="https://github.com/username"
          />
        </div>
      </div>
    </div>
  );
}