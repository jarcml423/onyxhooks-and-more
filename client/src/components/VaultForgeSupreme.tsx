import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface VaultForgeSupremeProps {
  children: React.ReactNode;
  industry?: string;
  showDimensionalLight?: boolean;
}

// VaultForge Supreme Color Palette - Cinematic Command Center
const VAULT_SUPREME_COLORS = {
  primaryBase: "#0B0E1A",        // Vault black-blue (deep, cinematic)
  primaryAccent: "#1C84FF",      // Vault Cobalt (electric highlight)
  secondaryAccent: "#7DCEFA",    // Light Sky Neon (modern polish)
  goldSignature: "#F9C80E",      // Prestige badge gold
  greenSignature: "#10B981",     // Elite emerald green for special CTAs
  inputFieldBg: "#111827",       // Soft contrast but still elite
  textPrimary: "#F3F4F6",        // Clean, legible, white-silver
  textSecondary: "#94A3B8",      // Soft slate-gray (consulting vibes)
  ctaHover: "#2563EB"            // Royal electric hover energy
};

const INDUSTRY_BACKGROUNDS = {
  fitness: `
    linear-gradient(145deg, ${VAULT_SUPREME_COLORS.primaryBase} 0%, ${VAULT_SUPREME_COLORS.primaryAccent} 100%),
    radial-gradient(circle at 25% 75%, rgba(28, 132, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 75% 25%, rgba(125, 206, 250, 0.1) 0%, transparent 50%)
  `,
  business: `
    linear-gradient(145deg, ${VAULT_SUPREME_COLORS.primaryBase} 0%, ${VAULT_SUPREME_COLORS.primaryAccent} 100%),
    radial-gradient(circle at top right, rgba(28, 132, 255, 0.17) 0%, transparent 70%),
    radial-gradient(circle at bottom left, rgba(125, 206, 250, 0.08) 0%, transparent 60%)
  `,
  finance: `
    linear-gradient(145deg, ${VAULT_SUPREME_COLORS.primaryBase} 0%, ${VAULT_SUPREME_COLORS.goldSignature} 15%, ${VAULT_SUPREME_COLORS.primaryAccent} 100%),
    radial-gradient(circle at 30% 70%, rgba(249, 200, 14, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(28, 132, 255, 0.1) 0%, transparent 50%)
  `,
  technology: `
    linear-gradient(145deg, ${VAULT_SUPREME_COLORS.primaryBase} 0%, ${VAULT_SUPREME_COLORS.primaryAccent} 100%),
    radial-gradient(circle at 20% 80%, rgba(125, 206, 250, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(28, 132, 255, 0.12) 0%, transparent 50%)
  `,
  consulting: `
    linear-gradient(145deg, ${VAULT_SUPREME_COLORS.primaryBase} 0%, ${VAULT_SUPREME_COLORS.primaryAccent} 100%),
    radial-gradient(circle at center, rgba(28, 132, 255, 0.1) 0%, transparent 60%),
    radial-gradient(circle at 60% 40%, rgba(125, 206, 250, 0.08) 0%, transparent 50%)
  `,
  default: `
    linear-gradient(145deg, ${VAULT_SUPREME_COLORS.primaryBase} 0%, ${VAULT_SUPREME_COLORS.primaryAccent} 100%),
    radial-gradient(circle at top right, rgba(28, 132, 255, 0.17) 0%, transparent 70%)
  `
};

