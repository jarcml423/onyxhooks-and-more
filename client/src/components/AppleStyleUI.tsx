import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AppleCardProps {
  children: ReactNode;
  className?: string;
  neonAccent?: boolean;
  blur?: boolean;
}

export function AppleCard({ children, className, neonAccent = false, blur = false }: AppleCardProps) {
  return (
    <div className={cn(
      "bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm",
      neonAccent && "ring-1 ring-blue-500/30 shadow-blue-500/10",
      blur && "backdrop-blur-md bg-white/70",
      className
    )}>
      {children}
    </div>
  );
}

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'unlock';
  disabled?: boolean;
  className?: string;
  animate?: boolean;
}

export function GlassButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  className,
  animate = false 
}: GlassButtonProps) {
  const baseStyles = "px-6 py-3 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border";
  
  const variants = {
    primary: "bg-blue-500/90 hover:bg-blue-600/90 text-white border-blue-500/50 shadow-lg shadow-blue-500/25",
    secondary: "bg-white/80 hover:bg-white/90 text-gray-700 border-gray-200/50 shadow-sm",
    unlock: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-transparent shadow-lg animate-pulse"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        animate && "animate-bounce",
        className
      )}
    >
      {children}
    </button>
  );
}

interface NeonAccentProps {
  children: ReactNode;
  color?: 'blue' | 'purple' | 'green' | 'orange';
  intensity?: 'low' | 'medium' | 'high';
}

export function NeonAccent({ children, color = 'blue', intensity = 'medium' }: NeonAccentProps) {
  const colors = {
    blue: 'shadow-blue-500/50 ring-blue-500/30',
    purple: 'shadow-purple-500/50 ring-purple-500/30', 
    green: 'shadow-green-500/50 ring-green-500/30',
    orange: 'shadow-orange-500/50 ring-orange-500/30'
  };

  const intensities = {
    low: 'ring-1 shadow-sm',
    medium: 'ring-2 shadow-md',
    high: 'ring-4 shadow-lg'
  };

  return (
    <div className={cn(
      "rounded-2xl ring-offset-2",
      colors[color],
      intensities[intensity]
    )}>
      {children}
    </div>
  );
}

interface BlurOverlayProps {
  isBlurred: boolean;
  children: ReactNode;
  unlockText?: string;
  onUnlock?: () => void;
}

export function BlurOverlay({ isBlurred, children, unlockText = "🔓 Unlock Now", onUnlock }: BlurOverlayProps) {
  if (!isBlurred) return <>{children}</>;

  return (
    <div className="relative">
      <div className="filter blur-sm opacity-60 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-2xl">
        <div className="text-center space-y-4">
          <div className="text-4xl">🔒</div>
          {onUnlock && (
            <GlassButton variant="unlock" onClick={onUnlock} animate={true}>
              {unlockText}
            </GlassButton>
          )}
        </div>
      </div>
    </div>
  );
}

export function ScarcityBadge({ count, total, urgent = false }: { count: number; total: number; urgent?: boolean }) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
      urgent 
        ? "bg-red-500/10 text-red-600 ring-1 ring-red-500/20 animate-pulse" 
        : "bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/20"
    )}>
      <div className={cn("w-2 h-2 rounded-full", urgent ? "bg-red-500" : "bg-orange-500")} />
      {count.toLocaleString()} of {total.toLocaleString()} claimed
    </div>
  );
}