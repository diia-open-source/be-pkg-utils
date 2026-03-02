import { describe, expect, it } from 'vitest'

import { phoneticChecker } from '../../src/phoneticChecker'

describe('PhoneticChecker', () => {
    describe('isPhoneticEqual', () => {
        it('should return true', () => {
            const etalonValue = 'амадоу'
            const slaveValue = 'амадоп'

            const result = phoneticChecker.arePhoneticallySimilar(etalonValue, slaveValue)

            expect(result).toBe(true)
        })

        it('should return false if threshold is custom', () => {
            const etalonValue = 'амадоу'
            const slaveValue = 'амадоп'

            const result = phoneticChecker.arePhoneticallySimilar(etalonValue, slaveValue, 0.9)

            expect(result).toBe(false)
        })

        it('should return false', () => {
            const etalonValue = 'амдоул'
            const slaveValue = 'амадов'

            const result = phoneticChecker.arePhoneticallySimilar(etalonValue, slaveValue)

            expect(result).toBe(false)
        })
    })
})
