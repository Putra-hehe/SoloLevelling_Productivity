import { Quest, Habit, Badge, User } from "../types";
import { createId } from "./id";

export const createMockUser = (name: string, email: string, userClass: any): User => {
  return {
    // Generate a unique id for new users using createId (has mobile-safe fallback)
    id: createId("user"),
    name,
    email,
    userClass,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalXP: 0,
    joinedDate: new Date().toISOString(),
    dailyGoal: "Build better habits",
    weeklySchedule: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  };
};

export const mockQuests: Quest[] = [
  {
    id: "1",
    title: "Complete morning workout",
    description: "30 minutes of exercise",
    difficulty: "normal",
    status: "pending",
    xpReward: 25,
    dueDate: new Date().toISOString(),
    tags: ["health", "fitness"],
    subtasks: [
      { id: "1-1", title: "Warm up (5 min)", completed: false },
      { id: "1-2", title: "Main workout (20 min)", completed: false },
      { id: "1-3", title: "Cool down (5 min)", completed: false },
    ],
    createdAt: new Date().toISOString(),
    isDaily: true,
  },
  {
    id: "2",
    title: "Learn React advanced patterns",
    description: "Study custom hooks and context",
    difficulty: "hard",
    status: "in_progress",
    xpReward: 50,
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    tags: ["learning", "coding"],
    subtasks: [
      { id: "2-1", title: "Read documentation", completed: true },
      { id: "2-2", title: "Build sample project", completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Meditate for 10 minutes",
    difficulty: "easy",
    status: "pending",
    xpReward: 10,
    tags: ["mindfulness", "health"],
    subtasks: [],
    createdAt: new Date().toISOString(),
    isDaily: true,
  },
];

export const mockHabits: Habit[] = [
  {
    id: "1",
    title: "Morning Pages",
    description: "Write 3 pages every morning",
    frequency: "daily",
    currentStreak: 7,
    longestStreak: 15,
    xpPerCompletion: 15,
    completedDates: [
      new Date(Date.now() - 86400000).toISOString(),
      new Date(Date.now() - 172800000).toISOString(),
    ],
    createdAt: new Date().toISOString(),
    color: "#8b5cf6",
  },
  {
    id: "2",
    title: "Read 30 minutes",
    description: "Read books or articles",
    frequency: "daily",
    currentStreak: 3,
    longestStreak: 10,
    xpPerCompletion: 10,
    completedDates: [new Date(Date.now() - 86400000).toISOString()],
    createdAt: new Date().toISOString(),
    color: "#06b6d4",
  },
  {
    id: "3",
    title: "Exercise",
    description: "Any physical activity",
    frequency: "weekly",
    customDays: [1, 3, 5],
    currentStreak: 2,
    longestStreak: 8,
    xpPerCompletion: 20,
    completedDates: [],
    createdAt: new Date().toISOString(),
    color: "#10b981",
  },
];

export const mockBadges: Badge[] = [
  {
    id: "1",
    name: "First Steps",
    description: "Complete your first quest",
    rarity: "common",
    iconType: "award",
    isLocked: false,
    unlockedAt: new Date().toISOString(),
    requirement: "Complete 1 quest",
  },
  {
    id: "2",
    name: "Habit Former",
    description: "Maintain a 7-day streak",
    rarity: "uncommon",
    iconType: "flame",
    isLocked: false,
    unlockedAt: new Date().toISOString(),
    requirement: "Get a 7-day streak",
  },
  {
    id: "3",
    name: "Quest Master",
    description: "Complete 50 quests",
    rarity: "rare",
    iconType: "trophy",
    isLocked: true,
    requirement: "Complete 50 quests",
  },
  {
    id: "4",
    name: "Focus Monk",
    description: "Complete 100 focus sessions",
    rarity: "epic",
    iconType: "zap",
    isLocked: true,
    requirement: "Complete 100 focus sessions",
  },
  {
    id: "5",
    name: "Legendary Warrior",
    description: "Reach level 50",
    rarity: "legendary",
    iconType: "crown",
    isLocked: true,
    requirement: "Reach level 50",
  },
];
