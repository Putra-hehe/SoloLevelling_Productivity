import { motion } from 'motion/react';
import { TrendingUp, Target, Flame, Clock, Award } from 'lucide-react';
import { Card } from '../components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';
import { FocusSession, Habit, Quest } from '../types';
import { isoToLocalDateKey, toLocalDateKey } from '../utils/date';

interface StatsPageProps {
  quests: Quest[];
  habits: Habit[];
  focusSessions: FocusSession[];
  moodByDate?: Record<string, string>;
}

export function StatsPage({ quests, habits, focusSessions, moodByDate }: StatsPageProps) {
  const totalQuests = quests.length;
  const completedQuests = quests.filter((q) => q.status === 'completed').length;
  const totalHabits = habits.length;
  const totalFocusTime = focusSessions.reduce((sum, s) => sum + (s.completed ? s.duration : 0), 0);

  const completionRate = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

  // Build last 7 days buckets in local time.
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const key = toLocalDateKey(date);
    return {
      key,
      day: format(date, 'EEE'),
      xp: 0,
      tasks: 0,
    };
  });

  const bucketByKey = new Map(last7Days.map((d) => [d.key, d]));

  // Quests
  for (const q of quests) {
    if (q.status !== 'completed' || !q.completedAt) continue;
    const key = isoToLocalDateKey(q.completedAt);
    if (!key) continue;
    const bucket = bucketByKey.get(key);
    if (!bucket) continue;
    bucket.xp += q.xpReward;
    bucket.tasks += 1;
  }

  // Habits
  for (const h of habits) {
    for (const d of h.completedDates) {
      const key = isoToLocalDateKey(d);
      if (!key) continue;
      const bucket = bucketByKey.get(key);
      if (!bucket) continue;
      bucket.xp += h.xpPerCompletion;
      bucket.tasks += 1;
    }
  }

  // Focus sessions
  for (const s of focusSessions) {
    if (!s.completed) continue;
    const key = isoToLocalDateKey(s.startTime);
    if (!key) continue;
    const bucket = bucketByKey.get(key);
    if (!bucket) continue;
    bucket.xp += s.xpEarned;
    bucket.tasks += 1;
  }

  const weeklyXP = last7Days.map(({ day, xp }) => ({ day, xp }));
  const weeklyProductivity = last7Days.map(({ day, tasks }) => ({ day, tasks }));

  const weeklyTotalXP = last7Days.reduce((sum, d) => sum + d.xp, 0);

  const prevWeekKeys = new Set(
    Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 13 - i);
      return toLocalDateKey(date);
    })
  );

  const prevWeekXP = (() => {
    let xp = 0;
    for (const q of quests) {
      if (q.status !== 'completed' || !q.completedAt) continue;
      const key = isoToLocalDateKey(q.completedAt);
      if (key && prevWeekKeys.has(key)) xp += q.xpReward;
    }
    for (const h of habits) {
      for (const d of h.completedDates) {
        const key = isoToLocalDateKey(d);
        if (key && prevWeekKeys.has(key)) xp += h.xpPerCompletion;
      }
    }
    for (const s of focusSessions) {
      if (!s.completed) continue;
      const key = isoToLocalDateKey(s.startTime);
      if (key && prevWeekKeys.has(key)) xp += s.xpEarned;
    }
    return xp;
  })();

  const weeklyDeltaPct = prevWeekXP > 0 ? Math.round(((weeklyTotalXP - prevWeekXP) / prevWeekXP) * 100) : null;

  // Category data derived from quest tags (completed only). Falls back to "Other".
  const categoryMap = new Map<string, number>();
  for (const q of quests) {
    if (q.status !== 'completed') continue;
    const category = q.tags?.[0] || 'Other';
    categoryMap.set(category, (categoryMap.get(category) || 0) + q.xpReward);
  }
  // Make sure core categories appear if there's no data.
  if (categoryMap.size === 0) {
    categoryMap.set('Other', 1);
  }

  const palette = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];
  const categoryData = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value], idx) => ({ name, value, color: palette[idx % palette.length] }));

  const todayKey = toLocalDateKey(new Date());
  const moodToday = moodByDate?.[todayKey];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl mb-2">Statistics</h1>
        <p className="text-muted-foreground">Track your progress and insights</p>
        {moodToday && (
          <p className="text-sm text-muted-foreground mt-1">Mood today: {moodToday}</p>
        )}
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedQuests}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Quests Completed</p>
            <div className="mt-2 text-xs text-purple-400">
              {completionRate}% completion rate
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalHabits}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Active Habits</p>
            <div className="mt-2 text-xs text-orange-400">
              Building consistency
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-cyan-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalFocusTime}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Focus Minutes</p>
            <div className="mt-2 text-xs text-cyan-400">
              Deep work time
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{weeklyTotalXP}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Weekly XP</p>
            <div className="mt-2 text-xs text-green-400">
              {weeklyDeltaPct === null
                ? 'First week tracked'
                : `${weeklyDeltaPct >= 0 ? '+' : ''}${weeklyDeltaPct}% from last week`}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h3>Weekly XP Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyXP}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                <XAxis 
                  dataKey="day" 
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#12131f',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="xp" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Productivity Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-cyan-400" />
              <h3>Tasks Completed</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyProductivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
                <XAxis 
                  dataKey="day" 
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#12131f',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="tasks" 
                  fill="url(#colorGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="mb-6">Quest Categories</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-3">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                  <span className="text-muted-foreground">{category.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