export default function VaultForgeSupreme({ 
  children, 
  industry = "default", 
  showDimensionalLight = true 
}: VaultForgeSupremeProps) {
  const [lightAnimation, setLightAnimation] = useState(0);
  
  useEffect(() => {
    if (showDimensionalLight) {
      const interval = setInterval(() => {
        setLightAnimation(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [showDimensionalLight]);

  const backgroundStyle = INDUSTRY_BACKGROUNDS[industry.toLowerCase() as keyof typeof INDUSTRY_BACKGROUNDS] 
    || INDUSTRY_BACKGROUNDS.default;

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: backgroundStyle,
        backgroundColor: VAULT_SUPREME_COLORS.primaryBase
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Cinematic Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(145deg, ${VAULT_SUPREME_COLORS.primaryBase} 0%, transparent 40%, ${VAULT_SUPREME_COLORS.primaryAccent}20 100%)`,
          backdropFilter: "blur(1px)"
        }}
      />

      {/* Dimensional Light Effects */}
      {showDimensionalLight && (
        <>
          {/* Animated gradient lighting */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${50 + Math.sin(lightAnimation * 0.01) * 20}% ${50 + Math.cos(lightAnimation * 0.01) * 15}%, ${VAULT_SUPREME_COLORS.primaryAccent}11 0%, transparent 70%)`
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Particle system */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full pointer-events-none"
              style={{
                backgroundColor: i % 3 === 0 ? VAULT_SUPREME_COLORS.primaryAccent : 
                               i % 3 === 1 ? VAULT_SUPREME_COLORS.secondaryAccent : 
                               VAULT_SUPREME_COLORS.goldSignature,
                left: `${10 + (i * 7)}%`,
                top: `${15 + (i * 6)}%`,
                opacity: 0.4
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.2, 0.5]
              }}
              transition={{
                duration: 3 + (i * 0.3),
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Light flares */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-32 h-32 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${VAULT_SUPREME_COLORS.primaryAccent}20 0%, transparent 70%)`,
              filter: "blur(20px)"
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </>
      )}

      {/* Elite Command Center Grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%">
          <defs>
            <pattern 
              id="vault-supreme-grid" 
              x="0" 
              y="0" 
              width="80" 
              height="80" 
              patternUnits="userSpaceOnUse"
            >
              <path 
                d="M 80 0 L 0 0 0 80" 
                fill="none" 
                stroke={VAULT_SUPREME_COLORS.primaryAccent}
                strokeWidth="0.5"
              />
              <circle
                cx="40"
                cy="40"
                r="1"
                fill={VAULT_SUPREME_COLORS.secondaryAccent}
                opacity="0.6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vault-supreme-grid)" />
        </svg>
      </div>

      {/* VaultForge Elite Header Accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 z-30"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${VAULT_SUPREME_COLORS.primaryAccent} 20%, ${VAULT_SUPREME_COLORS.goldSignature} 50%, ${VAULT_SUPREME_COLORS.primaryAccent} 80%, transparent 100%)`
        }}
      />

      {/* Content with Command Center Context */}
      <div 
        className="relative z-10"
        style={{
          "--vault-primary-base": VAULT_SUPREME_COLORS.primaryBase,
          "--vault-primary-accent": VAULT_SUPREME_COLORS.primaryAccent,
          "--vault-secondary-accent": VAULT_SUPREME_COLORS.secondaryAccent,
          "--vault-gold-signature": VAULT_SUPREME_COLORS.goldSignature,
          "--vault-input-bg": VAULT_SUPREME_COLORS.inputFieldBg,
          "--vault-text-primary": VAULT_SUPREME_COLORS.textPrimary,
          "--vault-text-secondary": VAULT_SUPREME_COLORS.textSecondary,
          "--vault-cta-hover": VAULT_SUPREME_COLORS.ctaHover
        } as React.CSSProperties}
      >
        {children}
      </div>

      {/* Bottom Elite Accent */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-px z-30"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${VAULT_SUPREME_COLORS.secondaryAccent}60 50%, transparent 100%)`
        }}
      />
    </motion.div>
  );
}

export const VaultSupremePanel = ({ 
  children, 
  className = "",
  glowEffect = false,
  goldAccent = false
}: { 
  children: React.ReactNode;
  className?: string;
  glowEffect?: boolean;
  goldAccent?: boolean;
}) => (
  <motion.div
    className={`backdrop-blur-xl rounded-2xl p-8 border ${className}`}
    style={{
      background: `linear-gradient(145deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)`,
      borderColor: goldAccent ? VAULT_SUPREME_COLORS.goldSignature + "40" : VAULT_SUPREME_COLORS.primaryAccent + "30",
      boxShadow: `0px 8px 24px rgba(0, 0, 0, 0.6)${glowEffect ? `, 0 0 40px ${VAULT_SUPREME_COLORS.primaryAccent}20` : ""}`
    }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    whileHover={{ 
      scale: 1.02,
      y: -5,
      boxShadow: `0px 12px 32px rgba(0, 0, 0, 0.7)${glowEffect ? `, 0 0 60px ${VAULT_SUPREME_COLORS.primaryAccent}30` : ""}`
    }}
  >
    {goldAccent && (
      <div 
        className="absolute top-0 left-8 right-8 h-0.5 rounded-full"
        style={{ backgroundColor: VAULT_SUPREME_COLORS.goldSignature }}
      />
    )}
    {children}
  </motion.div>
);

export const VaultSupremeButton = ({ 
  children, 
  variant = "primary",
  className = "",
  onClick,
  disabled = false,
  size = "default"
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "gold" | "green" | "ghost";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: "default" | "large";
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: "12px",
      fontWeight: "500",
      transition: "all 0.3s ease",
      border: "1px solid transparent"
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${VAULT_SUPREME_COLORS.primaryAccent} 0%, ${VAULT_SUPREME_COLORS.ctaHover} 100%)`,
          color: VAULT_SUPREME_COLORS.textPrimary,
          boxShadow: `0 8px 24px ${VAULT_SUPREME_COLORS.primaryAccent}40`
        };
      case "secondary":
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${VAULT_SUPREME_COLORS.inputFieldBg} 0%, ${VAULT_SUPREME_COLORS.primaryBase} 100%)`,
          color: VAULT_SUPREME_COLORS.textPrimary,
          borderColor: VAULT_SUPREME_COLORS.primaryAccent + "30",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)"
        };
      case "gold":
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${VAULT_SUPREME_COLORS.goldSignature} 0%, #E6B800 100%)`,
          color: VAULT_SUPREME_COLORS.primaryBase,
          boxShadow: `0 8px 24px ${VAULT_SUPREME_COLORS.goldSignature}40`
        };
      case "green":
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${VAULT_SUPREME_COLORS.greenSignature} 0%, #059669 100%)`,
          color: VAULT_SUPREME_COLORS.textPrimary,
          boxShadow: `0 8px 24px ${VAULT_SUPREME_COLORS.greenSignature}40`
        };
      case "ghost":
        return {
          ...baseStyle,
          background: "rgba(255, 255, 255, 0.05)",
          color: VAULT_SUPREME_COLORS.textSecondary,
          borderColor: VAULT_SUPREME_COLORS.textSecondary + "30"
        };
      default:
        return baseStyle;
    }
  };

  const sizeClasses = size === "large" ? "px-12 py-4 text-lg" : "px-6 py-3 text-base";

  return (
    <motion.button
      className={`${sizeClasses} ${className}`}
      style={getButtonStyle()}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { 
        scale: 1.05,
        boxShadow: variant === "primary" ? `0 12px 32px ${VAULT_SUPREME_COLORS.primaryAccent}60` :
                  variant === "gold" ? `0 12px 32px ${VAULT_SUPREME_COLORS.goldSignature}60` :
                  variant === "green" ? `0 12px 32px ${VAULT_SUPREME_COLORS.greenSignature}60` :
                  "0 8px 24px rgba(0, 0, 0, 0.5)"
      }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {children}
    </motion.button>
  );
};

