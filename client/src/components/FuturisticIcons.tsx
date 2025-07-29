import { motion } from "framer-motion";

interface FuturisticIconProps {
  type: "strategic" | "intelligence" | "generation" | "deployment";
  size?: "small" | "medium" | "large";
  animated?: boolean;
  glowIntensity?: "low" | "medium" | "high";
}

const FuturisticStrategicIcon = ({ size = "medium", animated = true, glowIntensity = "medium" }: Omit<FuturisticIconProps, "type">) => {
  const sizeMap = {
    small: { container: "w-10 h-10", svg: "w-8 h-8" },
    medium: { container: "w-12 h-12", svg: "w-10 h-10" },
    large: { container: "w-16 h-16", svg: "w-14 h-14" }
  };

  const glowMap = {
    low: "0 0 20px rgba(28, 132, 255, 0.3)",
    medium: "0 0 30px rgba(28, 132, 255, 0.5), 0 0 60px rgba(125, 206, 250, 0.3)",
    high: "0 0 40px rgba(28, 132, 255, 0.7), 0 0 80px rgba(125, 206, 250, 0.5)"
  };

  return (
    <motion.div
      className={`${sizeMap[size].container} relative flex items-center justify-center`}
      style={{
        background: `
          radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
          linear-gradient(145deg, 
            rgba(28, 132, 255, 0.3) 0%, 
            rgba(125, 206, 250, 0.2) 30%,
            rgba(0, 0, 0, 0.3) 70%,
            rgba(0, 0, 0, 0.6) 100%
          )
        `,
        borderRadius: "16px",
        border: "1px solid rgba(28, 132, 255, 0.4)",
        boxShadow: `
          inset 0 2px 4px rgba(255, 255, 255, 0.2),
          inset 0 -2px 4px rgba(0, 0, 0, 0.3),
          ${glowMap[glowIntensity]}
        `,
        backdropFilter: "blur(20px)"
      }}
      animate={animated ? {
        rotateY: [0, 10, 0, -10, 0],
        scale: [1, 1.05, 1]
      } : {}}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Futuristic Strategic Foundation Icon */}
      <motion.svg
        className={sizeMap[size].svg}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))" }}
      >
        <defs>
          <linearGradient id="strategicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor="#7DCEFA" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#1C84FF" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#2563EB" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.6" />
          </linearGradient>
          
          <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9C80E" stopOpacity="1" />
            <stop offset="50%" stopColor="#1C84FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7DCEFA" stopOpacity="0.6" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Geometric Ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#strategicGradient)"
          strokeWidth="2"
          strokeDasharray="8,4"
          filter="url(#glow)"
          animate={animated ? { rotate: 360 } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        {/* Hexagonal Framework */}
        <motion.polygon
          points="50,15 75,30 75,55 50,70 25,55 25,30"
          fill="rgba(28, 132, 255, 0.1)"
          stroke="url(#strategicGradient)"
          strokeWidth="2"
          filter="url(#glow)"
          animate={animated ? { 
            scale: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6]
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Inner Neural Network Nodes */}
        <motion.circle cx="50" cy="25" r="3" fill="url(#coreGradient)" filter="url(#glow)">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
        </motion.circle>
        <motion.circle cx="65" cy="40" r="3" fill="url(#coreGradient)" filter="url(#glow)">
          <animate attributeName="r" values="3;5;3" dur="2s" begin="0.5s" repeatCount="indefinite"/>
        </motion.circle>
        <motion.circle cx="65" cy="60" r="3" fill="url(#coreGradient)" filter="url(#glow)">
          <animate attributeName="r" values="3;5;3" dur="2s" begin="1s" repeatCount="indefinite"/>
        </motion.circle>
        <motion.circle cx="50" cy="75" r="3" fill="url(#coreGradient)" filter="url(#glow)">
          <animate attributeName="r" values="3;5;3" dur="2s" begin="1.5s" repeatCount="indefinite"/>
        </motion.circle>
        <motion.circle cx="35" cy="60" r="3" fill="url(#coreGradient)" filter="url(#glow)">
          <animate attributeName="r" values="3;5;3" dur="2s" begin="1s" repeatCount="indefinite"/>
        </motion.circle>
        <motion.circle cx="35" cy="40" r="3" fill="url(#coreGradient)" filter="url(#glow)">
          <animate attributeName="r" values="3;5;3" dur="2s" begin="0.5s" repeatCount="indefinite"/>
        </motion.circle>

        {/* Connecting Neural Lines */}
        <motion.line x1="50" y1="25" x2="65" y2="40" stroke="url(#strategicGradient)" strokeWidth="1" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/>
        </motion.line>
        <motion.line x1="65" y1="40" x2="65" y2="60" stroke="url(#strategicGradient)" strokeWidth="1" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" begin="0.5s" repeatCount="indefinite"/>
        </motion.line>
        <motion.line x1="65" y1="60" x2="50" y2="75" stroke="url(#strategicGradient)" strokeWidth="1" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" begin="1s" repeatCount="indefinite"/>
        </motion.line>
        <motion.line x1="50" y1="75" x2="35" y2="60" stroke="url(#strategicGradient)" strokeWidth="1" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" begin="1.5s" repeatCount="indefinite"/>
        </motion.line>
        <motion.line x1="35" y1="60" x2="35" y2="40" stroke="url(#strategicGradient)" strokeWidth="1" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" begin="1s" repeatCount="indefinite"/>
        </motion.line>
        <motion.line x1="35" y1="40" x2="50" y2="25" stroke="url(#strategicGradient)" strokeWidth="1" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" begin="0.5s" repeatCount="indefinite"/>
        </motion.line>

        {/* Central Core */}
        <motion.circle
          cx="50"
          cy="50"
          r="8"
          fill="url(#coreGradient)"
          filter="url(#glow)"
          animate={animated ? {
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Orbital Rings */}
        <motion.circle
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="url(#strategicGradient)"
          strokeWidth="1"
          strokeDasharray="4,2"
          opacity="0.5"
          animate={animated ? { rotate: -360 } : {}}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="url(#strategicGradient)"
          strokeWidth="1"
          strokeDasharray="6,3"
          opacity="0.3"
          animate={animated ? { rotate: 360 } : {}}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </motion.svg>

      {/* Floating Particles */}
      {animated && Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          style={{
            left: `${30 + (i * 20)}%`,
            top: `${25 + (i * 10)}%`,
            filter: "blur(0.5px)"
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2 + (i * 0.5),
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
};

export default function FuturisticIcon({ type, size = "medium", animated = true, glowIntensity = "medium" }: FuturisticIconProps) {
  switch (type) {
    case "strategic":
      return <FuturisticStrategicIcon size={size} animated={animated} glowIntensity={glowIntensity} />;
    case "intelligence":
      // Could add more futuristic icons here
      return <FuturisticStrategicIcon size={size} animated={animated} glowIntensity={glowIntensity} />;
    case "generation":
      return <FuturisticStrategicIcon size={size} animated={animated} glowIntensity={glowIntensity} />;
    case "deployment":
      return <FuturisticStrategicIcon size={size} animated={animated} glowIntensity={glowIntensity} />;
    default:
      return <FuturisticStrategicIcon size={size} animated={animated} glowIntensity={glowIntensity} />;
  }
}