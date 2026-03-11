import { Outlet, useLocation, useNavigate } from 'react-router';
import { Home, LineChart, Plus, Sparkles, User } from 'lucide-react';
import { useBottomBar } from '../context/BottomBarContext';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isHidden } = useBottomBar();

  const navItems = [
    { path: '/', icon: Home, label: 'Главная' },
    { path: '/analysis', icon: LineChart, label: 'Анализ' },
    { path: '/quick-add', icon: Plus, label: 'Добавить' },
    { path: '/chat', icon: Sparkles, label: 'AI' },
    { path: '/profile', icon: User, label: 'Профиль' },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#0B0B0F] overflow-x-hidden">
      <div className="pb-24">
        <Outlet />
      </div>

      {/* Bottom Navigation с анимациями */}
      <nav className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-[390px] pointer-events-none transition-all duration-300 ${isHidden ? 'translate-y-[200%]' : 'translate-y-0'}`}>
        <div
          className="rounded-[24px] px-4 py-3 flex items-center justify-around pointer-events-auto"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 transition-all duration-300"
              >
                <Icon 
                  className={`w-6 h-6 transition-all duration-300 ${
                    isActive 
                      ? 'text-[#4DA3FF] scale-110 -translate-y-1' 
                      : 'text-white/60 hover:text-white/80'
                  }`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                <span className={`text-[10px] transition-all duration-300 ${
                  isActive ? 'text-[#4DA3FF] font-bold' : 'text-white/60'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
