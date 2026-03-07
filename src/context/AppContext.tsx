import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: string;
  lifestyle: string;
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

interface Workout {
  id: number;
  name: string;
  duration: number;
  exercises: number;
  calories: number;
  date: string;
  completed: boolean;
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

interface SleepData {
  bedtime: string;
  wakeTime: string;
  duration: string;
  quality: number;
  deepSleep: string;
  remSleep: string;
  lightSleep: string;
}

interface AppState {
  profile: UserProfile;
  meals: Meal[];
  workouts: Workout[];
  transactions: Transaction[];
  goals: Goal[];
  sleep: SleepData;
  hasCompletedOnboarding: boolean;
}

const defaultState: AppState = {
  profile: {
    name: '',
    age: 0,
    weight: 0,
    height: 0,
    goal: 'Улучшение здоровья',
    lifestyle: 'Умеренно активный',
  },
  meals: [],
  workouts: [],
  transactions: [],
  goals: [],
  sleep: {
    bedtime: '23:00',
    wakeTime: '07:00',
    duration: '0ч 0м',
    quality: 0,
    deepSleep: '0ч 0м',
    remSleep: '0ч 0м',
    lightSleep: '0ч 0м',
  },
  hasCompletedOnboarding: false,
};

interface AppContextType {
  state: AppState;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  removeMeal: (id: number) => void;
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  removeWorkout: (id: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: number) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: number, goal: Partial<Goal>) => void;
  removeGoal: (id: number) => void;
  updateSleep: (sleep: Partial<SleepData>) => void;
  completeOnboarding: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'lifeos_app_data';

export function AppProvider({ children }: { children: ReactNode }) {
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateProfile = (profile: Partial<UserProfile>) => {
    setState(prev => ({ ...prev, profile: { ...prev.profile, ...profile } }));
  };

  const addMeal = (meal: Omit<Meal, 'id'>) => {
    setState(prev => ({
      ...prev,
      meals: [...prev.meals, { ...meal, id: Date.now() }],
    }));
  };

  const removeMeal = (id: number) => {
    setState(prev => ({
      ...prev,
      meals: prev.meals.filter(m => m.id !== id),
    }));
  };

  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    setState(prev => ({
      ...prev,
      workouts: [...prev.workouts, { ...workout, id: Date.now() }],
    }));
  };

  const removeWorkout = (id: number) => {
    setState(prev => ({
      ...prev,
      workouts: prev.workouts.filter(w => w.id !== id),
    }));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setState(prev => ({
      ...prev,
      transactions: [...prev.transactions, { ...transaction, id: Date.now() }],
    }));
  };

  const removeTransaction = (id: number) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id),
    }));
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    setState(prev => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: Date.now() }],
    }));
  };

  const updateGoal = (id: number, goal: Partial<Goal>) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, ...goal } : g),
    }));
  };

  const removeGoal = (id: number) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id),
    }));
  };

  const updateSleep = (sleep: Partial<SleepData>) => {
    setState(prev => ({
      ...prev,
      sleep: { ...prev.sleep, ...sleep },
    }));
  };

  const completeOnboarding = () => {
    setState(prev => ({ ...prev, hasCompletedOnboarding: true }));
  };

  const resetAllData = () => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AppContext.Provider value={{
      state,
      updateProfile,
      addMeal,
      removeMeal,
      addWorkout,
      removeWorkout,
      addTransaction,
      removeTransaction,
      addGoal,
      updateGoal,
      removeGoal,
      updateSleep,
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
