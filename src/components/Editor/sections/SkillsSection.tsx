import React from 'react';
import { Code, GripVertical, Plus, Trash2, Star } from 'lucide-react';
import { ResumeData, Skill } from '../../../types/resume';
import { v4 as uuidv4 } from 'uuid';

interface SkillsSectionProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
  isDragging?: boolean;
}

const skillCategories = [
  'Programming',
  'Frontend',
  'Backend',
  'Database',
  'Cloud',
  'DevOps',
  'Tools',
  'Soft Skills',
  'Languages'
];

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  data,
  onUpdate,
  isDragging
}) => {
  const { skills } = data;

  const addSkill = () => {
    const newSkill: Skill = {
      id: uuidv4(),
      name: '',
      category: 'Programming',
      level: 'Intermediate'
    };

    onUpdate({
      skills: [...skills, newSkill]
    });
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    onUpdate({
      skills: skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    });
  };

  const removeSkill = (id: string) => {
    onUpdate({
      skills: skills.filter(skill => skill.id !== id)
    });
  };

  const getSkillsByCategory = () => {
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);

    return grouped;
  };

  const getLevelStars = (level: string) => {
    const levels = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
    return levels[level as keyof typeof levels] || 2;
  };

  const skillsByCategory = getSkillsByCategory();

  return (
    <div className={`bg-white rounded-lg border-2 border-gray-200 p-6 transition-all duration-200 ${
      isDragging ? 'border-blue-400 shadow-lg' : 'hover:border-gray-300'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Code className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={addSkill}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Skill</span>
          </button>
          <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
        </div>
      </div>

      {/* Skill Input Form */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {skills.slice(-1).map((skill) => (
            <React.Fragment key={skill.id}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="JavaScript"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={skill.category}
                  onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {skillCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proficiency Level
                </label>
                <select
                  value={skill.level}
                  onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {skillLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="w-full px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4 mx-auto" />
                </button>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Skills Display by Category */}
      <div className="space-y-6">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category}>
            <h3 className="text-md font-medium text-gray-900 mb-3">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categorySkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= getLevelStars(skill.level)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-xs text-gray-500">{skill.level}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="ml-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No skills added yet</p>
          <p className="text-sm">Click "Add Skill" to get started</p>
        </div>
      )}
    </div>
  );
};