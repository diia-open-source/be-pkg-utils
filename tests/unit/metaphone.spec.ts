import { describe, expect, it } from 'vitest'

import { phoneticChecker } from '../../src/phoneticChecker/index'

const trasholdCoefficient = 0.75

describe('PhoneticChecker', () => {
    describe('isPhoneticEqual', () => {
        it('should return true', () => {
            const etalonValue = 'амадоу'
            const slaveValue = 'амадов'

            const result = phoneticChecker.getEqualityCoefficient(etalonValue, slaveValue)

            expect(result >= trasholdCoefficient).toBe(true)
        })

        it('should return false', () => {
            const etalonValue = 'амдоул'
            const slaveValue = 'амадов'

            const result = phoneticChecker.getEqualityCoefficient(etalonValue, slaveValue)

            expect(result >= trasholdCoefficient).toBe(false)
        })
    })
})
