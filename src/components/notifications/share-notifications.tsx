'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { 
  Bell, 
  BellOff, 
  Check, 
  Eye, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Trash2, 
  X 
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { 
  useNotifications, 
  requestNotificationPermission, 
  subscribeToPushNotifications,
  isPushSubscribed,
  type Notification 
} from "@/hooks/use-notifications";

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
  
  if (countryNames[country]) {
    return countryNames[country];
  }
  
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
  
  if (countryFlags[country]) {
    return countryFlags[country];
  }
  
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

// Get notification icon based on type
function NotificationIcon({ notification, className }: { notification: Notification; className?: string }) {
  const data = notification.data as Record<string, unknown>;
  
  if (notification.type === 'resume_view') {
    const deviceType = (data?.device_type as string) || 'desktop';
    return <DeviceIcon deviceType={deviceType} className={className} />;
  }
  
  return <Bell className={className} />;
}

export function ShareNotifications() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');

  // Check push notification status
  useEffect(() => {
    const checkPushStatus = async () => {
      if ('Notification' in window) {
        setPushPermission(Notification.permission);
      }
      const subscribed = await isPushSubscribed();
      setPushEnabled(subscribed);
    };
    checkPushStatus();
  }, []);

  // Handle enabling push notifications
  const handleEnablePush = useCallback(async () => {
    const permission = await requestNotificationPermission();
    setPushPermission(permission);
    
    if (permission === 'granted') {
      const success = await subscribeToPushNotifications();
      setPushEnabled(success);
    }
  }, []);

  // Handle opening dropdown - delete read notifications when closing
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    
    // When closing the dropdown, delete all unread notifications
    if (!open && unreadCount > 0) {
      markAllAsRead();
    }
  }, [unreadCount, markAllAsRead]);

  // Handle deleting notification
  const handleDelete = useCallback((notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  }, [deleteNotification]);

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
            unreadCount > 0 ? "text-white" : "text-slate-400"
          )} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-purple-600 text-white border border-purple-500 animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-2rem)] sm:w-[400px] max-h-[520px] overflow-hidden bg-black/95 border border-white/10 rounded-xl shadow-2xl p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 bg-neutral-900">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="p-1 sm:p-1.5 rounded-lg bg-neutral-800 border border-neutral-700">
              <Bell className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-neutral-400" />
            </div>
            <h3 className="font-semibold text-white text-xs sm:text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-purple-400">({unreadCount} new)</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {pushPermission !== 'denied' && !pushEnabled && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEnablePush}
                className="h-7 px-2 text-xs text-slate-400 hover:text-white hover:bg-neutral-800"
                title="Enable push notifications"
              >
                <BellOff className="h-3 w-3 mr-1" />
                Enable
              </Button>
            )}
            {pushEnabled && (
              <span className="text-xs text-green-400 flex items-center gap-1 mr-2">
                <Check className="h-3 w-3" />
                Push on
              </span>
            )}
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsRead()}
                className="h-7 px-2 text-xs text-slate-400 hover:text-white hover:bg-neutral-800"
                title="Clear all notifications"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Notifications list */}
        <div className="overflow-y-auto max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="p-4 rounded-full bg-neutral-800 border border-neutral-700 mb-4">
                <Bell className="h-8 w-8 text-neutral-500" />
              </div>
              <p className="text-sm text-slate-400 mb-1">No notifications yet</p>
              <p className="text-xs text-slate-500">
                Share your resume to start receiving view notifications
              </p>
              {pushPermission !== 'denied' && !pushEnabled && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEnablePush}
                  className="mt-4 text-xs border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  <Bell className="h-3 w-3 mr-1.5" />
                  Enable Push Notifications
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.slice(0, 30).map((notification) => {
                const data = notification.data as Record<string, unknown>;
                const country = (data?.country as string) || 'Unknown';
                const browser = (data?.browser as string) || 'Unknown';
                
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "group flex items-start gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-neutral-800/50 transition-colors cursor-pointer relative",
                      !notification.is_read && "bg-purple-500/5 border-l-2 border-l-purple-500"
                    )}
                  >
                    {/* Notification icon */}
                    <div className={cn(
                      "p-1.5 sm:p-2 rounded-lg border flex-shrink-0 transition-colors",
                      notification.is_read 
                        ? "bg-neutral-800 border-neutral-700" 
                        : "bg-purple-500/10 border-purple-500/30"
                    )}>
                      <NotificationIcon 
                        notification={notification}
                        className={cn(
                          "h-3.5 sm:h-4 w-3.5 sm:w-4",
                          notification.is_read ? "text-slate-400" : "text-purple-400"
                        )}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                        <p className={cn(
                          "text-xs sm:text-sm font-medium truncate",
                          notification.is_read ? "text-slate-300" : "text-white"
                        )}>
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mb-1">
                        {notification.message}
                      </p>
                      {notification.type === 'resume_view' && (
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <span title={getFullCountryName(country)} className="cursor-help">
                              {getCountryFlag(country)}
                            </span>
                            <span>{country}</span>
                          </span>
                          <span className="text-slate-600">•</span>
                          <span>{browser}</span>
                        </div>
                      )}
                    </div>

                    {/* Time and actions */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[10px] sm:text-xs text-slate-500">
                        {timeAgo(notification.created_at)}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleDelete(notification.id, e)}
                          className="p-1 rounded hover:bg-neutral-700 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
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
