import { createBrowserRouter } from 'react-router-dom';
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

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    errorElement: (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-2">Упс! Что-то пошло не так</h1>
          <p className="text-white/60 mb-4">Попробуйте обновить страницу</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#4DA3FF] rounded-xl text-white font-medium"
          >
            Обновить
          </button>
        </div>
      </div>
    ),
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
    ],
  },
]);
