import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('App: Starting initialization...');

try {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root container not found');
  }
  
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('App: Rendered successfully');
} catch (error) {
  console.error('App: Fatal initialization error:', error);
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'position:fixed;inset:0;background:white;color:black;padding:20px;z-index:10000;overflow:auto;';
  errorDiv.innerHTML = `<h1>Fatal Error</h1><pre>${error instanceof Error ? error.stack : String(error)}</pre>`;
  document.body.appendChild(errorDiv);
}
