import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative asset paths so the build works from any folder, not only a domain root.
  base: './',
  plugins: [react()],
});
