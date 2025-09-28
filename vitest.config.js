import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['assets/**/*.test.js'],
    exclude: ['_build/**', '.github/**'],
    coverage: {
      provider: 'v8',
      reportsDirectory: '_build/test/cover/js',
      include: ['assets/**/*.js'],
      exclude: ['assets/**/*.test.js', 'assets/**/__mocks__/**', 'assets/**/e2e/**'],
      thresholds: {
        statements: 55,
        branches: 75,
        functions: 35,
        lines: 55,
      },
    },
  },
});
