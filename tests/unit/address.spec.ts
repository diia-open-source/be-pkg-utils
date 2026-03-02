import { describe, expect, it } from 'vitest'

import { AddressUtils } from '../../src/address'

describe('Address utils', () => {
    const utils = new AddressUtils()

    describe('getRegionAtuIdByKatottgCode', () => {
        it('should throw error for unknown region code', () => {
            const katotttgCode = 'UA99000000000'
            const response = utils.getRegionAtuIdByKatottgCode(katotttgCode)

            expect(response).toEqual(null)
        })

        const testCases = [
            { code: '01', expectedId: 1, name: 'Автономна Республіка Крим' },
            { code: '05', expectedId: 2, name: 'Вінницька область' },
            { code: '07', expectedId: 3, name: 'Волинська область' },
            { code: '12', expectedId: 4, name: 'Дніпропетровська область' },
            { code: '14', expectedId: 5, name: 'Донецька область' },
            { code: '18', expectedId: 6, name: 'Житомирська область' },
            { code: '21', expectedId: 7, name: 'Закарпатська область' },
            { code: '23', expectedId: 8, name: 'Запорізька область' },
            { code: '26', expectedId: 9, name: 'Івано-Франківська область' },
            { code: '32', expectedId: 10, name: 'Київська область' },
            { code: '35', expectedId: 11, name: 'Кіровоградська область' },
            { code: '44', expectedId: 12, name: 'Луганська область' },
            { code: '46', expectedId: 13, name: 'Львівська область' },
            { code: '48', expectedId: 14, name: 'Миколаївська область' },
            { code: '51', expectedId: 15, name: 'Одеська область' },
            { code: '53', expectedId: 16, name: 'Полтавська область' },
            { code: '56', expectedId: 17, name: 'Рівненська область' },
            { code: '59', expectedId: 18, name: 'Сумська область' },
            { code: '61', expectedId: 19, name: 'Тернопільська область' },
            { code: '63', expectedId: 20, name: 'Харківська область' },
            { code: '65', expectedId: 21, name: 'Херсонська область' },
            { code: '68', expectedId: 22, name: 'Хмельницька область' },
            { code: '71', expectedId: 23, name: 'Черкаська область' },
            { code: '73', expectedId: 24, name: 'Чернівецька область' },
            { code: '74', expectedId: 25, name: 'Чернігівська область' },
            { code: '80', expectedId: 26, name: 'Київ' },
            { code: '85', expectedId: 27, name: 'Севастополь' },
        ]

        it.each(testCases)('should return correct atuId for region: "$name"', ({ code, expectedId }) => {
            const katotttgCode = `UA${code}0000000000`

            const result = utils.getRegionAtuIdByKatottgCode(katotttgCode)

            expect(result).toBe(expectedId)
        })
    })
})
