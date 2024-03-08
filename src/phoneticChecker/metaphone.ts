/* eslint-disable regexp/prefer-character-class */
class Metaphone {
    process(word: string): string {
        const normalizedValue = word.toUpperCase()

        const operations = [
            this.modifyOperation(/Ь|’|'|`/g, ''),
            this.modifyOperation(/Ґ/g, 'Г'),
            this.modifyOperation(/Е|Є|ЙЕ|ІЕ|ІО/g, 'Е'),
            this.modifyOperation(/Я|ІА|ІЯ/g, 'А'),
            this.modifyOperation(/І|Ї/g, 'И'),
            this.modifyOperation(/Ю/g, 'У'),
            this.modifyOperation(/ЙО/g, 'О'),
            this.modifyOperation(/У$/g, 'В'),
            this.modifyOperation(/П(Б|Г|Д|Ж|З)/g, 'Б$1'),
            this.modifyOperation(/С(Б|Г|Д|Ж|З)/g, 'З$1'),
            this.modifyOperation(/Х(Б|Г|Д|Ж|З)/g, 'Г$1'),
            this.modifyOperation(/Т(Б|Г|Д|Ж|З)/g, 'Д$1'),
            this.modifyOperation(/Ш(Б|Г|Д|Ж|З)/g, 'Ж$1'),
            this.modifyOperation(/ХВ/g, 'Ф'),
            this.modifyOperation(/(С|Ж)Ч/g, 'Щ'),
            this.modifyOperation(/(ШЧ[^Н])/, 'Щ'),
            this.modifyOperation(/С(Т|Л)Н/g, 'СН'),
            this.modifyOperation(/ЗДН/g, 'ЗH'),
            this.modifyOperation(/СТЛ/g, 'СЛ'),
            this.modifyOperation(/ШЧН/g, 'ШН'),
            this.modifyOperation(/ЦВ/g, 'Ц'),
            this.modifyOperation(/(\w)\1+/g, '$1'),
        ]

        return operations.reduce((acc, operation) => operation(acc), normalizedValue)
    }

    private modifyOperation(pattern: RegExp, replaceValue: string): (token: string) => string {
        return (token: string): string => token.replace(pattern, replaceValue)
    }
}

export const metaphone = new Metaphone()
