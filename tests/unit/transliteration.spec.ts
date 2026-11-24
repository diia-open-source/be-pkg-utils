import { describe, expect, it } from 'vitest'

import { TransliterationUtils } from '../../src'

describe('TransliterationUtils', () => {
    describe('method transliterate', () => {
        it.each([
            [
                'а б в г ґ д е є ж з і ї к л м н о п р с т у ф х ц ч ш щ ь ю я',
                'a b v h g d e ye zh z i yi k l m n o p r s t u f kh ts ch sh shch  yu ya',
            ],
            [
                'А Б В Г Ґ Д Е Є Ж З І Ї К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я',
                'A B V H G D E Ye Zh Z I Yi K L M N O P R S T U F Kh Ts Ch Sh Shch  Yu Ya',
            ],
            ['є', 'ye'],
            ['ї', 'yi'],
            ['й', 'y'],
            ['ю', 'yu'],
            ['я', 'ya'],
            ['ь', ''],
            ['’', ''],
            ['ʼ', ''],
            ['Марʼяна', 'Mariana'],
            ["'", ''],
            ['`', ''],
        ])('should transform from `%s` to `%s`', (inputText, expectedResult) => {
            const result = TransliterationUtils.transliterate(inputText)

            expect(result).toBe(expectedResult)
        })
    })
})
