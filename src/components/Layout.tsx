import { Outlet, useLocation, useNavigate } from 'react-router';
import { Home, LineChart, Plus, Sparkles, User } from 'lucide-react';
import { useBottomBar } from '../context/BottomBarContext';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { ScrollToTop } from './ScrollToTop';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isHidden, show } = useBottomBar();

  // Reset bottom bar visibility on route change
  useEffect(() => {
    show();
  }, [location.pathname, show]);

  useEffect(() => {
    const setupSystemBars = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Настройка статус-бара (верхняя полоска)
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#09090B' });
        } catch (error) {
          console.error('Error setting up status bar:', error);
        }
      }
    };

    setupSystemBars();
  }, []);

  const navItems = [
    { path: '/', icon: Home, label: 'Главная' },
    { path: '/analysis', icon: LineChart, label: 'Анализ' },
    { path: '/quick-add', icon: Plus, label: 'Добавить', isCenter: true },
    { path: '/chat', icon: Sparkles, label: 'AI' },
    { path: '/profile', icon: User, label: 'Профиль' },
  ];

  return (
    <div className="relative w-full min-h-screen bg-background text-white font-sans selection:bg-primary/30 flex flex-col">
      <ScrollToTop />
      <main className="flex-1 pb-32">
        <AnimatePresence initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "linear" }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Standard Native-Style Bottom Navigation */}
      <nav 
        className={`fixed bottom-0 left-0 right-0 z-[100] w-full transition-transform duration-300 ease-out bg-background/80 backdrop-blur-xl border-t border-white/5 safe-area-bottom pb-4 ${
          isHidden ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="px-4 pt-3 flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            if (item.isCenter) {
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] text-primary font-medium">{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-colors"
              >
                <Icon 
                  className={`w-6 h-6 transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-white/40'
                  }`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                <span className={`text-[10px] transition-colors duration-200 ${
                  isActive ? 'text-primary font-semibold' : 'text-white/40'
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
