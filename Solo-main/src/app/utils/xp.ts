import { QuestDifficulty } from '../types';

export const calculateXPForLevel = (level: number): number => {
  // XP needed increases exponentially
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const calculateLevel = (totalXP: number): number => {
  let level = 1;
  let xpNeeded = 0;
  
  while (totalXP >= xpNeeded + calculateXPForLevel(level)) {
    xpNeeded += calculateXPForLevel(level);
    level++;
  }
  
  return level;
};

export const getXPForDifficulty = (difficulty: QuestDifficulty | string): number => {
  switch (difficulty) {
    case 'easy':
      return 10;
    case 'normal':
      return 25;
    case 'hard':
      return 50;
    default:
      return 10;
  }
};


export const getDifficultyColor = (difficulty: QuestDifficulty): string => {
  switch (difficulty) {
    case 'easy':
      return 'text-green-400 border-green-400/30 bg-green-400/10';
    case 'normal':
      return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    case 'hard':
      return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
    default:
      return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
  }
};

export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'common':
      return 'text-gray-400 border-gray-400/30';
    case 'uncommon':
      return 'text-green-400 border-green-400/30';
    case 'rare':
      return 'text-blue-400 border-blue-400/30';
    case 'epic':
      return 'text-purple-400 border-purple-400/30';
    case 'legendary':
      return 'text-yellow-400 border-yellow-400/30';
    default:
      return 'text-gray-400 border-gray-400/30';
  }
};
