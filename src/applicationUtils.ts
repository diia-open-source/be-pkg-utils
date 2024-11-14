import { compare } from 'compare-versions'
import { camelCase, kebabCase } from 'lodash'
import { DateTime, ToRelativeUnit } from 'luxon'

import { ApiError, BadRequestError, ErrorData, ErrorType } from '@diia-inhouse/errors'
import {
    ActHeaders,
    ActionSession,
    ActionVersion,
    AppVersions,
    Gender,
    HashedFile,
    HashedFileWithSignature,
    HttpStatusCode,
    PlatformType,
    SessionType,
    SignedItem,
    TokenData,
    UserTokenData,
    WithAppVersions,
} from '@diia-inhouse/types'

export class ApplicationUtils {
    private static documentTypeToCamelCaseExceptions: Record<string, string> = {
        ['student-id-card']: 'studentCard',
        ['internal-passport']: 'idCard',
    }

    private static camelCaseToDocumentTypeExceptions: Record<string, string> = {
        ['studentCard']: 'student-id-card',
        ['idCard']: 'internal-passport',
    }

    private static defaultItnDate = '31.12.1899'

    private static defaultFormat = 'dd.MM.yyyy'

    private static readonly cyrillicToLatin: Map<string, string> = new Map([
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
    ])

    private static readonly nameComponentsToLowerCase = [
        'огли',
        'оглу',
        'заде',
        'кизи',
        'бей',
        'бек',
        'паша',
        'хан',
        'шах',
        'мелік',
        'зуль',
        'ібн',
        'тер',
        'аль',
        'ель',
        'аш',
        'ас',
        'ад',
        'ель',
        'ес',
    ]

    static documentTypeToCamelCase(documentType: string): string {
        return ApplicationUtils.documentTypeToCamelCaseExceptions[documentType] || camelCase(documentType)
    }

    static camelCaseToDocumentType(camelCaseDocumentType: string): string {
        return ApplicationUtils.camelCaseToDocumentTypeExceptions[camelCaseDocumentType] || kebabCase(camelCaseDocumentType)
    }

    static isItnChecksumValid(itn: string): boolean {
        if (itn.length !== 10) {
            return false
        }

        const ITN_POLY = [-1, 5, 7, 9, 4, 6, 10, 5, 7]

        const digits = [...itn].map(Number)
        const checksum = ITN_POLY.reduce((a, x, i) => a + x * digits[i], 0)
        const controlDigit = (checksum - 11 * Math.floor(checksum / 11)) % 10
        const last = digits.at(-1)

        return last === controlDigit
    }

    static getBirthDayFromItn(itn: string): string {
        if (itn.length !== 10) {
            return ''
        }

        const days = Number.parseInt(itn.slice(0, 5), 10)

        return DateTime.fromFormat(this.defaultItnDate, this.defaultFormat).plus({ days }).toFormat(this.defaultFormat)
    }

    static getGenderFromItn(itn: string): Gender {
        return Number(itn.at(-2)) % 2 === 0 ? Gender.female : Gender.male
    }

    static isItnFormatValid(itn: string): boolean {
        if (/^0{1,20}$/.test(itn) || itn === 'null' || !/^\d{10}$/.test(itn)) {
            return false
        }

        return true
    }

    static capitalizeName(name: string | undefined | null): string {
        if (!name) {
            return ''
        }

        const hyphenNameDelimiter = '-'

        return name
            .split(/([ -])/)
            .map((partName) => partName.toLowerCase())
            .map((partName, indx, array) => {
                const prevDelimiter = array[indx - 1]
                if (prevDelimiter === hyphenNameDelimiter && this.nameComponentsToLowerCase.includes(partName)) {
                    return partName
                }

                return ApplicationUtils.capitalizeFirstLetter(partName)
            })
            .join('')
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
        const latinToCyrillic = new Map(Array.from(this.cyrillicToLatin).map(([cyr, lat]) => [lat, cyr]))

        return value
            .split('')
            .map((char: string) => latinToCyrillic.get(char) || char)
            .join('')
    }

