import { motion } from "framer-motion";

interface SaasPaletteProps {
  industry: string;
  children: React.ReactNode;
  variant?: "standard" | "bold" | "premium";
}

const SAAS_COLOR_SYSTEMS = {
  fitness: {
    standard: {
      primary: "#00D4AA",
      secondary: "#00B894", 
      accent: "#00CEC9",
      background: "linear-gradient(135deg, #00D4AA 0%, #00B894 50%, #00A085 100%)",
      surface: "rgba(0, 212, 170, 0.1)",
      contrast: "#FFFFFF"
    },
    bold: {
      primary: "#FF6B35",
      secondary: "#F7931E",
      accent: "#FFD23F",
      background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #E85A4F 100%)",
      surface: "rgba(255, 107, 53, 0.12)",
      contrast: "#FFFFFF"
    },
    premium: {
      primary: "#6C5CE7",
      secondary: "#A29BFE",
      accent: "#FD79A8",
      background: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 50%, #74B9FF 100%)",
      surface: "rgba(108, 92, 231, 0.1)",
      contrast: "#FFFFFF"
    }
  },
  business: {
    standard: {
      primary: "#0984E3",
      secondary: "#0C7CD5",
      accent: "#74B9FF",
      background: "linear-gradient(135deg, #0984E3 0%, #0C7CD5 50%, #005AA7 100%)",
      surface: "rgba(9, 132, 227, 0.1)",
      contrast: "#FFFFFF"
    },
    bold: {
      primary: "#6C5CE7",
      secondary: "#A29BFE", 
      accent: "#FDCB6E",
      background: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 50%, #74B9FF 100%)",
      surface: "rgba(108, 92, 231, 0.12)",
      contrast: "#FFFFFF"
    },
    premium: {
      primary: "#2D3436",
      secondary: "#636E72",
      accent: "#00CEC9",
      background: "linear-gradient(135deg, #2D3436 0%, #636E72 50%, #74B9FF 100%)",
      surface: "rgba(45, 52, 54, 0.15)",
      contrast: "#FFFFFF"
    }
  },
  finance: {
    standard: {
      primary: "#F39C12",
      secondary: "#E67E22",
      accent: "#F1C40F",
      background: "linear-gradient(135deg, #F39C12 0%, #E67E22 50%, #D35400 100%)",
      surface: "rgba(243, 156, 18, 0.1)",
      contrast: "#FFFFFF"
    },
    bold: {
      primary: "#E17055",
      secondary: "#FDCB6E",
      accent: "#6C5CE7",
      background: "linear-gradient(135deg, #E17055 0%, #FDCB6E 50%, #F39C12 100%)",
      surface: "rgba(225, 112, 85, 0.12)",
      contrast: "#FFFFFF"
    },
    premium: {
      primary: "#00B894",
      secondary: "#00CEC9",
      accent: "#FDCB6E",
      background: "linear-gradient(135deg, #00B894 0%, #00CEC9 50%, #74B9FF 100%)",
      surface: "rgba(0, 184, 148, 0.1)",
      contrast: "#FFFFFF"
    }
  },
  technology: {
    standard: {
      primary: "#6C5CE7",
      secondary: "#A29BFE",
      accent: "#FD79A8",
      background: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 50%, #74B9FF 100%)",
      surface: "rgba(108, 92, 231, 0.1)",
      contrast: "#FFFFFF"
    },
    bold: {
      primary: "#FF3838",
      secondary: "#FF6B6B",
      accent: "#4ECDC4",
      background: "linear-gradient(135deg, #FF3838 0%, #FF6B6B 50%, #E55656 100%)",
      surface: "rgba(255, 56, 56, 0.12)",
      contrast: "#FFFFFF"
    },
    premium: {
      primary: "#00CEC9",
      secondary: "#55EFC4",
      accent: "#FD79A8",
      background: "linear-gradient(135deg, #00CEC9 0%, #55EFC4 50%, #6C5CE7 100%)",
      surface: "rgba(0, 206, 201, 0.1)",
      contrast: "#FFFFFF"
    }
  },
  consulting: {
    standard: {
      primary: "#2D3436",
      secondary: "#636E72",
      accent: "#00CEC9",
      background: "linear-gradient(135deg, #2D3436 0%, #636E72 50%, #74B9FF 100%)",
      surface: "rgba(45, 52, 54, 0.15)",
      contrast: "#FFFFFF"
    },
    bold: {
      primary: "#6C5CE7",
      secondary: "#A29BFE",
      accent: "#FDCB6E",
      background: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 50%, #00CEC9 100%)",
      surface: "rgba(108, 92, 231, 0.12)",
      contrast: "#FFFFFF"
    },
    premium: {
      primary: "#00B894",
      secondary: "#00CEC9", 
      accent: "#F39C12",
      background: "linear-gradient(135deg, #00B894 0%, #00CEC9 50%, #6C5CE7 100%)",
      surface: "rgba(0, 184, 148, 0.1)",
      contrast: "#FFFFFF"
    }
  }
};

