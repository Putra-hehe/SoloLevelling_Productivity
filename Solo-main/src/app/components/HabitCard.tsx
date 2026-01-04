import { Habit } from '../types';
import { Flame, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from './ui/card';

interface HabitCardProps {
  habit: Habit;
  onClick?: () => void;
  onToggle?: () => void;
  isCompletedToday?: boolean;
}

export function HabitCard({ habit, onClick, onToggle, isCompletedToday = false }: HabitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="p-4 cursor-pointer bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all relative overflow-hidden"
        onClick={onClick}
        style={{
          borderLeftColor: habit.color || '#8b5cf6',
          borderLeftWidth: '4px'
        }}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="mb-1">{habit.title}</h3>
              {habit.description && (
                <p className="text-sm text-muted-foreground">{habit.description}</p>
              )}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle?.();
              }}
              className="flex-shrink-0"
            >
              {isCompletedToday ? (
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
              )}
            </button>
          </div>

          {/* Streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <div>
                <span className="text-sm font-medium text-orange-400">{habit.currentStreak}</span>
                <span className="text-xs text-muted-foreground ml-1">day streak</span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Best: <span className="text-foreground font-medium">{habit.longestStreak}</span>
            </div>
          </div>

          {/* Frequency */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground capitalize">{habit.frequency}</span>
            <span className="text-purple-400 font-medium">+{habit.xpPerCompletion} XP</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
