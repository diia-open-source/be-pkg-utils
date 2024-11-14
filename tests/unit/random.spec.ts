import { describe, expect, it } from 'vitest'

import { RandomUtils } from '../../src'

describe('RandomUtils', () => {
    it('should return a string of random integers', () => {
        const randomIntsString = RandomUtils.getRandomIntsString()

        expect(randomIntsString).toMatch(/^\d{6}$/)
    })
    it('should return a generated uuid', () => {
        const uuid = RandomUtils.generateUUID()

        expect(uuid).toMatch(/[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}/)
    })
})
