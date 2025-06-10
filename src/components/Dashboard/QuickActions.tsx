import React from 'react';
import { Plus, FileText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  return (
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
  );
};
