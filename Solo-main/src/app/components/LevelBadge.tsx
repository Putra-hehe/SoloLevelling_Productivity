import { Crown } from 'lucide-react';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showCrown?: boolean;
}

export function LevelBadge({ level, size = 'md', showCrown = true }: LevelBadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-24 h-24 text-2xl'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {showCrown && (
        <Crown className={`absolute -top-2 ${iconSizes[size]} text-yellow-400 animate-bounce`} />
      )}
      <div 
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-[2px] shadow-lg shadow-purple-500/50`}
      >
        <div className="w-full h-full rounded-full bg-card flex items-center justify-center border-2 border-purple-400/20">
          <span className="font-bold bg-gradient-to-br from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {level}
          </span>
        </div>
      </div>
    </div>
  );
}
