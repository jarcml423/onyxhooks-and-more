import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Zap, Lock, Star, CheckCircle, XCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface GameChallenge {
  id: string;
  level: 'urgency' | 'curiosity' | 'clarity';
  difficulty: 'starter' | 'pro' | 'vault';
  hookA: string;
  hookB: string;
  correctAnswer: 'A' | 'B';
  explanation: string;
  category: string;
}

interface GameSession {
  sessionId: string;
  userTier: 'starter' | 'pro' | 'vault';
  challenges: GameChallenge[];
  currentChallengeIndex: number;
  score: number;
  maxScore: number;
  completed: boolean;
  badge?: string;
}

interface PersuasionGameProps {
  userTier: 'free' | 'starter' | 'pro' | 'vault';
  canPlay: boolean;
  playsRemaining: number;
}

export default function PersuasionGame({ userTier, canPlay, playsRemaining }: PersuasionGameProps) {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{ correct: boolean; explanation: string } | null>(null);
  const { toast } = useToast();

  const startGameMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/game/start", { userTier });
      return response.json();
    },
    onSuccess: (data: GameSession) => {
      setGameSession(data);
      setSelectedAnswer(null);
      setShowResult(false);
      setLastResult(null);
    },
    onError: (error: any) => {
      toast({
        title: "Game Start Failed",
        description: error.message || "Failed to start game. Please try again.",
        variant: "destructive",
      });
    },
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async (data: { sessionId: string; challengeId: string; answer: 'A' | 'B' }) => {
      const response = await apiRequest("POST", "/api/game/answer", data);
      return response.json();
    },
    onSuccess: (result: { correct: boolean; explanation: string; newScore: number; session: GameSession }) => {
      setLastResult({ correct: result.correct, explanation: result.explanation });
      setShowResult(true);
      setGameSession(result.session);
      
      if (result.correct) {
        toast({
          title: "Correct!",
          description: "Your persuasion instincts are sharp.",
        });
      } else {
        toast({
          title: "Not quite",
          description: "Learn from the Council's wisdom.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit answer.",
        variant: "destructive",
      });
    },
  });

  const handleAnswerSubmit = () => {
    if (!gameSession || !selectedAnswer) return;
    
    const currentChallenge = gameSession.challenges[gameSession.currentChallengeIndex];
    submitAnswerMutation.mutate({
      sessionId: gameSession.sessionId,
      challengeId: currentChallenge.id,
      answer: selectedAnswer
    });
  };

  const handleNextChallenge = () => {
    if (gameSession && gameSession.completed) {
      // Game is complete, don't advance
      return;
    }
    setSelectedAnswer(null);
    setShowResult(false);
    setLastResult(null);
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'urgency': return <Zap className="h-4 w-4" />;
      case 'curiosity': return <Target className="h-4 w-4" />;
      case 'clarity': return <Star className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'urgency': return 'bg-red-500';
      case 'curiosity': return 'bg-blue-500';
      case 'clarity': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      starter: 'bg-green-500',
      pro: 'bg-blue-500',
      vault: 'bg-purple-500'
    };
    return (
      <Badge className={`${colors[difficulty as keyof typeof colors]} text-white`}>
        {difficulty.toUpperCase()}
      </Badge>
    );
  };

  if (userTier === 'free') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <CardTitle className="text-2xl">A/B Persuasion Challenge</CardTitle>
          <p className="text-gray-600">Test your persuasion instincts against the Council</p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <Lock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium mb-2">Game Locked</p>
            <p className="text-gray-600 text-sm mb-4">
              The Persuasion Challenge is available for Starter tier and above
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              Upgrade to Starter ($47)
            </Button>
          </div>
          
          <div className="text-left space-y-3 text-sm text-gray-600">
            <h4 className="font-medium text-gray-900">What you'll get:</h4>
            <ul className="space-y-1">
              <li>• Monthly access token to play the challenge</li>
              <li>• 3 levels: Urgency, Curiosity, Clarity</li>
              <li>• Earn monthly badges for perfect scores</li>
              <li>• Council feedback on each choice</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!canPlay) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Trophy className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">A/B Persuasion Challenge</CardTitle>
          <p className="text-gray-600">Monthly challenge completed</p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-orange-700 font-medium mb-2">Challenge Used This Month</p>
            <p className="text-orange-600 text-sm mb-4">
              You've used your monthly access token. Resets on the 1st.
            </p>
            <div className="text-sm text-gray-600">
              <p>Next reset: {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!gameSession) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Trophy className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <CardTitle className="text-2xl">A/B Persuasion Challenge</CardTitle>
          <p className="text-gray-600">Test your persuasion instincts against expert-level hooks</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-blue-600">{userTier.toUpperCase()} DIFFICULTY</Badge>
              <Badge variant="outline">{playsRemaining} plays remaining</Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className={`w-3 h-3 rounded-full ${getLevelColor('urgency')} mx-auto`} />
                <p className="text-sm font-medium">Urgency</p>
                <p className="text-xs text-gray-500">Scarcity & deadlines</p>
              </div>
              <div className="space-y-2">
                <div className={`w-3 h-3 rounded-full ${getLevelColor('curiosity')} mx-auto`} />
                <p className="text-sm font-medium">Curiosity</p>
                <p className="text-xs text-gray-500">Pattern interrupts</p>
              </div>
              <div className="space-y-2">
                <div className={`w-3 h-3 rounded-full ${getLevelColor('clarity')} mx-auto`} />
                <p className="text-sm font-medium">Clarity</p>
                <p className="text-xs text-gray-500">Specific outcomes</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <h4 className="font-medium text-gray-900 mb-2">How it works:</h4>
            <ul className="space-y-1">
              <li>• Compare two hooks and choose the stronger one</li>
              <li>• Get expert explanations for each choice</li>
              <li>• Earn a monthly badge with a perfect score</li>
              <li>• Difficulty scales with your tier level</li>
            </ul>
          </div>

          <Button
            onClick={() => startGameMutation.mutate()}
            disabled={startGameMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {startGameMutation.isPending ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Starting Challenge...
              </>
            ) : (
              <>
                <Trophy className="mr-2 h-5 w-5" />
                Start Challenge
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Check if game is completed first
  const isGameComplete = gameSession.completed;
  
  // Safety checks for game session data
  if (!gameSession.challenges || gameSession.challenges.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Loading Challenge...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  // If game is complete, show results immediately


  const currentChallenge = gameSession.challenges[gameSession.currentChallengeIndex];
  
  // Safety check for current challenge
  if (!currentChallenge) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Error Loading Challenge</CardTitle>
          <p className="text-gray-600">Please restart the game.</p>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setGameSession(null)} className="w-full">
            Restart Game
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isGameComplete) {
    const isPerfectScore = gameSession.score === gameSession.maxScore;
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Trophy className={`h-16 w-16 mx-auto mb-4 ${isPerfectScore ? 'text-yellow-500' : 'text-gray-400'}`} />
          <CardTitle className="text-3xl">Challenge Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <div className="text-6xl font-bold text-blue-600">
              {gameSession.score}<span className="text-2xl text-gray-500">/{gameSession.maxScore}</span>
            </div>
            <Progress value={(gameSession.score / gameSession.maxScore) * 100} className="h-3" />
          </div>

          {isPerfectScore && gameSession.badge && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <p className="font-bold text-yellow-700 mb-2">Perfect Score!</p>
              <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">
                {gameSession.badge}
              </Badge>
              <p className="text-yellow-600 text-sm mt-2">
                Badge earned! Use this in your email signature to show your expertise.
              </p>
            </div>
          )}

          <div className="text-sm text-gray-600 space-y-2">
            <p>Your persuasion instincts have been measured.</p>
            <p>Return next month for a new challenge.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResult && lastResult) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className={`h-16 w-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            lastResult.correct ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {lastResult.correct ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
          </div>
          <CardTitle className={`text-2xl ${lastResult.correct ? 'text-green-700' : 'text-red-700'}`}>
            {lastResult.correct ? 'Correct!' : 'Not Quite'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Council Explanation:</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{lastResult.explanation}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Progress: {gameSession.currentChallengeIndex} / {gameSession.challenges.length}</span>
            <span>Score: {gameSession.score} / {gameSession.maxScore}</span>
          </div>
          <Progress value={(gameSession.currentChallengeIndex / gameSession.challenges.length) * 100} className="h-2" />

          {!gameSession.completed ? (
            <Button
              onClick={handleNextChallenge}
              className="w-full"
              size="lg"
            >
              Next Challenge
            </Button>
          ) : (
            <div className="text-center space-y-3">
              <div className="text-green-600 font-semibold text-lg">
                🎉 Challenge Complete!
              </div>
              <div className="text-gray-700">
                Final Score: <span className="font-bold">{gameSession.score}/{gameSession.maxScore}</span>
              </div>
              {gameSession.badge && (
                <Badge className="bg-yellow-500 text-white">
                  {gameSession.badge}
                </Badge>
              )}
              <Button
                onClick={() => setGameSession(null)}
                className="w-full"
                variant="outline"
              >
                Play Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getLevelIcon(currentChallenge.level)}
            <CardTitle className="capitalize">{currentChallenge.level} Challenge</CardTitle>
            {getDifficultyBadge(currentChallenge.difficulty)}
          </div>
          <Badge variant="outline">{currentChallenge.category}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Challenge {gameSession.currentChallengeIndex + 1} of {gameSession.challenges.length}</span>
          <span>Score: {gameSession.score} / {gameSession.maxScore}</span>
        </div>
        <Progress value={((gameSession.currentChallengeIndex) / gameSession.challenges.length) * 100} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">Which hook is stronger?</h3>
        </div>

        <div className="grid gap-4">
          <Card 
            className={`cursor-pointer transition-all border-2 ${
              selectedAnswer === 'A' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedAnswer('A')}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                    selectedAnswer === 'A' ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'
                  }`}>
                    A
                  </div>
                </div>
                <p className="text-gray-900 leading-relaxed">{currentChallenge.hookA}</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all border-2 ${
              selectedAnswer === 'B' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedAnswer('B')}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                    selectedAnswer === 'B' ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'
                  }`}>
                    B
                  </div>
                </div>
                <p className="text-gray-900 leading-relaxed">{currentChallenge.hookB}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button
          onClick={handleAnswerSubmit}
          disabled={!selectedAnswer || submitAnswerMutation.isPending}
          className="w-full"
          size="lg"
        >
          {submitAnswerMutation.isPending ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Submitting...
            </>
          ) : (
            'Submit Answer'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}