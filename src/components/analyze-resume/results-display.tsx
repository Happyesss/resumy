'use client'

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, TrendingUp, Target, Zap, Award, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { cn } from '@/lib/utils';
import { ResumeScoreMetrics } from '@/components/resume/editor/panels/resume-score-panel';

interface ResultsDisplayProps {
  scoreData: ResumeScoreMetrics;
  onAnalyzeAnother: () => void;
}

export function ResultsDisplay({ scoreData, onAnalyzeAnother }: ResultsDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return { color: '#10b981', label: 'Excellent' };
    if (score >= 80) return { color: '#f59e0b', label: 'Very Good' };
    if (score >= 70) return { color: '#f97316', label: 'Good' };
    if (score >= 60) return { color: '#ef4444', label: 'Needs Improvement' };
    return { color: '#dc2626', label: 'Poor' };
  };

  const scoreInfo = getScoreColor(scoreData.overallScore.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header Card with Overall Score */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-purple-500/30 backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-purple-600/10 rounded-full translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-600/10 to-purple-500/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <Award className="h-8 w-8 text-purple-400" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                  Resume Analysis Complete
                </h2>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: scoreInfo.color }} />
                  <span className="text-white font-semibold">{scoreInfo.label}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300 text-sm">Score: {scoreData.overallScore.score}/100</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {scoreData.overallScore.reason}
                </p>
              </div>
            </div>
            
            <div className="w-36 h-36">
              <CircularProgressbar
                value={scoreData.overallScore.score}
                text={`${scoreData.overallScore.score}%`}
                styles={buildStyles({
                  textSize: '18px',
                  pathColor: scoreInfo.color,
                  textColor: '#ffffff',
                  trailColor: '#374151',
                  strokeLinecap: 'round',
                  pathTransitionDuration: 2,
                })}
              />
            </div>
          </div>

          <Button
            onClick={onAnalyzeAnother}
            variant="outline"
            className="mt-6 bg-transparent border-purple-500/50 text-purple-300 hover:bg-purple-600/20 hover:border-purple-400"
          >
            <FileText className="mr-2 h-4 w-4" />
            Analyze Another Resume
          </Button>
        </div>
      </Card>

      {/* Professional Suggestions Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Areas for Improvement */}
        <SuggestionCard
          title="Areas for Improvement"
          icon={<TrendingUp className="h-5 w-5" />}
          items={scoreData.overallImprovements?.filter(imp => 
            imp.toLowerCase().includes('add') || 
            imp.toLowerCase().includes('include') ||
            imp.toLowerCase().includes('missing') ||
            imp.toLowerCase().includes('improve') ||
            imp.toLowerCase().includes('enhance')
          ).slice(0, 5) || []}
          type="improvement"
          emptyMessage="Excellent! No major improvements needed."
        />

        {/* Optimization Opportunities */}
        <SuggestionCard
          title="Optimization Opportunities"
          icon={<Zap className="h-5 w-5" />}
          items={scoreData.overallImprovements?.filter(imp => 
            imp.toLowerCase().includes('optimize') || 
            imp.toLowerCase().includes('tailor') ||
            imp.toLowerCase().includes('consider') ||
            imp.toLowerCase().includes('could')
          ).slice(0, 5) || []}
          type="optimization"
          emptyMessage="Your resume is well-optimized for your target role."
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricsCard title="Completeness" metrics={scoreData.completeness} icon={<CheckCircle className="h-5 w-5" />} />
        <MetricsCard title="Impact Score" metrics={scoreData.impactScore} icon={<Target className="h-5 w-5" />} />
        <MetricsCard title="Role Match" metrics={scoreData.roleMatch} icon={<Sparkles className="h-5 w-5" />} />
        
        {scoreData.miscellaneous && Object.keys(scoreData.miscellaneous).length > 0 && (
          <MetricsCard title="Additional Metrics" metrics={scoreData.miscellaneous} icon={<Award className="h-5 w-5" />} />
        )}
      </div>

      {/* Skills & Keywords Section */}
      <Card className="bg-gray-900/50 border-purple-500/30 backdrop-blur-sm">
        <div className="p-6">
          <h3 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Skills & Keywords Analysis
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Skills Identified
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Java', 'Spring Boot', 'React', 'MongoDB', 'Docker', 'Azure', 'Git', 'Linux', 'TypeScript', 'Node.js'].map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-full text-green-300 text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-400" />
                Enhancement Tips
              </h4>
              <div className="space-y-3">
                <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/20">
                  <p className="text-blue-300 text-sm">💡 Add specific version numbers for technologies (e.g., React 18, Java 11)</p>
                </div>
                <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/20">
                  <p className="text-blue-300 text-sm">💡 Include cloud certifications if available (AWS, Azure)</p>
                </div>
                <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/20">
                  <p className="text-blue-300 text-sm">💡 Mention specific frameworks and libraries used</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Suggestion Card Component
function SuggestionCard({ 
  title, 
  icon, 
  items, 
  type, 
  emptyMessage 
}: { 
  title: string; 
  icon: React.ReactNode; 
  items: string[]; 
  type: 'improvement' | 'optimization';
  emptyMessage: string;
}) {
  const cardStyles = type === 'improvement' 
    ? "bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/30"
    : "bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30";
  
  const iconColor = type === 'improvement' ? 'text-orange-400' : 'text-blue-400';
  const dotColor = type === 'improvement' ? 'bg-orange-400' : 'bg-blue-400';

  return (
    <Card className={`${cardStyles} backdrop-blur-sm`}>
      <div className="p-6">
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${iconColor}`}>
          {icon}
          {title}
        </h3>
        <div className="space-y-3">
          {items.length > 0 ? items.map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <div className={`w-2 h-2 ${dotColor} rounded-full mt-2 flex-shrink-0`} />
              <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
            </div>
          )) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <p className="text-green-300 font-medium">{emptyMessage}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// Metrics Card Component
function MetricsCard({ 
  title, 
  metrics, 
  icon 
}: { 
  title: string; 
  metrics: Record<string, { score: number; reason: string }>; 
  icon: React.ReactNode;
}) {
  const getCardColor = (title: string) => {
    switch (title) {
      case 'Completeness':
        return 'from-green-600/20 to-green-700/20';
      case 'Impact Score':
        return 'from-blue-600/20 to-blue-700/20';
      case 'Role Match':
        return 'from-purple-600/20 to-purple-700/20';
      default:
        return 'from-gray-600/20 to-gray-700/20';
    }
  };

  return (
    <Card className={cn("bg-gradient-to-br border-purple-500/30 backdrop-blur-sm", getCardColor(title))}>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-6 text-purple-300 flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <div className="space-y-4">
          {Object.entries(metrics).map(([label, data]) => (
            <ScoreItem
              key={label}
              label={label.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              score={data.score}
              reason={data.reason}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

// Score Item Component
function ScoreItem({ label, score, reason }: { label: string; score: number; reason: string }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  const getBarColor = (score: number) => {
    if (score >= 90) return 'bg-green-400';
    if (score >= 80) return 'bg-yellow-400';
    if (score >= 70) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-white/90 font-medium">{label}</span>
        <span className={cn("font-bold text-lg", getScoreColor(score))}>{score}%</span>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-2.5">
        <div
          className={cn("h-2.5 rounded-full transition-all duration-1000", getBarColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
        <p className="text-gray-300 text-sm leading-relaxed">{reason}</p>
      </div>
    </div>
  );
}
