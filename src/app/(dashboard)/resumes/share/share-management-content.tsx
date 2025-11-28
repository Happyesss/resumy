"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    ArrowLeft, BarChart3, Calendar, Check, Clock, Copy, ExternalLink, Eye, FileText, Globe, Link2, Lock, Monitor, RefreshCw, Share2, Smartphone,
    Tablet
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

export function ShareManagementContent({
  resumes,
  shares: initialShares,
  userId,
  deviceAnalytics,
}: ShareManagementContentProps) {
  const [shares, setShares] = useState<Share[]>(initialShares);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  
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
      }
    } catch (error) {
      console.error("Failed to delete share:", error);
    }
    setLoading(null);
  };

  // Calculate total stats
  const totalViews = shares.reduce((sum, s) => sum + s.view_count, 0);
  const activeShares = shares.filter((s) => s.is_active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/home"
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Share Your Resumes
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Create public links to share your resumes with anyone
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          icon={Eye}
          label="Total Views"
          value={totalViews}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatsCard
          icon={Link2}
          label="Active Links"
          value={activeShares}
          gradient="from-purple-500 to-pink-500"
        />
        <StatsCard
          icon={FileText}
          label="Total Resumes"
          value={resumes.length}
          gradient="from-orange-500 to-red-500"
        />
      </div>

      {/* Resume List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Your Resumes</h2>

        {resumes.length === 0 ? (
          <Card className="p-8 bg-white/5 border-white/10 text-center">
            <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No resumes yet. Create one to start sharing!</p>
            <Link href="/home">
              <Button className="mt-4">Create Resume</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4">
            {resumes.map((resume) => {
              const share = getShareForResume(resume.id);
              const isLoading = loading === resume.id || loading === share?.id;

              return (
                <Card
                  key={resume.id}
                  className="p-5 bg-white/5 border-white/10 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Resume Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-white truncate">
                            {resume.name}
                          </h3>
                          <p className="text-sm text-slate-400 truncate">
                            {resume.first_name} {resume.last_name}
                            {resume.target_role && ` • ${resume.target_role}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Share Status & Actions */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      {share ? (
                        <>
                          {/* View Count */}
                          <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-white/5 text-sm">
                            <Eye className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{share.view_count}</span>
                          </div>

                          {/* Status Badge */}
                          <button
                            onClick={() => handleToggleStatus(share.id, share.is_active)}
                            disabled={isLoading}
                            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${share.is_active
                                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              }`}
                          >
                            {share.is_active ? (
                              <>
                                <Globe className="w-4 h-4" />
                                <span className="hidden sm:inline">Active</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4" />
                                <span className="hidden sm:inline">Disabled</span>
                              </>
                            )}
                          </button>

                          {/* Copy Link */}
                          <button
                            onClick={() => copyLink(share.share_id)}
                            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 text-sm font-medium transition-colors"
                          >
                            {copiedId === share.share_id ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span className="hidden sm:inline">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                <span className="hidden sm:inline">Copy Link</span>
                              </>
                            )}
                          </button>

                          {/* Open Link */}
                          <a
                            href={`${shareBaseUrl}/r/${share.share_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Delete */}
                          <DeleteShareDialog
                            shareId={share.id}
                            resumeName={resume.name || `${resume.first_name} ${resume.last_name}`}
                            onConfirm={handleDeleteShare}
                            isLoading={isLoading}
                          />
                        </>
                      ) : (
                        <Button
                          onClick={() => handleCreateShare(resume.id)}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          {isLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Share2 className="w-4 h-4 mr-2" />
                          )}
                          Create Share Link
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Share Details (if exists) */}
                  {share && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1 truncate max-w-full">
                          <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{shareBaseUrl}/r/{share.share_id}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          Created {new Date(share.created_at).toLocaleDateString('en-US')}
                        </span>
                        {share.last_viewed_at && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                            Last viewed {new Date(share.last_viewed_at).toLocaleDateString('en-US')}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Analytics Section (if has shares) */}
      {shares.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Analytics Overview
          </h2>

          <Card className="p-6 bg-white/5 border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Device Breakdown - Real Data */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">Device Types</h3>
                <div className="space-y-2">
                  {deviceAnalytics.length > 0 ? (
                    deviceAnalytics.map((device) => {
                      const icon = device.device_type === "mobile"
                        ? Smartphone
                        : device.device_type === "tablet"
                          ? Tablet
                          : Monitor;
                      const label = device.device_type.charAt(0).toUpperCase() + device.device_type.slice(1);
                      return (
                        <DeviceRow
                          key={device.device_type}
                          icon={icon}
                          label={label}
                          percentage={device.percentage}
                        />
                      );
                    })
                  ) : (
                    <p className="text-sm text-slate-500">No data yet</p>
                  )}
                </div>
              </div>

              {/* Top Resumes */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">Top Viewed</h3>
                <div className="space-y-2">
                  {shares
                    .sort((a, b) => b.view_count - a.view_count)
                    .slice(0, 3)
                    .map((share) => {
                      const resume = resumes.find((r) => r.id === share.resume_id);
                      return (
                        <div
                          key={share.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-slate-300 truncate">
                            {resume?.name || "Unknown"}
                          </span>
                          <span className="text-slate-500">{share.view_count} views</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg views per resume</span>
                    <span className="text-white">
                      {shares.length > 0
                        ? Math.round(totalViews / shares.length)
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Most recent view</span>
                    <span className="text-white">
                      {shares.some((s) => s.last_viewed_at)
                        ? new Date(
                          Math.max(
                            ...shares
                              .filter((s) => s.last_viewed_at)
                              .map((s) => new Date(s.last_viewed_at!).getTime())
                          )
                        ).toLocaleDateString('en-US')
                        : "Never"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// Stats Card Component
function StatsCard({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  gradient: string;
}) {
  return (
    <Card className="p-4 bg-white/5 border-white/10">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
          <p className="text-sm text-slate-400">{label}</p>
        </div>
      </div>
    </Card>
  );
}

// Device Row Component
function DeviceRow({
  icon: Icon,
  label,
  percentage,
}: {
  icon: React.ElementType;
  label: string;
  percentage: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-slate-500" />
      <span className="text-sm text-slate-300 flex-1">{label}</span>
      <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-slate-500 w-8 text-right">{percentage}%</span>
    </div>
  );
}
