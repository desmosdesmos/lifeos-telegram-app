import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'soft' | 'rigid') => void;
    notificationOccurred: (style: 'error' | 'success' | 'warning') => void;
  };
  initDataUnsafe: {
    user?: TelegramUser;
  };
  initData: string;
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  isExpanded: boolean;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function useTelegramWebApp() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      setWebApp(tg);

      if (tg.initDataUnsafe?.user) {
        setUserId(tg.initDataUnsafe.user.id);
        const name = [tg.initDataUnsafe.user.first_name, tg.initDataUnsafe.user.last_name]
          .filter(Boolean)
          .join(' ') || tg.initDataUnsafe.user.username || null;
        setUserName(name);
        
        // Получаем аватарку из Telegram
        if (tg.initDataUnsafe.user.photo_url) {
          setUserAvatar(tg.initDataUnsafe.user.photo_url);
        }
      }

      // Set header color
      tg.setHeaderColor('#0B0B0F');
      tg.setBackgroundColor('#0B0B0F');
    }
  }, []);

  const closeApp = () => {
    webApp?.close();
  };

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      webApp?.showConfirm(message, (confirmed) => {
        resolve(confirmed);
      });
    });
  };

  const showAlert = (message: string): Promise<void> => {
    return new Promise((resolve) => {
      webApp?.showAlert(message, () => {
        resolve();
      });
    });
  };

  const hapticFeedback = (
    type: 'impact' | 'notification' = 'impact',
    impactStyle?: 'light' | 'medium' | 'heavy' | 'soft' | 'rigid',
    notificationStyle?: 'error' | 'success' | 'warning'
  ) => {
    if (type === 'impact') {
      webApp?.HapticFeedback.impactOccurred(impactStyle || 'light');
    } else {
      webApp?.HapticFeedback.notificationOccurred(notificationStyle || 'success');
    }
  };

  return {
    webApp,
    userId,
    userName,
    userAvatar,
    isTelegram: !!webApp,
    closeApp,
    showConfirm,
    showAlert,
    hapticFeedback,
  };
}
