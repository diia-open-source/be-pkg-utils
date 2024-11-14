import { randomInt, randomUUID } from 'node:crypto'

export const RandomUtils = {
    generateUUID: randomUUID,
    getRandomIntsString(length = 6): string {
        return Array.from({ length }, () => randomInt(0, 10)).join('')
    },
}
