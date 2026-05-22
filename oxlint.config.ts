import { defineConfig, base } from '@diia-inhouse/oxc-config/oxlint'

export default defineConfig({
    ...base,
    rules: {
        ...base.rules,
        '@diia-inhouse/locale/no-hardcoded-cyrillic': 'off',
    },
})
