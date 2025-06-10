import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useResumes } from '../hooks/useResumes';
import { StatsGrid } from '../components/Dashboard/StatsGrid';
import { ResumeList } from '../components/Dashboard/ResumeList';
import { QuickActions } from '../components/Dashboard/QuickActions';
import { ResumeTips } from '../components/Dashboard/ResumeTips';
import { UpgradePrompt } from '../components/Dashboard/UpgradePrompt';

export const DashboardPage: React.FC = () => {
  const { profile, user, isLoading: authLoading } = useAuth();
  const { resumes, isLoading: resumesLoading, duplicateResume, deleteResume, error } = useResumes();

  const handleDuplicateResume = async (id: string) => {
    try {
      await duplicateResume(id);
    } catch (error) {
      console.error('Failed to duplicate resume:', error);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResume(id);
      } catch (error) {
        console.error('Failed to delete resume:', error);
      }
    }
  };

  // Stats and tips moved to their respective components

  // Show loading only if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, this shouldn't happen due to ProtectedRoute
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access your dashboard.</p>
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your resumes and track your progress.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            <p className="font-medium">Error loading data:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <StatsGrid resumes={resumes} profile={profile ?? undefined} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ResumeList
              resumes={resumes}
              isLoading={resumesLoading}
              onDuplicate={handleDuplicateResume}
              onDelete={handleDeleteResume}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <QuickActions />
            <ResumeTips />
            <UpgradePrompt profile={profile ?? undefined} />
          </div>
        </div>
      </div>
    </div>
  );
};