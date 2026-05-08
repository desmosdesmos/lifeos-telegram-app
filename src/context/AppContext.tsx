import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { calculateMacroTargets, type MacroTargets } from '../utils/macroCalculator';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  goal: string;
  lifestyle: string;
  avatarUrl?: string;
  showInLeaderboard?: boolean;
}

interface TopUser {
  id: string;
  name: string;
  score: number;
  avatarUrl?: string;
  isMe?: boolean;
}

interface Meal {
  id: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  time: string;
}

interface SleepDay {
  id: number;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: string;
  quality: number;
  deepSleep: string;
  remSleep: string;
  lightSleep: string;
}

interface Workout {
  id: number;
  name: string;
  duration: number;
  exercises: number;
  calories: number;
  date: string;
  completed: boolean;
  photos?: string[];
}

interface ProgressPhoto {
  id: number;
  date: string;
  photo: string;
  weight: number;
  notes?: string;
}

interface Transaction {
  id: number;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  progress: number;
  target: number;
  unit: string;
  deadline: string;
  category: 'health' | 'fitness' | 'finance' | 'learning';
  completed: boolean;
}

interface AppState {
  profile: UserProfile;
  meals: Meal[];
  sleepDays: SleepDay[];
  workouts: Workout[];
  progressPhotos: ProgressPhoto[];
  transactions: Transaction[];
  goals: Goal[];
  hasCompletedOnboarding: boolean;
  topUsers: TopUser[];
}

const defaultState: AppState = {
  profile: {
    name: '',
    age: 0,
    weight: 0,
    height: 0,
    gender: 'male',
    goal: 'Улучшение здоровья',
    lifestyle: 'Умеренно активный',
    showInLeaderboard: false,
  },
  meals: [],
  sleepDays: [],
  workouts: [],
  progressPhotos: [],
  transactions: [],
  goals: [],
  hasCompletedOnboarding: false,
  topUsers: [
    { id: '1', name: 'Александр', score: 98, avatarUrl: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: 'Мария', score: 95, avatarUrl: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: 'Дмитрий', score: 92, avatarUrl: 'https://i.pravatar.cc/150?u=3' },
    { id: '4', name: 'Елена', score: 89, avatarUrl: 'https://i.pravatar.cc/150?u=4' },
    { id: '5', name: 'Иван', score: 85, avatarUrl: 'https://i.pravatar.cc/150?u=5' },
  ],
};

interface AppContextType {
  state: AppState;
  macroTargets: MacroTargets;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  removeMeal: (id: number) => void;
  addSleepDay: (sleepDay: Omit<SleepDay, 'id'>) => void;
  updateSleepDay: (id: number, sleepDay: Partial<SleepDay>) => void;
  removeSleepDay: (id: number) => void;
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  removeWorkout: (id: number) => void;
  updateWorkout: (id: number, workout: Partial<Workout>) => void;
  addProgressPhoto: (photo: Omit<ProgressPhoto, 'id'>) => void;
  removeProgressPhoto: (id: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: number) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: number, goal: Partial<Goal>) => void;
  removeGoal: (id: number) => void;
  completeOnboarding: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'lifeos_app_data_v3';

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultState;
      }
    }
    return defaultState;
  });

  // Загрузка данных из Firebase при входе
  useEffect(() => {
    if (!user) return;

    console.log('🔄 Syncing with Firebase for user:', user.uid);
    const userDocRef = doc(db, 'users', user.uid);

    // Подписываемся на изменения в облаке
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data() as AppState;
        console.log('✅ Data loaded from Cloud');
        setState(prev => ({
          ...prev,
          ...cloudData,
          // Сохраняем локальные topUsers, так как они пока статические
          topUsers: defaultState.topUsers 
        }));
      } else {
        // Если в облаке пусто, отправляем туда текущие локальные данные
        console.log('📡 First sync: pushing local data to Cloud');
        setDoc(userDocRef, state);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Сохранение локально и в облако при изменениях
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      setDoc(userDocRef, state).catch(err => console.error('❌ Cloud Save Error:', err));
    }
  }, [state, user]);

  const macroTargets = calculateMacroTargets({
    weight: state.profile.weight,
    height: state.profile.height,
    age: state.profile.age,
    gender: state.profile.gender,
    goal: state.profile.goal,
    lifestyle: state.profile.lifestyle,
  });

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    setState(prev => ({ ...prev, profile: { ...prev.profile, ...profile } }));
  }, []);

  const addMeal = useCallback((meal: Omit<Meal, 'id'>) => {
    setState(prev => ({
      ...prev,
      meals: [...prev.meals, { ...meal, id: Date.now() }],
    }));
  }, []);

  const removeMeal = useCallback((id: number) => {
    setState(prev => ({
      ...prev,
      meals: prev.meals.filter(m => m.id !== id),
    }));
  }, []);

  const addSleepDay = useCallback((sleepDay: Omit<SleepDay, 'id'>) => {
    setState(prev => ({
      ...prev,
      sleepDays: [...prev.sleepDays, { ...sleepDay, id: Date.now() }],
    }));
  }, []);

  const updateSleepDay = useCallback((id: number, sleepDay: Partial<SleepDay>) => {
    setState(prev => ({
      ...prev,
      sleepDays: prev.sleepDays.map(s => s.id === id ? { ...s, ...sleepDay } : s),
    }));
  }, []);

  const removeSleepDay = useCallback((id: number) => {
    setState(prev => ({
      ...prev,
      sleepDays: prev.sleepDays.filter(s => s.id !== id),
    }));
  }, []);

  const addWorkout = useCallback((workout: Omit<Workout, 'id'>) => {
    setState(prev => ({
      ...prev,
      workouts: [...prev.workouts, { ...workout, id: Date.now() }],
    }));
  }, []);

  const removeWorkout = useCallback((id: number) => {
    setState(prev => ({
      ...prev,
      workouts: prev.workouts.filter(w => w.id !== id),
    }));
  }, []);

  const updateWorkout = useCallback((id: number, workout: Partial<Workout>) => {
    setState(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === id ? { ...w, ...workout } : w),
    }));
  }, []);

  const addProgressPhoto = useCallback((photo: Omit<ProgressPhoto, 'id'>) => {
    setState(prev => ({
      ...prev,
      progressPhotos: [...prev.progressPhotos, { ...photo, id: Date.now() }],
    }));
  }, []);

  const removeProgressPhoto = useCallback((id: number) => {
    setState(prev => ({
      ...prev,
      progressPhotos: prev.progressPhotos.filter(p => p.id !== id),
    }));
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    setState(prev => ({
      ...prev,
      transactions: [...prev.transactions, { ...transaction, id: Date.now() }],
    }));
  }, []);

  const removeTransaction = useCallback((id: number) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id),
    }));
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, 'id'>) => {
    setState(prev => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: Date.now() }],
    }));
  }, []);

  const updateGoal = useCallback((id: number, goal: Partial<Goal>) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, ...goal } : g),
    }));
  }, []);

  const removeGoal = useCallback((id: number) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id),
    }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState(prev => ({ ...prev, hasCompletedOnboarding: true }));
  }, []);

  const resetAllData = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AppContext.Provider value={{
      state,
      macroTargets,
      updateProfile,
      addMeal,
      removeMeal,
      addSleepDay,
      updateSleepDay,
      removeSleepDay,
      addWorkout,
      removeWorkout,
      updateWorkout,
      addProgressPhoto,
      removeProgressPhoto,
      addTransaction,
      removeTransaction,
      addGoal,
      updateGoal,
      removeGoal,
      completeOnboarding,
      resetAllData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
