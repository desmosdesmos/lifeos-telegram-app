import { useLocation, useNavigate } from 'react-router';
import type { LucideIcon } from 'lucide-react';
import { Home, LineChart, Plus, Sparkles, User } from 'lucide-react';

interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
}

interface BottomNavigationProps {
  items?: NavItem[];
}

export function BottomNavigation({ items }: BottomNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultItems: NavItem[] = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/analysis', icon: LineChart, label: 'Analysis' },
    { path: '/nutrition', icon: Plus, label: 'Add' },
    { path: '/chat', icon: Sparkles, label: 'AI' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const navItems = items || defaultItems;

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[390px]">
      <div className="glass-card rounded-[24px] px-4 py-3 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-[#4DA3FF]' : 'text-white/60'
              }`}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
