import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Target, Flame, Timer, Smile, Plus, ChevronRight, Trophy, Sparkles } from 'lucide-react';
import { User, Quest, Habit } from '../types';
import { XPBar } from '../components/XPBar';
import { LevelBadge } from '../components/LevelBadge';
import { QuestCard } from '../components/QuestCard';
import { HabitCard } from '../components/HabitCard';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { format } from 'date-fns';

interface DashboardProps {
  user: User;
  /** Quests scheduled for today (all statuses). */
  todayQuestsAll: Quest[];
  /** Quests scheduled for today that are not yet completed. */
  todayQuests: Quest[];
  habits: Habit[];
  onAddQuest: () => void;
  onAddQuestAI: () => void;
  onQuestClick: (quest: Quest) => void;
  onQuestComplete: (questId: string) => void;
  onViewAllQuests: () => void;
  onViewAllHabits: () => void;
  moodToday?: string;
  onMoodChange: (mood: string) => void;
  onHabitClick: (habit: Habit) => void;
  onStartFocus: () => void;
}

export function Dashboard({ 
  user, 
  todayQuestsAll,
  todayQuests, 
  habits, 
  onAddQuest, 
  onAddQuestAI,
  onQuestClick,
  onQuestComplete,
  onViewAllQuests,
  onViewAllHabits,
  moodToday,
  onMoodChange,
  onHabitClick,
  onStartFocus 
}: DashboardProps) {
  const completedQuests = useMemo(
    () => todayQuestsAll.filter((q) => q.status === 'completed').length,
    [todayQuestsAll]
  );
  const totalQuests = todayQuestsAll.length;
  const completionRate = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

  const moods = [
    { emoji: '😊', label: 'Great', value: 'great' },
    { emoji: '🙂', label: 'Good', value: 'good' },
    { emoji: '😐', label: 'Okay', value: 'okay' },
    { emoji: '😔', label: 'Tired', value: 'tired' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-3xl mb-2">
            Welcome back, <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{user.name}</span>
          </h1>
          <p className="text-muted-foreground">{format(new Date(), 'EEEE, MMMM dd, yyyy')}</p>
        </div>

        <div className="flex items-center gap-4">
          <LevelBadge level={user.level} size="md" />
          <div className="flex gap-2">
            <Button
              onClick={onAddQuest}
              aria-label="Add Quest"
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white gap-2"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Add Quest
            </Button>
            <Button
              onClick={onAddQuestAI}
              aria-label="Generate random quest"
              className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white gap-2"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              AI Quest
            </Button>
          </div>
        </div>
      </motion.div>

      {/* XP Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-purple-500/20">
          <XPBar
            currentXP={user.xp}
            xpToNextLevel={user.xpToNextLevel}
            level={user.level}
            size="lg"
          />
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedQuests}/{totalQuests}</p>
                <p className="text-sm text-muted-foreground">Quests Today</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {habits.reduce((max, h) => Math.max(max, h.currentStreak), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Best Streak</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user.totalXP}</p>
                <p className="text-sm text-muted-foreground">Total XP</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Mood Check-in */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Smile className="w-5 h-5 text-primary" />
            <h3>How are you feeling today?</h3>
          </div>
          <div className="flex gap-3">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => onMoodChange(m.value)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  moodToday === m.value
                    ? 'border-primary bg-primary/10 scale-105'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-3xl mb-1">{m.emoji}</div>
                <div className="text-sm">{m.label}</div>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Today's Quests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2>Today's Quests</h2>
          <Button variant="ghost" size="sm" className="gap-1" onClick={onViewAllQuests}>
            View All
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {todayQuests.length > 0 ? (
            todayQuests.slice(0, 3).map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onClick={() => onQuestClick(quest)}
                onComplete={() => onQuestComplete(quest.id)}
              />
            ))
          ) : (
            <Card className="p-8 text-center bg-card/30 backdrop-blur-sm border-dashed">
              <Target className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No quests for today</p>
              <Button onClick={onAddQuest} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Quest
              </Button>
            </Card>
          )}
        </div>
      </motion.div>

      {/* Active Habits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2>Active Habits</h2>
          <Button variant="ghost" size="sm" className="gap-1" onClick={onViewAllHabits}>
            View All
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.slice(0, 3).map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onClick={() => onHabitClick(habit)}
            />
          ))}
        </div>
      </motion.div>

      {/* Focus Session Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Timer className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3>Ready to focus?</h3>
                <p className="text-sm text-muted-foreground">Start a focus session to earn bonus XP</p>
              </div>
            </div>
            <Button 
              onClick={onStartFocus}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              Start Session
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
