import { describe, expect, it } from 'vitest'

import { TokenData } from '@diia-inhouse/types'

import { Asserts } from '../../src/asserts'

describe('Asserts', () => {
    describe('assertIsRefreshTokenExists', () => {
        it('should not throw error', () => {
            const tokenData = { refreshToken: {} } as TokenData

            const checkIsRefreshTokenExists = (): void => {
                Asserts.isRefreshTokenExists(tokenData)
            }

            expect(checkIsRefreshTokenExists).not.toThrow()
        })

        it('should throw error', () => {
            const tokenData = {} as TokenData

            const checkIsRefreshTokenExists = (): void => {
                Asserts.isRefreshTokenExists(tokenData)
            }

            expect(checkIsRefreshTokenExists).toThrow('RefreshToken does not exists')
        })
    })

    describe('assertObjectHasOnlyOneOf', () => {
        interface TestObject {
            prop1?: string
            prop2?: string
            prop3?: string
        }

        it('should assert one property present in object', async () => {
            const object: TestObject = {
                prop1: '1',
                prop3: '3',
            }

            const checkAssertObjectHasOnlyOneOf = (): void => {
                Asserts.assertObjectHasOnlyOneOf(object, 'prop1', 'prop2')
            }

            expect(checkAssertObjectHasOnlyOneOf).not.toThrow()
        })

        it('should fail if more then one property present in object', async () => {
            const object: TestObject = {
                prop1: '1',
                prop2: '2',
                prop3: '3',
            }

            const checkAssertObjectHasOnlyOneOf = (): void => {
                Asserts.assertObjectHasOnlyOneOf(object, 'prop1', 'prop2')
            }

            expect(checkAssertObjectHasOnlyOneOf).toThrow('Expected to have only one of [prop1, prop2]')
        })

        it('should fail if no properties present in object', async () => {
            const object: TestObject = {
                prop3: '3',
            }

            const checkAssertObjectHasOnlyOneOf = (): void => {
                Asserts.assertObjectHasOnlyOneOf(object, 'prop1', 'prop2')
            }

            expect(checkAssertObjectHasOnlyOneOf).toThrow('Expected to have one of [prop1, prop2]')
        })
    })
})
