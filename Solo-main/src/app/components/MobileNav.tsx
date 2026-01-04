import { Home, Target, Flame, Timer, Trophy, BarChart3, Settings, CalendarDays } from 'lucide-react';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function MobileNav({ currentPage, onNavigate }: MobileNavProps) {
  const menuItems = [
    { id: 'dashboard', icon: Home },
    { id: 'quests', icon: Target },
    { id: 'calendar', icon: CalendarDays },
    { id: 'habits', icon: Flame },
    { id: 'focus', icon: Timer },
    { id: 'rewards', icon: Trophy },
    { id: 'stats', icon: BarChart3 },
    { id: 'settings', icon: Settings }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around p-2">
        {menuItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.id === 'dashboard' ? 'Home' : item.id.charAt(0).toUpperCase() + item.id.slice(1)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
