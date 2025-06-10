import React from 'react';
import { Briefcase, Plus, Trash2, Calendar } from 'lucide-react';
import { ResumeData, WorkExperience } from '../../../types/resume';

interface WorkExperienceSectionProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
}

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
  data,
  onUpdate
}) => {
  const { workExperience } = data;

  const updateExperience = (id: string, field: keyof WorkExperience, value: any) => {
    onUpdate({
      workExperience: workExperience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    onUpdate({
      workExperience: workExperience.filter(exp => exp.id !== id)
    });
  };

  const addDescription = (experienceId: string) => {
    const experience = workExperience.find(exp => exp.id === experienceId);
    if (experience) {
      updateExperience(experienceId, 'description', [...experience.description, '']);
    }
  };

  const updateDescription = (experienceId: string, index: number, value: string) => {
    const experience = workExperience.find(exp => exp.id === experienceId);
    if (experience) {
      const newDescription = [...experience.description];
      newDescription[index] = value;
      updateExperience(experienceId, 'description', newDescription);
    }
  };

  const removeDescription = (experienceId: string, index: number) => {
    const experience = workExperience.find(exp => exp.id === experienceId);
    if (experience && experience.description.length > 1) {
      const newDescription = experience.description.filter((_, i) => i !== index);
      updateExperience(experienceId, 'description', newDescription);
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6 transition-all duration-200 hover:border-gray-300">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
      </div>

      <div className="space-y-6">
        {workExperience.map((experience, index) => (
          <div key={experience.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                Experience {index + 1}
              </span>
              <button
                onClick={() => removeExperience(experience.id)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  value={experience.company}
                  onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="TechCorp Inc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <input
                  type="text"
                  value={experience.position}
                  onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={experience.location}
                  onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="San Francisco, CA"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-700">
                    Employment Period
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="month"
                    value={experience.startDate}
                    onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="month"
                    value={experience.endDate}
                    onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                    disabled={experience.current}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={experience.current}
                    onChange={(e) => {
                      updateExperience(experience.id, 'current', e.target.checked);
                      if (e.target.checked) {
                        updateExperience(experience.id, 'endDate', '');
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Currently working here</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description & Achievements
              </label>
              <div className="space-y-2">
                {experience.description.map((desc, descIndex) => (
                  <div key={descIndex} className="flex items-start space-x-2">
                    <input
                      type="text"
                      value={desc}
                      onChange={(e) => updateDescription(experience.id, descIndex, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="• Describe your responsibilities and achievements..."
                    />
                    {experience.description.length > 1 && (
                      <button
                        onClick={() => removeDescription(experience.id, descIndex)}
                        className="mt-2 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addDescription(experience.id)}
                  className="flex items-center space-x-1 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add bullet point</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {workExperience.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No work experience added yet</p>
            <p className="text-sm">Click "Add Experience" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};