import { Badge as BadgeType } from '../types';
import { Award, Flame, Trophy, Zap, Crown, Lock } from 'lucide-react';
import { getRarityColor } from '../utils/xp';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface BadgeCardProps {
  badge: BadgeType;
  onClick?: () => void;
}

const iconMap = {
  award: Award,
  flame: Flame,
  trophy: Trophy,
  zap: Zap,
  crown: Crown
};

export function BadgeCard({ badge, onClick }: BadgeCardProps) {
  const Icon = iconMap[badge.iconType as keyof typeof iconMap] || Award;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={!badge.isLocked ? { scale: 1.05, rotateY: 10 } : {}}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`p-6 cursor-pointer bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all relative overflow-hidden ${
          badge.isLocked ? 'opacity-50' : ''
        }`}
        onClick={onClick}
      >
        {/* Background glow effect */}
        {!badge.isLocked && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 blur-xl" />
        )}
        
        <div className="relative space-y-3">
          {/* Icon */}
          <div className="flex items-center justify-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              badge.isLocked 
                ? 'bg-secondary' 
                : 'bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-2 border-purple-400/30'
            }`}>
              {badge.isLocked ? (
                <Lock className="w-8 h-8 text-muted-foreground" />
              ) : (
                <Icon className={`w-8 h-8 ${getRarityColor(badge.rarity).split(' ')[0]}`} />
              )}
            </div>
          </div>

          {/* Name & Rarity */}
          <div className="text-center space-y-1">
            <h4>{badge.name}</h4>
            <Badge className={getRarityColor(badge.rarity)}>
              {badge.rarity}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground text-center min-h-[40px]">
            {badge.description}
          </p>

          {/* Requirement */}
          {badge.requirement && (
            <div className="text-xs text-center text-muted-foreground border-t border-border pt-2">
              {badge.requirement}
            </div>
          )}

          {/* Unlock date */}
          {!badge.isLocked && badge.unlockedAt && (
            <div className="text-xs text-center text-purple-400">
              Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