    static isIbanNumberValid(iban: string): boolean {
        const CODE_LENGTHS: Record<string, number> = {
            UA: 29,
        }

        const code = iban.match(/^([A-Z]{2})(\d{2})([\dA-Z]+)$/)
        if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
            return false
        }

        const digits: string = (code[3] + code[1] + code[2]).replaceAll(/[A-Z]/g, (letter: string) => {
            const letterCode = letter.codePointAt(0)

            return letterCode ? (letterCode - 55).toString() : Number.NaN.toString()
        })

        return this.mod97(digits) === 1
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

        for (const { name, signature } of signedItems) {
            if (!fileNames.has(name)) {
                throw new Error(`Provided name doesn't match with a hashed file: ${name}`)
            }

            signatureByFilename.set(name, signature)
            signatures.push(signature)
        }

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
                return { sessionType, user: data }
            }
            case SessionType.EResident: {
                return { sessionType, user: data }
            }
            case SessionType.EResidentApplicant: {
                return { sessionType, user: data }
            }
            case SessionType.CabinetUser: {
                return { sessionType, user: data }
            }
            case SessionType.Acquirer: {
                return { sessionType, acquirer: data }
            }
            case SessionType.PortalUser: {
                return { sessionType, user: data }
            }
            case SessionType.Partner: {
                return { sessionType, partner: data }
            }
            case SessionType.Temporary: {
                return { sessionType, temporary: data }
            }
            case SessionType.ServiceEntrance: {
                return { sessionType, entrance: data }
            }
            case SessionType.ServiceUser: {
                return { sessionType, serviceUser: data }
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

    /**
     * Get age from birth date. Powered by {@link https://moment.github.io/luxon/#/ luxon}
     *
     * @param birthDay Input birth date.
     * @param format `birthDay` format (https://moment.github.io/luxon/#/formatting?id=table-of-tokens). Default - 'dd.MM.yyyy'
     * @param unitOfTime Unit of time to return. Default - 'years'
     *
     * @returns Age in years if other `unitOfTime` is not specified
     * @throws If input date is invalid
     */
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

    static getPassportFullName({
        lastNameUA,
        firstNameUA,
        middleNameUA,
    }: {
        lastNameUA: string
        firstNameUA: string
        middleNameUA?: string
    }): string {
        return `${lastNameUA} ${firstNameUA} ${middleNameUA || ''}`.trim()
    }

    static getChildFullName({
        child: { lastName, firstName, middleName },
    }: {
        child: {
            lastName: string
            firstName: string
            middleName?: string
        }
    }): string {
        return `${lastName} ${firstName} ${middleName || ''}`.trim()
    }

    static encodeObjectToBase64<T>(object: T): string {
        return Buffer.from(JSON.stringify(object)).toString('base64')
    }

    static decodeObjectFromBase64<T>(encodedObject: string): T {
        return JSON.parse(Buffer.from(encodedObject, 'base64').toString())
    }

    /**
     * Format string or Date to the specified string format. Powered by {@link https://moment.github.io/luxon/#/ luxon}
     *
     * @param date Input date
     * @param format Output date format (https://moment.github.io/luxon/#/formatting?id=table-of-tokens)
     * @param fromFormat Input date format (https://moment.github.io/luxon/#/formatting?id=table-of-tokens). Used for string `date`. Default - 'dd.MM.yyyy'
     *
     * @throws If input date is invalid
     */
    static formatDate(date: string | Date, format: string, fromFormat = 'dd.MM.yyyy'): string {
        const convertedDate = date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromFormat(date, fromFormat)

        const { isValid, invalidReason, invalidExplanation } = convertedDate

        if (!isValid) {
            throw new Error(`Invalid date -> ${invalidReason}: ${invalidExplanation}`)
        }

        return convertedDate.setLocale('uk-UA').toFormat(format)
    }

    /**
     * Check if the input date is valid. Powered by {@link https://moment.github.io/luxon/#/ luxon}
     *
     * @param date Input date.
     * @param format `date` format (https://moment.github.io/luxon/#/formatting?id=table-of-tokens). Default - 'yyyy-MM-dd'
     *
     * @throws If input date is invalid
     */
    static validateDate(date: string, format = 'yyyy-MM-dd'): void | never {
        const parsedDate = DateTime.fromFormat(date, format)

        if (!parsedDate.isValid) {
            throw new BadRequestError(`Invalid date: ${parsedDate.invalidReason} ${parsedDate.invalidExplanation}`)
        }
    }

    static formatPhoneNumber(rawPhone: string, separator = ' ', prefix = '+'): string {
        return prefix + rawPhone.replace(/^\+?(\d{2})(\d{3})(\d{3})(\d{2})(\d+)$/, ['$1', '$2', '$3', '$4', '$5'].join(separator))
    }

    /**
     * Format number as: "XX XXX,XX {units}".
     *
     * @param amount Input number
     * @param units Unit to be append at the end of the formatted number
     * @param minimumFractionDigits Minimum number of fraction digits
     */
    static formatAmountWithThousandsSeparator(amount: number, units?: string, minimumFractionDigits?: number): string {
        // https://github.com/nodejs/help/issues/4068 (char "\u00A0" not equals with space in test asserts; reproduced in node 18.13, 18.15, 18.17)
        const result = amount.toLocaleString('uk-UA', { useGrouping: true, minimumFractionDigits }).replaceAll('\u00A0', ' ')

        return units ? `${result} ${units}` : result
    }

    static convertToPennies(amount: number): number {
        return this.toDecimalPlaces(amount * 100, 0)
    }

    static convertFromPennies(amount: number): number {
        return this.toDecimalPlaces(amount / 100, 2)
    }

    static multiplySum(amount: number, multiplier: number, decimalPlaces?: number): number {
        const multipliedSum: number = (amount * 100 * multiplier) / 100

        return this.toDecimalPlaces(multipliedSum, decimalPlaces)
    }

    static toDecimalPlaces(amount: number, decimalPlaces = 2): number {
        return Number.parseFloat(amount.toFixed(decimalPlaces))
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
        return input.replaceAll(/[^\da-zа-яєіїґ]/gi, '')
    }

    /**
     * Returns the appropriate plural form of a string based on the specified numeric value and locale.
     * Uses the pluralization rules for the provided locale to determine the correct form among the options.
     *
     * @param value - The number used to determine the plural form.
     * @param one - The form for singular (e.g., "one item").
     * @param few - The form for a few items (e.g., "few items").
     * @param many - The form for many items (e.g., "many items").
     * @param other - Optional. The fallback form if none of the specific plural rules match.
     *                           Defaults to the 'many' form if not provided.
     * @param locale - The locale used for pluralization rules. Defaults to 'uk' (Ukrainian).
     * @returns The appropriate pluralized string based on the value.
     *
     * @example
     * getPluralForm(1, 'яблуко', 'яблука', 'яблук'); // 'яблуко'
     * getPluralForm(2, 'яблуко', 'яблука', 'яблук'); // 'яблука'
     * getPluralForm(0, 'яблуко', 'яблука', 'яблук', 'плоди'); // 'плоди'
     * getPluralForm(0, 'яблуко', 'яблука', 'яблук'); // 'яблук' (uses 'many' as default fallback)
     */
    static pluralizeString(value: number, one: string, few: string, many: string, other?: string, locale = 'uk'): string {
        const rules = new Intl.PluralRules(locale)

        switch (rules.select(value)) {
            case 'one': {
                return one
            }
            case 'few': {
                return few
            }
            case 'many': {
                return many
            }
            default: {
                return other || many
            }
        }
    }

    private static mod97(string: string): number {
        let checksum: string | number = string.slice(0, 2)
        let fragment: string
        for (let offset = 2; offset < string.length; offset += 7) {
            fragment = String(checksum) + string.slice(offset, offset + 7)
            checksum = Number.parseInt(fragment, 10) % 97
        }

        return checksum as number
    }

    private static toApiError(err: Error & { code?: number; data?: ErrorData; type?: ErrorType }): ApiError {
        const { type, code, message, data } = err

        return new ApiError(message, code || HttpStatusCode.INTERNAL_SERVER_ERROR, data, data?.processCode, type)
    }
}
