import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Filter, Sword, Sparkles } from 'lucide-react';
import { Quest, QuestDifficulty, QuestStatus } from '../types';
import { QuestCard } from '../components/QuestCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { isoToLocalDateKey, toLocalDateKey } from '../utils/date';

interface QuestsPageProps {
  quests: Quest[];
  onAddQuest: () => void;
  onAddQuestAI: () => void;
  onQuestClick: (quest: Quest) => void;
  onCompleteQuest: (questId: string) => void;
}

export function QuestsPage({ quests, onAddQuest, onAddQuestAI, onQuestClick, onCompleteQuest }: QuestsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestDifficulty | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'completed'>('today');

  const todayKey = toLocalDateKey(new Date());

  const filterQuests = (status: QuestStatus | 'today' | 'upcoming') => {
    let filtered = quests;

    // Filter by tab
    if (status === 'today') {
      filtered = filtered.filter(q => {
        if (q.status === 'completed') return false;
        if (!q.dueDate) return true;
        const dueKey = isoToLocalDateKey(q.dueDate);
        return dueKey ? dueKey === todayKey : true;
      });
    } else if (status === 'upcoming') {
      filtered = filtered.filter(q => {
        if (q.status === 'completed') return false;
        const dueKey = isoToLocalDateKey(q.dueDate);
        return !!dueKey && dueKey > todayKey;
      });
    } else {
      filtered = filtered.filter(q => q.status === 'completed');
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }

    return filtered;
  };

  const todayQuests = filterQuests('today');
  const upcomingQuests = filterQuests('upcoming');
  const completedQuests = filterQuests('completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-3xl mb-2">Quests</h1>
          <p className="text-muted-foreground">Manage your epic quests and earn XP</p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onAddQuest}
            aria-label="Create new quest"
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white gap-2"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            New Quest
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
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search quests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={selectedDifficulty === 'easy' ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty('easy')}
            size="sm"
          >
            Easy
          </Button>
          <Button
            variant={selectedDifficulty === 'normal' ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty('normal')}
            size="sm"
          >
            Normal
          </Button>
          <Button
            variant={selectedDifficulty === 'hard' ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty('hard')}
            size="sm"
          >
            Hard
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="today">
              Today ({todayQuests.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingQuests.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedQuests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-3 mt-6">
            {todayQuests.length > 0 ? (
              todayQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onClick={() => onQuestClick(quest)}
                  onComplete={() => onCompleteQuest(quest.id)}
                />
              ))
            ) : (
              <Card className="p-12 text-center bg-card/30 backdrop-blur-sm border-dashed">
                <Sword className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">No quests for today</h3>
                <p className="text-muted-foreground mb-6">Start your adventure by creating a new quest</p>
                <Button onClick={onAddQuest} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Quest
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-3 mt-6">
            {upcomingQuests.length > 0 ? (
              upcomingQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onClick={() => onQuestClick(quest)}
                  onComplete={() => onCompleteQuest(quest.id)}
                />
              ))
            ) : (
              <Card className="p-12 text-center bg-card/30 backdrop-blur-sm border-dashed">
                <Sword className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">No upcoming quests</h3>
                <p className="text-muted-foreground">Plan ahead by scheduling future quests</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3 mt-6">
            {completedQuests.length > 0 ? (
              completedQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onClick={() => onQuestClick(quest)}
                />
              ))
            ) : (
              <Card className="p-12 text-center bg-card/30 backdrop-blur-sm border-dashed">
                <Sword className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">No completed quests yet</h3>
                <p className="text-muted-foreground">Complete quests to see them here</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