export const VaultSupremeInput = ({ 
  className = "",
  placeholder,
  value,
  onChange,
  type = "text"
}: {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) => (
  <motion.input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-4 py-3 rounded-xl text-base transition-all duration-300 ${className}`}
    style={{
      backgroundColor: VAULT_SUPREME_COLORS.inputFieldBg,
      border: `1px solid ${VAULT_SUPREME_COLORS.primaryAccent}`,
      color: VAULT_SUPREME_COLORS.textPrimary,
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)"
    }}
    whileFocus={{
      boxShadow: `0 0 20px ${VAULT_SUPREME_COLORS.primaryAccent}40, 0 4px 16px rgba(0, 0, 0, 0.3)`,
      borderColor: VAULT_SUPREME_COLORS.secondaryAccent
    }}
  />
);

export const VaultSupremeTextarea = ({ 
  className = "",
  placeholder,
  value,
  onChange,
  rows = 4
}: {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}) => (
  <motion.textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className={`w-full px-4 py-3 rounded-xl text-base transition-all duration-300 resize-none ${className}`}
    style={{
      backgroundColor: VAULT_SUPREME_COLORS.inputFieldBg,
      border: `1px solid ${VAULT_SUPREME_COLORS.primaryAccent}`,
      color: VAULT_SUPREME_COLORS.textPrimary,
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)"
    }}
    whileFocus={{
      boxShadow: `0 0 20px ${VAULT_SUPREME_COLORS.primaryAccent}40, 0 4px 16px rgba(0, 0, 0, 0.3)`,
      borderColor: VAULT_SUPREME_COLORS.secondaryAccent
    }}
  />
);

export const VaultSupremeMetric = ({ 
  value, 
  label, 
  accent = "primary"
}: {
  value: string;
  label: string;
  accent?: "primary" | "secondary" | "gold";
}) => {
  const accentColor = accent === "primary" ? VAULT_SUPREME_COLORS.primaryAccent :
                     accent === "secondary" ? VAULT_SUPREME_COLORS.secondaryAccent :
                     VAULT_SUPREME_COLORS.goldSignature;

  return (
    <motion.div
      className="text-center p-6 backdrop-blur-sm rounded-xl border"
      style={{ 
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderColor: accentColor + "30",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)"
      }}
      whileHover={{ 
        scale: 1.05,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        boxShadow: `0 8px 24px ${accentColor}30`
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div 
        className="text-4xl font-light mb-2 tracking-wide"
        style={{ color: accentColor }}
      >
        {value}
      </div>
      <div 
        className="text-sm font-medium uppercase tracking-wider"
        style={{ color: VAULT_SUPREME_COLORS.textSecondary }}
      >
        {label}
      </div>
    </motion.div>
  );
};