import React from 'react';

interface TierIconProps {
  tier: 'free' | 'starter' | 'pro' | 'vault';
  isActive: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function TierIcon({ tier, isActive, size = 'medium', className = '' }: TierIconProps) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const baseClasses = `${sizeClasses[size]} ${className} transition-all duration-300 cursor-pointer relative`;

  const renderIcon = () => {
    switch (tier) {
      case 'free':
        return (
          <div className={`${baseClasses} relative group tier-icon-wrapper`}>
            {/* Enhanced Frosted Glass Cube with Cyan Glow */}
            <div 
              className={`w-full h-full relative transition-all duration-300 group-hover:scale-103`}
              style={{
                transform: isActive ? 'scale(1.05) rotateX(5deg) rotateY(5deg)' : 'scale(1)',
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {/* Main Cube Face */}
              <div 
                className="w-full h-full rounded-lg border-2 relative overflow-hidden"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(34, 211, 238, 0.25), rgba(147, 197, 253, 0.15), rgba(34, 211, 238, 0.1))'
                    : 'linear-gradient(135deg, rgba(34, 211, 238, 0.12), rgba(147, 197, 253, 0.08), rgba(34, 211, 238, 0.05))',
                  backdropFilter: 'blur(16px) saturate(150%)',
                  borderColor: isActive ? '#22D3EE' : 'rgba(34, 211, 238, 0.4)',
                  borderWidth: '2px',
                  boxShadow: isActive 
                    ? '0 0 30px rgba(34, 211, 238, 0.4), inset 0 0 30px rgba(34, 211, 238, 0.15), 0 8px 32px rgba(34, 211, 238, 0.2)'
                    : '0 0 15px rgba(34, 211, 238, 0.15), inset 0 0 15px rgba(34, 211, 238, 0.08)'
                }}
              >
                {/* Enhanced Glass Refraction Effect */}
                <div 
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 35%, rgba(255, 255, 255, 0.05) 40%, transparent 45%)',
                    animation: isActive ? 'shimmer 3s ease-in-out infinite' : 'none'
                  }}
                />
                
                {/* Data Noise Scanlines */}
                <div className="absolute inset-0 opacity-60">
                  <div className="h-full w-full bg-gradient-to-b from-transparent via-cyan-400/8 to-transparent animate-pulse" />
                  <div className="absolute top-0 h-px w-full bg-cyan-400/20 animate-ping" />
                  <div className="absolute bottom-0 h-px w-full bg-cyan-400/20 animate-ping" style={{ animationDelay: '1s' }} />
                </div>
                
                {/* Holographic FREE Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span 
                    className="text-xs font-bold tracking-widest"
                    style={{
                      color: isActive ? '#22D3EE' : 'rgba(34, 211, 238, 0.7)',
                      textShadow: isActive ? '0 0 12px rgba(34, 211, 238, 0.8), 0 0 24px rgba(34, 211, 238, 0.4)' : '0 0 6px rgba(34, 211, 238, 0.3)',
                      filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.6))'
                    }}
                  >
                    FREE
                  </span>
                </div>
              </div>
              
              {/* 3D Cube Side Faces */}
              <div 
                className="absolute top-0 right-0 w-2 h-full rounded-r-lg"
                style={{
                  background: 'linear-gradient(to bottom, rgba(34, 211, 238, 0.15), rgba(34, 211, 238, 0.05))',
                  transform: 'rotateY(90deg) translateZ(2px)',
                  transformOrigin: 'left center'
                }}
              />
              <div 
                className="absolute bottom-0 left-0 w-full h-2 rounded-b-lg"
                style={{
                  background: 'linear-gradient(to right, rgba(34, 211, 238, 0.1), rgba(34, 211, 238, 0.05))',
                  transform: 'rotateX(-90deg) translateZ(2px)',
                  transformOrigin: 'center top'
                }}
              />
            </div>
          </div>
        );

      case 'starter':
        return (
          <div className={`${baseClasses} relative group tier-icon-wrapper`}>
            {/* Enhanced Crystal Shard on Tech Pedestal */}
            <div className="w-full h-full relative flex items-center justify-center">
              {/* Advanced Tech Pedestal */}
              <div 
                className="absolute bottom-0 transition-all duration-300"
                style={{
                  width: '32px',
                  height: '12px',
                  background: isActive 
                    ? 'linear-gradient(135deg, #1F2937, #374151, #111827)'
                    : 'linear-gradient(135deg, #1F2937aa, #374151aa, #111827aa)',
                  borderRadius: '4px',
                  border: isActive ? '2px solid #10B981' : '1px solid rgba(16, 185, 129, 0.4)',
                  boxShadow: isActive 
                    ? '0 0 16px rgba(16, 185, 129, 0.4), inset 0 2px 8px rgba(16, 185, 129, 0.2)'
                    : '0 0 8px rgba(16, 185, 129, 0.2)',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  left: '50%',
                  marginLeft: '-16px'
                }}
              >
                {/* Pedestal Glow Lines */}
                <div className="absolute inset-x-2 top-1 h-px bg-emerald-400 opacity-60" />
                <div className="absolute inset-x-3 bottom-1 h-px bg-emerald-400 opacity-40" />
              </div>
              
              {/* Enhanced Crystal Shard */}
              <div 
                className={`absolute transition-all duration-300 ${
                  isActive ? 'animate-starterPulse' : ''
                }`}
                style={{
                  width: '24px',
                  height: '40px',
                  background: isActive 
                    ? 'linear-gradient(135deg, #10B981, #059669, #047857, #065F46)'
                    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.8), rgba(5, 150, 105, 0.7), rgba(4, 120, 87, 0.6))',
                  clipPath: 'polygon(50% 0%, 20% 25%, 0% 70%, 30% 100%, 70% 100%, 100% 70%, 80% 25%)',
                  filter: isActive 
                    ? 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 40px rgba(16, 185, 129, 0.4))'
                    : 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.4))',
                  transform: isActive ? 'scale(1.15) translateY(-2px)' : 'scale(1)',
                  position: 'relative',
                  top: '2px',
                  left: '50%',
                  marginLeft: '-12px'
                }}
              >
                {/* Crystal Internal Facets */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 35%, transparent 40%)',
                    clipPath: 'polygon(50% 0%, 20% 25%, 0% 70%, 30% 100%, 70% 100%, 100% 70%, 80% 25%)',
                    animation: isActive ? 'shimmer 2s ease-in-out infinite' : 'none'
                  }}
                />
              </div>
              
              {/* Enhanced Power Glow Ring */}
              <div 
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 70%)',
                  animation: isActive ? 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none'
                }}
              />
              
              {/* Energy Particles */}
              {isActive && (
                <>
                  <div 
                    className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-ping"
                    style={{ top: '20%', left: '30%', animationDelay: '0s' }}
                  />
                  <div 
                    className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-ping"
                    style={{ top: '60%', right: '25%', animationDelay: '1s' }}
                  />
                  <div 
                    className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-ping"
                    style={{ bottom: '30%', left: '20%', animationDelay: '0.5s' }}
                  />
                </>
              )}
            </div>
          </div>
        );

      case 'pro':
        return (
          <div className={`${baseClasses} relative group`}>
            {/* Electric Blue Circuitry Cube */}
            <div 
              className={`w-full h-full rounded-lg border-2 relative overflow-hidden transition-all duration-300 ${
                isActive 
                  ? 'border-blue-400 shadow-lg shadow-blue-400/30' 
                  : 'border-blue-400/40'
              }`}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(29, 78, 216, 0.1))'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(29, 78, 216, 0.05))',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isActive 
                  ? '0 0 20px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.1)'
                  : '0 0 10px rgba(59, 130, 246, 0.2)'
              }}
            >
              {/* Circuit Traces */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                <defs>
                  <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path 
                  d="M8 12 L16 12 L16 20 L24 20 L24 12 L32 12 M16 20 L16 28 L24 28 L24 36 L32 36"
                  stroke="url(#circuit-gradient)"
                  strokeWidth="1.5"
                  fill="none"
                  className={isActive ? 'animate-pulse' : ''}
                />
                <circle cx="16" cy="12" r="2" fill="#3B82F6" className={isActive ? 'animate-ping' : ''} />
                <circle cx="24" cy="20" r="2" fill="#3B82F6" className={isActive ? 'animate-ping' : ''} />
                <circle cx="32" cy="36" r="2" fill="#3B82F6" className={isActive ? 'animate-ping' : ''} />
              </svg>
              
              {/* PRO Labels */}
              <div className="absolute top-1 left-1">
                <span 
                  className="text-xs font-bold"
                  style={{
                    color: isActive ? '#3B82F6' : '#3B82F680',
                    textShadow: isActive ? '0 0 6px rgba(59, 130, 246, 0.8)' : 'none'
                  }}
                >
                  PRO
                </span>
              </div>
              <div className="absolute bottom-1 right-1">
                <span 
                  className="text-xs font-bold"
                  style={{
                    color: isActive ? '#3B82F6' : '#3B82F680',
                    textShadow: isActive ? '0 0 6px rgba(59, 130, 246, 0.8)' : 'none'
                  }}
                >
                  PRO
                </span>
              </div>
            </div>
          </div>
        );

      case 'vault':
        return (
          <div className={`${baseClasses} relative group tier-icon-wrapper`}>
            {/* Enhanced Floating Golden Key with Cinematic Effects */}
            <div 
              className="w-full h-full relative"
              style={{
                animation: isActive ? 'floatKey 4s ease-in-out infinite' : 'none'
              }}
            >
              {/* Cinematic Glow Ring Behind Key */}
              <div 
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-70'
                }`}
                style={{
                  background: 'radial-gradient(circle, rgba(249, 200, 14, 0.4) 10%, rgba(249, 200, 14, 0.2) 30%, rgba(249, 200, 14, 0.1) 50%, transparent 70%)',
                  animation: isActive ? 'spin 8s linear infinite' : 'none',
                  border: '3px solid rgba(249, 200, 14, 0.6)',
                  boxShadow: isActive 
                    ? '0 0 40px rgba(249, 200, 14, 0.6), inset 0 0 20px rgba(249, 200, 14, 0.2)'
                    : '0 0 20px rgba(249, 200, 14, 0.3)'
                }}
              />
              
              {/* Enhanced Key Shape with 3D Effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                  className={`transition-all duration-300 ${isActive ? 'scale-115' : 'scale-100'}`} 
                  width="36" 
                  height="36" 
                  viewBox="0 0 36 36"
                  style={{
                    filter: isActive 
                      ? 'drop-shadow(0 0 20px rgba(249, 200, 14, 0.8)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))'
                      : 'drop-shadow(0 0 10px rgba(249, 200, 14, 0.4))'
                  }}
                >
                  <defs>
                    <linearGradient id="enhanced-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="25%" stopColor="#F59E0B" />
                      <stop offset="50%" stopColor="#D97706" />
                      <stop offset="75%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#B45309" />
                    </linearGradient>
                    <filter id="enhanced-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <filter id="inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feOffset in="SourceGraphic" dx="1" dy="1" result="offset"/>
                      <feGaussianBlur in="offset" stdDeviation="1" result="blur"/>
                      <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Key Head (Enhanced Circle) */}
                  <circle 
                    cx="12" 
                    cy="12" 
                    r="8" 
                    fill="none" 
                    stroke="url(#enhanced-gold-gradient)" 
                    strokeWidth="3"
                    filter={isActive ? "url(#enhanced-glow)" : "url(#inner-shadow)"}
                  />
                  
                  {/* Inner Key Head Detail */}
                  <circle 
                    cx="12" 
                    cy="12" 
                    r="4" 
                    fill="none" 
                    stroke="url(#enhanced-gold-gradient)" 
                    strokeWidth="1"
                    opacity="0.6"
                  />
                  
                  {/* Key Shaft (Enhanced) */}
                  <line 
                    x1="20" 
                    y1="12" 
                    x2="30" 
                    y2="12" 
                    stroke="url(#enhanced-gold-gradient)" 
                    strokeWidth="3"
                    filter={isActive ? "url(#enhanced-glow)" : "url(#inner-shadow)"}
                  />
                  
                  {/* Key Teeth (Enhanced) */}
                  <rect 
                    x="24" 
                    y="12" 
                    width="2" 
                    height="6" 
                    fill="url(#enhanced-gold-gradient)"
                    filter={isActive ? "url(#enhanced-glow)" : "url(#inner-shadow)"}
                  />
                  <rect 
                    x="27" 
                    y="12" 
                    width="2" 
                    height="8" 
                    fill="url(#enhanced-gold-gradient)"
                    filter={isActive ? "url(#enhanced-glow)" : "url(#inner-shadow)"}
                  />
                  <rect 
                    x="30" 
                    y="12" 
                    width="2" 
                    height="4" 
                    fill="url(#enhanced-gold-gradient)"
                    filter={isActive ? "url(#enhanced-glow)" : "url(#inner-shadow)"}
                  />
                </svg>
              </div>
              
              {/* Cinematic Lens Flare */}
              {isActive && (
                <>
                  <div 
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                      background: 'radial-gradient(circle, rgba(249, 200, 14, 0.6) 0%, rgba(249, 200, 14, 0.2) 40%, transparent 70%)',
                      animationDuration: '3s'
                    }}
                  />
                  <div 
                    className="absolute top-1/2 left-1/2 w-1 h-8 bg-yellow-300 opacity-60 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      boxShadow: '0 0 20px rgba(249, 200, 14, 0.8)',
                      animation: 'shimmer 2s ease-in-out infinite'
                    }}
                  />
                  <div 
                    className="absolute top-1/2 left-1/2 w-8 h-1 bg-yellow-300 opacity-60 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      boxShadow: '0 0 20px rgba(249, 200, 14, 0.8)',
                      animation: 'shimmer 2s ease-in-out infinite'
                    }}
                  />
                </>
              )}
              
              {/* Enhanced Encrypted Glow Overlay */}
              <div 
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  background: 'conic-gradient(from 0deg, rgba(249, 200, 14, 0.15), rgba(249, 200, 14, 0.4), rgba(249, 200, 14, 0.15), rgba(249, 200, 14, 0.4), rgba(249, 200, 14, 0.15))',
                  borderRadius: '50%',
                  animation: isActive ? 'spin 6s linear infinite reverse' : 'none'
                }}
              />
              
              {/* Arcane Power Particles */}
              {isActive && (
                <>
                  <div 
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                    style={{ 
                      top: '15%', 
                      left: '25%', 
                      animation: 'float 3s ease-in-out infinite',
                      boxShadow: '0 0 8px rgba(249, 200, 14, 0.8)'
                    }}
                  />
                  <div 
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                    style={{ 
                      top: '70%', 
                      right: '20%', 
                      animation: 'float 3s ease-in-out infinite',
                      animationDelay: '1s',
                      boxShadow: '0 0 8px rgba(249, 200, 14, 0.8)'
                    }}
                  />
                  <div 
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                    style={{ 
                      bottom: '25%', 
                      left: '15%', 
                      animation: 'float 3s ease-in-out infinite',
                      animationDelay: '2s',
                      boxShadow: '0 0 8px rgba(249, 200, 14, 0.8)'
                    }}
                  />
                </>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderIcon();
}