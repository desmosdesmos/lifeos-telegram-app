import { Outlet, useLocation, useNavigate } from 'react-router';
import { Home, LineChart, Plus, Sparkles, User } from 'lucide-react';
import { motion } from 'motion/react';
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
        <Outlet />
      </div>

      {/* Bottom Navigation с усиленным blur и анимациями */}
      <nav className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-[390px] pointer-events-none transition-all duration-500 ${isHidden ? 'translate-y-[200%] opacity-0' : 'translate-y-0 opacity-100'}`}>
        <motion.div
          className="glass-card-ultra rounded-[28px] px-3 py-3 flex items-center justify-around"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Active indicator background */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-b from-[#4DA3FF]/20 to-transparent rounded-2xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
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
                <motion.span 
                  className={`relative z-10 text-[10px] transition-all duration-300 ${
                    isActive ? 'text-[#4DA3FF] font-semibold' : 'text-white/40'
                  }`}
                  animate={{
                    y: isActive ? -2 : 0,
                    opacity: isActive ? 1 : 0.7
                  }}
                >
                  {item.label}
                </motion.span>
              </motion.button>
            );
          })}
        </motion.div>
      </nav>
    </div>
  );
}
