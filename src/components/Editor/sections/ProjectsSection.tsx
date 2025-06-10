import React from 'react';
import { ResumeData } from '../../../types/resume';

interface ProjectsSectionProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  data,
  onUpdate
}) => {
  const { projects } = data;

  const updateProject = (id: string, field: string, value: any) => {
    onUpdate({
      projects: projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    });
  };

  const removeProject = (id: string) => {
    onUpdate({
      projects: projects.filter(project => project.id !== id)
    });
  };

  const updateTechnologies = (id: string, tech: string) => {
    const techArray = tech.split(',').map(t => t.trim()).filter(t => t.length > 0);
    updateProject(id, 'technologies', techArray);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6 transition-all duration-200 hover:border-gray-300">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
      </div>

      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                Project {index + 1}
              </span>
              <button
                onClick={() => removeProject(project.id)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                {/* Trash2 icon removed */}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="E-commerce Platform"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Describe what the project does, your role, and key achievements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies Used
                </label>
                <input
                  type="text"
                  value={project.technologies.join(', ')}
                  onChange={(e) => updateTechnologies(project.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="React, Node.js, PostgreSQL, AWS (separate with commas)"
                />
                {project.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={project.startDate}
                    onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={project.endDate}
                    onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                    {/* ExternalLink icon removed */}
                    <span>Live URL (Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={project.url || ''}
                    onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://myproject.com"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                    {/* Github icon removed */}
                    <span>GitHub URL (Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={project.github || ''}
                    onChange={(e) => updateProject(project.id, 'github', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {/* Folder icon removed */}
            <p className="text-lg font-medium">No projects added yet</p>
            <p className="text-sm">Click "Add Project" to showcase your work</p>
          </div>
        )}
      </div>
    </div>
  );
};