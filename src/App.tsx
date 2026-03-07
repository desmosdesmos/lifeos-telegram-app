import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AppProvider, useApp } from './context/AppContext';
import { Onboarding } from './pages/Onboarding';
import './index.css';

function AppContent() {
  const { state, completeOnboarding } = useApp();

  if (!state.hasCompletedOnboarding) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
