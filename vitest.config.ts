import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';
import path from 'path';

// Load .env.local so DATABASE_URL is available during tests
config({ path: '.env.local' });

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    globals: false,
  },
});
