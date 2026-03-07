import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { calculateMacroTargets, type MacroTargets } from '../utils/macroCalculator';

interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
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
  },
  meals: [],
  sleepDays: [],
  workouts: [],
  progressPhotos: [],
  transactions: [],
  goals: [],
  hasCompletedOnboarding: false,
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

const STORAGE_KEY = 'lifeos_app_data_v2';

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

  // Calculate macro targets based on profile
  const macroTargets = calculateMacroTargets({
    weight: state.profile.weight,
    height: state.profile.height,
    age: state.profile.age,
    gender: state.profile.gender,
    goal: state.profile.goal,
    lifestyle: state.profile.lifestyle,
  });

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

  const addSleepDay = (sleepDay: Omit<SleepDay, 'id'>) => {
    setState(prev => ({
      ...prev,
      sleepDays: [...prev.sleepDays, { ...sleepDay, id: Date.now() }],
    }));
  };

  const updateSleepDay = (id: number, sleepDay: Partial<SleepDay>) => {
    setState(prev => ({
      ...prev,
      sleepDays: prev.sleepDays.map(s => s.id === id ? { ...s, ...sleepDay } : s),
    }));
  };

  const removeSleepDay = (id: number) => {
    setState(prev => ({
      ...prev,
      sleepDays: prev.sleepDays.filter(s => s.id !== id),
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

  const updateWorkout = (id: number, workout: Partial<Workout>) => {
    setState(prev => ({
      ...prev,
      workouts: prev.workouts.map(w => w.id === id ? { ...w, ...workout } : w),
    }));
  };

  const addProgressPhoto = (photo: Omit<ProgressPhoto, 'id'>) => {
    setState(prev => ({
      ...prev,
      progressPhotos: [...prev.progressPhotos, { ...photo, id: Date.now() }],
    }));
  };

  const removeProgressPhoto = (id: number) => {
    setState(prev => ({
      ...prev,
      progressPhotos: prev.progressPhotos.filter(p => p.id !== id),
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
