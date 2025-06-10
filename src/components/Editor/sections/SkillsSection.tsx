import React, { useState } from 'react';
import { ResumeData, Skill } from '../../../types/resume';

interface SkillsSectionProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
}

const skillCategories = [
  'Technical',
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
  onUpdate
}) => {
  const { skills } = data;
  const [newSkill, setNewSkill] = useState<Skill>({
    id: '',
    name: '',
    category: skillCategories[0],
    level: 'Intermediate'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSkill, setEditSkill] = useState<Skill | null>(null);

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    onUpdate({
      skills: [
        ...skills,
        { ...newSkill, id: Date.now().toString() }
      ]
    });
    setNewSkill({ id: '', name: '', category: skillCategories[0], level: 'Intermediate' });
  };

  const startEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setEditSkill({ ...skill });
  };

  const saveEdit = () => {
    if (!editSkill || !editSkill.name.trim()) return;
    onUpdate({
      skills: skills.map(skill => skill.id === editSkill.id ? editSkill : skill)
    });
    setEditingId(null);
    setEditSkill(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditSkill(null);
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

  const skillsByCategory = getSkillsByCategory();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
        <p className="text-xs text-gray-500 mt-1">Add and manage your technical and professional skills</p>
      </div>

      {/* Add Skill Form */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Skill</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Skill Name</label>
            <input
              type="text"
              value={newSkill.name}
              onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. JavaScript"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
            <select
              value={newSkill.category}
              onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {skillCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Proficiency</label>
            <select
              value={newSkill.level}
              onChange={e => setNewSkill({ ...newSkill, level: e.target.value as Skill['level'] })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {skillLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={addSkill}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Skills Display by Category */}
      <div className="space-y-6">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">{category}</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'skills'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categorySkills.map((skill) => (
                <div
                  key={skill.id}
                  className="relative p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors shadow-xs flex flex-col min-w-0"
                >
                  {editingId === skill.id ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Skill Name</label>
                          <input
                            type="text"
                            value={editSkill?.name || ''}
                            onChange={e => setEditSkill(editSkill ? { ...editSkill, name: e.target.value } : null)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                          <select
                            value={editSkill?.category || ''}
                            onChange={e => setEditSkill(editSkill ? { ...editSkill, category: e.target.value } : null)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          >
                            {skillCategories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Level</label>
                          <select
                            value={editSkill?.level || ''}
                            onChange={e => setEditSkill(editSkill ? { ...editSkill, level: e.target.value as Skill['level'] } : null)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          >
                            {skillLevels.map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-1">
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEdit}
                          className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start min-w-0">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 break-words truncate" title={skill.name}>
                            {skill.name}
                          </h4>
                          <div className="mt-1">
                            <span className="text-xs text-gray-500">{skill.level}</span>
                          </div>
                        </div>
                        <div className="flex space-x-1 flex-shrink-0">
                          <button
                            onClick={() => startEdit(skill)}
                            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => removeSkill(skill.id)}
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                            title="Remove"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No skills added</h3>
          <p className="mt-1 text-xs text-gray-500">Get started by adding your first skill above.</p>
        </div>
      )}
    </div>
  );
};