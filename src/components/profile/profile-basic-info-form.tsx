'use client';

import { Profile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Globe, Github, User } from "lucide-react";

interface ProfileBasicInfoFormProps {
  profile: Profile;
  onChange: (field: keyof Profile, value: string) => void;
}

export function ProfileBasicInfoForm({ profile, onChange }: ProfileBasicInfoFormProps) {
  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <Card className="relative group bg-gray-900 border-2 border-gray-800 hover:border-purple-400/40 hover:shadow-lg transition-all duration-300 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Name Row */}
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="relative group flex-1">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-full bg-purple-400/20 transition-transform duration-300 group-focus-within:scale-110">
                    <User className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
                <Input
                  value={profile.first_name || ''}
                  onChange={(e) => onChange('first_name', e.target.value)}
                  className="pr-12 text-lg font-medium bg-gray-800 border-gray-700 rounded-lg
                    focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20
                    hover:border-purple-400/50 hover:bg-gray-800/90 transition-colors
                    placeholder:text-gray-500 text-white focus:bg-gray-800"
                  placeholder="First Name"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-gray-900 rounded-full text-[10px] font-medium text-purple-400 border border-gray-700">
                  FIRST NAME
                </div>
              </div>
              <div className="relative group flex-1">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-full bg-purple-400/20 transition-transform duration-300 group-focus-within:scale-110">
                    <User className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
                <Input
                  value={profile.last_name || ''}
                  onChange={(e) => onChange('last_name', e.target.value)}
                  className="pr-12 text-lg font-medium bg-gray-800 border-gray-700 rounded-lg
                    focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20
                    hover:border-purple-400/50 hover:bg-gray-800/90 transition-colors
                    placeholder:text-gray-500 text-white focus:bg-gray-800"
                  placeholder="Last Name"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-gray-900 rounded-full text-[10px] font-medium text-purple-400 border border-gray-700">
                  LAST NAME
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="relative group flex-1">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-full bg-purple-400/20 transition-transform duration-300 group-focus-within:scale-110">
                    <Mail className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
                <Input
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => onChange('email', e.target.value)}
                  disabled
                  className="pr-12 bg-gray-700 border-gray-600 rounded-lg
                    text-gray-400 cursor-not-allowed
                    placeholder:text-gray-500"
                  placeholder="email@example.com"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-gray-900 rounded-full text-[10px] font-medium text-purple-400 border border-gray-700">
                  EMAIL
                </div>
              </div>
              <div className="relative group flex-1">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-full bg-purple-400/20 transition-transform duration-300 group-focus-within:scale-110">
                    <Phone className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
                <Input
                  type="tel"
                  value={profile.phone_number || ''}
                  onChange={(e) => onChange('phone_number', e.target.value)}
                  className="pr-12 bg-gray-800 border-gray-700 rounded-lg
                    focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20
                    hover:border-purple-400/50 hover:bg-gray-800/90 transition-colors
                    placeholder:text-gray-500 text-white focus:bg-gray-800"
                  placeholder="+1 (555) 000-0000"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-gray-900 rounded-full text-[10px] font-medium text-purple-400 border border-gray-700">
                  PHONE
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="relative group">
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="p-1.5 rounded-full bg-purple-400/20 transition-transform duration-300 group-focus-within:scale-110">
                  <MapPin className="h-4 w-4 text-purple-400" />
                </div>
              </div>
              <Input
                value={profile.location || ''}
                onChange={(e) => onChange('location', e.target.value)}
                className="pr-12 bg-gray-800 border-gray-700 rounded-lg
                  focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20
                  hover:border-purple-400/50 hover:bg-gray-800/90 transition-colors
                  placeholder:text-gray-500 text-white focus:bg-gray-800"
                placeholder="City, State, Country"
              />
              <div className="absolute -top-2.5 left-2 px-1 bg-gray-900 rounded-full text-[10px] font-medium text-purple-400 border border-gray-700">
                LOCATION
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Online Presence */}
      <Card className="relative group bg-gray-900 border-2 border-gray-800 hover:border-purple-400/40 hover:shadow-lg transition-all duration-300 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Website and LinkedIn */}
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="relative group flex-1">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-full bg-teal-400/20 transition-transform duration-300 group-focus-within:scale-110">
                    <Globe className="h-4 w-4 text-teal-400" />
                  </div>
                </div>
                <Input
                  type="url"
                  value={profile.website || ''}
                  onChange={(e) => onChange('website', e.target.value)}
                  className="pr-12 bg-gray-800 border-gray-700 rounded-lg
                    focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20
                    hover:border-teal-400/50 hover:bg-gray-800/90 transition-colors
                    placeholder:text-gray-500 text-white focus:bg-gray-800"
                  placeholder="https://your-website.com"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-gray-900 rounded-full text-[10px] font-medium text-teal-400 border border-gray-700">
                  WEBSITE
                </div>
              </div>
              <div className="relative group flex-1">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-full bg-blue-400/20 transition-transform duration-300 group-focus-within:scale-110">
                    {/* Linkedin icon removed */}
                  </div>
                </div>
                <Input
                  type="url"
                  value={profile.linkedin_url || ''}
                  onChange={(e) => onChange('linkedin_url', e.target.value)}
                  className="pr-12 bg-gray-800 border-gray-700 rounded-lg
                    focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20
                    hover:border-blue-400/50 hover:bg-gray-800/90 transition-colors
                    placeholder:text-gray-500 text-white focus:bg-gray-800"
                  placeholder="https://linkedin.com/in/username"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-gray-900 rounded-full text-[10px] font-medium text-blue-400 border border-gray-700">
                  LINKEDIN
                </div>
              </div>
            </div>

            {/* GitHub */}
            <div className="relative group">
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="p-1.5 rounded-full bg-white/20 transition-transform duration-300 group-focus-within:scale-110">
                  <Github className="h-4 w-4 text-white" />
                </div>
              </div>
              <Input
                type="url"
                value={profile.github_url || ''}
                onChange={(e) => onChange('github_url', e.target.value)}
                className="pr-12 bg-gray-800 border-gray-700 rounded-lg
                  focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20
                  hover:border-gray-400/50 hover:bg-gray-800/90 transition-colors
                  placeholder:text-gray-500 text-white focus:bg-gray-800"
                placeholder="https://github.com/username"
              />
              <div className="absolute -top-2.5 left-2 px-1 bg-gray-900 rounded-full text-[10px] font-medium text-white border border-gray-700">
                GITHUB
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}