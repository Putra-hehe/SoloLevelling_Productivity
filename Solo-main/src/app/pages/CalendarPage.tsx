import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CalendarDays, Plus } from 'lucide-react';

import { Quest } from '../types';
import { QuestCard } from '../components/QuestCard';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Calendar } from '../components/ui/calendar';
import { isoToLocalDateKey, toLocalDateKey } from '../utils/date';

interface CalendarPageProps {
  quests: Quest[];
  onQuestClick: (quest: Quest) => void;
  onCompleteQuest: (questId: string) => void;
  onAddQuestForDate: (date: Date) => void;
}

function dateKeyToLocalNoon(key: string): Date {
  const [y, m, d] = key.split('-').map((n) => Number(n));
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
}

export function CalendarPage({ quests, onQuestClick, onCompleteQuest, onAddQuestForDate }: CalendarPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const todayKey = toLocalDateKey(new Date());
  const selectedKey = toLocalDateKey(selectedDate);

  const questCountsByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const q of quests) {
      const key = isoToLocalDateKey(q.dueDate);
      if (!key) continue;
      // Count only not-completed quests so the calendar highlights actionable days.
      if (q.status === 'completed') continue;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [quests]);

  const daysWithQuests = useMemo(() => {
    return Array.from(questCountsByDay.keys()).map(dateKeyToLocalNoon);
  }, [questCountsByDay]);

  const overdueQuests = useMemo(() => {
    return quests
      .filter((q) => {
        if (q.status === 'completed') return false;
        const dueKey = isoToLocalDateKey(q.dueDate);
        return !!dueKey && dueKey < todayKey;
      })
      .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
  }, [quests, todayKey]);

  const selectedDayQuests = useMemo(() => {
    return quests
      .filter((q) => {
        const dueKey = isoToLocalDateKey(q.dueDate);
        return !!dueKey && dueKey === selectedKey;
      })
      .sort((a, b) => {
        // Incomplete first
        if (a.status !== b.status) {
          if (a.status === 'completed') return 1;
          if (b.status === 'completed') return -1;
        }
        return (a.createdAt || '').localeCompare(b.createdAt || '');
      });
  }, [quests, selectedKey]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-3xl mb-2 flex items-center gap-2">
            <CalendarDays className="w-7 h-7" />
            Calendar
          </h1>
          <p className="text-muted-foreground">Lihat quest berdasarkan tanggal, plus yang overdue.</p>
        </div>

        <Button
          onClick={() => onAddQuestForDate(selectedDate)}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add quest for {selectedKey}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-1"
        >
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
              modifiers={{ hasQuests: daysWithQuests }}
              modifiersClassNames={{
                hasQuests: 'bg-accent/40 text-accent-foreground rounded-md',
              }}
            />
            <div className="mt-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Today</span>
                <span className="font-medium">{todayKey}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Selected</span>
                <span className="font-medium">{selectedKey}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          {overdueQuests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-4 bg-card/30 backdrop-blur-sm border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <h2>Overdue</h2>
                  </div>
                  <span className="text-sm text-muted-foreground">{overdueQuests.length} quest</span>
                </div>
                <div className="space-y-3">
                  {overdueQuests.slice(0, 5).map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onClick={() => onQuestClick(quest)}
                      onComplete={() => onCompleteQuest(quest.id)}
                    />
                  ))}
                  {overdueQuests.length > 5 && (
                    <p className="text-sm text-muted-foreground">+{overdueQuests.length - 5} lainnya...</p>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2>Quests for {selectedKey}</h2>
              <span className="text-sm text-muted-foreground">{selectedDayQuests.length} quest</span>
            </div>

            {selectedDayQuests.length > 0 ? (
              <div className="space-y-3">
                {selectedDayQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onClick={() => onQuestClick(quest)}
                    onComplete={() => onCompleteQuest(quest.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-10 text-center bg-card/30 backdrop-blur-sm border-dashed">
                <p className="text-muted-foreground mb-4">Belum ada quest untuk tanggal ini.</p>
                <Button variant="outline" onClick={() => onAddQuestForDate(selectedDate)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add quest
                </Button>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
