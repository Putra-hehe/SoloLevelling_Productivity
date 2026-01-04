import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Flame } from 'lucide-react';
import { Habit } from '../types';
import { HabitCard } from '../components/HabitCard';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

interface HabitsPageProps {
  habits: Habit[];
  onAddHabit: () => void;
  onHabitClick: (habit: Habit) => void;
  onToggleHabit: (habitId: string) => void;
}

export function HabitsPage({ habits, onAddHabit, onHabitClick, onToggleHabit }: HabitsPageProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  
  const isCompletedToday = (habit: Habit) => {
    return habit.completedDates.some(date => date.startsWith(todayStr));
  };

  const totalStreakDays = habits.reduce((sum, h) => sum + h.currentStreak, 0);
  const completedToday = habits.filter(isCompletedToday).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-3xl mb-2">Habits</h1>
          <p className="text-muted-foreground">Build consistency and maintain your streaks</p>
        </div>

        <Button
          onClick={onAddHabit}
          aria-label="Create new habit"
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white gap-2"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          New Habit
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalStreakDays}</p>
                <p className="text-sm text-muted-foreground">Total Streak Days</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedToday}/{habits.length}</p>
                <p className="text-sm text-muted-foreground">Completed Today</p>
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
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {habits.reduce((max, h) => Math.max(max, h.longestStreak), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Habits Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {habits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onClick={() => onHabitClick(habit)}
                onToggle={() => onToggleHabit(habit.id)}
                isCompletedToday={isCompletedToday(habit)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-card/30 backdrop-blur-sm border-dashed">
            <Flame className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">No habits yet</h3>
            <p className="text-muted-foreground mb-6">Start building better habits today</p>
            <Button onClick={onAddHabit} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Habit
            </Button>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
