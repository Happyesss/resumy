// PersonalInfoTab.tsx
import { FormInput, FormTextarea } from '../FormComponents';
import { Save } from 'lucide-react';

interface PersonalInfoTabProps {
  profileData: any;
  setProfileData: (data: any) => void;
  isEditing: boolean;
  validationErrors: any;
  loading: boolean;
  saveAllProfileData: () => void;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  profileData,
  setProfileData,
  isEditing,
  validationErrors,
  loading,
  saveAllProfileData
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInput
        label="First Name"
        type="text"
        value={profileData.firstName}
        onChange={(e: any) => setProfileData({ ...profileData, firstName: e.target.value })}
        disabled={!isEditing}
        error={validationErrors.personal.firstName}
        required={isEditing}
      />
      <FormInput
        label="Last Name"
        type="text"
        value={profileData.lastName}
        onChange={(e: any) => setProfileData({ ...profileData, lastName: e.target.value })}
        disabled={!isEditing}
        error={validationErrors.personal.lastName}
        required={isEditing}
      />
      <FormInput
        label="Email"
        type="email"
        value={profileData.email}
        onChange={(e: any) => setProfileData({ ...profileData, email: e.target.value })}
        disabled={!isEditing}
        error={validationErrors.personal.email}
        required={isEditing}
      />
      <FormInput
        label="Phone"
        type="tel"
        value={profileData.phone}
        onChange={(e: any) => setProfileData({ ...profileData, phone: e.target.value })}
        disabled={!isEditing}
        error={validationErrors.personal.phone}
        placeholder="+1 (555) 555-5555"
      />
      <FormInput
        label="Location"
        type="text"
        value={profileData.location}
        onChange={(e: any) => setProfileData({ ...profileData, location: e.target.value })}
        disabled={!isEditing}
        error={validationErrors.personal.location}
        placeholder="City, State"
      />
      <FormInput
        label="LinkedIn"
        type="url"
        value={profileData.linkedin}
        onChange={(e: any) => setProfileData({ ...profileData, linkedin: e.target.value })}
        disabled={!isEditing}
        error={validationErrors.personal.linkedin}
        placeholder="linkedin.com/in/username"
      />
      <FormInput
        label="Website"
        type="url"
        value={profileData.website}
        onChange={(e: any) => setProfileData({ ...profileData, website: e.target.value })}
        disabled={!isEditing}
        error={validationErrors.personal.website}
        placeholder="yourwebsite.com"
      />
    </div>
    <FormTextarea
      label="Professional Bio"
      value={profileData.bio}
      onChange={(e: any) => setProfileData({ ...profileData, bio: e.target.value })}
      disabled={!isEditing}
      rows={4}
      placeholder="Tell us about yourself, your experience, and career goals..."
      error={validationErrors.personal.bio}
    />
    {isEditing && (
      <div className="flex justify-end">
        <button
          onClick={saveAllProfileData}
          disabled={loading}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>Save Changes</span>
        </button>
      </div>
    )}
  </div>
);

export default PersonalInfoTab;
