import React from 'react';
import { FileText, Download, Eye, Award } from 'lucide-react';
import { Database } from '../../types/database';

type Resume = Database['public']['Tables']['resumes']['Row'];
type Profile = Database['public']['Tables']['users']['Row'];

interface StatsGridProps {
  resumes: Resume[];
  profile?: Profile;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ resumes, profile }) => {
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

  return (
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
  );
};
