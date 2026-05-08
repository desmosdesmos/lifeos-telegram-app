import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AppProvider, useApp } from './context/AppContext';
import { BottomBarProvider } from './context/BottomBarContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Onboarding } from './pages/Onboarding';
import { Login } from './pages/Login';
import './index.css';

function AppContent() {
  const { state, completeOnboarding } = useApp();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#09090B] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Если пользователь не авторизован и еще не прошел онбординг - показываем вход
  if (!user && !state.hasCompletedOnboarding) {
    return <Login />;
  }

  if (!state.hasCompletedOnboarding) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BottomBarProvider>
          <AppContent />
        </BottomBarProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
