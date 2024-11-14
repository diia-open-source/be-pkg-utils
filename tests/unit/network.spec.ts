import { describe, expect, it } from 'vitest'

import { GrpcStatusCode } from '@diia-inhouse/types'

import { NetworkUtils } from '../../src/network'

describe('Network utils', () => {
    describe('isHttpCode', () => {
        it.each([
            [false, undefined],
            [false, 5],
            [false, 99],
            [true, 100],
            [true, 200],
            [true, 599],
            [false, 600],
            [false, 1000],
        ])('should return %s for the %d number', (result, number) => {
            expect(NetworkUtils.isHttpCode(number)).toEqual(result)
        })
    })

    describe('isGrpcCode', () => {
        it.each([
            [false, undefined],
            [false, 200],
            [true, GrpcStatusCode.OK],
        ])('should return %s for the %d number', (result, number) => {
            expect(NetworkUtils.isGrpcCode(number)).toEqual(result)
        })
    })

    describe('getHttpStatusCodeByGrpcCode', () => {
        it.each([
            [200, GrpcStatusCode.OK],
            [500, 1000],
        ])('should return %s for the %d number', (result, code) => {
            expect(NetworkUtils.getHttpStatusCodeByGrpcCode(code)).toEqual(result)
        })
    })

    describe('getGrpcCodeByHttpStatusCode', () => {
        it.each([
            [GrpcStatusCode.OK, 200],
            [GrpcStatusCode.UNKNOWN, 1000],
        ])('should return %s for the %d number', (result, code) => {
            expect(NetworkUtils.getGrpcCodeByHttpStatusCode(code)).toEqual(result)
        })
    })
})
