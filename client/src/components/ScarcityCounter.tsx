import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Zap, Crown } from 'lucide-react';

interface ScarcityCounterProps {
  tier: 'free' | 'starter' | 'pro' | 'vault';
  totalSpots: number;
  usedSpots: number;
  showAnimation?: boolean;
}

export default function ScarcityCounter({ tier, totalSpots, usedSpots, showAnimation = true }: ScarcityCounterProps) {
  const [animatedUsed, setAnimatedUsed] = useState(usedSpots);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (showAnimation && usedSpots !== animatedUsed) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setAnimatedUsed(usedSpots);
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [usedSpots, animatedUsed, showAnimation]);

  const remaining = totalSpots - animatedUsed;
  const percentage = (animatedUsed / totalSpots) * 100;
  
  const getTierConfig = () => {
    switch (tier) {
      case 'free':
        return {
          icon: <Users className="h-4 w-4" />,
          color: 'bg-cyan-500',
          progressGlow: '0 0 6px #06b6d4',
          label: 'Free',
          urgency: percentage > 90 ? 'Critical' : percentage > 75 ? 'High' : 'Normal'
        };
      case 'starter':
        return {
          icon: <Clock className="h-4 w-4" />,
          color: 'bg-emerald-500',
          progressGlow: '0 0 6px #10b981',
          label: 'Starter',
          urgency: percentage > 95 ? 'Critical' : percentage > 85 ? 'High' : 'Normal'
        };
      case 'pro':
        return {
          icon: <Zap className="h-4 w-4" />,
          color: 'bg-blue-500',
          progressGlow: '0 0 6px #3b82f6',
          label: 'Pro',
          urgency: percentage > 98 ? 'Critical' : percentage > 90 ? 'High' : 'Normal'
        };
      case 'vault':
        return {
          icon: <Crown className="h-4 w-4" />,
          color: 'bg-purple-500',
          progressGlow: '0 0 6px #c47dff',
          label: 'Vault',
          urgency: percentage > 99 ? 'Critical' : percentage > 95 ? 'High' : 'Normal'
        };
    }
  };

  const config = getTierConfig();
  
  const getUrgencyColor = () => {
    switch (config.urgency) {
      case 'Critical': 
        return {
          text: 'text-red-400 font-bold',
          glow: '0 0 6px rgba(255, 79, 79, 0.7)'
        };
      case 'High': 
        return {
          text: 'text-amber-400 font-semibold',
          glow: '0 0 6px rgba(251, 191, 36, 0.7)'
        };
      default: 
        return {
          text: 'text-gray-300',
          glow: 'none'
        };
    }
  };

  const urgencyStyle = getUrgencyColor();

  return (
    <div 
      className={`scarcity-counter transition-all duration-500 ${config.urgency === 'Critical' ? 'scarcity-pulse' : ''}`}
      style={{
        background: 'rgba(18, 18, 18, 0.65)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: `0 2px 12px ${tier === 'vault' ? 'rgba(147, 92, 255, 0.35)' : 'rgba(59, 130, 246, 0.25)'}`,
        borderRadius: '14px',
        padding: '16px'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Badge 
            className={`${config.color} text-white rounded-full border-none transition-all duration-300 hover:scale-105`}
            style={{
              boxShadow: config.progressGlow
            }}
          >
            {config.icon}
            {config.label}
          </Badge>
          {config.urgency === 'Critical' && (
            <Badge 
              variant="destructive" 
              className="animate-pulse rounded-full border-none"
              style={{
                background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)'
              }}
            >
              Almost Full!
            </Badge>
          )}
        </div>
        <div 
          className={`text-sm font-medium ${urgencyStyle.text} transition-all duration-300`}
          style={{
            textShadow: urgencyStyle.glow
          }}
        >
          {remaining.toLocaleString()} spot{remaining !== 1 ? 's' : ''} left
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Claimed</span>
          <span>{animatedUsed.toLocaleString()} / {totalSpots.toLocaleString()}</span>
        </div>
        
        <div 
          className="w-full rounded-full h-3 overflow-hidden"
          style={{
            background: 'rgba(31, 41, 55, 0.8)',
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}
        >
          <div 
            className={`h-full transition-all duration-500 ease-out progress-bar-pulse ${isAnimating ? 'animate-pulse' : ''}`}
            style={{ 
              width: `${Math.min(percentage, 100)}%`,
              background: tier === 'vault' 
                ? 'linear-gradient(90deg, #b76eff, #9d4eff)'
                : `linear-gradient(90deg, ${config.color.replace('bg-', '#')}, ${config.color.replace('bg-', '#')}dd)`,
              boxShadow: config.progressGlow
            }}
          />
        </div>
        
        <div className="text-xs text-gray-400 text-center">
          {percentage.toFixed(1)}% capacity
          {config.urgency === 'Critical' && (
            <span 
              className="font-bold ml-2"
              style={{
                color: '#ff4f4f',
                textShadow: '0 0 6px rgba(255, 79, 79, 0.7)'
              }}
            >
              Almost sold out!
            </span>
          )}
          {tier === 'vault' && remaining <= 1 && (
            <div 
              className="text-xs font-medium mt-2"
              style={{
                color: '#c47dff',
                textShadow: '0 0 8px rgba(196, 125, 255, 0.6)'
              }}
            >
              Elite membership access • Limited to 1 generation/month
            </div>
          )}
        </div>
      </div>
    </div>
  );
}