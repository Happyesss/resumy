"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ViewLogs } from "@/components/share/view-logs";
import {
  ArrowLeft,
  BarChart3,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  Link2,
  Lock,
  Monitor,
  RefreshCw,
  Share2,
  Smartphone,
  Tablet,
  TrendingUp,
  Zap,
  Activity,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createShareLink, deleteShare, toggleShareStatus } from "./actions";
import { DeleteShareDialog } from "./delete-share-dialog";

interface Resume {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  target_role: string | null;
  template: string | null;
  created_at: string;
  updated_at: string;
}

interface Share {
  id: string;
  resume_id: string;
  share_id: string;
  is_active: boolean;
  is_public: boolean;
  allow_indexing: boolean;
  view_count: number;
  custom_slug: string | null;
  expires_at: string | null;
  created_at: string;
  last_viewed_at: string | null;
}

interface DeviceAnalytics {
  device_type: string;
  count: number;
  percentage: number;
}

interface ShareManagementContentProps {
  resumes: Resume[];
  shares: Share[];
  userId: string;
  deviceAnalytics: DeviceAnalytics[];
}

function _getCountryFlag(country: string): string {
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

export function ShareManagementContent({
  resumes,
  shares: initialShares,
  userId: _userId,
  deviceAnalytics,
}: ShareManagementContentProps) {
  const [shares, setShares] = useState<Share[]>(initialShares);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [expandedResumeId, setExpandedResumeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Use environment variable or fallback for development
  const shareBaseUrl = process.env.NEXT_PUBLIC_SHARE_URL || "https://share.resumy.live";

  // Get share for a resume
  const getShareForResume = (resumeId: string) => {
    return shares.find((s) => s.resume_id === resumeId);
  };

  // Copy link to clipboard
  const copyLink = async (shareId: string) => {
    const url = `${shareBaseUrl}/r/${shareId}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(shareId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Create new share link
  const handleCreateShare = async (resumeId: string) => {
    setLoading(resumeId);
    try {
      const result = await createShareLink(resumeId);
      if (result.success && result.share) {
        setShares([...shares, result.share]);
      }
    } catch (error) {
      console.error("Failed to create share:", error);
    }
    setLoading(null);
  };

  // Toggle share active status
  const handleToggleStatus = async (shareId: string, currentStatus: boolean) => {
    setLoading(shareId);
    try {
      const result = await toggleShareStatus(shareId, !currentStatus);
      if (result.success) {
        setShares(
          shares.map((s) =>
            s.id === shareId ? { ...s, is_active: !currentStatus } : s
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
    setLoading(null);
  };

  // Delete share
  const handleDeleteShare = async (shareId: string) => {
    setLoading(shareId);
    try {
      const result = await deleteShare(shareId);
      if (result.success) {
        setShares(shares.filter((s) => s.id !== shareId));
        if (expandedResumeId) {
          const deletedShare = shares.find(s => s.id === shareId);
          if (deletedShare?.resume_id === expandedResumeId) {
            setExpandedResumeId(null);
          }
        }
      }
    } catch (error) {
      console.error("Failed to delete share:", error);
    }
    setLoading(null);
  };

  // Filter resumes based on active tab
  const filteredResumes = resumes.filter(resume => {
    const share = getShareForResume(resume.id);
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return share?.is_active;
    if (activeTab === 'inactive') return share && !share.is_active;
    return true;
  });

  // Calculate total stats
  const totalViews = shares.reduce((sum, s) => sum + s.view_count, 0);
  const activeShares = shares.filter((s) => s.is_active).length;
  const avgViews = shares.length > 0 ? Math.round(totalViews / shares.length) : 0;

  // Get recent activity
  const recentViews = shares
    .filter(s => s.last_viewed_at)
    .sort((a, b) => new Date(b.last_viewed_at!).getTime() - new Date(a.last_viewed_at!).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen pb-20">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 p-4 sm:p-6 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent opacity-60" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative">
            <Link
              href="/home"
              className="inline-flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 md:mb-8 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs sm:text-sm text-slate-300 hover:text-white group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/25">
                    <Share2 className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
                      Share & Analytics
                    </h1>
                    <p className="text-slate-400 mt-0.5 sm:mt-1 text-xs sm:text-sm">
                      Create shareable links and track who&apos;s viewing your resumes
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats Pills */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10">
                  <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-400" />
                  <span className="text-xs sm:text-sm text-white font-medium">{totalViews}</span>
                  <span className="text-[10px] sm:text-xs text-slate-400">views</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10">
                  <Link2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-green-400" />
                  <span className="text-xs sm:text-sm text-white font-medium">{activeShares}</span>
                  <span className="text-[10px] sm:text-xs text-slate-400">active</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10">
                  <FileText className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-purple-400" />
                  <span className="text-xs sm:text-sm text-white font-medium">{resumes.length}</span>
                  <span className="text-[10px] sm:text-xs text-slate-400">resumes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Resume List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center gap-1.5 sm:gap-2 p-0.5 sm:p-1 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 w-full sm:w-auto">
                {(['all', 'active', 'inactive'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === 'active' && activeShares > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">
                        {activeShares}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <span className="text-sm text-slate-500">
                {filteredResumes.length} {filteredResumes.length === 1 ? 'resume' : 'resumes'}
              </span>
            </div>

            {/* Resume Cards */}
            {resumes.length === 0 ? (
              <Card className="relative overflow-hidden border-white/10 bg-white/5 p-12 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent opacity-60" />
                
                <div className="relative space-y-4">
                  <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-purple-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">No resumes yet</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                      Create your first resume to start sharing it with the world
                    </p>
                  </div>
                  <Link href="/home">
                    <Button className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <Zap className="w-4 h-4 mr-2" />
                      Create Your First Resume
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredResumes.map((resume) => {
                  const share = getShareForResume(resume.id);
                  const isLoading = loading === resume.id || loading === share?.id;
                  const isExpanded = expandedResumeId === resume.id;

                  return (
                    <Card
                      key={resume.id}
                      className={`group relative overflow-hidden border-white/10 bg-white/5 transition-all duration-300 ${
                        isExpanded ? 'ring-1 ring-pink-500/30' : 'hover:bg-white/[0.07] hover:border-white/20'
                      }`}
                    >
                      {/* Background gradient effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Main Card Content */}
                      <div className="relative p-3 sm:p-4 md:p-5">
                        <div className="flex flex-col gap-3 sm:gap-4">
                          {/* Resume Info */}
                          <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 min-w-0 flex-1">
                            <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                              share?.is_active
                                ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30'
                                : share
                                  ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30'
                                  : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20'
                            }`}>
                              <FileText className={`w-6 h-6 ${
                                share?.is_active ? 'text-green-400' : share ? 'text-red-400' : 'text-purple-400'
                              }`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-white truncate">
                                  {resume.name}
                                </h3>
                                {share?.is_active && (
                                  <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                    LIVE
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-400">
                                <span className="truncate">
                                  {resume.first_name} {resume.last_name}
                                </span>
                                {resume.target_role && (
                                  <>
                                    <span className="text-slate-600">•</span>
                                    <span className="truncate text-pink-400">{resume.target_role}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Stats & Actions */}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            {share && (
                              <>
                                {/* View Count */}
                                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                  <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-400" />
                                  <span className="font-semibold text-blue-400 text-xs sm:text-sm">{share.view_count}</span>
                                  <span className="text-blue-400/60 text-[10px] sm:text-xs hidden sm:inline">views</span>
                                </div>

                                {/* Toggle Status */}
                                <button
                                  onClick={() => handleToggleStatus(share.id, share.is_active)}
                                  disabled={isLoading}
                                  className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                                    share.is_active
                                      ? "bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20"
                                      : "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                                  }`}
                                >
                                  {share.is_active ? (
                                    <>
                                      <Globe className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                                      <span className="hidden sm:inline">Active</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                                      <span className="hidden sm:inline">Disabled</span>
                                    </>
                                  )}
                                </button>

                                {/* Copy Link */}
                                <Button
                                  onClick={() => copyLink(share.share_id)}
                                  variant="outline"
                                  size="sm"
                                  className="border-pink-500/30 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 hover:border-pink-500/50 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
                                >
                                  {copiedId === share.share_id ? (
                                    <>
                                      <Check className="w-3.5 sm:w-4 h-3.5 sm:h-4 sm:mr-1.5" />
                                      <span className="hidden sm:inline">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 sm:w-4 h-3.5 sm:h-4 sm:mr-1.5" />
                                      <span className="hidden sm:inline">Copy</span>
                                    </>
                                  )}
                                </Button>

                                {/* Open Link */}
                                <a
                                  href={`${shareBaseUrl}/r/${share.share_id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-all"
                                >
                                  <ExternalLink className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                                </a>

                                {/* Expand/View Logs */}
                                <button
                                  onClick={() => setExpandedResumeId(isExpanded ? null : resume.id)}
                                  className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                                    isExpanded
                                      ? 'bg-pink-500/20 border border-pink-500/30 text-pink-400'
                                      : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                  }`}
                                >
                                  <Activity className="w-4 h-4" />
                                </button>

                                {/* Delete */}
                                <DeleteShareDialog
                                  shareId={share.id}
                                  resumeName={resume.name || `${resume.first_name} ${resume.last_name}`}
                                  onConfirm={handleDeleteShare}
                                  isLoading={isLoading}
                                />
                              </>
                            )}

                            {!share && (
                              <Button
                                onClick={() => handleCreateShare(resume.id)}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg shadow-pink-500/25"
                              >
                                {isLoading ? (
                                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                  <Share2 className="w-4 h-4 mr-2" />
                                )}
                                Create Link
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Share Link URL */}
                        {share && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 px-2.5 sm:px-3 py-2 rounded-lg bg-black/30 border border-white/5 text-xs">
                            <Link2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-500 flex-shrink-0" />
                            <span className="text-slate-400 truncate flex-1 font-mono text-[10px] sm:text-xs break-all">
                              {shareBaseUrl}/r/{share.share_id}
                            </span>
                            {share.last_viewed_at && (
                              <span className="flex items-center gap-1 text-slate-500 flex-shrink-0 text-[10px] sm:text-xs">
                                <Clock className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                                <span className="hidden sm:inline">Last viewed</span>
                                <span className="sm:hidden">Last</span>
                                {' '}{new Date(share.last_viewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Expanded View Logs Section */}
                      {isExpanded && share && (
                        <div className="border-t border-white/10 bg-black/20 p-3 sm:p-4 md:p-5">
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h4 className="text-sm font-medium text-white flex items-center gap-2">
                              <Activity className="w-4 h-4 text-pink-400" />
                              View Activity Log
                            </h4>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setExpandedResumeId(null);
                              }}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer relative z-20"
                            >
                              <X className="w-4 h-4 pointer-events-none" />
                            </button>
                          </div>
                          <ViewLogs shareId={share.share_id} resumeName={resume.name} />
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column - Analytics Sidebar */}
          <div className="space-y-6">
            {/* Overview Card */}
            <Card className="relative overflow-hidden border-white/10 bg-white/5 p-4 sm:p-5 md:p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5 opacity-60" />
              
              <div className="relative">
                <h3 className="text-xs sm:text-sm font-medium text-slate-400 mb-3 sm:mb-4 flex items-center gap-2">
                  <BarChart3 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  Overview
                </h3>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-0.5 sm:space-y-1">
                    <p className="text-2xl sm:text-3xl font-bold text-white">{totalViews}</p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Total Views</p>
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <p className="text-2xl sm:text-3xl font-bold text-white">{avgViews}</p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Avg per Resume</p>
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <p className="text-2xl sm:text-3xl font-bold text-green-400">{activeShares}</p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Active Links</p>
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <p className="text-2xl sm:text-3xl font-bold text-slate-400">{shares.length - activeShares}</p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Inactive Links</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Device Analytics */}
            {deviceAnalytics.length > 0 && (
              <Card className="relative overflow-hidden border-white/10 bg-white/5 p-4 sm:p-5 md:p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-60" />
                
                <div className="relative">
                  <h3 className="text-xs sm:text-sm font-medium text-slate-400 mb-3 sm:mb-4 flex items-center gap-2">
                    <Monitor className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                    Devices
                  </h3>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {deviceAnalytics.map((device) => {
                      const Icon = device.device_type === "mobile"
                        ? Smartphone
                        : device.device_type === "tablet"
                          ? Tablet
                          : Monitor;
                      const label = device.device_type.charAt(0).toUpperCase() + device.device_type.slice(1);
                      
                      return (
                        <div key={device.device_type} className="space-y-1.5 sm:space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-400" />
                              <span className="text-xs sm:text-sm text-slate-300">{label}</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <span className="text-[10px] sm:text-xs text-slate-500">{device.count}</span>
                              <span className="text-xs sm:text-sm font-medium text-white">{device.percentage}%</span>
                            </div>
                          </div>
                          <div className="h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                device.device_type === 'mobile' 
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                  : device.device_type === 'tablet'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                    : 'bg-gradient-to-r from-slate-400 to-slate-500'
                              }`}
                              style={{ width: `${device.percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            )}

            {/* Top Performing */}
            {shares.length > 0 && (
              <Card className="relative overflow-hidden border-white/10 bg-white/5 p-4 sm:p-5 md:p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 opacity-60" />
                
                <div className="relative">
                  <h3 className="text-xs sm:text-sm font-medium text-slate-400 mb-3 sm:mb-4 flex items-center gap-2">
                    <TrendingUp className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                    Top Performing
                  </h3>
                  
                  <div className="space-y-2.5 sm:space-y-3">
                    {shares
                      .sort((a, b) => b.view_count - a.view_count)
                      .slice(0, 5)
                      .map((share, index) => {
                        const resume = resumes.find((r) => r.id === share.resume_id);
                        const maxViews = shares[0]?.view_count || 1;
                        const percentage = Math.round((share.view_count / maxViews) * 100);
                        
                        return (
                          <div key={share.id} className="space-y-1.5 sm:space-y-2">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className={`flex items-center justify-center w-5 sm:w-6 h-5 sm:h-6 rounded-full text-[10px] sm:text-xs font-bold ${
                                index === 0 ? "bg-yellow-500/20 text-yellow-400" :
                                index === 1 ? "bg-slate-400/20 text-slate-400" :
                                index === 2 ? "bg-orange-500/20 text-orange-400" :
                                "bg-white/10 text-slate-500"
                              }`}>
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate">{resume?.name || "Unknown"}</p>
                              </div>
                              <span className="text-sm font-medium text-slate-400">{share.view_count}</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden ml-9">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500/50 to-orange-500/50 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </Card>
            )}

            {/* Recent Activity */}
            {recentViews.length > 0 && (
              <Card className="relative overflow-hidden border-white/10 bg-white/5 p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-60" />
                
                <div className="relative">
                  <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Recent Activity
                  </h3>
                  
                  <div className="space-y-3">
                    {recentViews.map((share) => {
                      const resume = resumes.find((r) => r.id === share.resume_id);
                      return (
                        <div key={share.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{resume?.name || "Unknown"}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(share.last_viewed_at!).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <Eye className="w-4 h-4 text-slate-500" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
