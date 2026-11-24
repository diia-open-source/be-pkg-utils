interface TransliterationRule {
    pattern: string
    replace: string
}

const rules: TransliterationRule[] = [
    { pattern: 'а', replace: 'a' },
    { pattern: 'б', replace: 'b' },
    { pattern: 'в', replace: 'v' },
    { pattern: 'зг', replace: 'zgh' },
    { pattern: 'Зг', replace: 'Zgh' },
    { pattern: 'г', replace: 'h' },
    { pattern: 'ґ', replace: 'g' },
    { pattern: 'д', replace: 'd' },
    { pattern: 'е', replace: 'e' },
    { pattern: '^є', replace: 'ye' },
    { pattern: 'є', replace: 'ie' },
    { pattern: 'ж', replace: 'zh' },
    { pattern: 'з', replace: 'z' },
    { pattern: 'и', replace: 'y' },
    { pattern: 'і', replace: 'i' },
    { pattern: '^ї', replace: 'yi' },
    { pattern: 'ї', replace: 'i' },
    { pattern: '^й', replace: 'y' },
    { pattern: 'й', replace: 'i' },
    { pattern: 'к', replace: 'k' },
    { pattern: 'л', replace: 'l' },
    { pattern: 'м', replace: 'm' },
    { pattern: 'н', replace: 'n' },
    { pattern: 'о', replace: 'o' },
    { pattern: 'п', replace: 'p' },
    { pattern: 'р', replace: 'r' },
    { pattern: 'с', replace: 's' },
    { pattern: 'т', replace: 't' },
    { pattern: 'у', replace: 'u' },
    { pattern: 'ф', replace: 'f' },
    { pattern: 'х', replace: 'kh' },
    { pattern: 'ц', replace: 'ts' },
    { pattern: 'ч', replace: 'ch' },
    { pattern: 'ш', replace: 'sh' },
    { pattern: 'щ', replace: 'shch' },
    { pattern: 'ьо', replace: 'io' },
    { pattern: 'ьї', replace: 'ii' },
    { pattern: 'ь', replace: '' },
    { pattern: '^ю', replace: 'yu' },
    { pattern: 'ю', replace: 'iu' },
    { pattern: '^я', replace: 'ya' },
    { pattern: 'я', replace: 'ia' },
    { pattern: 'А', replace: 'A' },
    { pattern: 'Б', replace: 'B' },
    { pattern: 'В', replace: 'V' },
    { pattern: 'Г', replace: 'H' },
    { pattern: 'Ґ', replace: 'G' },
    { pattern: 'Д', replace: 'D' },
    { pattern: 'Е', replace: 'E' },
    { pattern: '^Є', replace: 'Ye' },
    { pattern: 'Є', replace: 'Ie' },
    { pattern: 'Ж', replace: 'Zh' },
    { pattern: 'З', replace: 'Z' },
    { pattern: 'И', replace: 'Y' },
    { pattern: 'І', replace: 'I' },
    { pattern: '^Ї', replace: 'Yi' },
    { pattern: 'Ї', replace: 'I' },
    { pattern: '^Й', replace: 'Y' },
    { pattern: 'Й', replace: 'I' },
    { pattern: 'К', replace: 'K' },
    { pattern: 'Л', replace: 'L' },
    { pattern: 'М', replace: 'M' },
    { pattern: 'Н', replace: 'N' },
    { pattern: 'О', replace: 'O' },
    { pattern: 'П', replace: 'P' },
    { pattern: 'Р', replace: 'R' },
    { pattern: 'С', replace: 'S' },
    { pattern: 'Т', replace: 'T' },
    { pattern: 'У', replace: 'U' },
    { pattern: 'Ф', replace: 'F' },
    { pattern: 'Х', replace: 'Kh' },
    { pattern: 'Ц', replace: 'Ts' },
    { pattern: 'Ч', replace: 'Ch' },
    { pattern: 'Ш', replace: 'Sh' },
    { pattern: 'Щ', replace: 'Shch' },
    { pattern: 'Ь', replace: '' },
    { pattern: '^Ю', replace: 'Yu' },
    { pattern: 'Ю', replace: 'Iu' },
    { pattern: '^Я', replace: 'Ya' },
    { pattern: 'Я', replace: 'Ia' },
    { pattern: '’', replace: '' },
    { pattern: 'ʼ', replace: '' },
    { pattern: "'", replace: '' },
    { pattern: '`', replace: '' },
]

export const TransliterationUtils = {
    transliterate(inputText: string): string {
        let outputText = inputText
        const words = inputText.split(/[\n _-]/)

        for (const word of words) {
            let wordTransliteration = word

            for (const { pattern, replace } of rules) {
                // oxlint-disable-next-line security/detect-non-literal-regexp
                wordTransliteration = wordTransliteration.replaceAll(new RegExp(pattern, 'gm'), replace) // nosemgrep: eslint.detect-non-literal-regexp
            }

            outputText = outputText.replace(word, wordTransliteration)
        }

        return outputText
    },
}
