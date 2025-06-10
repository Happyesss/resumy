// SkillsTab.tsx
import { Plus } from 'lucide-react';
import { FormSelect } from '../FormComponents';
import { ErrorBanner } from '../ErrorBanner';

const SkillsTab = ({
  skills,
  isEditing,
  loading,
  loadingData,
  addSkill,
  updateSkill,
  errorMessages,
  setErrorMessages
}: any) => (
  <div className="space-y-6">
    <ErrorBanner 
      message={errorMessages.skills || ""}
      onDismiss={() => setErrorMessages((prev: any) => ({ ...prev, skills: '' }))} 
    />
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
      <button
        onClick={addSkill}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        disabled={loading || loadingData.skills}
      >
        {loadingData.skills ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        <span>Add Skill</span>
      </button>
    </div>
    {skills.length === 0 ? (
      <div className="text-center py-12 text-gray-500">
        {loadingData.skills ? (
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          </div>
        ) : (
          <></>
        )}
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill: any) => (
          <div key={skill.id} className="border border-gray-200 rounded-lg p-4">
            {isEditing ? (
              <FormSelect
                label=""
                value={skill.level}
                onChange={(e: any) => updateSkill(skill.id, { 
                  level: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
                })}
                options={[
                  { value: 'Beginner', label: 'Beginner' },
                  { value: 'Intermediate', label: 'Intermediate' },
                  { value: 'Advanced', label: 'Advanced' },
                  { value: 'Expert', label: 'Expert' }
                ]}
              />
            ) : null}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default SkillsTab;
