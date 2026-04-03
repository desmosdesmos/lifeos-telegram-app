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
    { path: '/', icon: Home, label: 'Главная' },
    { path: '/analysis', icon: LineChart, label: 'Анализ' },
    { path: '/quick-add', icon: Plus, label: 'Добавить' },
    { path: '/chat', icon: Sparkles, label: 'AI' },
    { path: '/profile', icon: User, label: 'Профиль' },
  ];

  const navItems = items || defaultItems;

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[390px]">
      <div className="glass-card-ultra rounded-[28px] px-3 py-3 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-1 p-2 rounded-2xl active:scale-95 transition-transform"
            >
              {/* Active indicator background */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#4DA3FF]/20 to-transparent rounded-2xl" />
              )}

              {/* Icon with glow effect */}
              <div className="relative z-10">
                <Icon
                  className={`w-6 h-6 transition-all duration-300 ${
                    isActive
                      ? 'text-[#4DA3FF] drop-shadow-[0_0_8px_rgba(77,163,255,0.6)]'
                      : 'text-white/50 hover:text-white/70'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {/* Glow orb for active state */}
                {isActive && (
                  <div className="absolute inset-0 bg-[#4DA3FF] blur-xl opacity-40 scale-150" />
                )}
              </div>

              {/* Label */}
              <span
                className={`relative z-10 text-[10px] transition-all duration-300 ${
                  isActive ? 'text-[#4DA3FF] font-semibold' : 'text-white/40'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
