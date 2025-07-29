import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Trophy, 
  Timer, 
  Zap, 
  Flag, 
  Users, 
  Target,
  PlayCircle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';
import nosBottleIcon from '@assets/NOS_icon_1751851168895.jpg';

interface ChallengeConfig {
  challengeActive: boolean;
  currentChallengeCycle: string;
  challengeStartDate: string;
  challengeEndDate: string;
  maxAttemptsPerCycle: number;
  timeRemaining: number;
}

interface ChallengeStats {
  totalEntries: number;
  averageTime: number;
  fastestTime: number;
  userRank?: number;
  userBestTime?: number;
  attemptsRemaining: number;
  currentCycle: string;
}

interface LeaderboardEntry {
  rank: number;
  displayName: string;
  timeToGenerate: number;
  timeFormatted: string;
  tier: string;
  isCurrentUser?: boolean;
}

interface ChallengeSubmission {
  timeToGenerate: number;
  timeFormatted: string;
  rank: number;
  message: string;
  cycle: string;
}

export default function NOSChallenge() {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [niche, setNiche] = useState('');
  const [transformation, setTransformation] = useState('');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [nosSoundEnabled, setNosSoundEnabled] = useState(true);
  const [lastSubmission, setLastSubmission] = useState<ChallengeSubmission | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Determine tier limits based on user subscription
  const getTierAttemptLimit = (userRole: string): number => {
    switch(userRole) {
      case 'free': return 2;
      case 'starter': return 25;
      case 'pro': return 50;
      case 'vault': return 100;
      default: return 2;
    }
  };

  // Check if user has access to challenge based on tier
  const hasAccessToChallenge = user?.role && ['free', 'starter', 'pro', 'vault', 'admin'].includes(user.role);

  // Determine tier from number of attempts (for display purposes)
  const getTierFromAttempts = (attempts: number): string => {
    if (attempts <= 2) return "Free";
    if (attempts <= 25) return "Starter";
    if (attempts <= 50) return "Pro";
    return "Vault";
  };

  // Fetch challenge configuration
  const { data: config, isLoading: configLoading } = useQuery<{success: boolean, config: ChallengeConfig}>({
    queryKey: ['/api/challenge/config'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch challenge stats
  const { data: stats, isLoading: statsLoading } = useQuery<{success: boolean, stats: ChallengeStats}>({
    queryKey: ['/api/challenge/stats'],
    enabled: config?.config?.challengeActive
  });

  // Fetch leaderboard
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery<{
    success: boolean,
    leaderboard: LeaderboardEntry[],
    cycle: string,
    totalEntries: number
  }>({
    queryKey: ['/api/challenge/leaderboard'],
    enabled: config?.config?.challengeActive
  });

  // Submit challenge entry mutation
  const submitChallenge = useMutation({
    mutationFn: async (data: { timeToGenerate: number; generatedHook: string; generatedOffer: string }) => {
      const response = await apiRequest('POST', '/api/challenge/submit', data);
      return response.json();
    },
    onSuccess: (data: { success: boolean, entry: ChallengeSubmission }) => {
      if (data.success) {
        setLastSubmission(data.entry);
        queryClient.invalidateQueries({ queryKey: ['/api/challenge/stats'] });
        queryClient.invalidateQueries({ queryKey: ['/api/challenge/leaderboard'] });
        toast({
          title: "Challenge Submitted! 🏁",
          description: `${data.entry.message} Your time: ${data.entry.timeFormatted}`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit challenge entry",
        variant: "destructive"
      });
    }
  });

  // Timer effect
  useEffect(() => {
    if (isActive && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, startTime]);

  const startChallenge = () => {
    if (!isActive) {
      setIsActive(true);
      setStartTime(Date.now());
      setElapsedTime(0);
      setGeneratedContent(null);
      setLastSubmission(null);
    }
  };

  const stopTimer = () => {
    setIsActive(false);
    const finalTime = Date.now() - (startTime || 0);
    setElapsedTime(finalTime);
    return finalTime;
  };

  const playNOSSound = async () => {
    if (nosSoundEnabled) {
      // Create audio context for authentic NOS purge sound effect
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Resume audio context if suspended (browser requirement)
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
          console.log('Audio context resumed');
        }
        
        // Create realistic NOS purge hiss using white noise
        const bufferSize = audioContext.sampleRate * 1.2; // 1.2 seconds
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        // Generate white noise for hiss effect
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoise = audioContext.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        
        // High-pass filter for NOS hiss character
        const highPassFilter = audioContext.createBiquadFilter();
        highPassFilter.type = 'highpass';
        highPassFilter.frequency.setValueAtTime(1200, audioContext.currentTime);
        highPassFilter.Q.setValueAtTime(2, audioContext.currentTime);
        
        // Band-pass filter for pressure release
        const bandPassFilter = audioContext.createBiquadFilter();
        bandPassFilter.type = 'bandpass';
        bandPassFilter.frequency.setValueAtTime(3500, audioContext.currentTime);
        bandPassFilter.Q.setValueAtTime(4, audioContext.currentTime);
        
        // Gain node for volume envelope
        const gainNode = audioContext.createGain();
        
        // Authentic NOS purge envelope: quick burst, sustain, fade
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.05); // Quick burst
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.2);  // Sustain
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2); // Fade
        
        // Connect the audio chain: noise → filters → gain → output
        whiteNoise.connect(highPassFilter);
        highPassFilter.connect(bandPassFilter);
        bandPassFilter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Start the NOS purge sound
        whiteNoise.start(audioContext.currentTime);
        whiteNoise.stop(audioContext.currentTime + 1.2);
        
        console.log('💨 AUTHENTIC NOS PURGE SOUND 💨 - AudioContext state:', audioContext.state);
      } catch (error) {
        console.error('Audio error:', error);
        console.log('💨 NOS PURGE SOUND 💨 (audio context unavailable)');
      }
    } else {
      console.log('🔇 NOS Sound FX disabled');
    }
  };

  // Handle Enter key press for faster NOS submission
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && niche.trim() && transformation.trim() && isActive && !isGenerating) {
      e.preventDefault();
      handleNOSGenerate();
    }
  };

  const handleNOSGenerate = async () => {
    if (!niche.trim() || !transformation.trim()) {
      toast({
        title: "Enter Details First",
        description: "Please fill in your niche and transformation before hitting NOS!",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    playNOSSound();

    // Simulate NOS purge delay
    setTimeout(async () => {
      try {
        // Mock generation for demo - in production, call real AI API
        const mockContent = `🔥 GENERATED HOOK: "The 3-Second Secret That Transformed My ${niche} Game Forever"

🎯 GENERATED OFFER: "${transformation} Breakthrough System - Get Results in 21 Days or Less!"`;

        setGeneratedContent(mockContent);
        const finalTime = stopTimer();
        
        // Auto-submit to challenge
        await submitChallenge.mutateAsync({
          timeToGenerate: finalTime,
          generatedHook: mockContent.split('\n')[0],
          generatedOffer: mockContent.split('\n')[2]
        });

      } catch (error) {
        console.error('Generation error:', error);
        toast({
          title: "Generation Failed",
          description: "Failed to generate content. Try again!",
          variant: "destructive"
        });
      } finally {
        setIsGenerating(false);
      }
    }, 800); // NOS purge duration
  };

  const formatTime = (ms: number) => {
    const seconds = ms / 1000;
    return `${seconds.toFixed(2)}s`;
  };

  const formatTimeRemaining = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  // Show access restriction if user doesn't have proper tier access
  if (!hasAccessToChallenge) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              NOS 9-Second Challenge
            </h1>
            <p className="text-xl text-slate-300">
              Authentication required to access the challenge
            </p>
          </div>
          
          <Card className="bg-slate-800/90 border-red-500/30 max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-center">
                Access Restricted
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-slate-300">
                You need to be logged in to participate in the NOS Challenge.
              </p>
              <Button 
                onClick={() => window.location.href = '/login'}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Sign In to Start Racing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (configLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading NOS Challenge...</div>
      </div>
    );
  }

  if (!config?.config?.challengeActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-slate-800/90 border-purple-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center gap-2">
              <Flag className="w-6 h-6 text-purple-400" />
              Challenge Inactive
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-slate-300">
            <p>The NOS 9-Second Challenge is currently inactive.</p>
            <p className="mt-2">Next cycle starts: <span className="text-purple-400">Q1-2025</span></p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Racing Heritage Header */}
        <Card className="bg-slate-800/90 border-purple-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-3">
              <Zap className="w-8 h-8 text-yellow-400" />
              NOS 9-Second Challenge
              <Trophy className="w-8 h-8 text-purple-400" />
            </CardTitle>
            <p className="text-slate-300 max-w-2xl mx-auto mb-4">
              From 200+ MPH motorcycle drag racing to high-converting hooks. 
              Every millisecond counts. Launch faster than your competitors.
            </p>
            
            {/* Racing Legacy Bio */}
            <div className="bg-slate-900/50 rounded-lg p-6 max-w-4xl mx-auto mt-6 border border-purple-500/20">
              <div className="text-left space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Flag className="w-5 h-5 text-yellow-400" />
                  The NOS Conversion Accelerator Legacy
                </h3>
                <p className="text-purple-200 text-sm">
                  The founder behind OnyxHooks & more doesn't just know speed — he lived it. Before building conversion-optimized AI systems, he was racing motorcycles at the track, running quarter-mile sprints in under 9 seconds, and clocking top speeds over 200 MPH.
                </p>
                <p className="text-white text-sm">
                  This isn't a metaphor — it's the DNA of this platform. Every launch was high-stakes. Every shift calculated. You only got one shot to get it right. That same obsessive execution is now infused into every hook generation.
                </p>
                
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-yellow-400">&lt;9s</div>
                    <div className="text-xs text-purple-300">Quarter Mile</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-yellow-400">200+</div>
                    <div className="text-xs text-purple-300">MPH Peak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-yellow-400">1000+</div>
                    <div className="text-xs text-purple-300">Racers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-yellow-400">LIVE</div>
                    <div className="text-xs text-purple-300">Dragstrip</div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Challenge Interface */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Timer & Stats */}
            <Card className="bg-slate-800/90 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Timer className="w-5 h-5 text-purple-400" />
                  Racing Timer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-6xl font-mono text-purple-400 font-bold">
                    {formatTime(elapsedTime)}
                  </div>
                  {isActive && (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <PlayCircle className="w-5 h-5" />
                      <span>TIMER RUNNING</span>
                    </div>
                  )}
                  <div className="flex justify-center gap-4 text-sm text-slate-400">
                    <div>Attempts: {config.config.maxAttemptsPerCycle - (stats?.stats?.attemptsRemaining || config.config.maxAttemptsPerCycle)}/{config.config.maxAttemptsPerCycle}</div>
                    <div>Cycle: {config.config.currentChallengeCycle}</div>
                    <div>Ends: {formatTimeRemaining(config.config.timeRemaining)}</div>
                  </div>
                  
                  {/* Tier Information Badge */}
                  <div className="mt-4 flex justify-center">
                    <div className="bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-sm">
                      <span className="text-slate-400">Current Tier: </span>
                      <span className="text-purple-400 font-semibold capitalize">
                        {getTierFromAttempts(config.config.maxAttemptsPerCycle)}
                      </span>
                      <span className="text-slate-400 ml-2">
                        ({config.config.maxAttemptsPerCycle} challenge attempts per cycle)
                      </span>
                    </div>
                  </div>
                  
                  {/* Separate from Hook Generation */}
                  <div className="mt-2 text-center">
                    <p className="text-xs text-slate-500">
                      Challenge attempts are separate from your hook generation quota
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Input Form */}
            <Card className="bg-slate-800/90 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Racing Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium">Your Niche</label>
                  <Input
                    value={niche}
                    onChange={(e) => {
                      setNiche(e.target.value);
                      // Start timer on first keystroke
                      if (e.target.value.length === 1 && !isActive) {
                        startChallenge();
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., Fitness coaching, Digital marketing..."
                    className="mt-1 bg-slate-700 border-purple-500/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium">Transformation You Deliver</label>
                  <Textarea
                    value={transformation}
                    onChange={(e) => {
                      setTransformation(e.target.value);
                      // Start timer on first keystroke if niche is empty
                      if (e.target.value.length === 1 && !niche.trim() && !isActive) {
                        startChallenge();
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., Help busy moms lose 20 pounds in 90 days..."
                    className="mt-1 bg-slate-700 border-purple-500/30 text-white h-20"
                  />
                </div>
                
                {/* NOS Generate Button */}
                <div className="text-center space-y-4">
                  <Button
                    onClick={handleNOSGenerate}
                    disabled={isGenerating || (!niche.trim() || !transformation.trim())}
                    className="w-full h-16 text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black border-2 border-yellow-400 shadow-lg shadow-yellow-500/30"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        NOS PURGING...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <img 
                          src={nosBottleIcon} 
                          alt="NOS Bottle" 
                          className="w-14 h-14 rounded-sm nos-bottle-icon" 
                        />
                        HIT THE NOS!
                        <Zap className="w-6 h-6" />
                      </div>
                    )}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-4 text-slate-400">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNosSoundEnabled(!nosSoundEnabled)}
                      className="text-slate-400 hover:text-white"
                    >
                      {nosSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      NOS Sound FX
                    </Button>
                    {nosSoundEnabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={playNOSSound}
                        className="text-slate-400 hover:text-white"
                      >
                        🎵 Test Sound
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated Content */}
            {generatedContent && (
              <Card className="bg-slate-800/90 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-400" />
                    Generated Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-green-400 whitespace-pre-wrap font-mono text-sm">
                    {generatedContent}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Last Submission */}
            {lastSubmission && (
              <Card className="bg-slate-800/90 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    Challenge Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-purple-400">
                      {lastSubmission.timeFormatted}
                    </div>
                    <div className="text-white">{lastSubmission.message}</div>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      Rank #{lastSubmission.rank}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Leaderboard Sidebar */}
          <div className="space-y-6">
            
            {/* Challenge Stats */}
            <Card className="bg-slate-800/90 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Track Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Racers:</span>
                  <span className="text-white">{stats?.stats?.totalEntries || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Average Time:</span>
                  <span className="text-white">{formatTime(stats?.stats?.averageTime || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Fastest Time:</span>
                  <span className="text-purple-400 font-bold">{formatTime(stats?.stats?.fastestTime || 0)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="bg-slate-800/90 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Quarter Mile Leaders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboardLoading ? (
                  <div className="text-center text-slate-400">Loading...</div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {leaderboard?.leaderboard?.map((entry) => (
                      <div
                        key={entry.rank}
                        className={`flex items-center justify-between p-2 rounded ${
                          entry.rank <= 3 
                            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20' 
                            : 'bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {entry.rank === 1 && <Trophy className="w-4 h-4 text-yellow-400" />}
                          {entry.rank === 2 && <Trophy className="w-4 h-4 text-gray-400" />}
                          {entry.rank === 3 && <Trophy className="w-4 h-4 text-orange-400" />}
                          <span className="text-white text-sm">#{entry.rank}</span>
                          <span className="text-slate-300 text-sm">{entry.displayName}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-purple-400 font-mono text-sm">{entry.timeFormatted}</div>
                          <Badge variant="outline" className="text-xs">
                            {entry.tier}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}