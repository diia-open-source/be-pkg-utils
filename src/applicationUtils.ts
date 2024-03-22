import { compare } from 'compare-versions'
import { DateTime, ToRelativeUnit } from 'luxon'

import { ApiError, BadRequestError, ErrorData, ErrorType } from '@diia-inhouse/errors'
import {
    ActHeaders,
    ActionSession,
    ActionVersion,
    AppVersions,
    BirthCertificate,
    DocumentType,
    DocumentTypeCamelCase,
    ForeignPassport,
    Gender,
    HashedFile,
    HashedFileWithSignature,
    HttpStatusCode,
    InternalPassport,
    PlatformType,
    SessionType,
    SignedItem,
    TokenData,
    Units,
    UserTokenData,
    WithAppVersions,
} from '@diia-inhouse/types'

const cyrillicToLatinPairArray = [
    ['і', 'i'],
    ['е', 'e'],
    ['у', 'y'],
    ['и', 'u'],
    ['о', 'o'],
    ['р', 'p'],
    ['а', 'a'],
    ['к', 'k'],
    ['х', 'x'],
    ['с', 'c'],
    ['І', 'I'],
    ['Е', 'E'],
    ['Т', 'T'],
    ['О', 'O'],
    ['Р', 'P'],
    ['А', 'A'],
    ['Н', 'H'],
    ['К', 'K'],
    ['Х', 'X'],
    ['С', 'C'],
    ['В', 'B'],
    ['М', 'M'],
    ['У', 'Y'],
];

export class ApplicationUtils {
    static documentTypeToCamelCase: Record<DocumentType, DocumentTypeCamelCase> = {
        [DocumentType.DriverLicense]: DocumentTypeCamelCase.driverLicense,
        [DocumentType.VehicleLicense]: DocumentTypeCamelCase.vehicleLicense,
        [DocumentType.VehicleInsurance]: DocumentTypeCamelCase.vehicleLicense,
        [DocumentType.StudentIdCard]: DocumentTypeCamelCase.studentCard,
        [DocumentType.InternalPassport]: DocumentTypeCamelCase.idCard,
        [DocumentType.ForeignPassport]: DocumentTypeCamelCase.foreignPassport,
        [DocumentType.TaxpayerCard]: DocumentTypeCamelCase.taxpayerCard,
        [DocumentType.RefInternallyDisplacedPerson]: DocumentTypeCamelCase.referenceInternallyDisplacedPerson,
        [DocumentType.BirthCertificate]: DocumentTypeCamelCase.birthCertificate,
        [DocumentType.LocalVaccinationCertificate]: DocumentTypeCamelCase.localVaccinationCertificate,
        [DocumentType.ChildLocalVaccinationCertificate]: DocumentTypeCamelCase.childLocalVaccinationCertificate,
        [DocumentType.InternationalVaccinationCertificate]: DocumentTypeCamelCase.internationalVaccinationCertificate,
        [DocumentType.PensionCard]: DocumentTypeCamelCase.pensionCard,
        [DocumentType.ResidencePermitPermanent]: DocumentTypeCamelCase.residencePermitPermanent,
        [DocumentType.ResidencePermitTemporary]: DocumentTypeCamelCase.residencePermitTemporary,
        [DocumentType.EResidency]: DocumentTypeCamelCase.eResidency,
        [DocumentType.EResidentPassport]: DocumentTypeCamelCase.eResidentPassport,
        [DocumentType.UId]: DocumentTypeCamelCase.uId,
        [DocumentType.MilitaryBond]: DocumentTypeCamelCase.militaryBond,
        [DocumentType.OfficialCertificate]: DocumentTypeCamelCase.officialCertificate,
        [DocumentType.HousingCertificate]: DocumentTypeCamelCase.housingCertificate,
        [DocumentType.EducationDocument]: DocumentTypeCamelCase.educationDocument,
        [DocumentType.MarriageActRecord]: DocumentTypeCamelCase.marriageActRecord,
        [DocumentType.DivorceActRecord]: DocumentTypeCamelCase.divorceActRecord,
        [DocumentType.NameChangeActRecord]: DocumentTypeCamelCase.nameChangeActRecord,
        [DocumentType.UserBirthCertificate]: DocumentTypeCamelCase.userBirthCertificate,
    }

