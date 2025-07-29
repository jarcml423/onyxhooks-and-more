import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Users, Clock, Target, Shield, DollarSign, MessageSquare, Star } from "lucide-react";

interface HookScorecard {
  clarity: number;
  curiosity: number;
  relevance: number;
  urgency: number;
  specificity: number;
  total: number;
  councilNotes?: string;
  improvementSuggestions?: string[];
}

interface OfferScorecard {
  dreamOutcome: number;
  likelihoodOfSuccess: number;
  timeToResults: number;
  effortAndSacrifice: number;
  riskReversal: number;
  valueStack: number;
  priceFraming: number;
  messagingClarity: number;
  total: number;
  councilNotes?: string;
  improvementSuggestions?: string[];
}

interface CouncilAgent {
  agentName: string;
  agentRole: string;
  justification: string;
  rewriteSuggestion?: string;
}

interface ScorecardProps {
  type: 'hook' | 'offer';
  scorecard: HookScorecard | OfferScorecard;
  councilFeedback?: CouncilAgent[];
  alexUpgrade?: {
    text: string;
    score: number;
    reasoning: string;
  };
  michaelNotes?: string;
  onUpgrade?: () => void;
}

const getScoreColor = (score: number, maxScore: number) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return "text-green-600 dark:text-green-400";
  if (percentage >= 75) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

const getProgressColor = (score: number, maxScore: number) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return "bg-green-500";
  if (percentage >= 75) return "bg-yellow-500";
  return "bg-red-500";
};

export function Scorecard({ type, scorecard, councilFeedback, alexUpgrade, michaelNotes, onUpgrade }: ScorecardProps) {
  const hookDimensions = [
    { key: 'clarity', label: 'Clarity', icon: MessageSquare, max: 20, description: "Can a 5th grader understand it instantly?" },
    { key: 'curiosity', label: 'Curiosity', icon: Target, max: 20, description: "Does it open a loop or spark desire?" },
    { key: 'relevance', label: 'Relevance', icon: Users, max: 20, description: "Does it speak to reader's pain/goal?" },
    { key: 'urgency', label: 'Urgency', icon: Clock, max: 20, description: "Sense of 'this matters NOW'?" },
    { key: 'specificity', label: 'Specificity', icon: TrendingUp, max: 20, description: "Facts, numbers, contrast, clarity?" }
  ];

  const offerDimensions = [
    { key: 'dreamOutcome', label: 'Dream Outcome', icon: Star, max: 20, description: "Big, believable, emotionally powerful?" },
    { key: 'likelihoodOfSuccess', label: 'Likelihood of Success', icon: Trophy, max: 15, description: "Believable outcome? Testimonials?" },
    { key: 'timeToResults', label: 'Time to Results', icon: Clock, max: 15, description: "Fast results? Quick value?" },
    { key: 'effortAndSacrifice', label: 'Effort & Sacrifice', icon: Target, max: 10, description: "Frictionless? Easy to complete?" },
    { key: 'riskReversal', label: 'Risk Reversal', icon: Shield, max: 10, description: "Risk-free? Refunds/guarantees?" },
    { key: 'valueStack', label: 'Value Stack', icon: TrendingUp, max: 10, description: "Bonuses, templates, toolkits?" },
    { key: 'priceFraming', label: 'Price Framing', icon: DollarSign, max: 10, description: "Clear ROI? Smart comparisons?" },
    { key: 'messagingClarity', label: 'Messaging Clarity', icon: MessageSquare, max: 10, description: "Crisp copy, no jargon?" }
  ];

  const dimensions = type === 'hook' ? hookDimensions : offerDimensions;
  const totalMax = type === 'hook' ? 100 : 100;

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="border-2">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <CardTitle className="text-2xl">
              {type === 'hook' ? 'Hook' : 'Offer'} Scorecard
            </CardTitle>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className={`text-4xl font-bold ${getScoreColor(scorecard.total, totalMax)}`}>
              {scorecard.total}/{totalMax}
            </div>
            <Badge variant={scorecard.total >= 90 ? "default" : scorecard.total >= 75 ? "secondary" : "destructive"} className="text-lg px-3 py-1">
              {scorecard.total >= 90 ? "Elite" : scorecard.total >= 75 ? "Strong" : "Needs Work"}
            </Badge>
          </div>
          <Progress value={(scorecard.total / totalMax) * 100} className="w-full h-3 mt-4" />
        </CardHeader>
      </Card>

      {/* Detailed Scoring */}
      <Card>
        <CardHeader>
          <CardTitle>Dimensional Analysis</CardTitle>
          <CardDescription>Breakdown by conversion factors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dimensions.map((dim) => {
              const score = (scorecard as any)[dim.key];
              const Icon = dim.icon;
              return (
                <div key={dim.key} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{dim.label}</div>
                      <div className="text-sm text-muted-foreground">{dim.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`font-bold ${getScoreColor(score, dim.max)}`}>
                      {score}/{dim.max}
                    </div>
                    <div className="w-16">
                      <Progress 
                        value={(score / dim.max) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Council Feedback */}
      {councilFeedback && councilFeedback.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Council Analysis</CardTitle>
            <CardDescription>Expert insights from the OnyxHooks Council</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {councilFeedback.map((agent, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{agent.agentName}</Badge>
                    <span className="text-sm text-muted-foreground">{agent.agentRole}</span>
                  </div>
                  <p className="text-sm">{agent.justification}</p>
                  {agent.rewriteSuggestion && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-sm">
                      <strong>Suggestion:</strong> {agent.rewriteSuggestion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Michael's Analysis */}
      {michaelNotes && (
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-500" />
              Michael's Closing Analysis
            </CardTitle>
            <CardDescription>The closer's perspective on conversion potential</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{michaelNotes}</p>
          </CardContent>
        </Card>
      )}

      {/* Alex's Upgrade */}
      {alexUpgrade && (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-green-500" />
              Alex's Upgrade
            </CardTitle>
            <CardDescription>Optimized version scoring {alexUpgrade.score}/100</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <h4 className="font-medium mb-2">Upgraded Version:</h4>
              <p className="font-mono text-sm">{alexUpgrade.text}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Why This Version Wins:</h4>
              <p className="text-sm text-muted-foreground">{alexUpgrade.reasoning}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <Badge variant="default" className="bg-green-600">
                Score: {alexUpgrade.score}/100
              </Badge>
              <Badge variant="outline">
                +{alexUpgrade.score - scorecard.total} improvement
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade CTA */}
      {scorecard.total < 90 && !alexUpgrade && onUpgrade && (
        <Card className="border-purple-200 dark:border-purple-800">
          <CardContent className="text-center p-6">
            <h3 className="font-semibold mb-2">Want to break 90+?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upgrade to Pro/Vault for Alex's rewrites + council variants
            </p>
            <Button onClick={onUpgrade} className="bg-purple-600 hover:bg-purple-700">
              Upgrade for Better Scores
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}