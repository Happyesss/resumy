'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Bell, Eye, Globe, Monitor, Smartphone, Tablet } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

interface ViewNotification {
  id: string;
  shareId: string;
  resumeId: string;
  resumeName: string;
  viewedAt: string;
  deviceType: string;
  country: string;
  browser: string;
  referrer: string;
}

interface NotificationData {
  notifications: ViewNotification[];
  unviewedCount: number;
  totalViews: number;
}

// Get full country name from code or abbreviation
function getFullCountryName(country: string): string {
  const countryNames: Record<string, string> = {
    'US': 'United States',
    'USA': 'United States',
    'United States': 'United States',
    'GB': 'United Kingdom',
    'UK': 'United Kingdom',
    'United Kingdom': 'United Kingdom',
    'CA': 'Canada',
    'Canada': 'Canada',
    'AU': 'Australia',
    'Australia': 'Australia',
    'DE': 'Germany',
    'Germany': 'Germany',
    'FR': 'France',
    'France': 'France',
    'IN': 'India',
    'India': 'India',
    'JP': 'Japan',
    'Japan': 'Japan',
    'CN': 'China',
    'China': 'China',
    'BR': 'Brazil',
    'Brazil': 'Brazil',
    'NL': 'Netherlands',
    'Netherlands': 'Netherlands',
    'SG': 'Singapore',
    'Singapore': 'Singapore',
    'ES': 'Spain',
    'Spain': 'Spain',
    'IT': 'Italy',
    'Italy': 'Italy',
    'MX': 'Mexico',
    'Mexico': 'Mexico',
    'KR': 'South Korea',
    'Korea': 'South Korea',
    'South Korea': 'South Korea',
    'RU': 'Russia',
    'Russia': 'Russia',
    'PL': 'Poland',
    'Poland': 'Poland',
    'SE': 'Sweden',
    'Sweden': 'Sweden',
    'CH': 'Switzerland',
    'Switzerland': 'Switzerland',
    'BE': 'Belgium',
    'Belgium': 'Belgium',
    'AT': 'Austria',
    'Austria': 'Austria',
    'NO': 'Norway',
    'Norway': 'Norway',
    'DK': 'Denmark',
    'Denmark': 'Denmark',
    'FI': 'Finland',
    'Finland': 'Finland',
    'IE': 'Ireland',
    'Ireland': 'Ireland',
    'NZ': 'New Zealand',
    'New Zealand': 'New Zealand',
    'ZA': 'South Africa',
    'South Africa': 'South Africa',
    'AR': 'Argentina',
    'Argentina': 'Argentina',
    'CL': 'Chile',
    'Chile': 'Chile',
    'CO': 'Colombia',
    'Colombia': 'Colombia',
    'PE': 'Peru',
    'Peru': 'Peru',
  };
  
  // Try exact match first
  if (countryNames[country]) {
    return countryNames[country];
  }
  
  // Try case-insensitive match
  const lowerCountry = country.toLowerCase();
  for (const [key, name] of Object.entries(countryNames)) {
    if (key.toLowerCase() === lowerCountry) {
      return name;
    }
  }
  
  return country || 'Unknown';
}

// Country flag emoji helper
function getCountryFlag(country: string): string {
  const countryFlags: Record<string, string> = {
    'United States': '🇺🇸',
    'USA': '🇺🇸',
    'US': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'UK': '🇬🇧',
    'GB': '🇬🇧',
    'Canada': '🇨🇦',
    'CA': '🇨🇦',
    'Australia': '🇦🇺',
    'AU': '🇦🇺',
    'Germany': '🇩🇪',
    'DE': '🇩🇪',
    'France': '🇫🇷',
    'FR': '🇫🇷',
    'India': '🇮🇳',
    'IN': '🇮🇳',
    'Japan': '🇯🇵',
    'JP': '🇯🇵',
    'China': '🇨🇳',
    'CN': '🇨🇳',
    'Brazil': '🇧🇷',
    'BR': '🇧🇷',
    'Netherlands': '🇳🇱',
    'NL': '🇳🇱',
    'Singapore': '🇸🇬',
    'SG': '🇸🇬',
    'Spain': '🇪🇸',
    'ES': '🇪🇸',
    'Italy': '🇮🇹',
    'IT': '🇮🇹',
    'Mexico': '🇲🇽',
    'MX': '🇲🇽',
    'South Korea': '🇰🇷',
    'Korea': '🇰🇷',
    'KR': '🇰🇷',
    'Russia': '🇷🇺',
    'RU': '🇷🇺',
    'Poland': '🇵🇱',
    'PL': '🇵🇱',
    'Sweden': '🇸🇪',
    'SE': '🇸🇪',
    'Switzerland': '🇨🇭',
    'CH': '🇨🇭',
    'Belgium': '🇧🇪',
    'BE': '🇧🇪',
    'Austria': '🇦🇹',
    'AT': '🇦🇹',
    'Norway': '🇳🇴',
    'NO': '🇳🇴',
    'Denmark': '🇩🇰',
    'DK': '🇩🇰',
    'Finland': '🇫🇮',
    'FI': '🇫🇮',
    'Ireland': '🇮🇪',
    'IE': '🇮🇪',
    'New Zealand': '🇳🇿',
    'NZ': '🇳🇿',
    'South Africa': '🇿🇦',
    'ZA': '🇿🇦',
    'Argentina': '🇦🇷',
    'AR': '🇦🇷',
    'Chile': '🇨🇱',
    'CL': '🇨🇱',
    'Colombia': '🇨🇴',
    'CO': '🇨🇴',
    'Peru': '🇵🇪',
    'PE': '🇵🇪',
    'Unknown': '🌐',
  };
  
  // Try exact match first
  if (countryFlags[country]) {
    return countryFlags[country];
  }
  
  // Try case-insensitive match
  const lowerCountry = country.toLowerCase();
  for (const [key, flag] of Object.entries(countryFlags)) {
    if (key.toLowerCase() === lowerCountry) {
      return flag;
    }
  }
  
  return '🌐';
}

