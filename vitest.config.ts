import { defineConfig } from 'vitest/config'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  test: {
    includeSource: ['**/*.{test,spec}.{ts}'],
  },
  plugins: [
    AutoImport({
      imports: ['vitest'],
    }),
  ],
})