    static camelCaseToDocumentType: Record<DocumentTypeCamelCase, DocumentType> = {
        [DocumentTypeCamelCase.idCard]: DocumentType.InternalPassport,
        [DocumentTypeCamelCase.foreignPassport]: DocumentType.ForeignPassport,
        [DocumentTypeCamelCase.taxpayerCard]: DocumentType.TaxpayerCard,
        [DocumentTypeCamelCase.driverLicense]: DocumentType.DriverLicense,
        [DocumentTypeCamelCase.vehicleLicense]: DocumentType.VehicleLicense,
        [DocumentTypeCamelCase.studentCard]: DocumentType.StudentIdCard,
        [DocumentTypeCamelCase.referenceInternallyDisplacedPerson]: DocumentType.RefInternallyDisplacedPerson,
        [DocumentTypeCamelCase.birthCertificate]: DocumentType.BirthCertificate,
        [DocumentTypeCamelCase.localVaccinationCertificate]: DocumentType.LocalVaccinationCertificate,
        [DocumentTypeCamelCase.childLocalVaccinationCertificate]: DocumentType.ChildLocalVaccinationCertificate,
        [DocumentTypeCamelCase.internationalVaccinationCertificate]: DocumentType.InternationalVaccinationCertificate,
        [DocumentTypeCamelCase.pensionCard]: DocumentType.PensionCard,
        [DocumentTypeCamelCase.residencePermitPermanent]: DocumentType.ResidencePermitPermanent,
        [DocumentTypeCamelCase.residencePermitTemporary]: DocumentType.ResidencePermitTemporary,
        [DocumentTypeCamelCase.eResidency]: DocumentType.EResidency,
        [DocumentTypeCamelCase.eResidentPassport]: DocumentType.EResidentPassport,
        [DocumentTypeCamelCase.uId]: DocumentType.UId,
        [DocumentTypeCamelCase.militaryBond]: DocumentType.MilitaryBond,
        [DocumentTypeCamelCase.officialCertificate]: DocumentType.OfficialCertificate,
        [DocumentTypeCamelCase.housingCertificate]: DocumentType.HousingCertificate,
        [DocumentTypeCamelCase.educationDocument]: DocumentType.EducationDocument,
        [DocumentTypeCamelCase.marriageActRecord]: DocumentType.MarriageActRecord,
        [DocumentTypeCamelCase.divorceActRecord]: DocumentType.DivorceActRecord,
        [DocumentTypeCamelCase.nameChangeActRecord]: DocumentType.NameChangeActRecord,
        [DocumentTypeCamelCase.userBirthCertificate]: DocumentType.UserBirthCertificate,
    }

    private static defaultItnDate = '31.12.1899'

    private static defaultFormat = 'dd.MM.yyyy'

    private static readonly nameDelimiters: string[] = [' ', '-']

    private static readonly cyrillicToLatin: Map<string, string> = new Map(cyrillicToLatinPairArray)

    private static readonly latinToCyrillic: Map<string, string> = new Map(cyrillicToLatinPairArray.map((t)=>
        [t[1], t[0]]
    ))

    private static readonly documentTypeToName: Record<DocumentType, string> = {
        [DocumentType.DriverLicense]: 'Посвідчення водія',
        [DocumentType.VehicleLicense]: 'Свідоцтво про реєстрацію транспортного засобу',
        [DocumentType.VehicleInsurance]: 'Страховой поліс транспортного засобу',
        [DocumentType.StudentIdCard]: 'Студентський квиток',
        [DocumentType.InternalPassport]: 'Паспорт громадянина України',
        [DocumentType.ForeignPassport]: 'Закордонний паспорт',
        [DocumentType.TaxpayerCard]: 'РНОКПП',
        [DocumentType.RefInternallyDisplacedPerson]: 'Довідка ВПО',
        [DocumentType.BirthCertificate]: 'Свідоцтво про народження дитини',
        [DocumentType.LocalVaccinationCertificate]: 'Внутрішній COVID19-сертифікат',
        [DocumentType.ChildLocalVaccinationCertificate]: 'Дитячий внутрішній COVID19-сертифікат',
        [DocumentType.InternationalVaccinationCertificate]: 'Міжнародний COVID19-сертифікат',
        [DocumentType.PensionCard]: 'Пенсійне посвідчення',
        [DocumentType.ResidencePermitPermanent]: 'Посвідка на постійне проживання',
        [DocumentType.ResidencePermitTemporary]: 'Посвідка на тимчасове проживання',
        [DocumentType.EResidency]: 'Картка Е-резидента',
        [DocumentType.EResidentPassport]: 'Паспорт Е-резидента',
        [DocumentType.UId]: 'Тимчасова посвідка у військовий час',
        [DocumentType.MilitaryBond]: 'Військова облігація',
        [DocumentType.OfficialCertificate]: 'Посвідчення посадової особи',
        [DocumentType.HousingCertificate]: 'Житловий сертифікат',
        [DocumentType.EducationDocument]: 'Документи про освіту',
        [DocumentType.MarriageActRecord]: 'Актовий запис про шлюб',
        [DocumentType.DivorceActRecord]: 'Актовий запис про розлучення',
        [DocumentType.NameChangeActRecord]: 'Актовий запис про зміну імені',
        [DocumentType.UserBirthCertificate]: 'Актовий запис про народження',
    }

