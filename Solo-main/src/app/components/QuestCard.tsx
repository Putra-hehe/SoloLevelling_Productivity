import { Quest } from '../types';
import { Calendar, Tag, Trophy, CheckCircle2, Circle, Clock } from 'lucide-react';
import { getDifficultyColor } from '../utils/xp';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { format } from 'date-fns';

interface QuestCardProps {
  quest: Quest;
  onClick?: () => void;
  onComplete?: () => void;
}

export function QuestCard({ quest, onClick, onComplete }: QuestCardProps) {
  const completedSubtasks = quest.subtasks.filter(st => st.completed).length;
  const totalSubtasks = quest.subtasks.length;
  const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="p-4 cursor-pointer bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all"
        onClick={onClick}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                {quest.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : quest.status === 'in_progress' ? (
                  <Clock className="w-5 h-5 text-blue-400" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
                <h3 className={quest.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                  {quest.title}
                </h3>
              </div>
              {quest.description && (
                <p className="text-sm text-muted-foreground ml-7">{quest.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {quest.status !== 'completed' && onComplete && (
                <Button
                  variant="ghost"
                  size="icon"
                  title="Mark as complete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete();
                  }}
                  className="h-8 w-8"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
              <Badge className={getDifficultyColor(quest.difficulty)}>
                {quest.difficulty}
              </Badge>
            </div>
          </div>

          {/* Progress Bar for Subtasks */}
          {totalSubtasks > 0 && (
            <div className="ml-7">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{completedSubtasks}/{totalSubtasks}</span>
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 ml-7">
            <div className="flex items-center gap-3 flex-wrap">
              {quest.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(quest.dueDate), 'MMM dd')}</span>
                </div>
              )}
              
              {quest.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-muted-foreground" />
                  <div className="flex gap-1">
                    {quest.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs">
              <Trophy className="w-3 h-3 text-purple-400" />
              <span className="text-purple-400 font-medium">+{quest.xpReward} XP</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