// Device icon helper
function DeviceIcon({ deviceType, className }: { deviceType: string; className?: string }) {
  switch (deviceType?.toLowerCase()) {
    case 'mobile':
      return <Smartphone className={className} />;
    case 'tablet':
      return <Tablet className={className} />;
    default:
      return <Monitor className={className} />;
  }
}

// Time ago helper
function timeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const LAST_SEEN_KEY = 'resumy_share_notifications_last_seen';

export function ShareNotifications() {
  const [data, setData] = useState<NotificationData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/resumes/share/notifications');
      if (res.ok) {
        const json = await res.json();
        if (json?.success) {
          // Calculate unviewed count based on last seen timestamp
          const lastSeen = localStorage.getItem(LAST_SEEN_KEY);
          let unreadNotifications = json.notifications;
          
          if (lastSeen) {
            const lastSeenDate = new Date(lastSeen);
            unreadNotifications = json.notifications.filter(
              (n: ViewNotification) => new Date(n.viewedAt) > lastSeenDate
            );
          }
          
          // Only set data if there are unread notifications OR if dropdown is open
          if (unreadNotifications.length > 0 || isOpen) {
            setData(json);
          }
          
          setNewCount(unreadNotifications.length);
        }
      }
    } catch (e) {
      console.error('Failed to fetch notifications:', e);
    } finally {
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Mark as seen when dropdown opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Fetch latest data when opening
      fetchNotifications();
      
      if (newCount > 0) {
        // Mark all as seen
        localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());
        setNewCount(0);
      }
    }
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 relative" disabled>
        <Bell className="h-4 w-4 text-slate-400" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative hover:bg-white/10"
        >
          <Bell className={cn(
            "h-4 w-4 transition-colors",
            newCount > 0 ? "text-white" : "text-slate-400"
          )} />
          {newCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-purple-600 text-white border border-purple-500">
              {newCount > 99 ? '99+' : newCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-2rem)] sm:w-[380px] max-h-[480px] overflow-hidden bg-black/95 border border-white/10 rounded-xl shadow-2xl p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 bg-neutral-900">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="p-1 sm:p-1.5 rounded-lg bg-neutral-800 border border-neutral-700">
              <Eye className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-neutral-400" />
            </div>
            <h3 className="font-semibold text-white text-xs sm:text-sm">Resume Views</h3>
          </div>
          {data && (
            <span className="text-xs text-slate-400">
              {data.totalViews} total views
            </span>
          )}
        </div>

        {/* Notifications list */}
        <div className="overflow-y-auto max-h-[360px]">
          {!data || data.notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="p-4 rounded-full bg-neutral-800 border border-neutral-700 mb-4">
                <Eye className="h-8 w-8 text-neutral-500" />
              </div>
              <p className="text-sm text-slate-400 mb-1">No views yet</p>
              <p className="text-xs text-slate-500">
                Share your resume to start tracking views
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {data.notifications.slice(0, 20).map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-neutral-800/50 transition-colors cursor-pointer"
                >
                  {/* Device icon */}
                  <div className="p-1.5 sm:p-2 rounded-lg bg-neutral-800 border border-neutral-700 flex-shrink-0">
                    <DeviceIcon 
                      deviceType={notification.deviceType} 
                      className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-slate-400" 
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                      <p className="text-xs sm:text-sm font-medium text-white truncate">
                        {notification.resumeName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <span title={getFullCountryName(notification.country)} className="cursor-help">
                          {getCountryFlag(notification.country)}
                        </span>
                        <span>{notification.country}</span>
                      </span>
                      <span className="text-slate-600">•</span>
                      <span>{notification.browser}</span>
                    </div>
                    {notification.referrer && notification.referrer !== 'Direct' && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                        <Globe className="h-3 w-3" />
                        <span>from {notification.referrer}</span>
                      </div>
                    )}
                  </div>

                  {/* Time */}
                  <span className="text-[10px] sm:text-xs text-slate-500 flex-shrink-0">
                    {timeAgo(notification.viewedAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {data && data.notifications.length > 0 && (
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-white/10 bg-neutral-900">
            <Link
              href="/resumes/share"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 w-full py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              View All Analytics
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
