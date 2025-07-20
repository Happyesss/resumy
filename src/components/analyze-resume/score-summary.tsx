'use client'

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, RefreshCw, FileText, TrendingUp, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { cn } from '@/lib/utils';
import { ResumeScoreMetrics } from '@/components/resume/editor/panels/resume-score-panel';

interface ScoreSummaryProps {
  scoreData: ResumeScoreMetrics;
  onAnalyzeAnother: () => void;
}

export function ScoreSummary({ scoreData, onAnalyzeAnother }: ScoreSummaryProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return { color: '#10b981', label: 'Excellent', bgColor: 'bg-green-500', textColor: 'text-green-400' };
    if (score >= 80) return { color: '#f59e0b', label: 'Very Good', bgColor: 'bg-yellow-500', textColor: 'text-yellow-400' };
    if (score >= 70) return { color: '#f97316', label: 'Good', bgColor: 'bg-orange-500', textColor: 'text-orange-400' };
    if (score >= 60) return { color: '#ef4444', label: 'Needs Improvement', bgColor: 'bg-red-500', textColor: 'text-red-400' };
    return { color: '#dc2626', label: 'Poor', bgColor: 'bg-red-600', textColor: 'text-red-400' };
  };

  const scoreInfo = getScoreColor(scoreData.overallScore.score);

  // Calculate quick stats
  const completenessAvg = (scoreData.completeness.contactInformation.score + scoreData.completeness.detailLevel.score) / 2;
  const impactAvg = (scoreData.impactScore.activeVoiceUsage.score + scoreData.impactScore.quantifiedAchievements.score) / 2;
  const roleMatchAvg = (scoreData.roleMatch.skillsRelevance.score + scoreData.roleMatch.experienceAlignment.score + scoreData.roleMatch.educationFit.score) / 3;

  const quickStats = [
    { label: 'Completeness', score: Math.round(completenessAvg), icon: FileText },
    { label: 'Impact', score: Math.round(impactAvg), icon: TrendingUp },
    { label: 'Role Match', score: Math.round(roleMatchAvg), icon: Target },
  ];

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-purple-500/30 backdrop-blur-sm">
        <div className="p-8">
          <div className="text-center space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Resume Score</h2>
              <Badge variant="secondary" className={cn("text-white text-sm", scoreInfo.bgColor)}>
                {scoreInfo.label}
              </Badge>
            </div>

            {/* Circular Progress */}
            <div className="relative">
              <div className="w-32 h-32 mx-auto">
                <CircularProgressbar
                  value={scoreData.overallScore.score}
                  text={`${scoreData.overallScore.score}%`}
                  styles={buildStyles({
                    textSize: '18px',
                    textColor: '#ffffff',
                    pathColor: scoreInfo.color,
                    trailColor: '#374151',
                    backgroundColor: '#1f2937',
                  })}
                />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-purple-400" />
              </div>
            </div>

            {/* Score Description */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
              <p className="text-gray-300 text-sm leading-relaxed">
                {scoreData.overallScore.reason}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-gray-900/50 border-purple-500/30 backdrop-blur-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Overview</h3>
          <div className="space-y-4">
            {quickStats.map((stat, index) => {
              const statColor = getScoreColor(stat.score);
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <stat.icon className="h-4 w-4 text-purple-400" />
                    </div>
                    <span className="text-white font-medium">{stat.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-semibold", statColor.textColor)}>
                      {stat.score}%
                    </span>
                    <div className="w-16 h-2 bg-gray-700 rounded-full">
                      <div 
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${stat.score}%`,
                          backgroundColor: statColor.color 
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Top Improvements Preview */}
      <Card className="bg-gray-900/50 border-purple-500/30 backdrop-blur-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Key Actions
          </h3>
          <div className="space-y-3">
            {scoreData.overallImprovements.slice(0, 3).map((improvement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/20"
              >
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300 text-sm leading-relaxed">{improvement}</p>
              </motion.div>
            ))}
            {scoreData.overallImprovements.length > 3 && (
              <p className="text-gray-400 text-xs text-center pt-2">
                +{scoreData.overallImprovements.length - 3} more recommendations →
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={onAnalyzeAnother}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-base font-medium"
        >
          <RefreshCw className="mr-3 h-5 w-5" />
          Analyze New Resume
        </Button>
        
        <Button
          variant="outline"
          className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 h-10 text-sm"
        >
          <FileText className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>
    </div>
  );
}
