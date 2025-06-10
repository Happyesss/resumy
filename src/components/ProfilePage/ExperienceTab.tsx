// ExperienceTab.tsx
import { Plus, Save, Trash2 } from 'lucide-react';
import { FormInput, FormTextarea, FormCheckbox } from '../FormComponents';
import { ErrorBanner } from '../ErrorBanner';

const ExperienceTab = ({
  workExperience,
  isEditing,
  loading,
  loadingData,
  validationErrors,
  addWorkExperience,
  updateWorkExperienceLocal,
  deleteWorkExperience,
  saveAllProfileData,
  errorMessages,
  setErrorMessages
}: any) => (
  <div className="space-y-6">
    <ErrorBanner 
      message={errorMessages.workExperience || ""}
      onDismiss={() => setErrorMessages((prev: any) => ({ ...prev, workExperience: '' }))} 
    />
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
      <button
        onClick={addWorkExperience}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        disabled={loading || loadingData.workExperience}
      >
        {loadingData.workExperience ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        <span>Add Experience</span>
      </button>
    </div>
    {workExperience.length === 0 ? (
      <div className="text-center py-12 text-gray-500">
        {loadingData.workExperience ? (
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p>Loading work experience...</p>
          </div>
        ) : (
          <>
            <p>No work experience added yet.</p>
            <p className="text-sm">Click "Add Experience" to get started.</p>
          </>
        )}
      </div>
    ) : (
      <div className="space-y-6">
        {workExperience.map((exp: any) => (
          <div key={exp.id} className="border border-gray-200 rounded-lg p-6 relative">
            {isEditing && (
              <button 
                onClick={() => deleteWorkExperience(exp.id)}
                className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                title="Delete Experience"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormInput
                label="Job Title"
                type="text"
                value={exp.title}
                onChange={(e: any) => updateWorkExperienceLocal(exp.id, { title: e.target.value })}
                disabled={!isEditing}
                error={validationErrors.workExperience[exp.id]?.title}
                required={isEditing}
              />
              <FormInput
                label="Company"
                type="text"
                value={exp.company}
                onChange={(e: any) => updateWorkExperienceLocal(exp.id, { company: e.target.value })}
                disabled={!isEditing}
                error={validationErrors.workExperience[exp.id]?.company}
                required={isEditing}
              />
              <FormInput
                label="Location"
                type="text"
                value={exp.location}
                onChange={(e: any) => updateWorkExperienceLocal(exp.id, { location: e.target.value })}
                disabled={!isEditing}
                error={validationErrors.workExperience[exp.id]?.location}
                placeholder="City, State or Remote"
                required={isEditing}
              />
              <div className="flex items-center mt-6">
                <FormCheckbox
                  label="I currently work here"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e: any) => updateWorkExperienceLocal(exp.id, { current: e.target.checked })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormInput
                label="Start Date"
                type="month"
                value={exp.startDate}
                onChange={(e: any) => updateWorkExperienceLocal(exp.id, { startDate: e.target.value })}
                disabled={!isEditing}
                error={validationErrors.workExperience[exp.id]?.startDate}
                required={isEditing}
              />
              {!exp.current && (
                <FormInput
                  label="End Date"
                  type="month"
                  value={exp.endDate}
                  onChange={(e: any) => updateWorkExperienceLocal(exp.id, { endDate: e.target.value })}
                  disabled={!isEditing}
                  error={validationErrors.workExperience[exp.id]?.endDate}
                  required={isEditing && !exp.current}
                />
              )}
            </div>
            <FormTextarea
              label="Description"
              value={exp.description}
              onChange={(e: any) => updateWorkExperienceLocal(exp.id, { description: e.target.value })}
              disabled={!isEditing}
              rows={3}
              error={validationErrors.workExperience[exp.id]?.description}
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
        ))}
      </div>
    )}
    {isEditing && workExperience.length > 0 && (
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

export default ExperienceTab;
