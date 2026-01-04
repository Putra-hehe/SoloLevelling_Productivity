import { useMemo, useState } from 'react';
import {
  BarChart3,
  CalendarDays,
  Gift,
  LayoutDashboard,
  Plus,
  Settings,
  Sparkles,
  Timer,
  Flame,
  ListTodo,
} from 'lucide-react';

import { Quest } from '../types';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './ui/command';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quests: Quest[];
  onNavigate: (page: string) => void;
  onNewQuest: () => void;
  onNewAIQuest: () => void;
  onStartFocus: () => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  quests,
  onNavigate,
  onNewQuest,
  onNewAIQuest,
  onStartFocus,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  const matchingQuests = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return quests
      .filter((quest) => quest.title.toLowerCase().includes(q))
      .slice(0, 6);
  }, [quests, query]);

  const run = (fn: () => void) => {
    fn();
    onOpenChange(false);
    setQuery('');
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search…" value={query} onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => run(() => onNavigate('dashboard'))}>
            <LayoutDashboard />
            Dashboard
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(() => onNavigate('quests'))}>
            <ListTodo />
            Quests
            <CommandShortcut>G Q</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(() => onNavigate('calendar'))}>
            <CalendarDays />
            Calendar
            <CommandShortcut>G C</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(() => onNavigate('habits'))}>
            <Flame />
            Habits
            <CommandShortcut>G H</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(() => onNavigate('focus'))}>
            <Timer />
            Focus
            <CommandShortcut>G F</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(() => onNavigate('rewards'))}>
            <Gift />
            Rewards
            <CommandShortcut>G R</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(() => onNavigate('stats'))}>
            <BarChart3 />
            Stats
            <CommandShortcut>G S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(() => onNavigate('settings'))}>
            <Settings />
            Settings
            <CommandShortcut>G ,</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(onNewQuest)}>
            <Plus />
            New Quest
            <CommandShortcut>N Q</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(onNewAIQuest)}>
            <Sparkles />
            AI Quest
            <CommandShortcut>N A</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(onStartFocus)}>
            <Timer />
            Start Focus Session
            <CommandShortcut>N F</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        {matchingQuests.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Quests">
              {matchingQuests.map((q) => (
                <CommandItem
                  key={q.id}
                  onSelect={() =>
                    run(() => {
                      // Navigate to quests page; user can click the card to open details.
                      onNavigate('quests');
                    })
                  }
                >
                  <ListTodo />
                  {q.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
