import { randomInt } from 'node:crypto'

export const RandomUtils = {
    getRandomIntsString(length = 6): string {
        return Array.from({ length }, () => randomInt(0, 10)).join('')
    },
}
