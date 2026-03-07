import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';
import './index.css';

function App() {
  // Initialize Telegram WebApp
  useTelegramWebApp();

  return <RouterProvider router={router} />;
}

export default App;