    static isItnChecksumValid(itn: string): boolean {
        if (itn.length !== 10) {
            return false
        }

        const ITN_POLY = [-1, 5, 7, 9, 4, 6, 10, 5, 7]

        const digits = [...itn].map(x => +x)
        const checksum = ITN_POLY.reduce((a, x, i) => a + x * digits[i], 0)
        const controlDigit = (checksum - 11 * Math.floor(checksum / 11)) % 10
        const last = digits.at(-1)

        return last === controlDigit
    }

    static getBirthDayFromItn(itn: string): string {
        if (itn.length !== 10) {
            return ''
        }

        const days = parseInt(itn.substring(0, 5), 10)

        return DateTime.fromFormat(this.defaultItnDate, this.defaultFormat).plus({ days }).toFormat(this.defaultFormat)
    }

    static getGenderFromItn(itn: string): Gender {
        return Number(itn[itn.length - 2]) % 2 === 0 ? Gender.female : Gender.male
    }

    static isItnFormatValid(itn: string): boolean {
        if (/^0{1,20}$/.test(itn) || itn === 'null' || !/^\d{10}$/.test(itn)) {
            return false
        }

        return true
    }

    static capitalizeName(name: string): string {
        const foundDelimiters: string[] = this.nameDelimiters.filter((delimiter: string) => {
            const regex = new RegExp(delimiter)

            return regex.test(name)
        })

        let resultName: string = name?.toLowerCase()
        if (foundDelimiters.length) {
            foundDelimiters.forEach((foundDelimiter: string) => {
                resultName = resultName
                    .split(foundDelimiter)
                    .map((partName: string) => ApplicationUtils.capitalizeFirstLetter(partName))
                    .join(foundDelimiter)
            })

            return resultName
        }

        return ApplicationUtils.capitalizeFirstLetter(resultName)
    }

    static capitalizeFirstLetter(str: string): string {
        if (typeof str !== 'string') {
            return ''
        }

        return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
    }

    static lowerFirstLetter(str: string): string {
        if (typeof str !== 'string') {
            return ''
        }

        return `${str.charAt(0).toLowerCase()}${str.slice(1)}`
    }

    static mapCyrillic(value: string): string {
        return value
            .split('')
            .map((char: string) => this.cyrillicToLatin.get(char) || char)
            .join('')
    }

    static mapLatin(value: string): string {
        return value
            .split('')
            .map((char: string) => this.latinToCyrillic.get(char) || char)
            .join('')
    }

