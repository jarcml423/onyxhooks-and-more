import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Trophy, 
  Zap, 
  Flag, 
  Users, 
  Settings,
  Play,
  Pause,
  Eye,
  Timer
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ChallengeEntry {
  id: number;
  displayName: string;
  timeToGenerate: number;
  timeFormatted: string;
  tier: string;
  attemptNumber: number;
  createdAt: Date;
}

export default function NOSChallengeAdmin() {
  const [challengeActive, setChallengeActive] = useState(true);
  const { toast } = useToast();

  // Fetch challenge entries
  const { data: entriesData, isLoading: entriesLoading } = useQuery<{
    success: boolean,
    entries: ChallengeEntry[],
    totalEntries: number
  }>({
    queryKey: ['/api/admin/challenge/entries'],
    refetchInterval: 30000
  });

  // Toggle challenge mutation
  const toggleChallenge = useMutation({
    mutationFn: async (active: boolean) => {
      const response = await apiRequest('POST', '/api/admin/challenge/toggle', { active });
      return response.json();
    },
    onSuccess: (data: { success: boolean, challengeActive: boolean, message: string }) => {
      if (data.success) {
        setChallengeActive(data.challengeActive);
        queryClient.invalidateQueries({ queryKey: ['/api/challenge/config'] });
        toast({
          title: "Challenge Status Updated",
          description: data.message,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update challenge status",
        variant: "destructive"
      });
    }
  });

  const handleToggleChallenge = () => {
    toggleChallenge.mutate(!challengeActive);
  };

  const formatTime = (ms: number) => {
    const seconds = ms / 1000;
    return `${seconds.toFixed(3)}s`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <Card className="bg-slate-800/90 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Settings className="w-6 h-6 text-purple-400" />
            NOS Challenge Administration
            <Zap className="w-6 h-6 text-yellow-400" />
          </CardTitle>
          <p className="text-slate-300">
            Manage the quarterly 9-second content creation challenge system
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Challenge Controls */}
        <div className="space-y-6">
          <Card className="bg-slate-800/90 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Flag className="w-5 h-5 text-purple-400" />
                Challenge Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Challenge Status:</span>
                <Badge 
                  variant={challengeActive ? "default" : "secondary"}
                  className={challengeActive ? "bg-green-600" : "bg-red-600"}
                >
                  {challengeActive ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>
              
              <Button
                onClick={handleToggleChallenge}
                disabled={toggleChallenge.isPending}
                className={`w-full ${
                  challengeActive 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {toggleChallenge.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {challengeActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {challengeActive ? "Deactivate Challenge" : "Activate Challenge"}
                  </div>
                )}
              </Button>

              <div className="text-sm text-slate-400 space-y-1">
                <div>Current Cycle: Q1-2025</div>
                <div>Total Entries: {entriesData?.totalEntries || 0}</div>
                <div>Active Until: Mar 31, 2025</div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-slate-800/90 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Today's Entries:</span>
                <span className="text-white">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Fastest Today:</span>
                <span className="text-purple-400 font-bold">4.23s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Avg Time:</span>
                <span className="text-white">8.42s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Eligible Users:</span>
                <span className="text-white">Free + Starter</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Entries */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/90 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Recent Challenge Entries
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  Live Feed
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {entriesLoading ? (
                <div className="text-center text-slate-400 py-8">
                  Loading entries...
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {entriesData?.entries?.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded bg-slate-700/50 hover:bg-slate-700/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Timer className="w-4 h-4 text-purple-400" />
                          <span className="text-white font-medium">{entry.displayName}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {entry.tier}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-slate-400">
                          Attempt #{entry.attemptNumber}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-purple-400 font-mono font-bold">
                            {entry.timeFormatted}
                          </div>
                          <div className="text-xs text-slate-400">
                            {formatDate(entry.createdAt)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {(!entriesData?.entries || entriesData.entries.length === 0) && (
                    <div className="text-center text-slate-400 py-8">
                      No challenge entries yet
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Challenge Configuration */}
      <Card className="bg-slate-800/90 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            Challenge Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-white text-sm font-medium">Max Attempts Per Cycle</label>
              <Input
                type="number"
                defaultValue="2"
                className="mt-1 bg-slate-700 border-purple-500/30 text-white"
                disabled
              />
            </div>
            <div>
              <label className="text-white text-sm font-medium">Cycle Start Date</label>
              <Input
                type="date"
                defaultValue="2025-01-01"
                className="mt-1 bg-slate-700 border-purple-500/30 text-white"
                disabled
              />
            </div>
            <div>
              <label className="text-white text-sm font-medium">Cycle End Date</label>
              <Input
                type="date"
                defaultValue="2025-03-31"
                className="mt-1 bg-slate-700 border-purple-500/30 text-white"
                disabled
              />
            </div>
          </div>
          
          <div className="mt-4 text-sm text-slate-400">
            <p>• Challenge is restricted to Free and Starter tier users only</p>
            <p>• Each user can submit maximum 2 attempts per quarterly cycle</p>
            <p>• Leaderboard resets at the start of each new quarter</p>
            <p>• Racing heritage: Inspired by 200+ MPH motorcycle drag racing</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}