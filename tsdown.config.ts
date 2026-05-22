import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: ['src/index.ts'],
    format: 'esm',
    dts: true,
    unbundle: true,
    outDir: 'dist',
    target: 'es2022',
    clean: true,
    fixedExtension: false,
    report: false,
    deps: { skipNodeModulesBundle: true },
})