export default function SaasPalette({ industry, children, variant = "premium" }: SaasPaletteProps) {
  const colorSystem = SAAS_COLOR_SYSTEMS[industry.toLowerCase() as keyof typeof SAAS_COLOR_SYSTEMS]?.[variant] 
    || SAAS_COLOR_SYSTEMS.consulting[variant];

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          ${colorSystem.background},
          radial-gradient(circle at 25% 25%, ${colorSystem.surface} 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, ${colorSystem.surface} 0%, transparent 50%)
        `,
        backgroundColor: "#0a0e1a"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Enterprise-grade overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40 backdrop-blur-[0.5px]" />
      
      {/* Salesforce-style accent lines */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: colorSystem.primary }} />
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: colorSystem.accent }} />
      
      {/* Dynamic branded elements */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: i % 2 === 0 ? colorSystem.primary : colorSystem.accent,
            left: `${15 + (i * 15)}%`,
            top: `${10 + (i * 12)}%`,
            opacity: 0.6
          }}
          animate={{
            y: [0, -20, 0],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 3 + (i * 0.5),
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Premium geometric grid with brand colors */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern 
              id={`brand-grid-${industry}`} 
              x="0" 
              y="0" 
              width="60" 
              height="60" 
              patternUnits="userSpaceOnUse"
            >
              <path 
                d="M 60 0 L 0 0 0 60" 
                fill="none" 
                stroke={colorSystem.primary}
                strokeWidth="1"
              />
              <circle
                cx="30"
                cy="30"
                r="1"
                fill={colorSystem.accent}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#brand-grid-${industry})`} />
        </svg>
      </div>

      {/* Content with brand context */}
      <div 
        className="relative z-10"
        style={{
          "--primary": colorSystem.primary,
          "--secondary": colorSystem.secondary,
          "--accent": colorSystem.accent,
          "--surface": colorSystem.surface,
          "--contrast": colorSystem.contrast
        } as React.CSSProperties}
      >
        {children}
      </div>
    </motion.div>
  );
}

export const BrandCard = ({ 
  children, 
  className = "",
  glowEffect = false,
  industry = "consulting"
}: { 
  children: React.ReactNode;
  className?: string;
  glowEffect?: boolean;
  industry?: string;
}) => {
  const colorSystem = SAAS_COLOR_SYSTEMS[industry.toLowerCase() as keyof typeof SAAS_COLOR_SYSTEMS]?.premium 
    || SAAS_COLOR_SYSTEMS.consulting.premium;

  return (
    <motion.div
      className={`backdrop-blur-xl bg-white/[0.04] border rounded-2xl p-8 shadow-2xl ${className}`}
      style={{
        borderColor: glowEffect ? colorSystem.primary : "rgba(255, 255, 255, 0.1)",
        boxShadow: glowEffect 
          ? `0 0 40px ${colorSystem.primary}20, 0 25px 50px -12px rgba(0, 0, 0, 0.4)`
          : "0 25px 50px -12px rgba(0, 0, 0, 0.4)"
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        boxShadow: glowEffect 
          ? `0 0 60px ${colorSystem.primary}30, 0 30px 60px -12px rgba(0, 0, 0, 0.5)`
          : "0 30px 60px -12px rgba(0, 0, 0, 0.5)"
      }}
    >
      {children}
    </motion.div>
  );
};

export const BrandButton = ({ 
  children, 
  variant = "primary",
  industry = "consulting",
  className = "",
  onClick,
  disabled = false
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent";
  industry?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const colorSystem = SAAS_COLOR_SYSTEMS[industry.toLowerCase() as keyof typeof SAAS_COLOR_SYSTEMS]?.premium 
    || SAAS_COLOR_SYSTEMS.consulting.premium;

  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return {
          background: `linear-gradient(135deg, ${colorSystem.primary} 0%, ${colorSystem.secondary} 100%)`,
          color: colorSystem.contrast,
          boxShadow: `0 10px 25px ${colorSystem.primary}30`
        };
      case "secondary":
        return {
          background: `linear-gradient(135deg, ${colorSystem.secondary} 0%, ${colorSystem.accent} 100%)`,
          color: colorSystem.contrast,
          boxShadow: `0 10px 25px ${colorSystem.secondary}30`
        };
      case "accent":
        return {
          background: `linear-gradient(135deg, ${colorSystem.accent} 0%, ${colorSystem.primary} 100%)`,
          color: colorSystem.contrast,
          boxShadow: `0 10px 25px ${colorSystem.accent}30`
        };
      default:
        return {};
    }
  };

  return (
    <motion.button
      className={`px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 ${className}`}
      style={getButtonStyle()}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        boxShadow: disabled ? undefined : `0 15px 35px ${colorSystem.primary}40`
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {children}
    </motion.button>
  );
};

export const BrandMetric = ({ 
  value, 
  label, 
  industry = "consulting",
  trend
}: {
  value: string;
  label: string;
  industry?: string;
  trend?: "up" | "down" | "stable";
}) => {
  const colorSystem = SAAS_COLOR_SYSTEMS[industry.toLowerCase() as keyof typeof SAAS_COLOR_SYSTEMS]?.premium 
    || SAAS_COLOR_SYSTEMS.consulting.premium;

  return (
    <motion.div
      className="text-center p-6 backdrop-blur-sm bg-white/[0.04] rounded-xl border shadow-lg"
      style={{ borderColor: `${colorSystem.primary}30` }}
      whileHover={{ 
        scale: 1.05,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        boxShadow: `0 15px 35px ${colorSystem.primary}20`
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div 
        className="text-4xl font-light mb-2 tracking-wide"
        style={{ color: colorSystem.primary }}
      >
        {value}
      </div>
      <div className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1">
        {label}
      </div>
      {trend && (
        <div 
          className="mt-2 text-xs flex items-center justify-center"
          style={{ 
            color: trend === 'up' ? '#00D4AA' : trend === 'down' ? '#FF6B6B' : '#74B9FF'
          }}
        >
          <span className="text-xs">
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trend}
          </span>
        </div>
      )}
    </motion.div>
  );
};