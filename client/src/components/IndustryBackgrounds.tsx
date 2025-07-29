import { motion } from "framer-motion";

interface IndustryBackgroundProps {
  industry: string;
  children: React.ReactNode;
  className?: string;
}

const INDUSTRY_STYLES = {
  fitness: {
    backgroundImage: `
      linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 50%, rgba(4, 120, 87, 0.08) 100%),
      radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.10) 0%, transparent 50%),
      linear-gradient(45deg, transparent 25%, rgba(16, 185, 129, 0.04) 50%, transparent 75%)
    `,
    backgroundColor: "#0a0f1c",
    accent: "emerald",
    pattern: "fitness",
    primaryColor: "#10b981",
    secondaryColor: "#059669"
  },
  business: {
    backgroundImage: `
      linear-gradient(135deg, rgba(59, 130, 246, 0.22) 0%, rgba(37, 99, 235, 0.15) 50%, rgba(29, 78, 216, 0.08) 100%),
      radial-gradient(circle at 75% 25%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
      radial-gradient(circle at 25% 75%, rgba(99, 102, 241, 0.10) 0%, transparent 50%),
      linear-gradient(90deg, transparent 35%, rgba(59, 130, 246, 0.05) 60%, transparent 85%)
    `,
    backgroundColor: "#0c1426",
    accent: "blue",
    pattern: "business",
    primaryColor: "#3b82f6",
    secondaryColor: "#2563eb"
  },
  finance: {
    backgroundImage: `
      linear-gradient(135deg, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.18) 50%, rgba(180, 83, 9, 0.10) 100%),
      radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(251, 191, 36, 0.12) 0%, transparent 50%),
      linear-gradient(60deg, transparent 30%, rgba(245, 158, 11, 0.06) 55%, transparent 80%)
    `,
    backgroundColor: "#1a1612",
    accent: "amber",
    pattern: "finance",
    primaryColor: "#f59e0b",
    secondaryColor: "#d97706"
  },
  technology: {
    backgroundImage: `
      linear-gradient(135deg, rgba(139, 92, 246, 0.24) 0%, rgba(124, 58, 237, 0.16) 50%, rgba(109, 40, 217, 0.08) 100%),
      radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.14) 0%, transparent 50%),
      radial-gradient(circle at 70% 60%, rgba(167, 139, 250, 0.11) 0%, transparent 50%),
      linear-gradient(120deg, transparent 20%, rgba(139, 92, 246, 0.05) 50%, transparent 80%)
    `,
    backgroundColor: "#0c0a1f",
    accent: "violet",
    pattern: "technology",
    primaryColor: "#8b5cf6",
    secondaryColor: "#7c3aed"
  },
  consulting: {
    backgroundImage: `
      linear-gradient(135deg, rgba(107, 114, 128, 0.25) 0%, rgba(75, 85, 99, 0.16) 50%, rgba(55, 65, 81, 0.08) 100%),
      radial-gradient(circle at 60% 20%, rgba(156, 163, 175, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 20% 80%, rgba(209, 213, 219, 0.12) 0%, transparent 50%),
      linear-gradient(30deg, transparent 25%, rgba(107, 114, 128, 0.05) 50%, transparent 75%)
    `,
    backgroundColor: "#0f1419",
    accent: "slate",
    pattern: "consulting",
    primaryColor: "#6b7280",
    secondaryColor: "#4b5563"
  },
  default: {
    backgroundImage: `
      linear-gradient(135deg, rgba(245, 158, 11, 0.24) 0%, rgba(217, 119, 6, 0.15) 50%, rgba(180, 83, 9, 0.08) 100%),
      radial-gradient(circle at 40% 60%, rgba(245, 158, 11, 0.12) 0%, transparent 50%),
      radial-gradient(circle at 80% 30%, rgba(251, 191, 36, 0.10) 0%, transparent 50%),
      linear-gradient(45deg, transparent 35%, rgba(245, 158, 11, 0.04) 60%, transparent 85%)
    `,
    backgroundColor: "#0a1220",
    accent: "amber",
    pattern: "default",
    primaryColor: "#f59e0b",
    secondaryColor: "#d97706"
  }
};

export default function IndustryBackground({ industry, children, className = "" }: IndustryBackgroundProps) {
  const style = INDUSTRY_STYLES[industry.toLowerCase() as keyof typeof INDUSTRY_STYLES] || INDUSTRY_STYLES.default;

  return (
    <motion.div
      className={`min-h-screen relative overflow-hidden ${className}`}
      style={{
        backgroundImage: style.backgroundImage,
        backgroundColor: style.backgroundColor
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Premium Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30 backdrop-blur-[0.5px]" />
      
      {/* Luxury Geometric Grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%">
          <defs>
            <pattern 
              id={`luxury-grid-${style.pattern}`} 
              x="0" 
              y="0" 
              width="40" 
              height="40" 
              patternUnits="userSpaceOnUse"
            >
              <path 
                d="M 40 0 L 0 0 0 40" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5"
                className="text-white"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#luxury-grid-${style.pattern})`} />
        </svg>
      </div>

      {/* Dynamic Particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 bg-${style.accent}-400/30 rounded-full`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Content Container */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export const LuxurySection = ({ 
  children, 
  className = "",
  accent = "amber"
}: { 
  children: React.ReactNode;
  className?: string;
  accent?: string;
}) => (
  <motion.div
    className={`backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl ${className}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    whileHover={{ 
      scale: 1.01,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)"
    }}
  >
    {children}
  </motion.div>
);

export const ConsultingCard = ({ 
  title, 
  subtitle, 
  children, 
  icon: Icon,
  accent = "amber",
  delay = 0
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: any;
  accent?: string;
  delay?: number;
}) => (
  <motion.div
    className="backdrop-blur-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-8 shadow-2xl"
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    whileHover={{ 
      scale: 1.02,
      y: -5,
      boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.5)"
    }}
  >
    <div className="flex items-center space-x-4 mb-6">
      {Icon && (
        <div className={`w-12 h-12 bg-gradient-to-br from-${accent}-400 to-${accent}-500 rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      )}
      <div>
        <h3 className="text-2xl font-light text-white tracking-wide">{title}</h3>
        {subtitle && (
          <p className="text-white/60 text-lg font-light mt-1">{subtitle}</p>
        )}
      </div>
    </div>
    {children}
  </motion.div>
);

export const PremiumMetric = ({ 
  value, 
  label, 
  sublabel,
  trend,
  accent = "amber"
}: {
  value: string;
  label: string;
  sublabel?: string;
  trend?: "up" | "down" | "stable";
  accent?: string;
}) => (
  <motion.div
    className="text-center p-6 backdrop-blur-sm bg-white/[0.04] rounded-xl border border-white/10 shadow-lg"
    whileHover={{ 
      scale: 1.05,
      backgroundColor: "rgba(255, 255, 255, 0.08)"
    }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className={`text-4xl font-light text-${accent}-400 mb-2 tracking-wide`}>
      {value}
    </div>
    <div className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1">
      {label}
    </div>
    {sublabel && (
      <div className="text-white/50 text-xs">
        {sublabel}
      </div>
    )}
    {trend && (
      <div className={`mt-2 text-xs flex items-center justify-center ${
        trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
      }`}>
        <span className="text-xs">
          {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trend}
        </span>
      </div>
    )}
  </motion.div>
);