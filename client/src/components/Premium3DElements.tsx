import { motion } from "framer-motion";

interface Premium3DElementProps {
  type: "number" | "icon" | "symbol" | "metric";
  value: string | number;
  context?: string;
  size?: "small" | "medium" | "large";
  glow?: boolean;
}

// Ultra-realistic 4K 3D styling for premium depth and vivid colors
const create3DStyle = (type: string, context?: string) => {
  const baseStyle = {
    background: `
      radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25) 0%, transparent 50%),
      linear-gradient(145deg, 
        rgba(28, 132, 255, 0.4) 0%, 
        rgba(28, 132, 255, 0.2) 15%,
        rgba(125, 206, 250, 0.15) 35%,
        rgba(0, 0, 0, 0.2) 65%,
        rgba(0, 0, 0, 0.6) 100%
      ),
      linear-gradient(225deg,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 30%
      )
    `,
    boxShadow: `
      inset 0 2px 4px rgba(255, 255, 255, 0.3),
      inset 0 -2px 4px rgba(0, 0, 0, 0.4),
      inset 1px 1px 2px rgba(28, 132, 255, 0.2),
      inset -1px -1px 2px rgba(0, 0, 0, 0.3),
      0 6px 12px rgba(0, 0, 0, 0.6),
      0 12px 24px rgba(0, 0, 0, 0.4),
      0 0 40px rgba(28, 132, 255, 0.3)
    `,
    borderRadius: "16px",
    border: "2px solid transparent",
    backgroundClip: "padding-box",
    backdropFilter: "blur(20px) saturate(180%)",
    position: "relative" as const,
    overflow: "hidden" as const,
    transform: "translateZ(0) perspective(1000px)",
    transformStyle: "preserve-3d" as const
  };

  // Context-specific enhancements
  switch (context) {
    case "finance":
      return {
        ...baseStyle,
        background: `
          linear-gradient(145deg, 
            rgba(249, 200, 14, 0.2) 0%, 
            rgba(249, 200, 14, 0.1) 25%,
            rgba(0, 0, 0, 0.1) 75%,
            rgba(0, 0, 0, 0.3) 100%
          )
        `,
        boxShadow: `
          ${baseStyle.boxShadow},
          0 0 20px rgba(249, 200, 14, 0.3)
        `
      };
    case "technology":
      return {
        ...baseStyle,
        background: `
          linear-gradient(145deg, 
            rgba(28, 132, 255, 0.2) 0%, 
            rgba(28, 132, 255, 0.1) 25%,
            rgba(0, 0, 0, 0.1) 75%,
            rgba(0, 0, 0, 0.3) 100%
          )
        `,
        boxShadow: `
          ${baseStyle.boxShadow},
          0 0 20px rgba(28, 132, 255, 0.3)
        `
      };
    case "business":
      return {
        ...baseStyle,
        background: `
          linear-gradient(145deg, 
            rgba(125, 206, 250, 0.2) 0%, 
            rgba(125, 206, 250, 0.1) 25%,
            rgba(0, 0, 0, 0.1) 75%,
            rgba(0, 0, 0, 0.3) 100%
          )
        `
      };
    default:
      return baseStyle;
  }
};

export default function Premium3DElement({ 
  type, 
  value, 
  context, 
  size = "medium", 
  glow = false 
}: Premium3DElementProps) {
  const sizeClasses = {
    small: "w-12 h-12 text-lg",
    medium: "w-16 h-16 text-2xl", 
    large: "w-24 h-24 text-4xl"
  };

  const style = create3DStyle(type, context);

  return (
    <motion.div
      className={`${sizeClasses[size]} flex items-center justify-center font-bold text-white relative`}
      style={style}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: glow ? `${style.boxShadow}, 0 0 30px rgba(28, 132, 255, 0.5)` : style.boxShadow
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300,
        damping: 20
      }}
    >
      {/* 3D Highlight Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
          borderRadius: "inherit"
        }}
      />
      
      {/* Ultra 3D Number with clean styling */}
      <span 
        className="relative z-10 font-black text-white"
        style={{
          fontSize: "inherit",
          textShadow: `
            0 1px 0 rgba(28, 132, 255, 0.8),
            0 2px 0 rgba(28, 132, 255, 0.7),
            0 3px 0 rgba(28, 132, 255, 0.6),
            0 4px 0 rgba(28, 132, 255, 0.5),
            0 5px 0 rgba(28, 132, 255, 0.4),
            0 6px 8px rgba(0, 0, 0, 0.8),
            0 8px 16px rgba(0, 0, 0, 0.6)
          `,
          filter: `
            drop-shadow(0 2px 4px rgba(255, 255, 255, 0.2))
            drop-shadow(0 0 10px rgba(28, 132, 255, 0.5))
          `,
          transform: "rotateX(15deg) rotateY(-5deg)",
          transformOrigin: "center center"
        }}
      >
        {value}
      </span>

      {/* Subtle Inner Glow */}
      <div 
        className="absolute inset-1 pointer-events-none rounded-lg"
        style={{
          background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, transparent 70%)"
        }}
      />
    </motion.div>
  );
}

