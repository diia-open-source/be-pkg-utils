import { ApiError, BadRequestError } from '@diia-inhouse/errors'
import TestKit from '@diia-inhouse/test'

import { Guards } from '../../src/guards'

describe('Guards', () => {
    const testKit = new TestKit()

    describe('apiError', () => {
        it('should return false', () => {
            const error = new Error('error')

            const result = Guards.apiError(error)

            expect(result).toBeFalsy()
        })

        it('should return true for ApiError instance', () => {
            const errorCode = 10001
            const error = new ApiError('errorMessage', errorCode)

            const result = Guards.apiError(error)

            expect(result).toBeTruthy()
        })

        it('should return true when the extended class is checked', () => {
            const error = new BadRequestError('badRequestErrorMessage')

            const result = Guards.apiError(error)

            expect(result).toBeTruthy()
        })
    })

    it('should return true for Error instance', () => {
        const error = new Error('error')

        const result = Guards.isError(error)

        expect(result).toBeTruthy()
    })

    describe('sessions', () => {
        it('isUserSession should return true for User session', () => {
            const session = testKit.session.getUserSession()

            const result = Guards.isUserSession(session)

            expect(result).toBeTruthy()
        })
        it('isUserSession should return false for undefined', () => {
            const session = undefined
            const result = Guards.isUserSession(session)

            expect(result).toBeFalsy()
        })

        it('isAcquirerSession should return true for Acquirer session', () => {
            const session = testKit.session.getAcquirerSession()

            const result = Guards.isAcquirerSession(session)

            expect(result).toBeTruthy()
        })
        it('isAcquirerSession should return false for undefined', () => {
            const session = undefined
            const result = Guards.isAcquirerSession(session)

            expect(result).toBeFalsy()
        })

        it('isServiceEntranceSession should return true for Acquirer session', () => {
            const session = testKit.session.getServiceEntranceSession()

            const result = Guards.isServiceEntranceSession(session)

            expect(result).toBeTruthy()
        })
        it('isServiceEntranceSession should return false for undefined', () => {
            const session = undefined
            const result = Guards.isServiceEntranceSession(session)

            expect(result).toBeFalsy()
        })
    })

    describe('hooks', () => {
        it('should return true if instance has onInit method', () => {
            const instance = {
                onInit: jest.fn(),
            }
            const result = Guards.hasOnInitHook(instance)

            expect(result).toBeTruthy()
        })

        it('should return false if instance without onInit', () => {
            const result = Guards.hasOnInitHook({})

            expect(result).toBeFalsy()
        })
        it('should return true if instance has onHealthCheckHook method', () => {
            const instance = {
                onHealthCheck: jest.fn(),
            }
            const result = Guards.hasOnHealthCheckHook(instance)

            expect(result).toBeTruthy()
        })

        it('should return false if instance without onHealthCheckHook', () => {
            const result = Guards.hasOnHealthCheckHook({})

            expect(result).toBeFalsy()
        })

        it('should return true if instance has onDestroyHook method', () => {
            const instance = {
                onDestroy: jest.fn(),
            }
            const result = Guards.hasOnDestroyHook(instance)

            expect(result).toBeTruthy()
        })

        it('should return false if instance without onDestroyHook', () => {
            const result = Guards.hasOnDestroyHook({})

            expect(result).toBeFalsy()
        })

        it('should return true if instance has onRegistrationsFinishedHook method', () => {
            const instance = {
                onRegistrationsFinished: jest.fn(),
            }
            const result = Guards.hasOnRegistrationsFinishedHook(instance)

            expect(result).toBeTruthy()
        })

        it('should return false if instance without onRegistrationsFinishedHook', () => {
            const result = Guards.hasOnRegistrationsFinishedHook({})

            expect(result).toBeFalsy()
        })
    })

    describe('isSettledError', () => {
        it('should return true if settled value is rejected', async () => {
            const [value] = await Promise.allSettled([Promise.reject(new Error('error'))])
            const result = Guards.isSettledError(value)

            expect(result).toBeTruthy()
        })

        it('should return false if settled value is fulfilled', async () => {
            const [value] = await Promise.allSettled([Promise.resolve(10)])
            const result = Guards.isSettledError(value)

            expect(result).toBeFalsy()
        })
    })
})
