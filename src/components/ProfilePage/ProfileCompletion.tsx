// ProfileCompletion.tsx
import React from 'react';

interface ProfileCompletionProps {
  completionPercentage: number;
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ completionPercentage }) => (
  <div className="bg-white rounded-lg shadow-sm mb-8 p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900">Profile Completion</h2>
      <span className="text-sm text-gray-600">{completionPercentage}% complete</span>
    </div>
    <div className="bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
          completionPercentage >= 80 ? 'bg-green-500' : 
          completionPercentage >= 50 ? 'bg-blue-600' : 'bg-yellow-500'
        }`} 
        style={{ width: `${completionPercentage}%` }}
      />
    </div>
    <p className="text-sm text-gray-600 mt-2">
      Complete your profile to increase your visibility to employers
    </p>
  </div>
);

export default ProfileCompletion;
