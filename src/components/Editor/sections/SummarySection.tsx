import React from 'react';
import { ResumeData } from '../../../types/resume';

interface SummarySectionProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
}

const sampleSummaries = [
  "Experienced software engineer with 5+ years developing scalable web applications and leading cross-functional teams.",
  "Creative marketing professional with expertise in digital campaigns and brand strategy that drive customer engagement.",
  "Results-driven sales manager with a proven track record of exceeding targets and building strong client relationships."
];

export const SummarySection: React.FC<SummarySectionProps> = ({
  data,
  onUpdate
}) => {
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const handleSummaryChange = (value: string) => {
    onUpdate({ summary: value });
  };

  const useSuggestion = (suggestion: string) => {
    handleSummaryChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6 transition-all duration-200 hover:border-gray-300">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Write a compelling summary that highlights your key achievements and career goals
          </label>
          <textarea
            value={data.summary}
            onChange={(e) => handleSummaryChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Describe your professional background, key skills, and career objectives in 2-3 sentences..."
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              Recommended: 50-150 words
            </span>
            <span className="text-xs text-gray-500">
              {data.summary.split(' ').filter(word => word.length > 0).length} words
            </span>
          </div>
        </div>

        {showSuggestions && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-3">Sample Summaries</h3>
            <div className="space-y-2">
              {sampleSummaries.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => useSuggestion(suggestion)}
                  className="w-full text-left p-2 text-sm text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};