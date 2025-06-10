// EducationTab.tsx
import { Plus, Save, Trash2 } from 'lucide-react';
import { FormInput } from '../FormComponents';
import { ErrorBanner } from '../ErrorBanner';

const EducationTab = ({
  education,
  isEditing,
  loading,
  loadingData,
  validationErrors,
  addEducation,
  updateEducationLocal,
  deleteEducation,
  saveAllProfileData,
  errorMessages,
  setErrorMessages
}: any) => (
  <div className="space-y-6">
    <ErrorBanner 
      message={errorMessages.education || ""}
      onDismiss={() => setErrorMessages((prev: any) => ({ ...prev, education: '' }))} 
    />
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Education</h3>
      <button
        onClick={addEducation}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        disabled={loading || loadingData.education}
      >
        {loadingData.education ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        <span>Add Education</span>
      </button>
    </div>
    {education.length === 0 ? (
      <div className="text-center py-12 text-gray-500">
        {loadingData.education ? (
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p>Loading education history...</p>
          </div>
        ) : (
          <>
            <p>No education added yet.</p>
            <p className="text-sm">Click "Add Education" to get started.</p>
          </>
        )}
      </div>
    ) : (
      <div className="space-y-6">
        {education.map((edu: any) => (
          <div key={edu.id} className="border border-gray-200 rounded-lg p-6 relative">
            {isEditing && (
              <button 
                onClick={() => deleteEducation(edu.id)}
                className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                title="Delete Education"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormInput
                label="Degree/Certificate"
                type="text"
                value={edu.degree}
                onChange={(e: any) => updateEducationLocal(edu.id, { degree: e.target.value })}
                disabled={!isEditing}
                error={validationErrors.education[edu.id]?.degree}
                required={isEditing}
              />
              <FormInput
                label="School/University"
                type="text"
                value={edu.school}
                onChange={(e: any) => updateEducationLocal(edu.id, { school: e.target.value })}
                disabled={!isEditing}
                error={validationErrors.education[edu.id]?.school}
                required={isEditing}
              />
              <FormInput
                label="Location"
                type="text"
                value={edu.location}
                onChange={(e: any) => updateEducationLocal(edu.id, { location: e.target.value })}
                disabled={!isEditing}
                error={validationErrors.education[edu.id]?.location}
                required={isEditing}
              />
              <FormInput
                label="GPA (optional)"
                type="text"
                value={edu.gpa || ''}
                onChange={(e: any) => updateEducationLocal(edu.id, { gpa: e.target.value })}
                disabled={!isEditing}
                placeholder="e.g. 3.8/4.0"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Start Date"
                type="month"
                value={edu.startDate}
                onChange={(e: any) => updateEducationLocal(edu.id, { startDate: e.target.value })}
                disabled={!isEditing}
                error={validationErrors.education[edu.id]?.startDate}
                required={isEditing}
              />
              <FormInput
                label="End Date (or Expected)"
                type="month"
                value={edu.endDate}
                onChange={(e: any) => updateEducationLocal(edu.id, { endDate: e.target.value })}
                disabled={!isEditing}
                error={validationErrors.education[edu.id]?.endDate}
                required={isEditing}
              />
            </div>
          </div>
        ))}
      </div>
    )}
    {isEditing && education.length > 0 && (
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

export default EducationTab;
