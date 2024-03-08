import { ToRelativeUnit } from 'luxon'
import { WithAppVersionsEntity } from 'tests/interfaces'

import { ApiError, BadRequestError } from '@diia-inhouse/errors'
import TestKit from '@diia-inhouse/test'
import {
    ActionVersion,
    BirthCertificate,
    Gender,
    HashedFile,
    HttpStatusCode,
    InternalPassport,
    PlatformType,
    SessionType,
    SignedItem,
    TokenData,
    Units,
} from '@diia-inhouse/types'

import { ApplicationUtils } from '../../src/applicationUtils'

describe('ApplicationUtils', () => {
    const testKit = new TestKit()

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
                return err.getCode()
            })

            expect(processCode).toEqual(result)
        })

        it('should return processCode when passed like separated param', async () => {
            const processCode = 21061998
            const error = new BadRequestError('errorMessage', {}, processCode)

            const result = ApplicationUtils.handleError(error, (err) => {
                return err.getCode()
            })

            expect(processCode).toEqual(result)
        })

        it('should return 500 code, when code is undefined', async () => {
            const error = new Error('errorMessage')

            const result = ApplicationUtils.handleError(error, (err) => {
                return err.getCode()
            })

            expect(result).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR)
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
            const checkFormatDate = (): void => {
                ApplicationUtils.formatDate('21/01/2023', 'dd-MM-yyyy', 'dd.MM.yyyy')
            }

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

            const result = ApplicationUtils.getChildFullName(<BirthCertificate>birthCertificate)

            expect(result).toBe('last first middle')
        })

        it('should make the child full name with optional middleName', () => {
            const birthCertificate = {
                child: {
                    lastName: 'last',
                    firstName: 'first',
                },
            }

            const result = ApplicationUtils.getChildFullName(<BirthCertificate>birthCertificate)

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

            const result = ApplicationUtils.getPassportFullName(<InternalPassport>passport)

            expect(result).toBe('last first middle')
        })

        it('should return full name with optional middleName', () => {
            const passport = {
                lastNameUA: 'last',
                firstNameUA: 'first',
            }

            const result = ApplicationUtils.getPassportFullName(<InternalPassport>passport)

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
            jest.useFakeTimers().setSystemTime(mockedCurrentDate)
        })

        it.each([
            [18, 'years', '24.03.2004'],
            [75, 'quarters', '24.03.2004'],
            [227, 'months', '24.03.2004'],
            [6916, 'days', '24.03.2004'],
        ])('should return %d %s', (count, relativeUnit, birthdayDate) => {
            const result = ApplicationUtils.getAge(birthdayDate, 'dd.MM.yyyy', <ToRelativeUnit>relativeUnit)

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
            [SessionType.CabinetUser, 'user'],
            [SessionType.PortalUser, 'user'],
            [SessionType.Acquirer, 'acquirer'],
            [SessionType.Partner, 'partner'],
            [SessionType.Temporary, 'temporary'],
            [SessionType.ServiceEntrance, 'entrance'],
            [SessionType.ServiceUser, 'serviceUser'],
        ])('should make %s session', (sessionType, fieldData) => {
            const data = <TokenData>{ sessionType }

            const result = ApplicationUtils.makeSession(data)

            expect(result).toMatchObject({
                sessionType,
                [fieldData]: data,
            })
        })

        it('should throw error', () => {
            const invalidData = <TokenData>{
                sessionType: <SessionType>'unknownType',
            }

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

            expect(result.replace(/\s/g, ' ')).toBe(expected)
        })
    })

    describe('convertToPennies', () => {
        it('should convert to pennies', () => {
            const hryvnia = 1
            const expected = 100

            const result = ApplicationUtils.convertToPennies(hryvnia)

            expect(result).toBe(expected)
        })
    })

    describe('convertFromPennies', () => {
        it('should convert from pennies', () => {
            const pennies = 100
            const expected = 1.0

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
            const expected = 30.0

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
                ApplicationUtils.toHashedFilesWithSignatures(<HashedFile[]>hashedFiles, signedItems)
            }).toThrow('Number of hashed files and signed elements are not matched')
        })

        it('should throw an error if the provided name does not match with a hashed file', () => {
            const hashedFiles = [{ fileName: 'file1' }]
            const signedItems = [{ name: 'file2', signature: 'signature1' }]

            expect(() => {
                ApplicationUtils.toHashedFilesWithSignatures(<HashedFile[]>hashedFiles, signedItems)
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

            const result = ApplicationUtils.toHashedFilesWithSignatures(<HashedFile[]>hashedFiles, signedItems)

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
        it('should capitalize the first letter of each word in the name', () => {
            const name = 'john doe'
            const expected = 'John Doe'

            const result = ApplicationUtils.capitalizeName(name)

            expect(result).toBe(expected)
        })

        it('should handle names with delimiters and capitalize each word', () => {
            const name = 'mary-anne smith'
            const expected = 'Mary-Anne Smith'

            const result = ApplicationUtils.capitalizeName(name)

            expect(result).toBe(expected)
        })

        it('should return an empty string if the name is null or undefined', () => {
            const name = ''
            const expected = ''

            const result = ApplicationUtils.capitalizeName(name)

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
            expect(ApplicationUtils.capitalizeFirstLetter(<string>input)).toBe(expectedResult)
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

            const result = ApplicationUtils.lowerFirstLetter(<string>{})

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
})
