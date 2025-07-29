import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, Users, Zap, Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AgentResponse {
  agentId: string;
  agentName: string;
  response: string;
  critique: string;
  tone: string;
  isBlurred: boolean;
}

interface CouncilSession {
  sessionId: string;
  responses: AgentResponse[];
  finalSynthesis: string;
  overallScore: number;
  nextSteps: string[];
  timestamp: Date;
}

interface AgentCouncilProps {
  userTier: 'free' | 'starter' | 'pro' | 'vault';
  generationsUsed: number;
  generationLimit: number;
}

export default function AgentCouncil({ userTier, generationsUsed, generationLimit }: AgentCouncilProps) {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'hook' | 'offer' | 'cta'>('hook');
  const [session, setSession] = useState<CouncilSession | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [speakingAgent, setSpeakingAgent] = useState<string | null>(null);
  const { toast } = useToast();

  const councilMutation = useMutation({
    mutationFn: async (data: { content: string; contentType: 'hook' | 'offer' | 'cta'; userTier: string }) => {
      const response = await apiRequest("POST", "/api/council/analyze", data);
      return response.json();
    },
    onSuccess: (data: CouncilSession) => {
      setSession(data);
      toast({
        title: "Council Analysis Complete",
        description: "The Agent Council has analyzed your content.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content to analyze.",
        variant: "destructive",
      });
      return;
    }

    councilMutation.mutate({
      content: content.trim(),
      contentType,
      userTier
    });
  };

  const speakAgentResponse = (agentId: string, text: string) => {
    if (!audioEnabled || !('speechSynthesis' in window)) {
      toast({
        title: "Audio Not Available",
        description: "Text-to-speech is not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();
    
    if (speakingAgent === agentId) {
      setSpeakingAgent(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice characteristics based on agent
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Try to find a suitable voice for each agent
      const voiceMap: { [key: string]: number } = {
        'maximus': 0, // Default voice
        'spartacus': 1, // Second voice if available
        'leonidas': 2, // Third voice if available
        'brutus': 3,
        'achilles': 4,
        'valerius': 5
      };
      
      const voiceIndex = voiceMap[agentId] || 0;
      if (voices[voiceIndex]) {
        utterance.voice = voices[voiceIndex];
      }
    }

    // Set speech characteristics
    utterance.rate = 0.9;
    utterance.pitch = agentId === 'maximus' ? 0.8 : agentId === 'spartacus' ? 0.9 : 1.0;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setSpeakingAgent(agentId);
    };

    utterance.onend = () => {
      setSpeakingAgent(null);
    };

    utterance.onerror = () => {
      setSpeakingAgent(null);
      toast({
        title: "Speech Error",
        description: "Failed to speak agent response.",
        variant: "destructive",
      });
    };

    window.speechSynthesis.speak(utterance);
  };

  const getAccessLevel = () => {
    return {
      free: {
        agentFeedback: 'blurred',
        maxGenerations: 100,
        audioSupport: false,
        realTimeCollab: false,
        description: 'Basic Gladiator feedback with blurred responses'
      },
      starter: {
        agentFeedback: 'text_only',
        maxGenerations: 1000,
        audioSupport: false,
        realTimeCollab: false,
        description: 'Full text feedback from all gladiator agents'
      },
      pro: {
        agentFeedback: 'full_text',
        maxGenerations: 1000,
        audioSupport: true,
        realTimeCollab: true,
        description: 'Full Gladiator collaboration with audio support'
      },
      vault: {
        agentFeedback: 'cinematic',
        maxGenerations: 1,
        audioSupport: true,
        realTimeCollab: true,
        description: 'Cinematic Gladiator experience with animations'
      }
    }[userTier];
  };

  const accessLevel = getAccessLevel();
  const canGenerate = generationsUsed < generationLimit;

  const renderAgentResponse = (agent: AgentResponse, index: number) => {
    const isLocked = agent.isBlurred && userTier === 'free';
    
    return (
      <Card key={agent.agentId} className="relative rounded-2xl h-auto" style={{
        backgroundColor: userTier === 'vault' ? 'rgba(249, 200, 14, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        borderColor: userTier === 'vault' ? '#F9C80E' : 'rgba(28, 132, 255, 0.3)',
        backdropFilter: 'blur(20px)',
        minHeight: '180px'
      }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#E2E8F0' }}>
              <div className={`w-3 h-3 rounded-full ${
                agent.agentId === 'maximus' ? 'bg-blue-500' :
                agent.agentId === 'spartacus' ? 'bg-red-500' :
                agent.agentId === 'leonidas' ? 'bg-green-500' :
                agent.agentId === 'brutus' ? 'bg-purple-500' :
                agent.agentId === 'achilles' ? 'bg-yellow-500' :
                agent.agentId === 'valerius' ? 'bg-gray-500' :
                'bg-gray-400'
              }`} />
              {agent.agentName}
            </CardTitle>
            {accessLevel.audioSupport && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="h-8 w-8 p-0"
                  title="Toggle audio support"
                >
                  {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                {audioEnabled && !isLocked && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakAgentResponse(agent.agentId, agent.response)}
                    className="h-8 w-8 p-0"
                    title="Listen to agent response"
                    disabled={speakingAgent === agent.agentId}
                  >
                    {speakingAgent === agent.agentId ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Volume2 className="h-4 w-4" style={{ color: '#1C84FF' }} />
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
          <Badge 
            variant="outline" 
            className="agent-style-tag w-fit text-xs transition-all duration-300" 
            style={{ 
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '999px',
              padding: '4px 12px',
              fontSize: '0.75rem',
              color: '#00bfff',
              fontWeight: '500',
              textShadow: '0 0 4px rgba(0,191,255,0.3)',
              border: 'none'
            }}
          >
            {agent.tone}
          </Badge>
        </CardHeader>
        <CardContent>
          {isLocked ? (
            <div className="relative">
              <div className="text-sm mb-2" style={{ color: '#94A3B8' }}>
                {agent.response.split(' ').slice(0, 2).join(' ')} ████████████████████...
              </div>
              <div className="absolute inset-0 flex items-center justify-center" style={{
                background: 'linear-gradient(to right, transparent, rgba(11, 14, 26, 0.8), transparent)'
              }}>
                <div className="border rounded-lg p-3 shadow-sm" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: '#1C84FF',
                  backdropFilter: 'blur(20px)'
                }}>
                  <Lock className="h-4 w-4 mx-auto mb-1" style={{ color: '#1C84FF' }} />
                  <p className="text-xs text-center" style={{ color: '#CBD5E1' }}>Gladiators await orders...</p>
                  <Button 
                    size="sm" 
                    className="mt-2 text-xs h-7" 
                    style={{
                      backgroundColor: '#1C84FF',
                      color: '#FFFFFF'
                    }}
                    onClick={() => setLocation('/quiz')}
                  >
                    🔓 Unlock Now
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div 
                className="agent-response text-sm leading-relaxed whitespace-pre-wrap" 
                style={{ 
                  fontSize: '0.95rem',
                  color: '#ccc',
                  paddingTop: '0.5rem',
                  minHeight: '60px',
                  wordBreak: 'break-word',
                  animation: 'quoteReveal 0.5s ease-in-out'
                }}
              >
                {agent.response
                  .replace(/\*\*Maximus\*\*:?\s*/gi, '')
                  .replace(/\*\*Spartacus\*\*:?\s*/gi, '')
                  .replace(/\*\*Leonidas\*\*:?\s*/gi, '')
                  .replace(/\*\*Brutus\*\*:?\s*/gi, '')
                  .replace(/\*\*Achilles\*\*:?\s*/gi, '')
                  .replace(/\*\*Valerius\*\*:?\s*/gi, '')
                  .replace(/\*\*(Maximus|Spartacus|Leonidas|Brutus|Achilles|Valerius)\*\*\s*\([^)]+\):\s*/gi, '')
                  .trim()}
              </div>
              {userTier === 'vault' && (
                <div className="mt-3 p-2 rounded text-xs" style={{
                  backgroundColor: 'rgba(249, 200, 14, 0.2)',
                  color: '#F9C80E'
                }}>
                  Elite gladiator wisdom activated
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Users className="h-6 w-6" style={{ color: '#1C84FF' }} />
          <h2 className="text-2xl font-bold" style={{ color: '#F1F5F9' }}>Meet Your Gladiator Council</h2>
          <Badge style={{
            backgroundColor: userTier === 'vault' ? '#F9C80E' :
                           userTier === 'pro' ? '#1C84FF' :
                           userTier === 'starter' ? '#10B981' :
                           '#64748B',
            color: userTier === 'vault' ? '#0B0E1A' : '#FFFFFF'
          }}>
            {userTier.toUpperCase()}
          </Badge>
        </div>
        
        <p className="max-w-2xl mx-auto" style={{ color: '#CBD5E1' }}>
          {accessLevel.description}
        </p>

        <div className="flex items-center justify-center gap-4 text-sm hud-tracking" style={{ 
          color: '#aaa',
          fontFamily: 'monospace',
          letterSpacing: '0.6px'
        }}>
          <span>{generationsUsed} / {generationLimit} used this month</span>
          <Progress 
            value={(generationsUsed / generationLimit) * 100} 
            className="w-32 h-2 progress-glow" 
            style={{
              background: '#cc94ff',
              boxShadow: '0 0 6px #d3a7ff',
              borderRadius: '999px'
            }}
          />
        </div>
      </div>

      <Card className="max-w-2xl mx-auto" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(28, 132, 255, 0.3)',
        backdropFilter: 'blur(20px)'
      }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 terminal-title" style={{ color: '#E2E8F0' }}>
            <Zap 
              className="h-5 w-5 pulse-glow transition-all duration-300 hover:animate-pulse" 
              style={{ 
                color: '#8f6aff',
                textShadow: '0 0 6px #c59fff',
                filter: 'drop-shadow(0 0 6px #c59fff)'
              }} 
            />
            Submit for Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {(['hook', 'offer', 'cta'] as const).map((type) => (
              <Button
                key={type}
                variant={contentType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setContentType(type)}
                className="capitalize transition-all duration-300"
                style={contentType === type ? {
                  background: 'linear-gradient(135deg, #9b57ff, #6e32d3)',
                  boxShadow: '0 0 8px rgba(155, 87, 255, 0.7)',
                  borderRadius: '10px',
                  color: '#fff',
                  border: 'none'
                } : {
                  background: '#1d1f2b',
                  color: '#ccc',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                {type}
              </Button>
            ))}
          </div>
          
          <Textarea
            placeholder={`Enter your ${contentType} for Council analysis...`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="resize-none cinematic-textarea animate-fade-in"
            style={{
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(4px)',
              borderRadius: '12px',
              color: '#E2E8F0'
            }}
          />
          
          <Button
            onClick={handleSubmit}
            disabled={!canGenerate || councilMutation.isPending || !content.trim()}
            className="w-full submit-glow transition-all duration-300"
            style={!canGenerate || councilMutation.isPending || !content.trim() ? {
              opacity: 0.3,
              cursor: 'not-allowed'
            } : {
              background: 'linear-gradient(90deg, #b56bff, #9b57ff)',
              boxShadow: '0 0 10px rgba(179, 107, 255, 0.45)',
              border: 'none'
            }}
          >
            {councilMutation.isPending ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Council Analyzing...
              </>
            ) : (
              `Submit to Council (${generationLimit - generationsUsed} remaining)`
            )}
          </Button>

          {!canGenerate && (
            <div className="text-center p-4 rounded-lg border" style={{
              backgroundColor: 'rgba(251, 146, 60, 0.1)',
              borderColor: 'rgba(251, 146, 60, 0.3)'
            }}>
              <p className="font-medium" style={{ color: '#FB923C' }}>Monthly limit reached</p>
              <p className="text-sm" style={{ color: '#FDBA74' }}>Resets on the 1st of next month</p>
            </div>
          )}
        </CardContent>
      </Card>

      {session && (
        <div className="space-y-6">
          <Card className="max-w-4xl mx-auto" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(28, 132, 255, 0.3)',
            backdropFilter: 'blur(20px)'
          }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between" style={{ color: '#E2E8F0' }}>
                <span>Council Analysis Results</span>
                <Badge 
                  className="score-badge text-lg px-3 py-1 transition-all duration-300" 
                  style={{ 
                    background: '#1d7bff',
                    color: 'white',
                    fontWeight: '700',
                    borderRadius: '999px',
                    boxShadow: '0 0 6px rgba(29,123,255,0.4)',
                    animation: 'scoreReveal 0.8s ease-out'
                  }}
                >
                  {session.overallScore}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Progress 
                  value={session.overallScore} 
                  className="h-3 mb-2 animated-progress" 
                  style={{
                    animation: 'progressFill 1.2s ease-out'
                  }}
                />
                <p 
                  className="text-sm text-center council-confidence-tooltip" 
                  style={{ color: '#94A3B8' }}
                  title="Council consensus level. Higher = stronger alignment across AI agents."
                >
                  Council Confidence Score: {session.overallScore}%
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 max-w-6xl mx-auto">
            {session.responses.map((agent, index) => renderAgentResponse(agent, index))}
          </div>

          <Card className="max-w-4xl mx-auto" style={{
            background: 'linear-gradient(135deg, rgba(28, 132, 255, 0.1) 0%, rgba(249, 200, 14, 0.1) 100%)',
            borderColor: 'rgba(28, 132, 255, 0.3)',
            backdropFilter: 'blur(20px)'
          }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#E2E8F0' }}>
                <Users className="h-5 w-5" style={{ color: '#1C84FF' }} />
                Council Synthesis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed" style={{ color: '#E2E8F0' }}>{session.finalSynthesis}</p>
              
              <div>
                <h4 className="font-medium mb-2" style={{ color: '#E2E8F0' }}>Recommended Next Steps:</h4>
                <ul className="space-y-1">
                  {session.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 font-bold">{index + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {userTier !== 'vault' && (
                <div className="mt-4 p-4 bg-purple-100 rounded-lg border border-purple-200">
                  <p className="text-purple-700 font-medium">Want deeper analysis?</p>
                  <p className="text-purple-600 text-sm">Upgrade to Vault for cinematic Council experience with animations and elite insights.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
