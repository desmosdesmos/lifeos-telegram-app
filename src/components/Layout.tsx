import { Outlet, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
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
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="gradient-orb gradient-orb-1" style={{ top: '10%', left: '-10%', width: '300px', height: '300px' }} />
        <div className="gradient-orb gradient-orb-2" style={{ bottom: '20%', right: '-5%', width: '250px', height: '250px' }} />
        <div className="gradient-orb gradient-orb-3" style={{ top: '50%', left: '50%', width: '200px', height: '200px', transform: 'translate(-50%, -50%)' }} />
      </div>

      <div className="relative pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            style={{ minHeight: '100vh' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <nav
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-[390px] transition-all duration-300 ${
          isHidden ? 'translate-y-[200%] opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="glass-card-ultra rounded-[28px] px-3 py-3 flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center gap-1 p-2 rounded-2xl"
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
    </div>
  );
}
