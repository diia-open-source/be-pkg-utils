import { describe, expect, it } from 'vitest'

import { AuthDocumentType, DiiaOfficeStatus, Gender, ProfileFeature, SessionType, UserTokenData } from '@diia-inhouse/types'

import { extractProfileFeatures } from '../../src'

const user: UserTokenData = {
    addressOfBirth: '',
    addressOfRegistration: '',
    authEntryPoint: {
        document: AuthDocumentType.EResidency,
        bankName: '',
        isBankId: false,
        target: '',
    },
    birthDay: '',
    document: {
        type: AuthDocumentType.EResidency,
        value: 'xxxx',
    },
    email: '',
    fName: '',
    gender: Gender.male,
    identifier: '',
    itn: '',
    lName: '',
    mName: '',
    mobileUid: '',
    passport: '',
    phoneNumber: '',
    refreshToken: {
        value: 'xxx',
        expirationTime: 0,
    },
    sessionType: SessionType.User,
}

describe('SessionUtil', () => {
    describe('extractProfileFeatures', () => {
        it('should return true for office', () => {
            const result = extractProfileFeatures({
                user,
                sessionType: SessionType.User,
                features: {
                    office: {
                        unitId: 'test',
                        officeIdentifier: 'test-xx-xx',
                        profileId: 'yyy',
                        organizationId: 'xxx',
                        scopes: [],
                        isOrganizationAdmin: false,
                        status: DiiaOfficeStatus.ACTIVE,
                        tokenFailedAt: undefined,
                    },
                },
            })

            expect(result).toContain(ProfileFeature.office)
        })
    })

    describe('result empty', () => {
        it('features has undefined office', () => {
            const result = extractProfileFeatures({
                user,
                sessionType: SessionType.User,
                features: {
                    office: undefined,
                },
            })

            expect(result.length === 0).toBe(true)
        })

        it('features no keys must be empty array', () => {
            const result = extractProfileFeatures({
                user,
                sessionType: SessionType.User,
                features: {},
            })

            expect(result.length === 0).toBe(true)
        })

        it('no features no keys must be empty array', () => {
            const result = extractProfileFeatures({
                user,
                sessionType: SessionType.User,
            })

            expect(result.length === 0).toBe(true)
        })

        it('user office status suspended must be empty array', () => {
            const result = extractProfileFeatures({
                user,
                sessionType: SessionType.User,
                features: {
                    office: {
                        unitId: 'test',
                        officeIdentifier: 'test-xx-xx',
                        profileId: 'yyy',
                        organizationId: 'xxx',
                        scopes: [],
                        isOrganizationAdmin: false,
                        status: DiiaOfficeStatus.SUSPENDED,
                        tokenFailedAt: undefined,
                    },
                },
            })

            expect(result.length === 0).toBe(true)
        })

        it('user office status dismissed must be empty array', () => {
            const result = extractProfileFeatures({
                user,
                sessionType: SessionType.User,
                features: {
                    office: {
                        unitId: 'test',
                        officeIdentifier: 'test-xx-xx',
                        profileId: 'yyy',
                        organizationId: 'xxx',
                        scopes: [],
                        isOrganizationAdmin: false,
                        status: DiiaOfficeStatus.DISMISSED,
                        tokenFailedAt: undefined,
                    },
                },
            })

            expect(result.length === 0).toBe(true)
        })
    })
})
