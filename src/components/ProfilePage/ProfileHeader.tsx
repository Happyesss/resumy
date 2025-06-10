// ProfileHeader.tsx
import React from 'react';
import { Save, X, Edit3, Camera, UserIcon } from 'lucide-react';

interface ProfileHeaderProps {
  profileData: any;
  user: any;
  isEditing: boolean;
  loading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleProfileImageClick: () => void;
  handleProfileImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setIsEditing: (val: boolean) => void;
  saveAllProfileData: () => void;
  setSaveSuccess: (val: boolean) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileData,
  user,
  isEditing,
  loading,
  fileInputRef,
  handleProfileImageClick,
  handleProfileImageUpload,
  setIsEditing,
  saveAllProfileData
}) => (
  <div className="bg-white rounded-lg shadow-sm mb-8">
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer" onClick={handleProfileImageClick}>
              {profileData.profileImage ? (
                <img 
                  src={profileData.profileImage} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <button 
              onClick={handleProfileImageClick}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="hidden"
            />
            {loading && (
              <div className="absolute inset-0 bg-gray-200 bg-opacity-70 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profileData.firstName} {profileData.lastName}
            </h1>
            <p className="text-gray-600">{user?.role === 'jobseeker' ? 'Job Seeker' : 'Employer'}</p>
            <p className="text-gray-500">{profileData.location}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {isEditing && (
            <button
              onClick={saveAllProfileData}
              disabled={loading}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
            >
              <Save className="h-4 w-4" />
              <span>Save All Changes</span>
            </button>
          )}
          <button
            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileHeader;
