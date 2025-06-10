import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Download, 
  Edit3,
  Copy,
  Trash2,
  Eye,
  Share2,
  TrendingUp,
  Award,
  Users,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useResumes } from '../hooks/useResumes';

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

  const stats = [
    {
      label: 'Total Resumes',
      value: resumes.length.toString(),
      icon: FileText,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Total Downloads',
      value: resumes.reduce((sum, resume) => sum + (resume.download_count || 0), 0).toString(),
      icon: Download,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'Profile Views',
      value: resumes.reduce((sum, resume) => sum + (resume.view_count || 0), 0).toString(),
      icon: Eye,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      label: 'Subscription',
      value: profile?.subscription_tier || 'Free',
      icon: Award,
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const tips = [
    {
      title: 'Optimize for ATS',
      description: 'Use keywords from job descriptions to improve your resume\'s visibility.',
      icon: TrendingUp
    },
    {
      title: 'Keep it Concise',
      description: 'Aim for 1-2 pages and focus on your most relevant experiences.',
      icon: FileText
    },
    {
      title: 'Quantify Achievements',
      description: 'Use numbers and metrics to demonstrate your impact and results.',
      icon: Award
    }
  ];

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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2 capitalize">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Resumes */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">My Resumes</h2>
                  <Link
                    to="/resume-builder"
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Resume</span>
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {resumesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your resumes...</p>
                  </div>
                ) : resumes.length > 0 ? (
                  <div className="space-y-4">
                    {resumes.map((resume) => (
                      <div key={resume.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{resume.title}</h3>
                              <p className="text-sm text-gray-600">
                                Last modified: {new Date(resume.last_modified).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/resume-builder/${resume.id}`}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDuplicateResume(resume.id)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Duplicate"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Share">
                              <Share2 className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Download">
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteResume(resume.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Download className="h-4 w-4" />
                            <span>{resume.download_count || 0} downloads</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{resume.view_count || 0} views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>Created {new Date(resume.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
                    <p className="text-gray-600 mb-6">Create your first professional resume to get started.</p>
                    <Link
                      to="/resume-builder"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Your First Resume
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/resume-builder"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Create New Resume</span>
                </Link>
                <Link
                  to="/templates"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Browse Templates</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Update Profile</span>
                </Link>
              </div>
            </div>

            {/* Resume Tips */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Tips</h3>
              <div className="space-y-4">
                {tips.map((tip, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start space-x-2">
                      <tip.icon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{tip.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade Prompt */}
            {profile?.subscription_tier === 'free' && (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Upgrade to Pro</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Unlock premium templates, advanced features, and unlimited downloads.
                </p>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm">
                  Upgrade Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};