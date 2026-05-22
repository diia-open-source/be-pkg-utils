import flevenshtein from 'fast-levenshtein'

import { metaphone } from './metaphone.js'

class PhoneticChecker {
    private equalityCoefficientThreshold = 0.75

    arePhoneticallySimilar(etalonValue: string, slaveValue: string, threshold: number = this.equalityCoefficientThreshold): boolean {
        const equalityCoefficient = this.getEqualityCoefficient(etalonValue, slaveValue)

        return equalityCoefficient >= threshold
    }

    private getEqualityCoefficient(etalonValue: string, slaveValue: string): number {
        const etalonValuePhone = metaphone.process(etalonValue)
        const slaveValuePhone = metaphone.process(slaveValue)

        const distance = flevenshtein.get(etalonValuePhone, slaveValuePhone)

        const etalonLength = etalonValue.length

        return (etalonLength - distance) / etalonLength
    }
}

export const phoneticChecker: PhoneticChecker = new PhoneticChecker()
