import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './seed';
import { KarrotApp } from './karrot/KarrotApp';
import { SCENARIOS, type Scenario } from './karrot/useKarrotApp';
import { ScreensPage } from './screens/ScreensPage';

/** `?sc=<scenario>` renders one 390×844 phone (for embedding in an iframe); otherwise every screen. */
const sc = new URLSearchParams(location.search).get('sc');
const single = SCENARIOS.includes(sc as Scenario) ? (sc as Scenario) : null;

if (single) document.body.style.background = 'var(--seed-color-bg-layer-default)';

createRoot(document.getElementById('root')!).render(
  <StrictMode>{single ? <KarrotApp scenario={single} /> : <ScreensPage />}</StrictMode>,
);
