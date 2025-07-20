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
    if (score >= 90) return { color: '#22c55e', label: 'Excellent', bgColor: 'bg-green-500', textColor: 'text-green-400' };
    if (score >= 80) return { color: '#eab308', label: 'Very Good', bgColor: 'bg-yellow-500', textColor: 'text-yellow-400' };
    if (score >= 70) return { color: '#f97316', label: 'Good', bgColor: 'bg-orange-500', textColor: 'text-orange-400' };
    if (score >= 60) return { color: '#ef4444', label: 'Needs Improvement', bgColor: 'bg-red-500', textColor: 'text-red-400' };
    return { color: '#dc2626', label: 'Poor', bgColor: 'bg-red-600', textColor: 'text-red-500' };
  };

  const scoreInfo = getScoreColor(scoreData.overallScore.score);

  // Calculate statistics
  const allScores = [
    scoreData.completeness.contactInformation.score,
    scoreData.completeness.detailLevel.score,
    scoreData.impactScore.activeVoiceUsage.score,
    scoreData.impactScore.quantifiedAchievements.score,
    scoreData.roleMatch.skillsRelevance.score,
    scoreData.roleMatch.experienceAlignment.score,
    scoreData.roleMatch.educationFit.score
  ];
  const averageScore = Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length);
  const highestScore = Math.max(...allScores);
  const lowestScore = Math.min(...allScores);

  // Organize scores by category for better display
  const organizedScores = [
    {
      title: 'Completeness',
      icon: FileText,
      color: 'blue',
      items: [
        { name: 'Contact Information', ...scoreData.completeness.contactInformation },
        { name: 'Detail Level', ...scoreData.completeness.detailLevel }
      ]
    },
    {
      title: 'Impact & Voice',
      icon: TrendingUp,
      color: 'purple',
      items: [
        { name: 'Active Voice Usage', ...scoreData.impactScore.activeVoiceUsage },
        { name: 'Quantified Achievements', ...scoreData.impactScore.quantifiedAchievements }
      ]
    },
    {
      title: 'Role Matching',
      icon: Target,
      color: 'green',
      items: [
        { name: 'Skills Relevance', ...scoreData.roleMatch.skillsRelevance },
        { name: 'Experience Alignment', ...scoreData.roleMatch.experienceAlignment },
        { name: 'Education Fit', ...scoreData.roleMatch.educationFit }
      ]
    }
  ];

  return (
    <div className="min-h-screen text-white">
      <div className="px-6 grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Main Score */}
        <div className="xl:col-span-1">
          <Card className="bg-gray-800 border-gray-700 p-8 mb-6">
            <div className="text-center mb-6">
              <div className="w-48 h-48 mx-auto mb-6">
                <CircularProgressbar
                  value={scoreData.overallScore.score}
                  text={`${scoreData.overallScore.score}`}
                  styles={buildStyles({
                    textSize: '24px',
                    textColor: '#ffffff',
                    pathColor: scoreInfo.color,
                    trailColor: '#374151',
                    backgroundColor: '#1f2937',
                  })}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>300</span>
                  <span>850</span>
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
                <p className="text-gray-300 text-sm mt-4">{scoreData.overallScore.reason}</p>
              </div>
            </div>
            <button className="w-full bg-gray-900 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors">
              Update your resume score
            </button>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gray-800 border-gray-700 p-4">
              <div className="text-center">
                <div className="text-green-400 text-sm font-medium mb-1">100%</div>
                <div className="text-xs text-gray-400">High impact</div>
                <div className="text-xs text-gray-500">Percentage of achievements you've quantified on time</div>
              </div>
            </Card>
            <Card className="bg-gray-800 border-gray-700 p-4">
              <div className="text-center">
                <div className="text-red-400 text-sm font-medium mb-1">2%</div>
                <div className="text-xs text-gray-400">Low impact</div>
                <div className="text-xs text-gray-500">How much experience you can add compared to your total time</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column - Categories */}
        <div className="xl:col-span-2 space-y-6">
          {organizedScores.map((category, categoryIndex) => (
            <Card key={category.title} className="bg-gray-800 border-gray-700">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    category.color === 'blue' ? 'bg-blue-500/20' : 
                    category.color === 'purple' ? 'bg-purple-500/20' : 'bg-green-500/20'
                  }`}>
                    <category.icon className={`h-4 w-4 ${
                      category.color === 'blue' ? 'text-blue-400' : 
                      category.color === 'purple' ? 'text-purple-400' : 'text-green-400'
                    }`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                </div>

                <div className="space-y-4">
                  {category.items.map((item, index) => {
                    const itemScore = getScoreColor(item.score);
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (index * 0.05) }}
                        className="bg-gray-900/50 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                              <BarChart className="h-3 w-3 text-gray-400" />
                            </div>
                            <h4 className="text-white font-medium">{item.name}</h4>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold">{item.score}%</div>
                            <div className={cn("text-xs", itemScore.textColor)}>
                              {itemScore.label}
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                          <div 
                            className="h-2 rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${item.score}%`,
                              backgroundColor: itemScore.color 
                            }}
                          />
                        </div>
                        
                        <p className="text-gray-400 text-sm">{item.reason}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          ))}

          {/* Improvements Section */}
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Key Improvements</h3>
              </div>
              
              <div className="space-y-3">
                {scoreData.overallImprovements.map((improvement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg"
                  >
                    <div className="w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle className="h-3 w-3 text-yellow-400" />
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{improvement}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>

          {/* Miscellaneous Scores */}
          {scoreData.miscellaneous && Object.keys(scoreData.miscellaneous ?? {}).length > 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Brain className="h-4 w-4 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Additional Analysis</h3>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(scoreData.miscellaneous ?? {}).map(([key, data], index) => {
                    const miscScore = getScoreColor(data.score);
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gray-900/50 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                          <div className="text-right">
                            <div className="text-white font-semibold">{data.score}%</div>
                            <div className={cn("text-xs", miscScore.textColor)}>
                              {miscScore.label}
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${data.score}%`,
                              backgroundColor: miscScore.color 
                            }}
                          />
                        </div>
                        <p className="text-gray-400 text-sm">{data.reason}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      {onAnalyzeAnother && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 p-6 text-center"
        >
          <Card className="bg-gray-800 border-gray-700 p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">Ready for Another Analysis?</h3>
            <p className="text-gray-400 mb-6">Upload a new resume to get detailed insights and recommendations</p>
            <button
              onClick={onAnalyzeAnother}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Analyze Another Resume
            </button>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
