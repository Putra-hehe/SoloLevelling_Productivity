import { motion } from 'motion/react';
import { Trophy, Gift, Star } from 'lucide-react';
import { Badge as BadgeType } from '../types';
import { BadgeCard } from '../components/BadgeCard';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

interface RewardsPageProps {
  badges: BadgeType[];
  onBadgeClick: (badge: BadgeType) => void;
}

export function RewardsPage({ badges, onBadgeClick }: RewardsPageProps) {
  const unlockedBadges = badges.filter(b => !b.isLocked);
  const lockedBadges = badges.filter(b => b.isLocked);

  const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  
  const sortedUnlocked = [...unlockedBadges].sort((a, b) => {
    return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
  });

  const sortedLocked = [...lockedBadges].sort((a, b) => {
    return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-10 h-10 text-purple-400" />
          <h1 className="text-3xl">Rewards & Achievements</h1>
        </div>
        <p className="text-muted-foreground">Collect badges and unlock rewards</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/20 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
            <div className="text-3xl font-bold text-yellow-400 mb-1">{unlockedBadges.length}</div>
            <p className="text-sm text-muted-foreground">Unlocked Badges</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 text-center">
            <Gift className="w-8 h-8 mx-auto mb-3 text-purple-400" />
            <div className="text-3xl font-bold text-purple-400 mb-1">{lockedBadges.length}</div>
            <p className="text-sm text-muted-foreground">To Unlock</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 text-center">
            <Star className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
            <div className="text-3xl font-bold text-cyan-400 mb-1">
              {Math.round((unlockedBadges.length / badges.length) * 100)}%
            </div>
            <p className="text-sm text-muted-foreground">Completion</p>
          </Card>
        </motion.div>
      </div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs defaultValue="unlocked">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="unlocked">
              Unlocked ({unlockedBadges.length})
            </TabsTrigger>
            <TabsTrigger value="locked">
              Locked ({lockedBadges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unlocked" className="mt-6">
            {sortedUnlocked.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedUnlocked.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    onClick={() => onBadgeClick(badge)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center bg-card/30 backdrop-blur-sm border-dashed">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">No badges unlocked yet</h3>
                <p className="text-muted-foreground">Complete quests and maintain habits to unlock badges</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="locked" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedLocked.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  onClick={() => onBadgeClick(badge)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Rarity Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="p-6 bg-card/30 backdrop-blur-sm border-border/50">
          <h3 className="mb-4">Rarity Levels</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="text-sm">Common</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-sm">Uncommon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              <span className="text-sm">Rare</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400" />
              <span className="text-sm">Epic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="text-sm">Legendary</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
