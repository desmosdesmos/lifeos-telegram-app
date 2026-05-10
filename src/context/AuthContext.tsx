import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { signOut, onAuthStateChanged, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

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
    let isMounted = true;

    // Инициализация плагина Google Auth для Web
    const initGoogle = async () => {
      try {
        if (!Capacitor.isNativePlatform()) {
          await GoogleAuth.initialize({
            clientId: '524253422941-f3glrvsqhn01uce91ku3lvv3e6abbvp4.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            grantOfflineAccess: true,
          });
          console.log('Auth: Google Auth Web initialized');
        }
      } catch (err) {
        console.warn('Auth: Google Auth initialization warning (Web):', err);
      }
    };

    initGoogle();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (isMounted) {
        setUser(firebaseUser);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      // 1. Получаем токен через нативный плагин Capacitor
      const googleUser = await GoogleAuth.signIn();
      
      if (!googleUser.authentication || !googleUser.authentication.idToken) {
        throw new Error('Google Sign-In failed: No ID token returned');
      }

      // 2. Авторизуемся в Firebase с полученным токеном
      const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
      await signInWithCredential(auth, credential);
    } catch (error) {
      console.error('Error signing in with Google Native:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await GoogleAuth.signOut();
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

