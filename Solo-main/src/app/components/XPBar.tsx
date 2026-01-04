import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface XPBarProps {
  currentXP: number;
  xpToNextLevel: number;
  level: number;
  showLevel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function XPBar({ currentXP, xpToNextLevel, level, showLevel = true, size = 'md' }: XPBarProps) {
  const percentage = Math.min((currentXP / xpToNextLevel) * 100, 100);
  
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="w-full space-y-2">
      {showLevel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-muted-foreground">
              Level {level}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {currentXP} / {xpToNextLevel} XP
          </span>
        </div>
      )}
      
      <div className={`w-full bg-secondary/50 rounded-full overflow-hidden backdrop-blur-sm ${heightClasses[size]}`}>
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 via-purple-400 to-cyan-400 relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
}
