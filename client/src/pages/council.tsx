import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Zap, Crown, Lock } from 'lucide-react';
import AgentCouncil from '@/components/AgentCouncil';
import PersuasionGame from '@/components/PersuasionGame';
import DailyWisdom from '@/components/DailyWisdom';
import ScarcityCounter from '@/components/ScarcityCounter';
import CouncilSequence from '@/components/CouncilSequence';
import TierIcon from '@/components/TierIcon';

export default function CouncilPage() {
  const [currentTier, setCurrentTier] = useState<'free' | 'starter' | 'pro' | 'vault'>('vault'); // Demo tier
  const [showWisdom, setShowWisdom] = useState(true);
  
  // Mock usage data for demo - aligned with executive summary limits
  const usageData = {
    free: { used: 1, limit: 2 },
    starter: { used: 234, limit: 1000 },
    pro: { used: 567, limit: 1000 },
    vault: { used: 0, limit: 1 }
  };

  const usage = usageData[currentTier];

  // Scarcity data for different tiers - represents total membership spots available
  const scarcityData = {
    free: { total: 10000, used: 8234 },
    starter: { total: 1000, used: 972 },
    pro: { total: 500, used: 487 },
    vault: { total: 100, used: 99 } // Only 1 spot left for Vault membership
  };

  return (
    <div className="min-h-screen" style={{ 
      background: "linear-gradient(135deg, #0B0E1A 0%, #111827 25%, #1C2333 50%, #0F172A 75%, #0B0E1A 100%)"
    }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-8 w-8" style={{ color: "#F9C80E" }} />
            <h1 className="text-4xl font-bold" style={{
              background: "linear-gradient(135deg, #1C84FF 0%, #F9C80E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              OnyxHooks Council
            </h1>
          </div>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: "#94A3B8" }}>
            Six gladiator AI agents analyze your content with legendary precision and conversion mastery
          </p>

          {/* Daily Wisdom - Only for Starter+ */}
          {currentTier !== 'free' && (
            <div className="max-w-2xl mx-auto mt-6">
              <DailyWisdom 
                userTier={currentTier}
                isVisible={showWisdom}
                onToggle={() => setShowWisdom(!showWisdom)}
              />
            </div>
          )}

          {/* Scarcity Counter */}
          <div className="max-w-xs mx-auto mt-6">
            <ScarcityCounter
              tier={currentTier}
              totalSpots={scarcityData[currentTier].total}
              usedSpots={scarcityData[currentTier].used}
              showAnimation={true}
            />
          </div>
        </div>



        {/* Demo Mode: Tier Selection Cards */}
        <div className="text-center mb-6">
          <p className="text-sm" style={{ color: "#94A3B8" }}>Demo Mode: Click any tier to test the experience</p>
        </div>
        
        {/* Enhanced Tier Overview Cards with 3D Icons */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className={`cursor-pointer transition-all duration-300 hover:scale-105 ${currentTier === 'free' ? 'ring-2 ring-cyan-400' : ''}`}
                style={{
                  backgroundColor: currentTier === 'free' ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  borderColor: currentTier === 'free' ? '#22D3EE' : 'rgba(34, 211, 238, 0.3)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: currentTier === 'free' ? '0 0 20px rgba(34, 211, 238, 0.3)' : 'none'
                }}
                onClick={() => setCurrentTier('free')}>
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <TierIcon tier="free" isActive={currentTier === 'free'} size="medium" />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ 
                color: currentTier === 'free' ? '#22D3EE' : '#E2E8F0',
                textShadow: currentTier === 'free' ? '0 0 8px rgba(34, 211, 238, 0.6)' : 'none'
              }}>
                FREE
              </h3>
              <p className="text-sm mb-3" style={{ color: '#94A3B8' }}>Blurred feedback</p>
              <Badge 
                variant="outline" 
                className="transition-all duration-300" 
                style={{ 
                  borderColor: currentTier === 'free' ? '#22D3EE' : '#64748B', 
                  color: currentTier === 'free' ? '#22D3EE' : '#64748B',
                  boxShadow: currentTier === 'free' ? '0 0 8px rgba(34, 211, 238, 0.4)' : 'none'
                }}
              >
                100/month
              </Badge>
            </CardContent>
          </Card>
          
          <Card className={`cursor-pointer transition-all duration-300 hover:scale-105 ${currentTier === 'starter' ? 'ring-2 ring-green-400' : ''}`}
                style={{
                  backgroundColor: currentTier === 'starter' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.05)',
                  borderColor: currentTier === 'starter' ? '#10B981' : 'rgba(16, 185, 129, 0.3)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: currentTier === 'starter' ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none'
                }}
                onClick={() => setCurrentTier('starter')}>
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <TierIcon tier="starter" isActive={currentTier === 'starter'} size="medium" />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ 
                color: currentTier === 'starter' ? '#10B981' : '#10B981',
                textShadow: currentTier === 'starter' ? '0 0 8px rgba(16, 185, 129, 0.6)' : 'none'
              }}>
                STARTER
              </h3>
              <p className="text-sm mb-3" style={{ color: '#6EE7B7' }}>Full text feedback</p>
              <Badge 
                className="transition-all duration-300" 
                style={{ 
                  backgroundColor: currentTier === 'starter' ? '#10B981' : 'rgba(16, 185, 129, 0.7)', 
                  color: '#FFFFFF',
                  boxShadow: currentTier === 'starter' ? '0 0 12px rgba(16, 185, 129, 0.6)' : 'none'
                }}
              >
                1,000/month
              </Badge>
            </CardContent>
          </Card>
          
          <Card className={`cursor-pointer transition-all duration-300 hover:scale-105 ${currentTier === 'pro' ? 'ring-2 ring-blue-400' : ''}`}
                style={{
                  backgroundColor: currentTier === 'pro' ? 'rgba(28, 132, 255, 0.15)' : 'rgba(28, 132, 255, 0.05)',
                  borderColor: currentTier === 'pro' ? '#1C84FF' : 'rgba(28, 132, 255, 0.3)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: currentTier === 'pro' ? '0 0 20px rgba(28, 132, 255, 0.3)' : 'none'
                }}
                onClick={() => setCurrentTier('pro')}>
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <TierIcon tier="pro" isActive={currentTier === 'pro'} size="medium" />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ 
                color: currentTier === 'pro' ? '#1C84FF' : '#1C84FF',
                textShadow: currentTier === 'pro' ? '0 0 8px rgba(28, 132, 255, 0.6)' : 'none'
              }}>
                PRO
              </h3>
              <p className="text-sm mb-3" style={{ color: '#7DD3FC' }}>Real-time collab + audio</p>
              <Badge 
                className="transition-all duration-300" 
                style={{ 
                  backgroundColor: currentTier === 'pro' ? '#1C84FF' : 'rgba(28, 132, 255, 0.7)', 
                  color: '#FFFFFF',
                  boxShadow: currentTier === 'pro' ? '0 0 12px rgba(28, 132, 255, 0.6)' : 'none'
                }}
              >
                1,000/month
              </Badge>
            </CardContent>
          </Card>
          
          <Card className={`cursor-pointer transition-all duration-300 hover:scale-105 ${currentTier === 'vault' ? 'ring-2 ring-yellow-400' : ''}`}
                style={{
                  backgroundColor: currentTier === 'vault' ? 'rgba(249, 200, 14, 0.15)' : 'rgba(249, 200, 14, 0.05)',
                  borderColor: currentTier === 'vault' ? '#F9C80E' : 'rgba(249, 200, 14, 0.3)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: currentTier === 'vault' ? '0 0 20px rgba(249, 200, 14, 0.3)' : 'none'
                }}
                onClick={() => setCurrentTier('vault')}>
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <TierIcon tier="vault" isActive={currentTier === 'vault'} size="medium" />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ 
                color: currentTier === 'vault' ? '#F9C80E' : '#F9C80E',
                textShadow: currentTier === 'vault' ? '0 0 8px rgba(249, 200, 14, 0.6)' : 'none'
              }}>
                VAULT
              </h3>
              <p className="text-sm mb-3" style={{ color: '#FDE047' }}>Cinematic experience</p>
              <Badge 
                className="transition-all duration-300" 
                style={{ 
                  backgroundColor: currentTier === 'vault' ? '#F9C80E' : 'rgba(249, 200, 14, 0.7)', 
                  color: '#0B0E1A',
                  boxShadow: currentTier === 'vault' ? '0 0 12px rgba(249, 200, 14, 0.6)' : 'none',
                  fontWeight: 'bold'
                }}
              >
                1/month
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="council" className="w-full">
          <TabsList className={`grid w-full ${currentTier === 'vault' ? 'grid-cols-3' : 'grid-cols-2'} max-w-lg mx-auto mb-8`} style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(28, 132, 255, 0.3)',
            backdropFilter: 'blur(20px)'
          }}>
            <TabsTrigger value="council" className="flex items-center gap-2" style={{
              color: '#E2E8F0'
            }}>
              <Users className="h-4 w-4" />
              Council
            </TabsTrigger>
            {currentTier === 'vault' && (
              <TabsTrigger value="sequence" className="flex items-center gap-2" style={{
                color: '#F9C80E'
              }}>
                <Crown className="h-4 w-4" />
                Elite Sequence
              </TabsTrigger>
            )}
            <TabsTrigger value="game" className="flex items-center gap-2" style={{
              color: '#E2E8F0'
            }}>
              <Trophy className="h-4 w-4" />
              Arena
            </TabsTrigger>
          </TabsList>

          <TabsContent value="council">
            <AgentCouncil 
              userTier={currentTier}
              generationsUsed={usage.used}
              generationLimit={usage.limit}
            />
          </TabsContent>

          {currentTier === 'vault' && (
            <TabsContent value="sequence">
              <CouncilSequence userTier={currentTier} />
            </TabsContent>
          )}

          <TabsContent value="game">
            <PersuasionGame 
              userTier={currentTier}
              canPlay={currentTier !== 'free'}
              playsRemaining={currentTier === 'free' ? 0 : 1}
            />
          </TabsContent>
        </Tabs>

        {/* Agent Profiles Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#E2E8F0' }}>Meet Your Gladiator Council</h2>
            <p style={{ color: '#94A3B8' }}>Six legendary warriors with unique expertise and battle-tested wisdom</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Maximus",
                title: "Strategic Advisor",
                color: "blue",
                specialty: "Surgical analysis and outcome optimization",
                tone: "Calm, analytical, outcome-focused"
              },
              {
                name: "Spartacus",
                title: "Growth Tactician",
                color: "red", 
                specialty: "Pattern interrupts and viral mechanics",
                tone: "Direct, energetic, attention-focused"
              },
              {
                name: "Leonidas",
                title: "Conversion Expert",
                color: "green",
                specialty: "High-ticket sales psychology and urgency",
                tone: "Confident, results-driven, urgent"
              },
              {
                name: "Brutus",
                title: "Value Stack King",
                color: "purple",
                specialty: "Offer architecture and value engineering",
                tone: "Strategic, methodical, layered"
              },
              {
                name: "Achilles",
                title: "Elite Persuasion",
                color: "yellow",
                specialty: "Wealth-coded messaging and elite positioning",
                tone: "Disruptive, metaphor-rich, aspirational"
              },
              {
                name: "Valerius",
                title: "Harmonizer/Closer",
                color: "gray",
                specialty: "Council synthesis and executive guidance",
                tone: "Warm, structured, closing-focused"
              }
            ].map((agent, index) => (
              <Card 
                key={index} 
                className="gladiator-card hover:shadow-lg transition-all duration-500 group relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(38,40,58, 0.85), rgba(20,20,30, 0.95))',
                  boxShadow: '0 0 12px rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '14px',
                  backdropFilter: 'blur(4px)',
                  animation: `fadeInCard 0.8s ease-in ${index * 0.1}s both`
                }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div 
                      className={`gladiator-dot w-3 h-3 rounded-full transition-all duration-300 cursor-pointer group-hover:scale-110`}
                      style={{
                        backgroundColor: agent.color === 'blue' ? '#3b82f6' :
                                       agent.color === 'red' ? '#ef4444' :
                                       agent.color === 'green' ? '#10b981' :
                                       agent.color === 'purple' ? '#8b5cf6' :
                                       agent.color === 'yellow' ? '#f59e0b' :
                                       '#6b7280',
                        boxShadow: `0 0 8px ${
                          agent.color === 'blue' ? '#3b82f6' :
                          agent.color === 'red' ? '#ef4444' :
                          agent.color === 'green' ? '#10b981' :
                          agent.color === 'purple' ? '#8b5cf6' :
                          agent.color === 'yellow' ? '#f59e0b' :
                          '#6b7280'
                        }`
                      }}
                      title={`Council Role: ${agent.title}`}
                    />
                    <div>
                      <CardTitle 
                        className="gladiator-name" 
                        style={{ 
                          fontSize: '1.25rem',
                          fontWeight: '700',
                          letterSpacing: '0.3px',
                          color: '#fff'
                        }}
                      >
                        {agent.name}
                      </CardTitle>
                      <p 
                        className="gladiator-role" 
                        style={{ 
                          fontSize: '0.875rem',
                          color: '#aaa',
                          fontStyle: 'italic'
                        }}
                      >
                        {agent.title}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div 
                    className="specialty-section"
                    style={{
                      marginTop: '0.5rem',
                      paddingLeft: '1rem',
                      borderLeft: '2px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    <h4 className="text-sm font-medium mb-1 subheading-glow" style={{ 
                      color: '#eee',
                      textShadow: '0 0 4px rgba(255,255,255,0.05)'
                    }}>Specialty</h4>
                    <p className="text-sm" style={{ color: '#94A3B8' }}>{agent.specialty}</p>
                  </div>
                  <div 
                    className="tone-section"
                    style={{
                      marginTop: '0.5rem',
                      paddingLeft: '1rem',
                      borderLeft: '2px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    <h4 className="text-sm font-medium mb-1 subheading-glow" style={{ 
                      color: '#eee',
                      textShadow: '0 0 4px rgba(255,255,255,0.05)'
                    }}>Tone</h4>
                    <p className="text-sm" style={{ color: '#94A3B8' }}>{agent.tone}</p>
                  </div>
                </CardContent>
                
                {/* Elite Mode Easter Egg - Gladiator Quote Overlay */}
                <div 
                  className="gladiator-quote absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-2000 flex items-center justify-center pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(15,17,27,0.9))',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '14px'
                  }}
                >
                  <div className="text-center p-6">
                    <blockquote 
                      className="text-sm italic mb-2 leading-relaxed"
                      style={{ color: '#E2E8F0' }}
                    >
                      "{
                        agent.name === 'Maximus' ? 'Strength and honor guide every strategic decision.' :
                        agent.name === 'Spartacus' ? 'Freedom comes to those who dare to break the chains of mediocrity.' :
                        agent.name === 'Leonidas' ? 'This is Sparta! Where offers become legends.' :
                        agent.name === 'Brutus' ? 'Your offer isn\'t what you\'re selling. It\'s what they\'re buying.' :
                        agent.name === 'Achilles' ? 'Glory belongs to those who seize it with both hands.' :
                        'The wise strategist synthesizes all perspectives into one unstoppable truth.'
                      }"
                    </blockquote>
                    <cite 
                      className="text-xs font-medium"
                      style={{ 
                        color: agent.color === 'blue' ? '#3b82f6' :
                               agent.color === 'red' ? '#ef4444' :
                               agent.color === 'green' ? '#10b981' :
                               agent.color === 'purple' ? '#8b5cf6' :
                               agent.color === 'yellow' ? '#f59e0b' :
                               '#6b7280'
                      }}
                    >
                      — {agent.name}
                    </cite>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Upgrade CTA for Free Users */}
        {currentTier === 'free' && (
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto" style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(28, 132, 255, 0.1) 100%)',
              borderColor: 'rgba(28, 132, 255, 0.3)',
              backdropFilter: 'blur(20px)'
            }}>
              <CardContent className="p-8">
                <Crown className="h-12 w-12 mx-auto mb-4" style={{ color: '#F9C80E' }} />
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#E2E8F0' }}>
                  Unlock the Full Council Experience
                </h3>
                <p className="mb-6" style={{ color: '#94A3B8' }}>
                  Get unblurred agent feedback, play the Persuasion Challenge, and access advanced collaboration features.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Badge className="bg-green-600 text-lg px-6 py-3">
                    Starter - $47 one-time
                  </Badge>
                  <Badge className="bg-blue-600 text-lg px-6 py-3">
                    Pro - $197/month
                  </Badge>
                  <Badge className="bg-purple-600 text-lg px-6 py-3">
                    Vault - $5,000/year
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}