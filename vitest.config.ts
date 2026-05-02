import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';

// Load .env.local so DATABASE_URL is available during tests
config({ path: '.env.local' });

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
  },
});
