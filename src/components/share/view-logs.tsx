"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Globe,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

interface ViewLog {
  id: string;
  viewedAt: string;
  deviceType: string;
  browser: string;
  country: string;
  referrer: string;
  os: string;
}

interface ViewLogsProps {
  shareId: string;
  resumeName: string;
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
    'PT': 'Portugal',
    'Portugal': 'Portugal',
    'GR': 'Greece',
    'Greece': 'Greece',
    'TR': 'Turkey',
    'Turkey': 'Turkey',
    'IL': 'Israel',
    'Israel': 'Israel',
    'AE': 'United Arab Emirates',
    'UAE': 'United Arab Emirates',
    'SA': 'Saudi Arabia',
    'Saudi Arabia': 'Saudi Arabia',
    'EG': 'Egypt',
    'Egypt': 'Egypt',
    'NG': 'Nigeria',
    'Nigeria': 'Nigeria',
    'KE': 'Kenya',
    'Kenya': 'Kenya',
    'PK': 'Pakistan',
    'Pakistan': 'Pakistan',
    'BD': 'Bangladesh',
    'Bangladesh': 'Bangladesh',
    'ID': 'Indonesia',
    'Indonesia': 'Indonesia',
    'MY': 'Malaysia',
    'Malaysia': 'Malaysia',
    'PH': 'Philippines',
    'Philippines': 'Philippines',
    'TH': 'Thailand',
    'Thailand': 'Thailand',
    'VN': 'Vietnam',
    'Vietnam': 'Vietnam',
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
    'Portugal': '🇵🇹',
    'PT': '🇵🇹',
    'Greece': '🇬🇷',
    'GR': '🇬🇷',
    'Turkey': '🇹🇷',
    'TR': '🇹🇷',
    'Israel': '🇮🇱',
    'IL': '🇮🇱',
    'UAE': '🇦🇪',
    'AE': '🇦🇪',
    'Saudi Arabia': '🇸🇦',
    'SA': '🇸🇦',
    'Egypt': '🇪🇬',
    'EG': '🇪🇬',
    'Nigeria': '🇳🇬',
    'NG': '🇳🇬',
    'Kenya': '🇰🇪',
    'KE': '🇰🇪',
    'Pakistan': '🇵🇰',
    'PK': '🇵🇰',
    'Bangladesh': '🇧🇩',
    'BD': '🇧🇩',
    'Indonesia': '🇮🇩',
    'ID': '🇮🇩',
    'Malaysia': '🇲🇾',
    'MY': '🇲🇾',
    'Philippines': '🇵🇭',
    'PH': '🇵🇭',
    'Thailand': '🇹🇭',
    'TH': '🇹🇭',
    'Vietnam': '🇻🇳',
    'VN': '🇻🇳',
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

// Browser icon/text helper
function getBrowserIcon(browser: string) {
  const lowerBrowser = browser?.toLowerCase() || '';
  if (lowerBrowser.includes('chrome')) return 'Chrome';
  if (lowerBrowser.includes('safari')) return 'Safari';
  if (lowerBrowser.includes('firefox')) return 'Firefox';
  if (lowerBrowser.includes('edge')) return 'Edge';
  if (lowerBrowser.includes('opera')) return 'Opera';
  return browser || 'Unknown';
}

// Time formatting helpers
function timeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ViewLogs({ shareId, resumeName: _resumeName }: ViewLogsProps) {
  const [logs, setLogs] = useState<ViewLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch(`/api/resumes/share/view-logs?shareId=${shareId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setLogs(json.logs || []);
          }
        }
      } catch (e) {
        console.error('Failed to fetch view logs:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [shareId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-white/5 rounded-lg" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-white/5 mb-4">
          <Eye className="h-6 w-6 text-slate-500" />
        </div>
        <p className="text-sm text-slate-400">No views recorded yet</p>
        <p className="text-xs text-slate-500 mt-1">Views will appear here when someone visits your shared resume</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayLogs = logs.slice(startIndex, endIndex);

  // Group logs by date for better organization
  const groupedLogs = displayLogs.reduce((acc, log) => {
    const date = new Date(log.viewedAt).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as Record<string, ViewLog[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groupedLogs).map(([date, dateLogs]) => (
        <div key={date} className="space-y-2">
          <div className="flex items-center gap-2 py-2">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs font-medium text-slate-400">{date}</span>
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-slate-500">{dateLogs.length} view{dateLogs.length !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="space-y-2">
            {dateLogs.map((log) => (
              <div
                key={log.id}
                className="group relative overflow-hidden rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all p-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative flex items-start gap-4">
                  {/* Device Icon */}
                  <div className={cn(
                    "p-2.5 rounded-xl flex-shrink-0",
                    log.deviceType === 'mobile' ? "bg-blue-500/10" :
                    log.deviceType === 'tablet' ? "bg-purple-500/10" :
                    "bg-slate-500/10"
                  )}>
                    <DeviceIcon
                      deviceType={log.deviceType}
                      className={cn(
                        "h-5 w-5",
                        log.deviceType === 'mobile' ? "text-blue-400" :
                        log.deviceType === 'tablet' ? "text-purple-400" :
                        "text-slate-400"
                      )}
                    />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Location & Device Row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white">
                        <span title={getFullCountryName(log.country)} className="cursor-help">
                          {getCountryFlag(log.country)}
                        </span>
                        <span>{log.country}</span>
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-sm text-slate-400 capitalize">
                        {log.deviceType}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-sm text-slate-400">
                        {getBrowserIcon(log.browser)}
                      </span>
                    </div>

                    {/* Details Row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      {log.os && (
                        <>
                          <span>{log.os}</span>
                          <span className="text-slate-700">•</span>
                        </>
                      )}
                      {log.referrer && log.referrer !== 'Direct' && log.referrer !== 'direct' ? (
                        <span className="inline-flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          via {log.referrer}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          Direct visit
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-medium text-slate-300">
                      {timeAgo(log.viewedAt)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(log.viewedAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/5 relative z-10">
          <div className="text-xs text-slate-500 order-2 sm:order-1">
            Showing {startIndex + 1}-{Math.min(endIndex, logs.length)} of {logs.length} views
          </div>
          
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentPage(prev => Math.max(1, prev - 1));
              }}
              disabled={currentPage === 1}
              className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer relative z-10"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4 text-slate-400 pointer-events-none" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                const showPage = 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1);
                
                const showEllipsis = 
                  (page === currentPage - 2 && currentPage > 3) ||
                  (page === currentPage + 2 && currentPage < totalPages - 2);
                
                if (showEllipsis) {
                  return (
                    <span key={page} className="px-2 text-slate-600 select-none">
                      ...
                    </span>
                  );
                }
                
                if (!showPage) return null;
                
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentPage(page);
                    }}
                    className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all active:scale-95 cursor-pointer relative z-10 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentPage(prev => Math.min(totalPages, prev + 1));
              }}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer relative z-10"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4 text-slate-400 pointer-events-none" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Summary stats component for the view logs
export function ViewLogsSummary({ logs }: { logs: ViewLog[] }) {
  if (logs.length === 0) return null;

  // Calculate stats
  const deviceBreakdown = logs.reduce((acc, log) => {
    const device = log.deviceType || 'desktop';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const countryBreakdown = logs.reduce((acc, log) => {
    const country = log.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCountries = Object.entries(countryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {/* Device breakdown */}
      <Card className="p-4 bg-white/5 border-white/10">
        <h4 className="text-xs font-medium text-slate-400 mb-3 flex items-center gap-2">
          <Monitor className="h-3.5 w-3.5" />
          Devices
        </h4>
        <div className="space-y-2">
          {Object.entries(deviceBreakdown).map(([device, count]) => (
            <div key={device} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DeviceIcon deviceType={device} className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-300 capitalize">{device}</span>
              </div>
              <span className="text-sm font-medium text-white">{count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Country breakdown */}
      <Card className="p-4 bg-white/5 border-white/10">
        <h4 className="text-xs font-medium text-slate-400 mb-3 flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />
          Top Locations
        </h4>
        <div className="space-y-2">
          {topCountries.map(([country, count]) => (
            <div key={country} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span title={getFullCountryName(country)} className="cursor-help">
                  {getCountryFlag(country)}
                </span>
                <span className="text-sm text-slate-300">{country}</span>
              </div>
              <span className="text-sm font-medium text-white">{count}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
