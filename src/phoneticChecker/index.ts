import flevenshtein from 'fast-levenshtein'

import { metaphone } from './metaphone'

class PhoneticChecker {
    getEqualityCoefficient(etalonValue: string, slaveValue: string): number {
        const etalonValuePhone = metaphone.process(etalonValue)
        const slaveValuePhone = metaphone.process(slaveValue)

        const distance = this.getLevenshteinDistance(etalonValuePhone, slaveValuePhone)

        const etalonLength = etalonValue.length

        return (etalonLength - distance) / etalonLength
    }

    private getLevenshteinDistance(str1: string, str2: string): number {
        return flevenshtein.get(str1, str2)
    }
}

export const phoneticChecker = new PhoneticChecker()
