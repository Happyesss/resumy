import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Star, Eye, Download, Filter, Search } from 'lucide-react';
import { useTemplates } from '../hooks/useTemplates';
import { useAuth } from '../contexts/AuthContext';

export const TemplatesPage: React.FC = () => {
  const { templates, isLoading, incrementTemplateDownload } = useTemplates();
  const { profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'modern', name: 'Modern', count: templates.filter(t => t.category === 'modern').length },
    { id: 'creative', name: 'Creative', count: templates.filter(t => t.category === 'creative').length },
    { id: 'professional', name: 'Professional', count: templates.filter(t => t.category === 'professional').length },
    { id: 'executive', name: 'Executive', count: templates.filter(t => t.category === 'executive').length },
    { id: 'technical', name: 'Technical', count: templates.filter(t => t.category === 'technical').length }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (template.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = async (templateId: string) => {
    try {
      await incrementTemplateDownload(templateId);
      // Navigate to resume builder with selected template
      window.location.href = `/resume-builder?template=${templateId}`;
    } catch (error) {
      console.error('Failed to use template:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Resume Templates
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our collection of expertly designed, ATS-friendly templates. 
            Each template is crafted to help you stand out and land your dream job.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Category Filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              {/* Template Preview */}
              <div className="relative aspect-[3/4] bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-gray-400" />
                </div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {template.download_count > 10000 && (
                    <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-medium">
                      Popular
                    </span>
                  )}
                  {template.is_premium && (
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-medium">
                      Premium
                    </span>
                  )}
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <button className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => handleUseTemplate(template.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={template.is_premium && profile?.subscription_tier === 'free'}
                  >
                    Use Template
                  </button>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{template.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{template.rating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm">{template.description}</p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>{template.download_count.toLocaleString()} downloads</span>
                  </div>
                  <span className="capitalize text-blue-600 font-medium">{template.category}</span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  disabled={template.is_premium && profile?.subscription_tier === 'free'}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    template.is_premium && profile?.subscription_tier === 'free'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : template.is_premium
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {template.is_premium && profile?.subscription_tier === 'free'
                    ? 'Upgrade to Use'
                    : template.is_premium
                    ? 'Use Premium Template'
                    : 'Use Template'
                  }
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria to find the perfect template.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Can't Find the Perfect Template?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our resume builder allows you to customize any template to match your style and industry. 
            Start with any template and make it uniquely yours.
          </p>
          <Link
            to="/resume-builder"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Start Building Your Resume
          </Link>
        </div>
      </div>
    </div>
  );
};