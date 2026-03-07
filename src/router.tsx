import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Nutrition } from './pages/Nutrition';
import { Sleep } from './pages/Sleep';
import { AIAnalysis } from './pages/AIAnalysis';
import { AIChat } from './pages/AIChat';
import { Profile } from './pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'nutrition', Component: Nutrition },
      { path: 'sleep', Component: Sleep },
      { path: 'analysis', Component: AIAnalysis },
      { path: 'chat', Component: AIChat },
      { path: 'profile', Component: Profile },
    ],
  },
]);
