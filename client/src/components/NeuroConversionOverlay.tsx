import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Zap, Shield, Crown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { apiRequest } from '@/lib/queryClient';

interface NeuroScore {
  overallScore: number;
  riskAssessment: number;
  costJustification: number;
  timeBelievability: number;
  statusElevation: number;
  buyerProfile: 'skeptical' | 'status-seeking' | 'solution-hungry';
  psychologicalTriggers: string[];
  optimizationSuggestions: string[];
  conversionPrediction: 'low' | 'medium' | 'high' | 'elite';
}

interface NeuroConversionOverlayProps {
  content: string;
  type: 'hook' | 'offer' | 'cta';
  industry?: string;
  targetAudience?: string;
  isVisible: boolean;
  onClose: () => void;
}

const getScoreColor = (score: number): string => {
  if (score >= 85) return '#F9C80E'; // Gold
  if (score >= 70) return '#1C84FF'; // Blue  
  if (score >= 50) return '#10B981'; // Green
  return '#EF4444'; // Red
};

const getScoreLevel = (score: number): string => {
  if (score >= 85) return 'Elite';
  if (score >= 70) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
};

const getBuyerProfileIcon = (profile: string) => {
  switch (profile) {
    case 'skeptical': return <Shield className="w-5 h-5" />;
    case 'status-seeking': return <Crown className="w-5 h-5" />;
    case 'solution-hungry': return <Target className="w-5 h-5" />;
    default: return <Brain className="w-5 h-5" />;
  }
};

const getBuyerProfileColor = (profile: string): string => {
  switch (profile) {
    case 'skeptical': return '#EF4444'; // Red
    case 'status-seeking': return '#F9C80E'; // Gold
    case 'solution-hungry': return '#10B981'; // Green
    default: return '#6B7280'; // Gray
  }
};

export default function NeuroConversionOverlay({ 
  content, 
  type, 
  industry, 
  targetAudience, 
  isVisible, 
  onClose 
}: NeuroConversionOverlayProps) {
  const [neuroScore, setNeuroScore] = useState<NeuroScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeContent = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/neuroconversion/analyze', {
        content,
        type,
        industry,
        targetAudience
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNeuroScore(data.neuroScore);
      } else {
        setError('Analysis failed. Please try again.');
      }
    } catch (err) {
      setError('Failed to analyze content. Check your connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: 20 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Brain className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">NeuroConversion Analysis</h3>
                    <p className="text-slate-400">Advanced psychological scoring for {type} content</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Content Preview */}
            <div className="p-6 border-b border-slate-700">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {type.toUpperCase()}
                  </Badge>
                  {industry && (
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      {industry}
                    </Badge>
                  )}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {content.length > 200 ? `${content.substring(0, 200)}...` : content}
                </p>
              </div>
            </div>

            {/* Analysis Results */}
            <div className="p-6">
              {!neuroScore && !isAnalyzing && (
                <div className="text-center">
                  <Button
                    onClick={analyzeContent}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Analyze Neuro-Conversion Potential
                  </Button>
                  <p className="text-slate-400 text-sm mt-2">
                    Powered by VaultForge Elite Council psychological framework
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 bg-slate-800/50 rounded-lg px-6 py-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
                    />
                    <span className="text-slate-300">Analyzing psychological triggers...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-center">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400">{error}</p>
                    <Button
                      onClick={analyzeContent}
                      variant="outline"
                      className="mt-3"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              )}

              {neuroScore && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Overall Score */}
                  <div className="text-center bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-slate-600 flex items-center justify-center relative overflow-hidden">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `conic-gradient(${getScoreColor(neuroScore.overallScore)} ${neuroScore.overallScore * 3.6}deg, transparent 0deg)`,
                            }}
                          />
                          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center relative z-10">
                            <span className="text-2xl font-bold text-white">{neuroScore.overallScore}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <h4 className="text-2xl font-bold text-white">{getScoreLevel(neuroScore.overallScore)} Conversion</h4>
                        <p className="text-slate-400">Overall NeuroScore</p>
                        <Badge 
                          className={`mt-2 ${
                            neuroScore.conversionPrediction === 'elite' ? 'bg-yellow-500/20 text-yellow-400' :
                            neuroScore.conversionPrediction === 'high' ? 'bg-blue-500/20 text-blue-400' :
                            neuroScore.conversionPrediction === 'medium' ? 'bg-green-500/20 text-green-400' :
                            'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {neuroScore.conversionPrediction.toUpperCase()} Prediction
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-5 h-5 text-red-400" />
                        <span className="font-semibold text-white">Risk Assessment</span>
                      </div>
                      <Progress value={neuroScore.riskAssessment * 10} className="mb-2" />
                      <span className="text-sm text-slate-400">{neuroScore.riskAssessment}/10</span>
                    </div>

                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span className="font-semibold text-white">Cost Justification</span>
                      </div>
                      <Progress value={neuroScore.costJustification * 10} className="mb-2" />
                      <span className="text-sm text-slate-400">{neuroScore.costJustification}/10</span>
                    </div>

                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold text-white">Time Believability</span>
                      </div>
                      <Progress value={neuroScore.timeBelievability * 10} className="mb-2" />
                      <span className="text-sm text-slate-400">{neuroScore.timeBelievability}/10</span>
                    </div>

                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-center gap-2 mb-3">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        <span className="font-semibold text-white">Status Elevation</span>
                      </div>
                      <Progress value={neuroScore.statusElevation * 10} className="mb-2" />
                      <span className="text-sm text-slate-400">{neuroScore.statusElevation}/10</span>
                    </div>
                  </div>

                  {/* Buyer Profile */}
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-3">
                      {getBuyerProfileIcon(neuroScore.buyerProfile)}
                      <span className="font-semibold text-white">Buyer Psychology Profile</span>
                    </div>
                    <Badge 
                      className="mb-3"
                      style={{ 
                        backgroundColor: `${getBuyerProfileColor(neuroScore.buyerProfile)}20`,
                        color: getBuyerProfileColor(neuroScore.buyerProfile),
                        borderColor: getBuyerProfileColor(neuroScore.buyerProfile)
                      }}
                    >
                      {neuroScore.buyerProfile.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  {/* Psychological Triggers */}
                  {neuroScore.psychologicalTriggers.length > 0 && (
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                      <h5 className="font-semibold text-white mb-3">Detected Psychological Triggers</h5>
                      <div className="flex flex-wrap gap-2">
                        {neuroScore.psychologicalTriggers.map((trigger, index) => (
                          <Badge key={index} variant="outline" className="text-blue-400 border-blue-400">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Optimization Suggestions */}
                  {neuroScore.optimizationSuggestions.length > 0 && (
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                      <h5 className="font-semibold text-white mb-3">Council Optimization Recommendations</h5>
                      <ul className="space-y-2">
                        {neuroScore.optimizationSuggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-300 text-sm">
                            <span className="text-yellow-400 mt-1">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}