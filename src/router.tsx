import { createHashRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Nutrition } from './pages/Nutrition';
import { Sleep } from './pages/Sleep';
import { AIAnalysis } from './pages/AIAnalysis';
import { AIChat } from './pages/AIChat';
import { Profile } from './pages/Profile';
import { Fitness } from './pages/Fitness';
import { Finances } from './pages/Finances';
import { Goals } from './pages/Goals';
import { Statistics } from './pages/Statistics';
import { QuickAdd } from './pages/QuickAdd';

export const router = createHashRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'nutrition', Component: Nutrition },
      { path: 'sleep', Component: Sleep },
      { path: 'fitness', Component: Fitness },
      { path: 'finances', Component: Finances },
      { path: 'goals', Component: Goals },
      { path: 'analysis', Component: AIAnalysis },
      { path: 'chat', Component: AIChat },
      { path: 'profile', Component: Profile },
      { path: 'statistics', Component: Statistics },
      { path: 'quick-add', Component: QuickAdd },
    ],
  },
]);
