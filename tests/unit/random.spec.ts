import { RandomUtils } from '../../src'

describe('RandomUtils', () => {
    it('should return a string of random integers', () => {
        const randomIntsString = RandomUtils.getRandomIntsString()

        expect(randomIntsString).toMatch(/^\d{6}$/)
    })
})
