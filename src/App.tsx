import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AppProvider, useApp } from './context/AppContext';
import { BottomBarProvider } from './context/BottomBarContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { Onboarding } from './pages/Onboarding';
import { PaywallModal } from './components/PaywallModal';
import './index.css';

function AppContent() {
  const { state, completeOnboarding } = useApp();

  if (!state.hasCompletedOnboarding) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <>
      <RouterProvider router={router} />
      <PaywallModal />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <BottomBarProvider>
        <SubscriptionProvider>
          <AppContent />
        </SubscriptionProvider>
      </BottomBarProvider>
    </AppProvider>
  );
}

export default App;
