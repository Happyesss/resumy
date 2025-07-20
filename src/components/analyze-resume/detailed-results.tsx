'use client'

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Target, TrendingUp, Award, Users, Zap, FileText, Brain, Eye, Shield, User, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { cn } from '@/lib/utils';
import { ResumeScoreMetrics } from '@/components/resume/editor/panels/resume-score-panel';

interface DetailedResultsProps {
  scoreData: ResumeScoreMetrics;
  onAnalyzeAnother?: () => void;
}

export function DetailedResults({ scoreData, onAnalyzeAnother }: DetailedResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return { color: '#10b981', label: 'Excellent', bgColor: 'bg-green-500' };
    if (score >= 80) return { color: '#f59e0b', label: 'Very Good', bgColor: 'bg-yellow-500' };
    if (score >= 70) return { color: '#f97316', label: 'Good', bgColor: 'bg-orange-500' };
    if (score >= 60) return { color: '#ef4444', label: 'Needs Improvement', bgColor: 'bg-red-500' };
    return { color: '#dc2626', label: 'Poor', bgColor: 'bg-red-600' };
  };

  const scoreInfo = getScoreColor(scoreData.overallScore.score);

  // Organize scores by category for better display
  const organizedScores = [
    {
      title: 'Completeness',
      icon: FileText,
      items: [
        { name: 'Contact Information', ...scoreData.completeness.contactInformation },
        { name: 'Detail Level', ...scoreData.completeness.detailLevel }
      ]
    },
    {
      title: 'Impact & Voice',
      icon: TrendingUp,
      items: [
        { name: 'Active Voice Usage', ...scoreData.impactScore.activeVoiceUsage },
        { name: 'Quantified Achievements', ...scoreData.impactScore.quantifiedAchievements }
      ]
    },
    {
      title: 'Role Matching',
      icon: Target,
      items: [
        { name: 'Skills Relevance', ...scoreData.roleMatch.skillsRelevance },
        { name: 'Experience Alignment', ...scoreData.roleMatch.experienceAlignment },
        { name: 'Education Fit', ...scoreData.roleMatch.educationFit }
      ]
    }
  ];

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      {/* Overall Score Header */}
      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-purple-500/30 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Resume Score</h2>
                <p className="text-gray-400 text-sm">Overall compatibility rating</p>
              </div>
            </div>
            <Badge variant="secondary" className={cn("text-white", scoreInfo.bgColor)}>
              {scoreInfo.label}
            </Badge>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="w-20 h-20">
              <CircularProgressbar
                value={scoreData.overallScore.score}
                text={`${scoreData.overallScore.score}%`}
                styles={buildStyles({
                  textSize: '20px',
                  textColor: '#ffffff',
                  pathColor: scoreInfo.color,
                  trailColor: '#374151',
                  backgroundColor: '#1f2937',
                })}
              />
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Score Range</span>
                  <span className="text-white">{scoreData.overallScore.score}/100</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${scoreData.overallScore.score}%`,
                      backgroundColor: scoreInfo.color 
                    }}
                  />
                </div>
                <p className="text-gray-300 text-sm mt-2">{scoreData.overallScore.reason}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Category Scores */}
      {organizedScores.map((category, categoryIndex) => (
        <Card key={category.title} className="bg-gray-900/50 border-purple-500/30 backdrop-blur-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <category.icon className="h-5 w-5 text-purple-400" />
              {category.title}
            </h3>
            <div className="space-y-4">
              {category.items.map((item, index) => {
                const itemScore = getScoreColor(item.score);
                
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (index * 0.05) }}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <BarChart className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{item.name}</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">{item.score}%</div>
                        <div className={cn("text-xs", itemScore.color === '#10b981' ? 'text-green-400' : itemScore.color === '#f59e0b' ? 'text-yellow-400' : 'text-red-400')}>
                          {itemScore.label}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mb-3">
                      <div 
                        className="h-1.5 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${item.score}%`,
                          backgroundColor: itemScore.color 
                        }}
                      />
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.reason}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>
      ))}

      {/* Improvements Section */}
      <Card className="bg-gray-900/50 border-purple-500/30 backdrop-blur-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Key Improvements
          </h3>
          <div className="space-y-3">
            {scoreData.overallImprovements.map((improvement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30"
              >
                <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="h-3 w-3 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm leading-relaxed">{improvement}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* Miscellaneous Scores if available */}
      {scoreData.miscellaneous && Object.keys(scoreData.miscellaneous).length > 0 && (
        <Card className="bg-gray-900/50 border-purple-500/30 backdrop-blur-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-400" />
              Additional Analysis
            </h3>
            <div className="space-y-3">
              {Object.entries(scoreData.miscellaneous).map(([key, data], index) => {
                const miscScore = getScoreColor(data.score);
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                      <div className="text-right">
                        <div className="text-white font-semibold">{data.score}%</div>
                        <div className={cn("text-xs", miscScore.color === '#10b981' ? 'text-green-400' : miscScore.color === '#f59e0b' ? 'text-yellow-400' : 'text-red-400')}>
                          {miscScore.label}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
                      <div 
                        className="h-1.5 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${data.score}%`,
                          backgroundColor: miscScore.color 
                        }}
                      />
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{data.reason}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Add Analyze Another Resume Button */}
      {onAnalyzeAnother && (
        <Card className="bg-gray-900/80 border-gray-800 mt-6">
          <div className="p-6 text-center">
            <button
              onClick={onAnalyzeAnother}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Analyze Another Resume
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
