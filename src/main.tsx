import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './seed';
import { KarrotApp } from './karrot/KarrotApp';
import { SCENARIOS, type Scenario } from './karrot/useKarrotApp';
import { PrototypePage } from './screens/PrototypePage';
import { ScreensPage } from './screens/ScreensPage';

/**
 * `?sc=<scenario>` renders one bare 390×844 phone (for iframes). `?mode=prototype`, `#prototype` or
 * `window.KARROT_MODE = 'prototype'` opens the guided single-phone prototype. Otherwise every screen.
 */
const params = new URLSearchParams(location.search);
const sc = params.get('sc');
const prototype =
  params.get('mode') === 'prototype' || location.hash === '#prototype' || (window as { KARROT_MODE?: string }).KARROT_MODE === 'prototype';
const single = SCENARIOS.includes(sc as Scenario) ? (sc as Scenario) : null;

if (single) document.body.style.background = 'var(--seed-color-bg-layer-default)';

createRoot(document.getElementById('root')!).render(
  <StrictMode>{single ? <KarrotApp scenario={single} /> : prototype ? <PrototypePage /> : <ScreensPage />}</StrictMode>,
);