    static isIbanNumberValid(iban: string): boolean {
        const CODE_LENGTHS: Record<string, number> = {
            UA: 29,
        }

        const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/)
        if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
            return false
        }

        const digits: string = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, (letter: string) => (letter.charCodeAt(0) - 55).toString())

        return this.mod97(digits) === 1
    }

    static getDocumentName(documentType: DocumentType): string {
        return this.documentTypeToName[documentType]
    }

    static getStreetName(street: string, streetType: string): string {
        if (!street) {
            return ''
        }

        return streetType ? `${streetType} ${street}`.trim() : street
    }

    static toHashedFilesWithSignatures(hashedFiles: HashedFile[], signedItems: SignedItem[]): [HashedFileWithSignature[], string[]] {
        if (!hashedFiles?.length) {
            throw new BadRequestError('Hashed files array is empty')
        }

        if (hashedFiles.length !== signedItems.length) {
            throw new Error('Number of hashed files and signed elements are not matched')
        }

        const fileNames: Set<string> = new Set(hashedFiles.map(({ fileName }: HashedFile) => fileName))
        const signatureByFilename: Map<string, string> = new Map()
        const signatures: string[] = []

        signedItems.forEach(({ name, signature }: SignedItem) => {
            if (!fileNames.has(name)) {
                throw new Error(`Provided name doesn't match with a hashed file: ${name}`)
            }

            signatureByFilename.set(name, signature)
            signatures.push(signature)
        })

        const hashedFilesWithSignatures = hashedFiles.map<HashedFileWithSignature>(({ fileName, fileHash }) => ({
            name: fileName,
            hash: fileHash,
            signature: signatureByFilename.get(fileName)!,
        }))

        return [hashedFilesWithSignatures, signatures]
    }

    static handleError<T = never>(err: unknown, cb: (err: ApiError) => T): T {
        if (err instanceof ApiError) {
            return cb(err)
        }

        if (err instanceof Error) {
            return cb(this.toApiError(err))
        }

        const message = `Unexpected error caused: ${err}`
        const wrappedError = new Error(message)

        return cb(this.toApiError(wrappedError))
    }

    static makeSession(data: TokenData): ActionSession {
        const { sessionType } = data
        switch (sessionType) {
            case SessionType.User: {
                return { sessionType: data.sessionType, user: data }
            }
            case SessionType.EResident: {
                return { sessionType: data.sessionType, user: data }
            }
            case SessionType.EResidentApplicant: {
                return { sessionType: data.sessionType, user: data }
            }
            case SessionType.CabinetUser: {
                return { sessionType: data.sessionType, user: data }
            }
            case SessionType.Acquirer: {
                return { sessionType: data.sessionType, acquirer: data }
            }
            case SessionType.PortalUser: {
                return { sessionType: data.sessionType, user: data }
            }
            case SessionType.Partner: {
                return { sessionType: data.sessionType, partner: data }
            }
            case SessionType.Temporary: {
                return { sessionType: data.sessionType, temporary: data }
            }
            case SessionType.ServiceEntrance: {
                return { sessionType: data.sessionType, entrance: data }
            }
            case SessionType.ServiceUser: {
                return { sessionType: data.sessionType, serviceUser: data }
            }
            default: {
                const unhandledType: never = sessionType

                throw new TypeError(`Unhandled sessionType: ${unhandledType}`)
            }
        }
    }

    static getActionNameWithVersion(actionName: string, actionVersion: ActionVersion = ActionVersion.V0): string {
        return `${actionName}.${actionVersion}`
    }

    static getGreeting(fName: string, skipEmogi?: boolean): string {
        const text = `Вітаємо, ${fName}`

        return skipEmogi ? `${text}!` : `${text} 👋`
    }

    static getAge(birthDay: string, format = 'dd.MM.yyyy', unitOfTime: ToRelativeUnit = 'years'): number {
        const birthdayDate = DateTime.fromFormat(birthDay, format)

        if (!birthdayDate.isValid) {
            throw new Error('Invalid user birthday')
        }

        /* Added an array of "units" with milliseconds to ensure that all larger unit values are integers.
            For instance:
                birthDay = '24.03.2009'
                currentDate = '24.03.2023'
                DateTime.now().diff(birthdayDate, 'years')['years'] => 14.001228454102156
                // fix
                DateTime.now().diff(birthdayDate, ['years', 'milliseconds'])['years'] => 14
                DateTime.now().diff(birthdayDate, ['months', 'milliseconds'])['months'] => 168
        */
        return DateTime.now().diff(birthdayDate, [unitOfTime, 'milliseconds'])[unitOfTime]
    }

    static getFullName(lastName: string, firstName: string, middleName?: string, separator = ' '): string {
        return [lastName, firstName, middleName].filter(Boolean).join(separator).trim()
    }

    static getShortName(lastName: string, firstName: string, middleName?: string): string {
        const shortMiddleName = middleName ? ` ${middleName.charAt(0).toUpperCase()}.` : ''

        return `${lastName} ${firstName.charAt(0).toUpperCase()}.${shortMiddleName}`.trim()
    }

    static getUserFullName(user: UserTokenData): string {
        const { lName, fName, mName } = user

        return `${lName} ${fName} ${mName || ''}`.trim()
    }

    static getPassportFullName(passport: InternalPassport | ForeignPassport): string {
        const { lastNameUA, firstNameUA, middleNameUA } = passport

        return `${lastNameUA} ${firstNameUA} ${middleNameUA || ''}`.trim()
    }

    static getChildFullName(birthCertificate: BirthCertificate): string {
        const {
            child: { lastName, firstName, middleName },
        } = birthCertificate

        return `${lastName} ${firstName} ${middleName || ''}`.trim()
    }

    static encodeObjectToBase64<T>(object: T): string {
        return Buffer.from(JSON.stringify(object)).toString('base64')
    }

    static decodeObjectFromBase64<T>(encodedObject: string): T {
        return JSON.parse(Buffer.from(encodedObject, 'base64').toString())
    }

    static formatDate(date: string | Date, format: string, fromFormat = 'dd.MM.yyyy'): string {
        const convertedDate = date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromFormat(date, fromFormat)

        const { isValid, invalidReason, invalidExplanation } = convertedDate

        if (!isValid) {
            throw new Error(`Invalid date -> ${invalidReason}: ${invalidExplanation}`)
        }

        return convertedDate.setLocale('uk-UA').toFormat(format)
    }

    static formatPhoneNumber(rawPhone: string, separator = ' ', prefix = '+'): string {
        return prefix + rawPhone.replace(/^\+?(\d{2})(\d{3})(\d{3})(\d{2})(\d+)$/, ['$1', '$2', '$3', '$4', '$5'].join(separator))
    }

    static formatAmountWithThousandsSeparator(amount: number, units?: Units, minimumFractionDigits?: number): string {
        // https://github.com/nodejs/help/issues/4068 (char "\u00A0" not equals with space in test asserts; reproduced in node 18.13, 18.15, 18.17)
        const result = amount.toLocaleString('uk-UA', { useGrouping: true, minimumFractionDigits }).replace(/\u00A0/g, ' ')

        return units ? `${result} ${units}` : result
    }

    static convertToPennies(amount: number): number {
        return amount * 100
    }

    static convertFromPennies(amount: number): number {
        return this.toDecimalPlaces(amount / 100, 2)
    }

    static multiplySum(amount: number, multiplier: number, decimalPlaces?: number): number {
        const multipliedSum: number = (amount * 100 * multiplier) / 100

        return this.toDecimalPlaces(multipliedSum, decimalPlaces)
    }

    static toDecimalPlaces(amount: number, decimalPlaces = 2): number {
        return parseFloat(amount.toFixed(decimalPlaces))
    }

    static filterByAppVersions<T extends WithAppVersions>(
        items: T[],
        headers: Pick<ActHeaders, 'appVersion' | 'platformType'> | undefined,
    ): T[] {
        const { appVersion, platformType } = headers || {}
        if (!appVersion || !platformType) {
            return items
        }

        return items.filter(({ appVersions }) => {
            if (!appVersions) {
                return true
            }

            return ApplicationUtils.isAppVersionMatch(appVersion, platformType, appVersions)
        })
    }

    static isAppVersionMatch(appVersion: string, platformType: PlatformType, appVersions: AppVersions): boolean {
        if (appVersions.versions?.[platformType]?.some((version) => compare(appVersion, version, '='))) {
            return true
        }

        const minVersion = appVersions.minVersion?.[platformType]
        const maxVersion = appVersions.maxVersion?.[platformType]
        if (minVersion && maxVersion) {
            if (compare(appVersion, minVersion, '>=') && compare(appVersion, maxVersion, '<=')) {
                return true
            }

            return false
        }

        if (minVersion && compare(appVersion, minVersion, '>=')) {
            return true
        }

        if (maxVersion && compare(appVersion, maxVersion, '<=')) {
            return true
        }

        return false
    }

    static getFileName(name: string, id: string, requestDateTime?: string, postFix?: string): string {
        return [name.trim(), id.trim(), requestDateTime?.trim(), postFix?.trim()].filter(Boolean).join('-')
    }

    static sanitizeString(input: string): string {
        return input.replace(/[^a-z\dа-яґєії]/gi, '')
    }

    private static mod97(string: string): number {
        let checksum: string | number = string.slice(0, 2)
        let fragment: string
        for (let offset = 2; offset < string.length; offset += 7) {
            fragment = String(checksum) + string.substring(offset, offset + 7)
            checksum = parseInt(fragment, 10) % 97
        }

        return <number>checksum
    }

    private static toApiError(err: Error & { code?: number; data?: ErrorData; type?: ErrorType }): ApiError {
        const { type, code, message, data } = err

        return new ApiError(message, code || HttpStatusCode.INTERNAL_SERVER_ERROR, data, data?.processCode, type)
    }
}
