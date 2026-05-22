import fs from 'node:fs'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

import { ToRelativeUnit } from 'luxon'
import { WithAppVersionsEntity } from 'tests/interfaces'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError, BadRequestError } from '@diia-inhouse/errors'
import TestKit from '@diia-inhouse/test'
import {
    ActionVersion,
    DurationMs,
    Gender,
    HashedFile,
    HttpStatusCode,
    PlatformType,
    SessionType,
    SignedItem,
    TokenData,
    Units,
} from '@diia-inhouse/types'

import { ApplicationUtils } from '../../src/applicationUtils'

vi.mock('node:fs')
vi.mock('node:path')

const checkFormatDate = (): void => {
    ApplicationUtils.formatDate('21/01/2023', 'dd-MM-yyyy', 'dd.MM.yyyy')
}

describe('ApplicationUtils', () => {
    const testKit = new TestKit()

    describe('documentTypeToCamelCase', () => {
        it.each([
            ['foo-bar', 'fooBar'],
            ['student-id-card', 'studentCard'],
            ['internal-passport', 'idCard'],
        ])('should transform %s -> %s', (input, expected) => {
            expect(ApplicationUtils.documentTypeToCamelCase(input)).toBe(expected)
        })
    })

    describe('camelCaseToDocumentType', () => {
        it.each([
            ['fooBar', 'foo-bar'],
            ['studentCard', 'student-id-card'],
            ['idCard', 'internal-passport'],
        ])('should transform %s -> %s', (input, expected) => {
            expect(ApplicationUtils.camelCaseToDocumentType(input)).toBe(expected)
        })
    })

    describe('mapCyrillic', () => {
        it('should map string with cyrillic to string with latin', () => {
            const stringWithCyrillic = '123LJХК'
            const mappedString = ApplicationUtils.mapCyrillic(stringWithCyrillic)

            expect(mappedString).not.toEqual(stringWithCyrillic)
            expect(mappedString).toBe('123LJXK')
        })

        it('should not modify string without cyrillic', () => {
            const stringWithLatin = '123LJXK'
            const mappedString = ApplicationUtils.mapCyrillic(stringWithLatin)

            expect(mappedString).toEqual(stringWithLatin)
        })
    })
    describe('mapLatin', () => {
        it('should map string with latin to string with cyrillic', () => {
            const stringWithLatin = '123Yi'
            const mappedString = ApplicationUtils.mapLatin(stringWithLatin)

            expect(mappedString).not.toEqual(stringWithLatin)
            expect(mappedString).toBe('123Уі')
        })

        it('should not modify string without latin', () => {
            const stringWithCyrillic = '123Уі'
            const mappedString = ApplicationUtils.mapLatin(stringWithCyrillic)

            expect(mappedString).toEqual(stringWithCyrillic)
        })
    })
    describe('getBirthDayFromItn', () => {
        it.each([
            ['0000100000', '01.01.1900'],
            ['0000200000', '02.01.1900'],
            ['0000300000', '03.01.1900'],
            ['0010000', ''],
        ])('itn %s should produce %s birthDay', (itn: string, expectedDate: string) => {
            expect(ApplicationUtils.getBirthDayFromItn(itn)).toEqual(expectedDate)
        })
    })
    describe('getGenderFromItn', () => {
        it.each([
            ['1111111101', Gender.female],
            ['1111111121', Gender.female],
            ['1111111141', Gender.female],
            ['1111111161', Gender.female],
            ['1111111181', Gender.female],
            ['1111111111', Gender.male],
            ['1111111131', Gender.male],
            ['1111111151', Gender.male],
            ['1111111171', Gender.male],
            ['1111111191', Gender.male],
        ])('itn %s should produce %s gender', (itn: string, expectedGender: Gender) => {
            expect(ApplicationUtils.getGenderFromItn(itn)).toEqual(expectedGender)
        })
    })

    describe('handleError', () => {
        it('should return ApiError if usual error provided', () => {
            const errorMessage = 'Some error has been happened here'

            const e = new Error(errorMessage)

            const result = ApplicationUtils.handleError(e, (error) => error)

            expect(result).toBeInstanceOf(ApiError)
            expect(result.message).toEqual(errorMessage)
        })

        it('should return ApiError with custom fields if custom fields exists in error', () => {
            const errorMessage = 'Some error has been happened here'
            const customPropValue = { testKey: 'testValue' }

            const e = new Error(errorMessage)

            Object.defineProperty(e, 'code', { value: 11000 })
            Object.defineProperty(e, 'keyValue', { value: customPropValue, enumerable: true })

            const result = ApplicationUtils.handleError(e, (error) => error)

            expect(result).toBeInstanceOf(ApiError)
            expect(result.getData().keyValue).toEqual(customPropValue)
            expect(result.message).toEqual(errorMessage)
        })

        it('should return ApiError when usual error provided with async callback', async () => {
            const errorMessage = 'Some error has been happened here'

            const e = new Error(errorMessage)

            const result = await ApplicationUtils.handleError(e, async (error) => error)

            expect(result).toBeInstanceOf(ApiError)
            expect(result.message).toEqual(errorMessage)
        })

        it('should return ApiError when error is not provided', () => {
            const errorMessage = 'unexpectedErrorHere'
            const e = errorMessage

            const result = ApplicationUtils.handleError(e, (error) => error)

            expect(result).toBeInstanceOf(ApiError)
            expect(result.message).toContain(errorMessage)
        })

        it('should return an ApiError that is the original ApiError', () => {
            const errorMessage = 'Some error has been happened here'

            const e = new ApiError(errorMessage, HttpStatusCode.BAD_REQUEST)

            const result = ApplicationUtils.handleError(e, (error) => error)

            expect(result).toBe(e)
        })
    })

    describe('extractProcessCode', () => {
        it('should return processCode when passed like object', async () => {
            const processCode = 21061998
            const error = new BadRequestError('errorMessage', { processCode })

            const result = ApplicationUtils.handleError(error, (err) => {
                return err.getProcessCode()
            })

            expect(processCode).toEqual(result)
        })

        it('should return processCode when passed like separated param', async () => {
            const processCode = 21061998
            const error = new BadRequestError('errorMessage', {}, processCode)

            const result = ApplicationUtils.handleError(error, (err) => {
                return err.getProcessCode()
            })

            expect(processCode).toEqual(result)
        })

        it('should return undefined, when code is undefined', async () => {
            const error = new Error('errorMessage')

            const result = ApplicationUtils.handleError(error, (err) => {
                return err.getProcessCode()
            })

            expect(result).toBeUndefined()
        })
    })

    describe('filterByAppVersions', () => {
        it('should return all entities if appVersions is not present', () => {
            const platformType = PlatformType.Android
            const appVersion = '3.0.23.456'
            const items: WithAppVersionsEntity[] = [{ id: 'exact' }]

            const filtered = ApplicationUtils.filterByAppVersions(items, { platformType, appVersion })

            expect(filtered).toEqual([expect.objectContaining({ id: 'exact' })])
        })

        it('should return all entities if appVersion or platformType is not present', () => {
            const platformType = PlatformType.Android
            const appVersion = '3.0.23.456'
            const items: WithAppVersionsEntity[] = [{ id: 'exact' }]

            const filteredFirst = ApplicationUtils.filterByAppVersions(items, { platformType })
            const filteredSecond = ApplicationUtils.filterByAppVersions(items, { appVersion })

            expect(filteredFirst).toEqual(filteredSecond)
        })

        it('should filter entities by specific versions', () => {
            const platformType = PlatformType.Android
            const appVersion = '3.0.23.456'
            const items: WithAppVersionsEntity[] = [
                { id: 'exact', appVersions: { versions: { [platformType]: [appVersion], Huawei: [], iOS: [], Browser: [] } } },
                { id: 'any build', appVersions: { versions: { [platformType]: ['3.0.23.*'], Huawei: [], iOS: [], Browser: [] } } },
                { id: 'lower', appVersions: { versions: { [platformType]: ['3.0.22.456'], Huawei: [], iOS: [], Browser: [] } } },
                { id: 'higher', appVersions: { versions: { [platformType]: ['3.0.24'], Huawei: [], iOS: [], Browser: [] } } },
                {
                    id: 'another platform',
                    appVersions: { versions: { [PlatformType.iOS]: [appVersion], Huawei: [], Android: [], Browser: [] } },
                },
            ]

            const filtered = ApplicationUtils.filterByAppVersions(items, { platformType, appVersion })

            expect(filtered).toEqual([expect.objectContaining({ id: 'exact' }), expect.objectContaining({ id: 'any build' })])
        })

        it('should filter entities by min versions', () => {
            const platformType = PlatformType.Android
            const appVersion = '3.0.23.456'
            const items: WithAppVersionsEntity[] = [
                { id: 'exact', appVersions: { minVersion: { [platformType]: appVersion } } },
                { id: 'any build', appVersions: { minVersion: { [platformType]: '3.0.23.*' } } },
                { id: 'lower', appVersions: { minVersion: { [platformType]: '3.0.23' } } },
                { id: 'lower build', appVersions: { minVersion: { [platformType]: '3.0.23.455' } } },
                { id: 'higher', appVersions: { minVersion: { [platformType]: '3.0.24' } } },
                { id: 'higher build', appVersions: { minVersion: { [platformType]: '3.0.23.457' } } },
                { id: 'another platform', appVersions: { minVersion: { [PlatformType.Huawei]: appVersion } } },
            ]

            const filtered = ApplicationUtils.filterByAppVersions(items, { platformType, appVersion })

            expect(filtered).toEqual([
                expect.objectContaining({ id: 'exact' }),
                expect.objectContaining({ id: 'any build' }),
                expect.objectContaining({ id: 'lower' }),
                expect.objectContaining({ id: 'lower build' }),
            ])
        })

        it('should filter entities by max versions', () => {
            const platformType = PlatformType.Android
            const appVersion = '3.0.23.456'
            const items: WithAppVersionsEntity[] = [
                { id: 'exact', appVersions: { maxVersion: { [platformType]: appVersion } } },
                { id: 'any build', appVersions: { maxVersion: { [platformType]: '3.0.23.*' } } },
                { id: 'lower', appVersions: { maxVersion: { [platformType]: '3.0.23' } } },
                { id: 'lower build', appVersions: { maxVersion: { [platformType]: '3.0.23.455' } } },
                { id: 'higher', appVersions: { maxVersion: { [platformType]: '3.0.24' } } },
                { id: 'higher build', appVersions: { maxVersion: { [platformType]: '3.0.23.457' } } },
                { id: 'another platform', appVersions: { maxVersion: { [PlatformType.Huawei]: appVersion } } },
            ]

            const filtered = ApplicationUtils.filterByAppVersions(items, { platformType, appVersion })

            expect(filtered).toEqual([
                expect.objectContaining({ id: 'exact' }),
                expect.objectContaining({ id: 'any build' }),
                expect.objectContaining({ id: 'higher' }),
                expect.objectContaining({ id: 'higher build' }),
            ])
        })

        it('should filter entities by max and min versions', () => {
            const platformType = PlatformType.Android
            const appVersion = '3.0.23.456'
            const items: WithAppVersionsEntity[] = [
                { id: 'exact', appVersions: { maxVersion: { [platformType]: appVersion }, minVersion: { [platformType]: appVersion } } },
                {
                    id: 'any build',
                    appVersions: { maxVersion: { [platformType]: '3.0.23.*' }, minVersion: { [platformType]: '3.0.23.*' } },
                },
                { id: 'lower', appVersions: { maxVersion: { [platformType]: '3.0.23' }, minVersion: { [platformType]: '3.0.23' } } },
                {
                    id: 'lower build',
                    appVersions: { maxVersion: { [platformType]: '3.0.23.455' }, minVersion: { [platformType]: '3.0.23.455' } },
                },
                { id: 'higher', appVersions: { maxVersion: { [platformType]: '3.0.24' }, minVersion: { [platformType]: '3.0.24' } } },
                {
                    id: 'higher build',
                    appVersions: { maxVersion: { [platformType]: '3.0.23.457' }, minVersion: { [platformType]: '3.0.23.457' } },
                },
                {
                    id: 'another platform',
                    appVersions: { maxVersion: { [PlatformType.Huawei]: appVersion }, minVersion: { [PlatformType.Huawei]: appVersion } },
                },
            ]

            const filtered = ApplicationUtils.filterByAppVersions(items, { platformType, appVersion })

            expect(filtered).toEqual([expect.objectContaining({ id: 'exact' }), expect.objectContaining({ id: 'any build' })])
        })
    })

    describe('formatDate', () => {
        it('should format string dates properly', () => {
            const dateWithShortFormat = ApplicationUtils.formatDate('21.01.2023', 'dd-MM-yyyy', 'dd.MM.yyyy')
            const dateWithLocaleFormat = ApplicationUtils.formatDate('21.01.2023', 'd MMMM yyyy', 'dd.MM.yyyy')

            expect(dateWithShortFormat).toBe('21-01-2023')
            expect(dateWithLocaleFormat).toBe('21 січня 2023')
        })

        it('should format js dates properly', () => {
            const dateWithShortFormat = ApplicationUtils.formatDate(new Date('2023-01-21'), 'dd-MM-yyyy')
            const dateWithLocaleFormat = ApplicationUtils.formatDate(new Date('2023-01-21'), 'd MMMM yyyy')

            expect(dateWithShortFormat).toBe('21-01-2023')
            expect(dateWithLocaleFormat).toBe('21 січня 2023')
        })

        it('should throw error if passed date in wrong format', () => {
            expect(checkFormatDate).toThrow('Invalid date')
        })
    })

    describe('getChildFullName', () => {
        it('should make the child full name', () => {
            const birthCertificate = {
                child: {
                    lastName: 'last',
                    firstName: 'first',
                    middleName: 'middle',
                },
            }

            const result = ApplicationUtils.getChildFullName(birthCertificate)

            expect(result).toBe('last first middle')
        })

        it('should make the child full name with optional middleName', () => {
            const birthCertificate = {
                child: {
                    lastName: 'last',
                    firstName: 'first',
                },
            }

            const result = ApplicationUtils.getChildFullName(birthCertificate)

            expect(result).toBe('last first')
        })
    })

    describe('getPassportFullName', () => {
        it('should return full name', () => {
            const passport = {
                lastNameUA: 'last',
                firstNameUA: 'first',
                middleNameUA: 'middle',
            }

            const result = ApplicationUtils.getPassportFullName(passport)

            expect(result).toBe('last first middle')
        })

        it('should return full name with optional middleName', () => {
            const passport = {
                lastNameUA: 'last',
                firstNameUA: 'first',
            }

            const result = ApplicationUtils.getPassportFullName(passport)

            expect(result).toBe('last first')
        })
    })

    describe('getUserFullName', () => {
        it('should return full name', () => {
            const { user } = testKit.session.getUserSession()

            const result = ApplicationUtils.getUserFullName(user)

            expect(result).toBe(`${user.lName} ${user.fName} ${user.mName}`)
        })
    })

    describe('getFullName', () => {
        it('should return full name', () => {
            const firstName = 'fName'
            const lastName = 'lName'
            const middleName = 'mName'

            const result = ApplicationUtils.getFullName(lastName, firstName, middleName)

            expect(result).toBe(`${lastName} ${firstName} ${middleName}`)
        })

        it('should return full name with provided separator', () => {
            const firstName = 'fName'
            const lastName = 'lName'
            const middleName = 'mName'
            const separator = '\n'

            const result = ApplicationUtils.getFullName(lastName, firstName, middleName, separator)

            expect(result).toBe(`${lastName}${separator}${firstName}${separator}${middleName}`)
        })
    })

    describe('getShortName', () => {
        it('should return short name', () => {
            const lastName = 'Дія'
            const firstName = 'Надія'
            const middleName = 'Володимирівна'

            const result = ApplicationUtils.getShortName(lastName, firstName, middleName)

            expect(result).toBe(`Дія Н. В.`)
        })

        it('should return short name if middleName not exists', () => {
            const lastName = 'Дія'
            const firstName = 'Надія'

            const result = ApplicationUtils.getShortName(lastName, firstName)

            expect(result).toBe(`Дія Н.`)
        })
    })

    describe('getAge', () => {
        const mockedCurrentDate = new Date('2023-03-01')

        beforeEach(() => {
            vi.useFakeTimers().setSystemTime(mockedCurrentDate)
        })

        it.each([
            [18, 'years', '24.03.2004'],
            [18, 'years', '24.03.2004'],
            [75, 'quarters', '24.03.2004'],
            [227, 'months', '24.03.2004'],
            [6916, 'days', '24.03.2004'],
        ])('should return %d %s', (count, relativeUnit, birthdayDate) => {
            const result = ApplicationUtils.getAge(birthdayDate, { unitOfTime: relativeUnit as ToRelativeUnit })

            expect(result).toBe(count)
        })

        it.each([
            [19, '2024-12-01', '02.12.2004'],
            [20, '2024-12-01', '01.12.2004'],
        ])('should return %d when relativeTo date is %s', (count, relativeTo, birthdayDate) => {
            const result = ApplicationUtils.getAge(birthdayDate, { relativeTo })

            expect(result).toBe(count)
        })

        it('invalid date', async () => {
            const invaliDate = new Date('foo').toString()

            expect(() => {
                ApplicationUtils.getAge(invaliDate)
            }).toThrow('Invalid user birthday')
        })
    })

    describe('getGreeting', () => {
        it('should return greeting', () => {
            expect(ApplicationUtils.getGreeting('Андрій', true)).toBe('Вітаємо, Андрій!')
        })

        it('should return greeting with emoji', () => {
            expect(ApplicationUtils.getGreeting('Андрій', false)).toBe('Вітаємо, Андрій 👋')
        })
    })

    describe('getActionNameWithVersion', () => {
        it('actionName with default version', () => {
            const actionName = 'actionName'

            expect(ApplicationUtils.getActionNameWithVersion(actionName)).toBe(`${actionName}.${ActionVersion.V0}`)
        })

        it('action name with version', () => {
            const actionName = 'actionName'

            expect(ApplicationUtils.getActionNameWithVersion(actionName, ActionVersion.V9)).toBe(`${actionName}.${ActionVersion.V9}`)
        })
    })

    describe('makeSession', () => {
        it.each([
            [SessionType.User, 'user'],
            [SessionType.EResident, 'user'],
            [SessionType.EResidentApplicant, 'user'],
            [SessionType.PortalUser, 'user'],
            [SessionType.Acquirer, 'acquirer'],
            [SessionType.Partner, 'partner'],
            [SessionType.Temporary, 'temporary'],
            [SessionType.ServiceEntrance, 'entrance'],
            [SessionType.ServiceUser, 'serviceUser'],
        ])('should make %s session', (sessionType, fieldData) => {
            const data = { sessionType } as TokenData

            const result = ApplicationUtils.makeSession(data)

            expect(result).toMatchObject({
                sessionType,
                [fieldData]: data,
            })
        })

        it('should throw error', () => {
            const invalidData = {
                sessionType: 'unknownType' as SessionType,
            } as TokenData

            expect(() => {
                ApplicationUtils.makeSession(invalidData)
            }).toThrow(TypeError)
        })
    })

    describe('formatPhoneNumber', () => {
        it('should format phone number', () => {
            const phone = '380971234567'

            expect(ApplicationUtils.formatPhoneNumber(phone, '-', '+')).toBe('+38-097-123-45-67')
        })
    })

    describe('formatAmountWithThousandsSeparator', () => {
        it('format amount with empty optional arguments', () => {
            const amount = 9876543.21
            const units = Units.Hryvnia
            const expected = '9 876 543,21 грн'

            const result = ApplicationUtils.formatAmountWithThousandsSeparator(amount, units)

            expect(result.replaceAll(/\s/g, ' ')).toBe(expected)
        })
        it('format amount without pennies with empty optional arguments', () => {
            const amount = 9876543
            const units = Units.Hryvnia
            const expected = '9 876 543 грн'

            const result = ApplicationUtils.formatAmountWithThousandsSeparator(amount, units)

            expect(result.replaceAll(/\s/g, ' ')).toBe(expected)
        })
    })

    describe('convertToPennies', () => {
        it.each([
            [1, 100],
            [123.45, 12345],
            [299.9, 29990],
        ])('should convert to pennies', (hryvnia, expected) => {
            const result = ApplicationUtils.convertToPennies(hryvnia)

            expect(result).toBe(expected)
        })
    })

    describe('convertFromPennies', () => {
        it('should convert from pennies', () => {
            const pennies = 100
            const expected = 1

            const result = ApplicationUtils.convertFromPennies(pennies)

            expect(result).toBe(expected)
        })
    })

    describe('toDecimalPlaces', () => {
        it('should convert to float', () => {
            const pennies = 100.2232
            const expected = 100.22

            const result = ApplicationUtils.toDecimalPlaces(pennies)

            expect(result).toBe(expected)
        })
    })

    describe('multiply', () => {
        it('should multiply the amount by the multiplier and round to default decimal places', () => {
            const amount = 10
            const multiplier = 2
            const expected = 20

            const result = ApplicationUtils.multiplySum(amount, multiplier)

            expect(result).toBe(expected)
        })

        it('should multiply the amount by the multiplier and round to specified decimal places', () => {
            const amount = 10
            const multiplier = 3
            const decimalPlaces = 3
            const expected = 30

            const result = ApplicationUtils.multiplySum(amount, multiplier, decimalPlaces)

            expect(result).toBe(expected)
        })
    })

    describe('isIbanNumberValid', () => {
        it('should return true for a valid IBAN number', () => {
            const iban = 'UA903052992990004149123456789'
            const expected = true

            const result = ApplicationUtils.isIbanNumberValid(iban)

            expect(result).toBe(expected)
        })

        it('should return false for an invalid IBAN number', () => {
            const iban = 'UA123'
            const expected = false

            const result = ApplicationUtils.isIbanNumberValid(iban)

            expect(result).toBe(expected)
        })
    })

    describe('extractBankCodeFromIban', () => {
        it('should extract bank code from a valid IBAN number', () => {
            const iban = 'UA833052991234567890123456789'
            const expected = '305299'

            const result = ApplicationUtils.extractBankCodeFromIban(iban)

            expect(result).toBe(expected)
        })
    })

    describe('toHashedFilesWithSignatures', () => {
        it('should throw Error if hashedFiles array is not matched count with signedItems', () => {
            const hashedFiles: HashedFile[] = [{ fileName: 'file1', fileHash: 'hash' }]
            const signedItems: SignedItem[] = []

            expect(() => {
                ApplicationUtils.toHashedFilesWithSignatures(hashedFiles, signedItems)
            }).toThrow(Error)
        })

        it('should throw Error if hashedFiles array is empty', () => {
            const hashedFiles: HashedFile[] = []
            const signedItems: SignedItem[] = []

            expect(() => {
                ApplicationUtils.toHashedFilesWithSignatures(hashedFiles, signedItems)
            }).toThrow(Error)
        })

        it('should throw an error if the number of hashed files and signed elements do not match', () => {
            const hashedFiles = [{ fileName: 'file1' }, { fileName: 'file2' }]
            const signedItems = [{ name: 'file1', signature: 'signature1' }]

            expect(() => {
                ApplicationUtils.toHashedFilesWithSignatures(hashedFiles as HashedFile[], signedItems)
            }).toThrow('Number of hashed files and signed elements are not matched')
        })

        it('should throw an error if the provided name does not match with a hashed file', () => {
            const hashedFiles = [{ fileName: 'file1' }]
            const signedItems = [{ name: 'file2', signature: 'signature1' }]

            expect(() => {
                ApplicationUtils.toHashedFilesWithSignatures(hashedFiles as HashedFile[], signedItems)
            }).toThrow("Provided name doesn't match with a hashed file: file2")
        })

        it('should return an array of HashedFileWithSignature and an array of signatures', () => {
            const hashedFiles = [{ fileName: 'file1' }, { fileName: 'file2' }]
            const signedItems = [
                { name: 'file1', signature: 'signature1' },
                { name: 'file2', signature: 'signature2' },
            ]

            const expectedFilesWithSignatures = [
                { name: 'file1', signature: 'signature1' },
                { name: 'file2', signature: 'signature2' },
            ]
            const expectedSignatures = ['signature1', 'signature2']

            const result = ApplicationUtils.toHashedFilesWithSignatures(hashedFiles as HashedFile[], signedItems)

            expect(result[0]).toEqual(expectedFilesWithSignatures)
            expect(result[1]).toEqual(expectedSignatures)
        })
    })

    describe('encodeObjectToBase64', () => {
        it('should encode an object to base64', () => {
            const object = { name: 'John', age: 30 }
            const expected = 'eyJuYW1lIjoiSm9obiIsImFnZSI6MzB9'

            const result = ApplicationUtils.encodeObjectToBase64(object)

            expect(result).toBe(expected)
        })
    })

    describe('decodeObjectFromBase64', () => {
        it('should decode an object from base64', () => {
            const encodedObject = 'eyJuYW1lIjoiSm9obiIsImFnZSI6MzB9'
            const expected = { name: 'John', age: 30 }

            const result = ApplicationUtils.decodeObjectFromBase64(encodedObject)

            expect(result).toEqual(expected)
        })
    })

    describe('getStreetName', () => {
        it('should return the concatenated street name and street type', () => {
            const street = 'Main'
            const streetType = 'Street'
            const expected = 'Street Main'

            const result = ApplicationUtils.getStreetName(street, streetType)

            expect(result).toBe(expected)
        })

        it('should return the street name without street type if street type is not provided', () => {
            const street = 'Main'
            const streetType = ''
            const expected = 'Main'

            const result = ApplicationUtils.getStreetName(street, streetType)

            expect(result).toBe(expected)
        })

        it('should return an empty string if street is not provided', () => {
            const street = ''
            const streetType = 'Street'
            const expected = ''

            const result = ApplicationUtils.getStreetName(street, streetType)

            expect(result).toBe(expected)
        })
    })

    describe('isItnChecksumValid', () => {
        it('should return true for a valid ITN with correct checksum', () => {
            const itn = '0000000017'
            const expected = true

            const result = ApplicationUtils.isItnChecksumValid(itn)

            expect(result).toBe(expected)
        })

        it('should return false for an invalid ITN with incorrect checksum', () => {
            const itn = '1234567891'
            const expected = false

            const result = ApplicationUtils.isItnChecksumValid(itn)

            expect(result).toBe(expected)
        })

        it('should return false for an ITN with an incorrect length', () => {
            const itn = '123456789'
            const expected = false

            const result = ApplicationUtils.isItnChecksumValid(itn)

            expect(result).toBe(expected)
        })
    })

    describe('capitalizeName', () => {
        it.each([
            {
                case: 'capitalize the first letter of each word in the name',
                input: 'john doe',
                expected: 'John Doe',
            },
            {
                case: 'handle names with delimiters and capitalize each word',
                input: 'mary-ANNE smith',
                expected: 'Mary-Anne Smith',
            },
            {
                case: 'handle name only with delimiters and capitalize each word',
                input: 'АННА-КАРІНА',
                expected: 'Анна-Каріна',
            },
            {
                case: 'return an empty string if the name is empty',
                input: '',
                expected: '',
            },
            {
                case: 'return an empty string if the name is null',
                input: null,
                expected: '',
            },
            {
                case: 'return an empty string if the name is undefined',
                input: undefined,
                expected: '',
            },
            {
                case: 'not capitalize Arabic/Persian/Turkic name parts after dash',
                input: 'Ядзізж-ОГЛИ заде Дія Надія',
                expected: 'Ядзізж-огли заде Дія Надія',
            },
            {
                case: 'not capitalize Arabic/Persian/Turkic name parts',
                input: 'Ядзізж ОГЛИ заде Дія Надія',
                expected: 'Ядзізж огли заде Дія Надія',
            },
            {
                case: 'capitalize the first letter of the name if it is a single word and Arabic/Persian/Turkic',
                input: 'БЕЙ',
                expected: 'Бей',
            },
        ])('should $case', ({ input, expected }) => {
            const result = ApplicationUtils.capitalizeName(input)

            expect(result).toBe(expected)
        })
    })

    describe('capitalizeFirstLetter', () => {
        it.each([
            ['foo', 'Foo'],
            ['bar', 'Bar'],
            [{}, ''],
            [null, ''],
            [undefined, ''],
            [[], ''],
        ])('%s => %s', (input, expectedResult) => {
            expect(ApplicationUtils.capitalizeFirstLetter(input as string)).toBe(expectedResult)
        })
    })

    describe('lowerFirstLetter', () => {
        it('should convert the first letter of a string to lowercase', () => {
            const str = 'HelloWorld'
            const expected = 'helloWorld'

            const result = ApplicationUtils.lowerFirstLetter(str)

            expect(result).toBe(expected)
        })

        it('should handle an empty string input and return an empty string', () => {
            const str = ''
            const expected = ''

            const result = ApplicationUtils.lowerFirstLetter(str)

            expect(result).toBe(expected)
        })

        it('should return empty string in case received argument is not a string type', () => {
            const expected = ''

            const result = ApplicationUtils.lowerFirstLetter({} as string)

            expect(result).toBe(expected)
        })
    })

    describe('isItnFormatValid', () => {
        it('should return true for a valid ITN format', () => {
            const itn = '1234567890'

            const result = ApplicationUtils.isItnFormatValid(itn)

            expect(result).toBe(true)
        })

        it('should return false for an ITN consisting of all zeroes', () => {
            const itn = '0000000000'

            const result = ApplicationUtils.isItnFormatValid(itn)

            expect(result).toBe(false)
        })

        it('should return false for the string "null"', () => {
            const itn = 'null'

            const result = ApplicationUtils.isItnFormatValid(itn)

            expect(result).toBe(false)
        })

        it('should return false for an invalid ITN format', () => {
            const itn = '1234'

            const result = ApplicationUtils.isItnFormatValid(itn)

            expect(result).toBe(false)
        })
    })

    describe('getFileName', () => {
        const name = 'name-mock'
        const id = 'id-mock'
        const requestDateTime = '2020-01-01T00:00:00.000Z'
        const postFix = 'post-fix-mock'

        it('should file name', () => {
            const result = ApplicationUtils.getFileName(name, id)

            expect(result).toBe(`${name}-${id}`)
        })

        it('should file name if pass requestDateTime', () => {
            const result = ApplicationUtils.getFileName(name, id, requestDateTime)

            expect(result).toBe(`${name}-${id}-${requestDateTime}`)
        })

        it('should file name if pass postFix', () => {
            const result = ApplicationUtils.getFileName(name, id, requestDateTime, postFix)

            expect(result).toBe(`${name}-${id}-${requestDateTime}-${postFix}`)
        })

        it('should file name if pass postFix without requestDateTime', () => {
            const result = ApplicationUtils.getFileName(name, id, undefined, postFix)

            expect(result).toBe(`${name}-${id}-${postFix}`)
        })

        it('should trim whitespace', () => {
            const fileName = ApplicationUtils.getFileName('  file  ', '  123  ', '  2023-06-28  ', '  postfix  ')

            expect(fileName).toBe('file-123-2023-06-28-postfix')
        })
    })

    describe('sanitizeString', () => {
        it.each([
            ['В`ячеславівна', 'Вячеславівна'],
            ['В`ячеслав', 'Вячеслав'],
            ["В'ячеслав", 'Вячеслав'],
            ['Софія', 'Софія'],
            ['Надія Володимирівна-Дія', 'НадіяВолодимирівнаДія'],
        ])('should sanitize %s to %s', (input, result) => {
            expect(ApplicationUtils.sanitizeString(input)).toEqual(result)
        })
    })

    describe('formatMask', () => {
        it('should format numeric data according to ##-### mask', () => {
            expect(ApplicationUtils.formatMask('12345', '##-###')).toBe('12-345')
        })

        it('should format alphanumeric data according to ##-### mask', () => {
            expect(ApplicationUtils.formatMask('AB345', '##-###')).toBe('AB-345')
            expect(ApplicationUtils.formatMask('12CDE', '##-###')).toBe('12-CDE')
        })

        it('should format data according to #### mask', () => {
            expect(ApplicationUtils.formatMask('1234', '####')).toBe('1234')
            expect(ApplicationUtils.formatMask('ABCD', '####')).toBe('ABCD')
        })

        it('should format numeric data according to ##.#### mask', () => {
            expect(ApplicationUtils.formatMask('123456', '##.####')).toBe('12.3456')
            expect(ApplicationUtils.formatMask('ABCD12', '##.####')).toBe('AB.CD12')
        })

        it('should format data according to ### ## mask', () => {
            expect(ApplicationUtils.formatMask('12345', '### ##')).toBe('123 45')
            expect(ApplicationUtils.formatMask('ABCDE', '### ##')).toBe('ABC DE')
        })

        it('should format data according to ###### mask', () => {
            expect(ApplicationUtils.formatMask('123456', '######')).toBe('123456')
            expect(ApplicationUtils.formatMask('ABCDEF', '######')).toBe('ABCDEF')
        })

        it('should format data according to ##### mask', () => {
            expect(ApplicationUtils.formatMask('12345', '#####')).toBe('12345')
            expect(ApplicationUtils.formatMask('ABCDE', '#####')).toBe('ABCDE')
        })

        it('should format data according to ##-#### mask', () => {
            expect(ApplicationUtils.formatMask('123456', '##-####')).toBe('12-3456')
            expect(ApplicationUtils.formatMask('ABCDEF', '##-####')).toBe('AB-CDEF')
            expect(ApplicationUtils.formatMask('CD34567', '##-####')).toBe('CD-34567')
        })

        it('should format data according to ##-##-## mask', () => {
            expect(ApplicationUtils.formatMask('123456', '##-##-##')).toBe('12-34-56')
            expect(ApplicationUtils.formatMask('ABCDEF', '##-##-##')).toBe('AB-CD-EF')
        })

        it('should handle empty input', () => {
            expect(ApplicationUtils.formatMask('', '##-###')).toBe('')
        })

        it('should handle empty mask', () => {
            expect(ApplicationUtils.formatMask('12345', '')).toBe('12345')
            expect(ApplicationUtils.formatMask('ABCDE', '')).toBe('ABCDE')
        })

        it('should handle special characters in input', () => {
            expect(ApplicationUtils.formatMask('@#$%^', '##-###')).toBe('@#-$%^')
            expect(ApplicationUtils.formatMask('!@#$%', '### ##')).toBe('!@# $%')
        })

        it('should handle input shorter than mask', () => {
            expect(ApplicationUtils.formatMask('123', '##-###')).toBe('12-3')
            expect(ApplicationUtils.formatMask('ABC', '##-###')).toBe('AB-C')
        })

        it('should handle input longer than mask', () => {
            expect(ApplicationUtils.formatMask('1234567890', '##-###')).toBe('12-34567890')
            expect(ApplicationUtils.formatMask('ABCDEFGHIJ', '### ##')).toBe('ABC DEFGHIJ')
        })
    })

    describe('getServiceName', () => {
        beforeEach(() => {
            vi.resetAllMocks()
        })

        it('should extract name from package.json and convert to PascalCase', () => {
            const mockPackageJson = JSON.stringify({ name: 'test-package' })

            vi.mocked(path.resolve).mockReturnValue('/path/to/package.json')
            vi.mocked(fs.readFileSync).mockReturnValue(mockPackageJson)

            const result = ApplicationUtils.getServiceName()

            expect(result).toBe('TestPackage')
            expect(path.resolve).toHaveBeenCalledWith(expect.any(String), 'package.json')
            expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/package.json', 'utf8')
        })

        it('should handle scoped package names', () => {
            const mockPackageJson = JSON.stringify({ name: '@scope/test-package' })

            vi.mocked(path.resolve).mockReturnValue('/path/to/package.json')
            vi.mocked(fs.readFileSync).mockReturnValue(mockPackageJson)

            const result = ApplicationUtils.getServiceName()

            expect(result).toBe('TestPackage')
        })

        it('should return empty string if name field is missing', () => {
            const mockPackageJson = JSON.stringify({})

            vi.mocked(path.resolve).mockReturnValue('/path/to/package.json')
            vi.mocked(fs.readFileSync).mockReturnValue(mockPackageJson)

            const result = ApplicationUtils.getServiceName()

            expect(result).toBe('')
        })
    })

    describe('getServiceVersion', () => {
        it('should return the version of the service', () => {
            const mockPackageJson = JSON.stringify({ version: '1.0.0' })

            vi.mocked(path.resolve).mockReturnValue('/path/to/package.json')
            vi.mocked(fs.readFileSync).mockReturnValue(mockPackageJson)

            const result = ApplicationUtils.getServiceVersion()

            expect(result).toBe('1.0.0')
        })

        it('should return an empty string if the version is not found', () => {
            const mockPackageJson = JSON.stringify({})

            vi.mocked(path.resolve).mockReturnValue('/path/to/package.json')
            vi.mocked(fs.readFileSync).mockReturnValue(mockPackageJson)

            const result = ApplicationUtils.getServiceVersion()

            expect(result).toBe('')
        })
    })

    describe('memoize', () => {
        it('should memoize a function', async () => {
            const spy = vi.fn<() => Promise<number>>().mockResolvedValueOnce(10)
            const memoized = ApplicationUtils.memoize(async () => {
                await delay(10)

                return await spy()
            }, DurationMs.Hour)

            const [result1, result2, result3] = await Promise.all([memoized(), memoized(), memoized()])
            const result4 = await memoized()

            expect(spy).toHaveBeenCalledTimes(1)
            expect([result1, result2, result3, result4]).toEqual([10, 10, 10, 10])
        })

        it('should memoize a function with different arguments', async () => {
            const spy = vi.fn<(arg: number) => Promise<number>>()

            spy.mockResolvedValueOnce(10).mockResolvedValueOnce(10)
            const memoized = ApplicationUtils.memoize(async (arg: number) => {
                await delay(10)

                return await spy(arg)
            }, DurationMs.Hour)

            const [result1, result2, result3] = await Promise.all([memoized(1), memoized(2), memoized(1)])
            const result4 = await memoized(2)

            expect(spy).toHaveBeenCalledTimes(2)
            expect([result1, result2, result3, result4]).toEqual([10, 10, 10, 10])
        })

        it('should not cache an error', async () => {
            const spy = vi.fn<() => Promise<number>>()

            spy.mockRejectedValueOnce(new Error('test')).mockResolvedValueOnce(10)
            const memoized = ApplicationUtils.memoize(async () => {
                await delay(10)

                return await spy()
            }, DurationMs.Hour)

            await expect(memoized()).rejects.toThrow('test')
            const result = await memoized()

            expect(spy).toHaveBeenCalledTimes(2)
            expect(result).toBe(10)
        })

        it('should cache forever by default', async () => {
            const spy = vi.fn<() => Promise<number>>().mockResolvedValueOnce(10)
            const memoized = ApplicationUtils.memoize(async () => {
                await delay(10)

                return await spy()
            })

            const result1 = await memoized()
            const result2 = await memoized()

            expect(spy).toHaveBeenCalledTimes(1)
            expect([result1, result2]).toEqual([10, 10])
        })
    })

    describe('encodeDecodeObjectValue', () => {
        const originalData = {
            title: 'Bank Reports',
            errors: [
                {
                    type: 'stringEmpty',
                    message: "The 'params.reports[0].ps' field must not be empty.",
                    field: 'params.reports[0].ps',
                    actual: '',
                    date: new Date('2025-01-01T00:00:00.000Z'),
                },
                {
                    type: 'stringEnum',
                    message: "The 'params.reports[0].ps' field does not match any of the allowed values.",
                    field: 'params.reports[0].ps',
                    expected: 'Visa, MasterCard, Простір',
                    actual: '',
                },
            ],
            processCode: 1013,
            code: 422,
        }

        describe('encodeValuesWithIterator', () => {
            it('should encode string values in a simple object', () => {
                const result = ApplicationUtils.encodeValuesWithIterator({ foo: 'bar' })

                expect(result).toEqual({ foo: 'bar' })
            })

            it('should encode string value', () => {
                const result = ApplicationUtils.encodeValuesWithIterator('bar')

                expect(result).toEqual('bar')
            })

            it('should encode string values in complex nested object', () => {
                const result = ApplicationUtils.encodeValuesWithIterator(originalData) as typeof originalData

                expect(result.title).toBe('Bank%20Reports')
                expect(result.errors[0].type).toBe('stringEmpty')
                expect(result.errors[0].message).toBe("The%20'params.reports%5B0%5D.ps'%20field%20must%20not%20be%20empty.")
                expect(result.errors[0].field).toBe('params.reports%5B0%5D.ps')
                expect(result.errors[0].actual).toBe('')
                expect(result.errors[1].expected).toBe('Visa%2C%20MasterCard%2C%20%D0%9F%D1%80%D0%BE%D1%81%D1%82%D1%96%D1%80')

                expect(result.processCode).toBe(1013)
                expect(result.code).toBe(422)
            })

            it('should not modify the original object', () => {
                const originalCopy = structuredClone(originalData)

                ApplicationUtils.encodeValuesWithIterator(originalData)
                expect(originalData).toEqual(originalCopy)
            })
        })

        describe('decodeValuesWithIterator', () => {
            it('should decode string values in a simple object', () => {
                const encoded = { foo: 'bar%20test' }
                const result = ApplicationUtils.decodeValuesWithIterator(encoded)

                expect(result).toEqual({ foo: 'bar test' })
            })

            it('should decode string value', () => {
                const encoded = 'bar%20test'
                const result = ApplicationUtils.decodeValuesWithIterator(encoded)

                expect(result).toEqual('bar test')
            })

            it('should decode string values in complex nested object', () => {
                const encodedData = ApplicationUtils.encodeValuesWithIterator(originalData)
                const result = ApplicationUtils.decodeValuesWithIterator(encodedData) as typeof originalData

                expect(result).toEqual(originalData)
            })

            it('should not modify the original object', () => {
                const encodedData = ApplicationUtils.encodeValuesWithIterator(originalData)
                const originalCopy = structuredClone(encodedData) as typeof originalData

                ApplicationUtils.decodeValuesWithIterator(encodedData)
                expect(encodedData).toEqual(originalCopy)
            })
        })
    })
})
