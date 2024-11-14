import { describe, expect, it } from 'vitest'

import { DurationMs } from '@diia-inhouse/types'

import { IntegrationUtils } from '../../src/integration'

describe('Integration utils', () => {
    describe('getRetryDelay', () => {
        const timeLeft = DurationMs.Hour
        const initDelay = DurationMs.Minute
        const maxDelay = DurationMs.Hour
        const multiplier = 5

        it('should return the correct delay', () => {
            const retry = 2

            const expectedDelay = initDelay * Math.pow(multiplier, retry)

            const actualDelay = IntegrationUtils.getRetryDelay(retry, timeLeft, initDelay, maxDelay, multiplier)

            expect(actualDelay).toEqual(expectedDelay)
        })

        it('should return the timeLeft if the calculated delay exceeds timeLeft', () => {
            const retry = 5

            const expectedDelay = timeLeft

            const actualDelay = IntegrationUtils.getRetryDelay(retry, timeLeft, initDelay, maxDelay, multiplier)

            expect(actualDelay).toEqual(expectedDelay)
        })

        it('should return the initDelay if retry is 0', () => {
            const retry = 0

            const expectedDelay = initDelay

            const actualDelay = IntegrationUtils.getRetryDelay(retry, timeLeft, initDelay, maxDelay, multiplier)

            expect(actualDelay).toEqual(expectedDelay)
        })

        it('should return the maxDelay if the calculated delay exceeds maxDelay', () => {
            const retry = 10

            const expectedDelay = maxDelay

            const actualDelay = IntegrationUtils.getRetryDelay(retry, timeLeft, initDelay, maxDelay, multiplier)

            expect(actualDelay).toEqual(expectedDelay)
        })
    })
})
