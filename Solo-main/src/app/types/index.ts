export type UserClass = 'warrior' | 'scholar' | 'creator';

export type QuestDifficulty = 'easy' | 'normal' | 'hard';

export type QuestStatus = 'pending' | 'in_progress' | 'completed';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface User {
  id: string;
  name: string;
  email: string;
  userClass: UserClass;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXP: number;
  avatar?: string;
  joinedDate: string;
  dailyGoal?: string;
  weeklySchedule?: string[];
}

export interface Quest {
  id: string;
  title: string;
  description?: string;
  difficulty: QuestDifficulty;
  status: QuestStatus;
  xpReward: number;
  dueDate?: string;
  tags: string[];
  subtasks: Subtask[];
  createdAt: string;
  completedAt?: string;
  isDaily?: boolean;
  isWeekly?: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  customDays?: number[];
  currentStreak: number;
  longestStreak: number;
  xpPerCompletion: number;
  completedDates: string[];
  createdAt: string;
  reminderTime?: string;
  color?: string;
}

export interface FocusSession {
  id: string;
  questId?: string;
  duration: number;
  startTime: string;
  endTime?: string;
  xpEarned: number;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  iconType: string;
  unlockedAt?: string;
  isLocked: boolean;
  requirement?: string;
}

export interface Stats {
  totalQuests: number;
  completedQuests: number;
  totalHabits: number;
  totalFocusTime: number;
  weeklyXP: number[];
  weeklyProductivity: number[];
  habitStreaks: { habitId: string; streak: number }[];
  categoryBreakdown: { category: string; count: number }[];
}

export interface AppState {
  user: User | null;
  quests: Quest[];
  habits: Habit[];
  focusSessions: FocusSession[];
  badges: Badge[];
  currentPage: string;
  isOnboarded: boolean;
  /**
   * Mood check-in keyed by local date (YYYY-MM-DD).
   * Keeps history so the user can see trends over time.
   */
  moodByDate?: Record<string, string>;

  /**
   * Tracks the last local date (YYYY-MM-DD) when daily quests were reset.
   * This prevents daily quests from getting stuck as completed forever.
   */
  lastDailyReset?: string;
}
