import React from 'react';
import { TrendingUp, FileText, Award } from 'lucide-react';

export const ResumeTips: React.FC = () => {
  const tips = [
    {
      title: 'Optimize for ATS',
      description: 'Use keywords from job descriptions to improve your resume\'s visibility.',
      icon: TrendingUp
    },
    {
      title: 'Keep it Concise',
      description: 'Aim for 1-2 pages and focus on your most relevant experiences.',
      icon: FileText
    },
    {
      title: 'Quantify Achievements',
      description: 'Use numbers and metrics to demonstrate your impact and results.',
      icon: Award
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Tips</h3>
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-start space-x-2">
              <tip.icon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 text-sm">{tip.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
