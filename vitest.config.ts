/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node' // using vitest to test mainly server-side code. Use cypress for UI.
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  },
  envPrefix: 'NEXT_'
});
