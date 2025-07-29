import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles, Crown, Shield, TrendingUp, Users, Target, Zap, Award } from "lucide-react";

interface IndustryBackground {
  name: string;
  gradient: string;
  primaryColor: string;
  accentColor: string;
  image?: string;
  pattern: string;
}

const INDUSTRY_THEMES: Record<string, IndustryBackground> = {
  fitness: {
    name: "Fitness & Health",
    gradient: "from-emerald-900 via-teal-900 to-cyan-900",
    primaryColor: "emerald-400",
    accentColor: "gold",
    pattern: "radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)"
  },
  business: {
    name: "Business & Executive",
    gradient: "from-slate-900 via-blue-900 to-indigo-900",
    primaryColor: "blue-400", 
    accentColor: "platinum",
    pattern: "radial-gradient(circle at 75% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
  },
  finance: {
    name: "Finance & Investment",
    gradient: "from-gray-900 via-slate-800 to-zinc-900",
    primaryColor: "yellow-400",
    accentColor: "gold",
    pattern: "radial-gradient(circle at 50% 75%, rgba(234, 179, 8, 0.1) 0%, transparent 50%)"
  },
  coaching: {
    name: "Life & Leadership Coaching",
    gradient: "from-purple-900 via-violet-900 to-indigo-900",
    primaryColor: "purple-400",
    accentColor: "rose-gold",
    pattern: "radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)"
  },
  default: {
    name: "Premium Consulting",
    gradient: "from-gray-900 via-slate-900 to-zinc-900",
    primaryColor: "amber-400",
    accentColor: "gold",
    pattern: "radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.08) 0%, transparent 50%)"
  }
};

interface EliteVaultExperienceProps {
  industry?: string;
  children: React.ReactNode;
  showLuxuryElements?: boolean;
}

export default function EliteVaultExperience({ 
  industry = "default", 
  children, 
  showLuxuryElements = true 
}: EliteVaultExperienceProps) {
  const [theme, setTheme] = useState<IndustryBackground>(INDUSTRY_THEMES.default);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const selectedTheme = INDUSTRY_THEMES[industry.toLowerCase()] || INDUSTRY_THEMES.default;
    setTheme(selectedTheme);

    // Generate floating sparkles for luxury effect
    if (showLuxuryElements) {
      const newSparkles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 4
      }));
      setSparkles(newSparkles);
    }
  }, [industry, showLuxuryElements]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Elite Background with Industry-Specific Gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}
        style={{ 
          backgroundImage: theme.pattern,
          backgroundBlendMode: "overlay"
        }}
      />
      
      {/* Luxury Geometric Patterns */}
      <div className="absolute inset-0">
        <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 100 100">
          <defs>
            <pattern id="luxury-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#luxury-grid)"/>
        </svg>
        
        {/* Floating luxury elements */}
        {showLuxuryElements && sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className={`absolute w-1 h-1 bg-${theme.accentColor} rounded-full`}
            style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 4,
              delay: sparkle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Premium Glass Morphism Overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
      
      {/* Elite Header Banner */}
      {showLuxuryElements && (
        <motion.div 
          className="relative z-20 bg-gradient-to-r from-black/40 via-black/20 to-black/40 backdrop-blur-md border-b border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Crown className={`w-6 h-6 text-${theme.accentColor}`} />
                <span className="text-white/90 font-light tracking-wider text-sm">
                  VAULTFORGE ELITE
                </span>
              </motion.div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-white/70 text-xs">
                <Shield className="w-4 h-4" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70 text-xs">
                <Award className="w-4 h-4" />
                <span>{theme.name}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content Area with Consulting Firm Layout */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>

      {/* Elite Footer Accent */}
      {showLuxuryElements && (
        <div className="fixed bottom-0 left-0 right-0 z-30 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
    </div>
  );
}

export const LuxuryCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ 
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
    }}
  >
    {children}
  </motion.div>
);

export const ConsultingSection = ({ 
  title, 
  subtitle, 
  children, 
  icon: Icon,
  gradient = "from-white/10 to-white/5"
}: { 
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: any;
  gradient?: string;
}) => (
  <motion.section
    className={`bg-gradient-to-br ${gradient} backdrop-blur-xl rounded-2xl p-10 border border-white/10 shadow-2xl`}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7 }}
  >
    <div className="flex items-center space-x-4 mb-8">
      {Icon && <Icon className="w-8 h-8 text-amber-400" />}
      <div>
        <h2 className="text-3xl font-light text-white tracking-wide">{title}</h2>
        {subtitle && (
          <p className="text-white/60 text-lg font-light mt-2">{subtitle}</p>
        )}
      </div>
    </div>
    {children}
  </motion.section>
);

export const MetricDisplay = ({ 
  value, 
  label, 
  trend, 
  color = "amber" 
}: { 
  value: string;
  label: string;
  trend?: "up" | "down";
  color?: string;
}) => (
  <motion.div
    className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className={`text-4xl font-light text-${color}-400 mb-2 tracking-wide`}>{value}</div>
    <div className="text-white/70 text-sm uppercase tracking-wider">{label}</div>
    {trend && (
      <TrendingUp className={`w-4 h-4 mx-auto mt-2 ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`} />
    )}
  </motion.div>
);