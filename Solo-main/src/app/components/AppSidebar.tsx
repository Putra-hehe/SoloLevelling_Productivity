import { Sword, Home, Target, Flame, Timer, Trophy, BarChart3, Settings, Plus, CalendarDays } from 'lucide-react';
import { User } from '../types';
import { LevelBadge } from './LevelBadge';
import { Button } from './ui/button';

interface AppSidebarProps {
  user: User;
  currentPage: string;
  onNavigate: (page: string) => void;
  onAddQuest: () => void;
}

export function AppSidebar({ user, currentPage, onNavigate, onAddQuest }: AppSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'quests', label: 'Quests', icon: Target },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'habits', label: 'Habits', icon: Flame },
    { id: 'focus', label: 'Focus', icon: Timer },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo & User */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sword className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            LEVELDAY
          </h2>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent">
          <LevelBadge level={user.level} size="sm" showCrown={false} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.userClass}</p>
          </div>
        </div>
      </div>

      {/* Quick Add */}
      <div className="p-4 border-b border-sidebar-border">
        <Button
          onClick={onAddQuest}
          className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Quest
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-purple-500/20'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* XP Progress */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground mb-2">
          Level {user.level} Progress
        </div>
        <div className="w-full h-2 bg-sidebar-accent rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
            style={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {user.xp} / {user.xpToNextLevel} XP
        </div>
      </div>
    </div>
  );
}
