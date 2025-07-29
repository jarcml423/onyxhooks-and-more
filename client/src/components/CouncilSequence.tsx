import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Crown, Copy, Sparkles, Users, Target, Shield } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CouncilSequenceOutput {
  phase1FusedCouncil: string;
  phase2Disruptive: string;
  phase2Sophisticated: string;
  phase2Structured: string;
  councilConfidenceScore: number;
  insights: {
    spartacus: string;
    leonidas: string;
    maximus: string;
    brutus: string;
    achilles: string;
    valerius: string;
  };
  sessionId: string;
  timestamp: Date;
}

interface CouncilSequenceProps {
  userTier: 'free' | 'starter' | 'pro' | 'vault';
}

export default function CouncilSequence({ userTier }: CouncilSequenceProps) {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'hook' | 'offer' | 'cta'>('offer');
  const [sequence, setSequence] = useState<CouncilSequenceOutput | null>(null);
  const { toast } = useToast();

  const sequenceMutation = useMutation({
    mutationFn: async (data: { content: string; contentType: 'hook' | 'offer' | 'cta'; userTier: string }) => {
      const response = await apiRequest("POST", "/api/council/sequence", data);
      return response.json();
    },
    onSuccess: (data: { sequence: CouncilSequenceOutput }) => {
      setSequence(data.sequence);
      toast({
        title: "Elite Council Sequence Complete",
        description: "The Council has crafted your sophisticated conversion variants.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Sequence Failed",
        description: error.message || "Failed to generate Council Sequence.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content for the Council Sequence.",
        variant: "destructive",
      });
      return;
    }

    if (userTier !== 'vault') {
      toast({
        title: "Vault Exclusive",
        description: "Council Sequence is exclusive to Vault tier members.",
        variant: "destructive",
      });
      return;
    }

    sequenceMutation.mutate({
      content: content.trim(),
      contentType,
      userTier
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  if (userTier !== 'vault') {
    return (
      <Card className="max-w-4xl mx-auto" style={{
        backgroundColor: 'rgba(249, 200, 14, 0.1)',
        borderColor: '#F9C80E',
        backdropFilter: 'blur(20px)'
      }}>
        <CardContent className="p-8 text-center">
          <Crown className="h-12 w-12 mx-auto mb-4" style={{ color: '#F9C80E' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: '#F9C80E' }}>Elite Council Sequence</h3>
          <p className="mb-4" style={{ color: '#FDE047' }}>
            Vault-exclusive feature: Sophisticated expansion + precision sharpening across three conversion archetypes
          </p>
          <Badge className="bg-yellow-500 text-black px-4 py-2">
            Upgrade to Vault Required
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="max-w-4xl mx-auto" style={{
        backgroundColor: 'rgba(249, 200, 14, 0.1)',
        borderColor: '#F9C80E',
        backdropFilter: 'blur(20px)'
      }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#F9C80E' }}>
            <Crown className="h-6 w-6" />
            Elite Council Sequence
          </CardTitle>
          <p className="text-sm" style={{ color: '#FDE047' }}>
            Sophisticated expansion followed by precision sharpening into three distinct conversion archetypes
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {(['hook', 'offer', 'cta'] as const).map((type) => (
              <Button
                key={type}
                variant={contentType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setContentType(type)}
                className="capitalize"
                style={{
                  backgroundColor: contentType === type ? '#F9C80E' : 'transparent',
                  borderColor: '#F9C80E',
                  color: contentType === type ? '#0B0E1A' : '#F9C80E'
                }}
              >
                {type}
              </Button>
            ))}
          </div>
          
          <Textarea
            placeholder={`Enter your ${contentType} for Elite Council Sequence...`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="resize-none text-gray-100 placeholder:text-gray-400"
            style={{
              backgroundColor: 'rgba(249, 200, 14, 0.05)',
              borderColor: '#F9C80E',
              color: '#F1F5F9'
            }}
          />
          
          <Button
            onClick={handleSubmit}
            disabled={sequenceMutation.isPending || !content.trim()}
            className="w-full"
            style={{ backgroundColor: '#F9C80E', color: '#0B0E1A' }}
          >
            {sequenceMutation.isPending ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2" />
                Elite Council Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Elite Sequence
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {sequence && (
        <div className="space-y-6 max-w-6xl mx-auto">
          {/* Confidence Score */}
          <Card style={{
            backgroundColor: 'rgba(249, 200, 14, 0.1)',
            borderColor: '#F9C80E',
            backdropFilter: 'blur(20px)'
          }}>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#F9C80E' }}>
                {sequence.councilConfidenceScore}%
              </div>
              <p className="text-sm" style={{ color: '#FDE047' }}>Council Confidence Score</p>
            </CardContent>
          </Card>

          {/* Phase 1: Fused Council Response */}
          <Card style={{
            background: 'linear-gradient(135deg, rgba(249, 200, 14, 0.15) 0%, rgba(28, 132, 255, 0.15) 100%)',
            borderColor: '#F9C80E',
            backdropFilter: 'blur(20px)'
          }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between" style={{ color: '#F1F5F9' }}>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" style={{ color: '#F9C80E' }} />
                  Phase 1: Fused Council
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(sequence.phase1FusedCouncil)}
                  style={{ color: '#F9C80E' }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
              <p className="text-xs" style={{ color: '#FDE047' }}>
                Maximus + Brutus + Valerius + Achilles Combined
              </p>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed" style={{ color: '#F1F5F9' }}>
                {sequence.phase1FusedCouncil
                  .replace(/\*\*Maximus\*\*:?\s*/gi, '')
                  .replace(/\*\*Spartacus\*\*:?\s*/gi, '')
                  .replace(/\*\*Leonidas\*\*:?\s*/gi, '')
                  .replace(/\*\*Brutus\*\*:?\s*/gi, '')
                  .replace(/\*\*Achilles\*\*:?\s*/gi, '')
                  .replace(/\*\*Valerius\*\*:?\s*/gi, '')
                  .replace(/\*\*(Maximus|Spartacus|Leonidas|Brutus|Achilles|Valerius)\*\*\s*\([^)]+\):\s*/gi, '')
                  .replace(/\*PHASE\s+\d+:\s*[^*]*\*/gi, '')
                  .trim()}
              </p>
            </CardContent>
          </Card>

          {/* Phase 2: Three Precision Archetypes */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Disruptive/Urgent */}
            <Card style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: '#EF4444',
              backdropFilter: 'blur(20px)'
            }}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2" style={{ color: '#F87171' }}>
                    <Target className="h-4 w-4" />
                    Disruptive/Urgent
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(sequence.phase2Disruptive)}
                    style={{ color: '#F87171' }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <p className="text-xs" style={{ color: '#FCA5A5' }}>Spartacus + Leonidas</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed" style={{ color: '#F1F5F9' }}>
                  {sequence.phase2Disruptive
                    .replace(/\*\*Maximus\*\*:?\s*/gi, '')
                    .replace(/\*\*Spartacus\*\*:?\s*/gi, '')
                    .replace(/\*\*Leonidas\*\*:?\s*/gi, '')
                    .replace(/\*\*Brutus\*\*:?\s*/gi, '')
                    .replace(/\*\*Achilles\*\*:?\s*/gi, '')
                    .replace(/\*\*Valerius\*\*:?\s*/gi, '')
                    .replace(/\*\*(Maximus|Spartacus|Leonidas|Brutus|Achilles|Valerius)\*\*\s*\([^)]+\):\s*/gi, '')
                    .trim()}
                </p>
              </CardContent>
            </Card>

            {/* Sophisticated/Status */}
            <Card style={{
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              borderColor: '#A855F7',
              backdropFilter: 'blur(20px)'
            }}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2" style={{ color: '#C084FC' }}>
                    <Crown className="h-4 w-4" />
                    Sophisticated/Status
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(sequence.phase2Sophisticated)}
                    style={{ color: '#C084FC' }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <p className="text-xs" style={{ color: '#DDD6FE' }}>Brutus + Achilles</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed" style={{ color: '#F1F5F9' }}>
                  {sequence.phase2Sophisticated
                    .replace(/\*\*Maximus\*\*:?\s*/gi, '')
                    .replace(/\*\*Spartacus\*\*:?\s*/gi, '')
                    .replace(/\*\*Leonidas\*\*:?\s*/gi, '')
                    .replace(/\*\*Brutus\*\*:?\s*/gi, '')
                    .replace(/\*\*Achilles\*\*:?\s*/gi, '')
                    .replace(/\*\*Valerius\*\*:?\s*/gi, '')
                    .replace(/\*\*(Maximus|Spartacus|Leonidas|Brutus|Achilles|Valerius)\*\*\s*\([^)]+\):\s*/gi, '')
                    .trim()}
                </p>
              </CardContent>
            </Card>

            {/* Structured/Outcome */}
            <Card style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderColor: '#22C55E',
              backdropFilter: 'blur(20px)'
            }}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2" style={{ color: '#4ADE80' }}>
                    <Shield className="h-4 w-4" />
                    Structured/Outcome
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(sequence.phase2Structured)}
                    style={{ color: '#4ADE80' }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <p className="text-xs" style={{ color: '#BBF7D0' }}>Maximus + Valerius</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed" style={{ color: '#F1F5F9' }}>
                  {sequence.phase2Structured
                    .replace(/\*\*Maximus\*\*:?\s*/gi, '')
                    .replace(/\*\*Spartacus\*\*:?\s*/gi, '')
                    .replace(/\*\*Leonidas\*\*:?\s*/gi, '')
                    .replace(/\*\*Brutus\*\*:?\s*/gi, '')
                    .replace(/\*\*Achilles\*\*:?\s*/gi, '')
                    .replace(/\*\*Valerius\*\*:?\s*/gi, '')
                    .replace(/\*\*(Maximus|Spartacus|Leonidas|Brutus|Achilles|Valerius)\*\*\s*\([^)]+\):\s*/gi, '')
                    .trim()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Council Insights */}
          <Card style={{
            backgroundColor: 'rgba(249, 200, 14, 0.1)',
            borderColor: '#F9C80E',
            backdropFilter: 'blur(20px)'
          }}>
            <CardHeader>
              <CardTitle style={{ color: '#F9C80E' }}>Council Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {Object.entries(sequence.insights).map(([agent, insight]) => (
                  <div key={agent} className="flex items-start gap-2">
                    <Badge variant="outline" className="text-xs" style={{ 
                      borderColor: '#F9C80E', 
                      color: '#FDE047' 
                    }}>
                      {agent}
                    </Badge>
                    <p className="text-xs" style={{ color: '#F1F5F9' }}>{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}