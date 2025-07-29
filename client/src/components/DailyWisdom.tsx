import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, X, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DailyWisdomProps {
  userTier: 'free' | 'starter' | 'pro' | 'vault';
  isVisible: boolean;
  onToggle: () => void;
}

interface WisdomQuote {
  id: string;
  quote: string;
  author: string;
  category: 'psychology' | 'marketing' | 'sales' | 'mindset';
  tier: 'all' | 'starter' | 'pro' | 'vault';
}

const WISDOM_QUOTES: WisdomQuote[] = [
  {
    id: 'w1',
    quote: "People don't buy products, they buy better versions of themselves.",
    author: "Maximus",
    category: 'psychology',
    tier: 'all'
  },
  {
    id: 'w2', 
    quote: "Attention is the new currency. Spend it wisely, earn it boldly.",
    author: "Spartacus",
    category: 'marketing',
    tier: 'all'
  },
  {
    id: 'w3',
    quote: "Urgency without value is pressure. Value without urgency is ignored.",
    author: "Leonidas", 
    category: 'sales',
    tier: 'starter'
  },
  {
    id: 'w4',
    quote: "Your offer isn't what you're selling. It's what they're buying.",
    author: "Brutus",
    category: 'psychology',
    tier: 'starter'
  },
  {
    id: 'w5',
    quote: "Elite positioning isn't about being expensive. It's about being irreplaceable.",
    author: "Achilles",
    category: 'mindset',
    tier: 'pro'
  },
  {
    id: 'w6',
    quote: "The best strategy synthesizes all perspectives into one unstoppable truth.",
    author: "Valerius",
    category: 'mindset',
    tier: 'vault'
  }
];

export default function DailyWisdom({ userTier, isVisible, onToggle }: DailyWisdomProps) {
  const [currentQuote, setCurrentQuote] = useState<WisdomQuote | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get available quotes for user tier
    const availableQuotes = WISDOM_QUOTES.filter(quote => {
      if (quote.tier === 'all') return true;
      if (userTier === 'free') return quote.tier === 'all';
      if (userTier === 'starter') return ['all', 'starter'].includes(quote.tier);
      if (userTier === 'pro') return ['all', 'starter', 'pro'].includes(quote.tier);
      if (userTier === 'vault') return true;
      return false;
    });

    // Rotate quote hourly
    const hour = new Date().getHours();
    const quoteIndex = hour % availableQuotes.length;
    setCurrentQuote(availableQuotes[quoteIndex]);
    
    // Reset voting daily
    const today = new Date().toDateString();
    const lastVoteDate = localStorage.getItem('wisdom-vote-date');
    if (lastVoteDate !== today) {
      setHasVoted(false);
      localStorage.removeItem('wisdom-vote-date');
    } else {
      setHasVoted(localStorage.getItem('wisdom-voted') === 'true');
    }
  }, [userTier]);

  const handleVote = (liked: boolean) => {
    if (hasVoted) return;
    
    setHasVoted(true);
    const today = new Date().toDateString();
    localStorage.setItem('wisdom-voted', 'true');
    localStorage.setItem('wisdom-vote-date', today);
    
    toast({
      title: liked ? "Thanks for the love!" : "Feedback noted",
      description: liked ? "Your gladiator appreciates it." : "We'll find better wisdom for you.",
    });
  };

  if (!isVisible || !currentQuote) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'psychology': 
        return {
          bg: 'bg-purple-500/20',
          text: 'text-purple-300',
          glow: 'shadow-purple-400/30',
          hover: 'hover:shadow-purple-400/50'
        };
      case 'marketing': 
        return {
          bg: 'bg-blue-500/20',
          text: 'text-blue-300',
          glow: 'shadow-blue-400/30',
          hover: 'hover:shadow-blue-400/50'
        };
      case 'sales': 
        return {
          bg: 'bg-green-500/20',
          text: 'text-green-300',
          glow: 'shadow-green-400/30',
          hover: 'hover:shadow-green-400/50'
        };
      case 'mindset': 
        return {
          bg: 'bg-orange-500/20',
          text: 'text-orange-300',
          glow: 'shadow-orange-400/30',
          hover: 'hover:shadow-orange-400/50'
        };
      default: 
        return {
          bg: 'bg-gray-500/20',
          text: 'text-gray-300',
          glow: 'shadow-gray-400/30',
          hover: 'hover:shadow-gray-400/50'
        };
    }
  };

  const categoryStyle = getCategoryColor(currentQuote.category);

  return (
    <div 
      className="daily-wisdom-card transition-all duration-700 ease-out hover:shadow-purple-500/20"
      style={{
        background: 'linear-gradient(135deg, rgba(40,40,50,0.9), rgba(25,25,35,0.85))',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
        borderRadius: '12px'
      }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Lightbulb 
                className="h-5 w-5 text-yellow-400" 
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))'
                }}
              />
            </div>
            <span className="font-semibold text-white">Daily Wisdom</span>
            <Badge 
              className={`${categoryStyle.bg} ${categoryStyle.text} border-none transition-all duration-300 ${categoryStyle.hover}`}
              style={{
                backdropFilter: 'blur(8px)',
                boxShadow: `0 0 12px ${categoryStyle.glow}`
              }}
              variant="outline"
            >
              {currentQuote.category}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <blockquote className="text-gray-200 italic mb-4 leading-relaxed text-[15px] font-light">
          "{currentQuote.quote}"
        </blockquote>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">
            — {currentQuote.author}
          </span>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote(true)}
              disabled={hasVoted}
              className={`h-8 px-2 text-gray-400 transition-all duration-300 ${
                hasVoted 
                  ? 'opacity-50' 
                  : 'hover:text-green-400 hover:bg-green-400/10 hover:shadow-green-400/30'
              }`}
              style={{
                boxShadow: !hasVoted ? '0 0 8px transparent' : 'none'
              }}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote(false)}
              disabled={hasVoted}
              className={`h-8 px-2 text-gray-400 transition-all duration-300 ${
                hasVoted 
                  ? 'opacity-50' 
                  : 'hover:text-red-400 hover:bg-red-400/10 hover:shadow-red-400/30'
              }`}
              style={{
                boxShadow: !hasVoted ? '0 0 8px transparent' : 'none'
              }}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {hasVoted && (
          <p className="text-xs text-gray-400 mt-3 opacity-80">
            New wisdom refreshes hourly. Come back tomorrow to vote again!
          </p>
        )}
      </div>
    </div>
  );
}