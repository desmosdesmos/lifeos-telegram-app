import { createContext, useContext, useState, type ReactNode } from 'react';

interface BottomBarContextType {
  isHidden: boolean;
  hide: () => void;
  show: () => void;
}

const BottomBarContext = createContext<BottomBarContextType | null>(null);

export function BottomBarProvider({ children }: { children: ReactNode }) {
  const [isHidden, setIsHidden] = useState(false);

  const hide = () => setIsHidden(true);
  const show = () => setIsHidden(false);

  return (
    <BottomBarContext.Provider value={{ isHidden, hide, show }}>
      {children}
    </BottomBarContext.Provider>
  );
}

export function useBottomBar() {
  const context = useContext(BottomBarContext);
  if (!context) {
    throw new Error('useBottomBar must be used within BottomBarProvider');
  }
  return context;
}
