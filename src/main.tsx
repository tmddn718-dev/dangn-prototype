import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './seed';
import { ScreensPage } from './screens/ScreensPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScreensPage />
  </StrictMode>,
);
