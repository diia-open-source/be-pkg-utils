import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

const timeout = 60 * 1000

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        name: 'unit',
        testTimeout: timeout,
        hookTimeout: timeout,
        exclude: ['node_modules', 'dist'],
        include: ['tests/unit/**/*.spec.ts'],
    },
})
