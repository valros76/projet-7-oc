import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/unit/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // Seuils globaux exigés à 80% minimum, et 60% branches minimum
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 60,
        statements: 80,
      },
    },
  },
})