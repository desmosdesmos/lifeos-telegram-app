import { Outlet, useLocation, useNavigate } from 'react-router';
import { Home, LineChart, Plus, Sparkles, User } from 'lucide-react';
import { useBottomBar } from '../context/BottomBarContext';
import { motion, AnimatePresence } from 'motion/react';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isHidden } = useBottomBar();

  const navItems = [
    { path: '/', icon: Home, label: 'Главная' },
    { path: '/analysis', icon: LineChart, label: 'Анализ' },
    { path: '/quick-add', icon: Plus, label: 'Добавить', isCenter: true },
    { path: '/chat', icon: Sparkles, label: 'AI' },
    { path: '/profile', icon: User, label: 'Профиль' },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#0B0B0F] overflow-x-hidden text-white font-sans selection:bg-[#4DA3FF]/30">
      <main className="pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation с оптимизированными анимациями */}
      <nav 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2.5rem)] max-w-[420px] pointer-events-none transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          isHidden ? 'translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100'
        }`}
        style={{ willChange: 'transform, opacity' }}
      >
        <div
          className="rounded-[28px] px-2 py-3 flex items-center justify-around pointer-events-auto relative overflow-hidden"
          style={{
            background: 'rgba(20, 20, 25, 0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            if (item.isCenter) {
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="relative -top-2 flex items-center justify-center transition-transform active:scale-90"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4DA3FF] to-[#22C55E] flex items-center justify-center shadow-[0_8px_20px_rgba(77,163,255,0.3)] border border-white/20">
                    <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                </button>
              );
            }

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1.5 px-3 py-1 rounded-xl transition-all duration-200 active:scale-95"
              >
                <div className={`relative flex items-center justify-center transition-all duration-300 ${isActive ? '-translate-y-0.5' : ''}`}>
                  <Icon 
                    className={`w-6 h-6 transition-colors duration-300 ${
                      isActive ? 'text-[#4DA3FF]' : 'text-white/40'
                    }`} 
                    strokeWidth={isActive ? 2.5 : 2} 
                  />
                  {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#4DA3FF] shadow-[0_0_8px_#4DA3FF]" />
                  )}
                </div>
                <span className={`text-[10px] tracking-tight transition-colors duration-300 ${
                  isActive ? 'text-[#4DA3FF] font-semibold' : 'text-white/40'
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