export const Premium3DIcon = ({ 
  icon: Icon, 
  context, 
  size = "medium",
  animated = false 
}: {
  icon: any;
  context?: string;
  size?: "small" | "medium" | "large";
  animated?: boolean;
}) => {
  const sizeClasses = {
    small: "w-10 h-10",
    medium: "w-12 h-12",
    large: "w-16 h-16"
  };

  const iconSizes = {
    small: "w-5 h-5",
    medium: "w-6 h-6", 
    large: "w-8 h-8"
  };

  const style = create3DStyle("icon", context);

  return (
    <motion.div
      className={`${sizeClasses[size]} flex items-center justify-center relative`}
      style={style}
      initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        rotateY: 0,
        rotateX: animated ? [0, 5, 0] : 0
      }}
      whileHover={{ 
        scale: 1.1,
        rotateY: 10,
        boxShadow: `${style.boxShadow}, 0 0 25px rgba(28, 132, 255, 0.4)`
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300,
        duration: animated ? 3 : 0.5,
        repeat: animated ? Infinity : 0
      }}
    >
      {/* 3D Highlight */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 60%)",
          borderRadius: "inherit"
        }}
      />
      
      <Icon 
        className={`${iconSizes[size]} text-white relative z-10`}
        style={{
          filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)) drop-shadow(0 1px 2px rgba(255, 255, 255, 0.1))"
        }}
      />
    </motion.div>
  );
};

export const Premium3DMetric = ({ 
  value, 
  label, 
  context,
  trend,
  size = "large"
}: {
  value: string;
  label: string;
  context?: string;
  trend?: "up" | "down" | "stable";
  size?: "medium" | "large";
}) => {
  const containerStyle = create3DStyle("metric", context);
  
  const trendColors = {
    up: "#10B981",
    down: "#EF4444", 
    stable: "#6B7280"
  };

  const trendSymbols = {
    up: "↗",
    down: "↘",
    stable: "→"
  };

  return (
    <motion.div
      className={`${size === "large" ? "p-8" : "p-6"} text-center relative`}
      style={containerStyle}
      initial={{ scale: 0.9, opacity: 0, z: -100 }}
      animate={{ scale: 1, opacity: 1, z: 0 }}
      whileHover={{ 
        scale: 1.05,
        z: 20,
        boxShadow: `${containerStyle.boxShadow}, 0 0 40px rgba(28, 132, 255, 0.3)`
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300,
        damping: 25
      }}
    >
      {/* Premium Highlight Gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              transparent 30%,
              transparent 70%,
              rgba(28, 132, 255, 0.05) 100%
            )
          `,
          borderRadius: "inherit"
        }}
      />

      {/* Value Display */}
      <motion.div 
        className={`${size === "large" ? "text-5xl" : "text-4xl"} font-light mb-3 text-white relative z-10`}
        style={{
          textShadow: `
            0 3px 6px rgba(0, 0, 0, 0.7),
            0 1px 3px rgba(0, 0, 0, 0.9),
            0 0 20px rgba(28, 132, 255, 0.3)
          `,
          background: context === "finance" ? 
            "linear-gradient(135deg, #F9C80E 0%, #FCD34D 100%)" :
            "linear-gradient(135deg, #1C84FF 0%, #7DCEFA 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}
        animate={{ 
          scale: [1, 1.02, 1],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {value}
      </motion.div>

      {/* Label */}
      <div 
        className={`${size === "large" ? "text-sm" : "text-xs"} font-medium uppercase tracking-wider text-gray-300 mb-2 relative z-10`}
        style={{
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)"
        }}
      >
        {label}
      </div>

      {/* Trend Indicator */}
      {trend && (
        <motion.div 
          className="flex items-center justify-center text-xs relative z-10"
          style={{ color: trendColors[trend] }}
          animate={{ 
            y: trend === "up" ? [-2, 2, -2] : trend === "down" ? [2, -2, 2] : [0, 0, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className="mr-1 text-lg">{trendSymbols[trend]}</span>
          <span className="uppercase tracking-wide font-medium">{trend}</span>
        </motion.div>
      )}

      {/* Subtle Inner Reflection */}
      <div 
        className="absolute top-2 left-2 right-2 h-6 pointer-events-none rounded-t-lg"
        style={{
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%)"
        }}
      />
    </motion.div>
  );
};

export const Premium3DProgressStep = ({ 
  number, 
  title, 
  isActive, 
  isCompleted,
  context 
}: {
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  context?: string;
}) => {
  const stepStyle = create3DStyle("number", context);
  
  return (
    <motion.div 
      className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-300"
      style={{
        ...stepStyle,
        backgroundColor: isActive ? "rgba(28, 132, 255, 0.1)" : "rgba(255, 255, 255, 0.03)",
        borderColor: isActive ? "#1C84FF" : "rgba(255, 255, 255, 0.1)"
      }}
      whileHover={{ scale: 1.02 }}
    >
      <Premium3DElement
        type="number"
        value={number}
        context={isCompleted ? "business" : isActive ? "technology" : undefined}
        size="medium"
        glow={isActive}
      />
      
      <span 
        className="font-light tracking-wide"
        style={{ 
          color: isActive ? "#F3F4F6" : "#94A3B8",
          textShadow: isActive ? "0 1px 2px rgba(0, 0, 0, 0.5)" : "none"
        }}
      >
        {title}
      </span>
    </motion.div>
  );
};