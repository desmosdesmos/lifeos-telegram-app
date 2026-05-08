import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { signInWithRedirect, signOut, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Безопасная инициализация для мобильных устройств
    let isMounted = true;

    const initAuth = async () => {
      try {
        // Проверяем результат редиректа только на мобилках или если был редирект
        await getRedirectResult(auth);
      } catch (error) {
        console.error('Redirect Auth Error:', error);
      }

      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (isMounted) {
          setUser(firebaseUser);
          setLoading(false);
        }
      });

      return unsubscribe;
    };

    const unsubscribePromise = initAuth();

    return () => {
      isMounted = false;
      unsubscribePromise.then(unsub => unsub && unsub());
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
