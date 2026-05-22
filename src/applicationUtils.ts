import fs from 'node:fs'
import path from 'node:path'

import { compare } from 'compare-versions'
import lodash from 'lodash'
import { DateTime, ToRelativeUnit } from 'luxon'
import mapAgeCleaner from 'map-age-cleaner'
import { PackageJson } from 'type-fest'

import { ApiError, BadRequestError } from '@diia-inhouse/errors'
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

import { ProcessObjectCallback } from './interfaces/applicationUtils.js'
import { OriginError } from './interfaces/error.js'

// oxlint-disable-next-line typescript/unbound-method
const { camelCase, cloneDeep, kebabCase, startCase } = lodash

// oxlint-disable-next-line typescript/no-extraneous-class
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

        const digits = Array.from(itn, Number)
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

        const loweredNameParts = name.toLowerCase().split(' ')
        if (loweredNameParts.length === 1) {
            const [namePart] = loweredNameParts

            if (this.nameComponentsToLowerCase.includes(namePart)) {
                return this.capitalizeFirstLetter(namePart)
            }
        }

        return loweredNameParts
            .map((word) =>
                word
                    .split('-')
                    .map((namePart) =>
                        this.nameComponentsToLowerCase.includes(namePart) ? namePart : this.capitalizeFirstLetter(namePart),
                    )
                    .join('-'),
            )
            .join(' ')
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

    /**
     * Validates the Ukrainian IBAN number by format and checksum.
     */
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

    /**
     * Extracts the bank code (МФО) from Ukrainian IBAN (4-10 digits). Does not validate the IBAN.
     *
     * @link https://en.wikipedia.org/wiki/International_Bank_Account_Number#IBAN_formats_by_country
     * @example
     * ```typescript
     * const bankCode = extractBankCodeFromIban('UA833052991234567890123456789') // '305299'
     * ```
     */
    static extractBankCodeFromIban(iban: string): string {
        return iban.slice(4, 10)
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

        const message = `Unexpected error caused: ${String(err)}`
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

                throw new TypeError(`Unhandled sessionType: ${String(unhandledType)}`)
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
     * @param params Additional parameters. Default: `{ format: 'dd.MM.yyyy', unitOfTime: 'years' }`
     * @param params.format Input date format (https://moment.github.io/luxon/#/formatting?id=table-of-tokens). Default - 'dd.MM.yyyy'
     * @param params.unitOfTime Unit of time to get the difference in. Default - 'years'
     * @param params.relativeTo Date to compare the input date to. Default - current date
     *
     * @returns Age in years if other `unitOfTime` is not specified
     * @throws If input date is invalid
     */
    static getAge(birthDay: string, params: { format?: string; unitOfTime?: ToRelativeUnit; relativeTo?: string } = {}): number {
        const { format = 'dd.MM.yyyy', unitOfTime = 'years', relativeTo } = params

        const birthdayDate = DateTime.fromFormat(birthDay, format)
        if (!birthdayDate.isValid) {
            throw new Error('Invalid user birthday')
        }

        const fromDate = relativeTo ? DateTime.fromISO(relativeTo) : DateTime.now()

        /* Added an array of "units" with milliseconds to ensure that all larger unit values are integers.
            For instance:
                birthDay = '24.03.2009'
                currentDate = '24.03.2023'
                DateTime.now().diff(birthdayDate, 'years')['years'] => 14.001228454102156
                // fix
                DateTime.now().diff(birthdayDate, ['years', 'milliseconds'])['years'] => 14
                DateTime.now().diff(birthdayDate, ['months', 'milliseconds'])['months'] => 168
        */
        return fromDate.diff(birthdayDate, [unitOfTime, 'milliseconds'])[unitOfTime]
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

    /**
     * Returns the name of a service from a package.json in the current working directory (process.cwd()) converted to PascalCase.
     * If the name is scoped, it will be returned without the scope.
     * If the name is not found, an empty string is returned. Also, all whitespace characters are removed.
     *
     * @returns The name of the service in PascalCase.
     *
     * @example
     * getServiceName() // 'my-service' -> 'MyService'
     * getServiceName() // '@scope/my-service' -> 'MyService'
     */
    static getServiceName(): string {
        try {
            const packageName = this.getPackageJson().name || ''

            let nameWithoutScope = packageName
            if (packageName.startsWith('@')) {
                const parts = packageName.split('/')
                if (parts.length > 1) {
                    nameWithoutScope = parts[1]
                }
            }

            return startCase(camelCase(nameWithoutScope)).replaceAll(/\s/g, '')
        } catch {
            return ''
        }
    }

    /**
     * Returns the version of a service from a package.json in the current working directory (process.cwd()).
     * If the version is not found, an empty string is returned.
     *
     * @returns The version of the service.
     *
     * @example
     * getServiceVersion() // '1.143.0-rc.2'
     */
    static getServiceVersion(): string {
        try {
            const packageJson = this.getPackageJson()

            return packageJson.version || ''
        } catch {
            return ''
        }
    }

    /**
     * Format string according to mask pattern
     *
     * Basic Examples:
     * '12345' with '##-###'    -> '12-345'
     * 'AB345' with '##-###'    -> 'AB-345'
     * '123456' with '##.####'  -> '12.3456'
     * '12345' with '### ##'    -> '123 45'
     * 'ABCDEF' with '##-##-##' -> 'AB-CD-EF'
     */
    static formatMask(rawData: string, mask: string): string {
        if (!rawData || !mask) {
            return rawData
        }

        let result = ''
        let dataIndex = 0

        for (const element of mask) {
            if (dataIndex >= rawData.length) {
                break
            }

            if (element === '#') {
                result += rawData[dataIndex]
                dataIndex++
            } else {
                result += element
            }
        }

        result += rawData.slice(dataIndex)

        return result
    }

    /**
     * Memoize a function.
     * The function is memoized by the arguments (`JSON.stringify(args)`) and the result is cached for the specified time to live in milliseconds.
     * If the function is called with the same arguments again, the cached result is returned.
     * If the function is called with the same arguments again after the time to live has expired, the function is called again and the result is cached again.
     *
     * @param fn - The function to memoize.
     * @param ttl - The time to live for the cached value in milliseconds.
     * @returns The memoized function.
     */
    // oxlint-disable-next-line typescript/no-inferrable-types -- explicit type required by isolatedDeclarations
    static memoize<T extends (...args: Parameters<T>) => ReturnType<T>>(fn: T, ttl: number = Infinity): T {
        const promiseCache = new Map<string, ReturnType<T>>()
        const cache = new Map<string, { data: ReturnType<T> | Awaited<ReturnType<T>>; maxAge: number }>()

        mapAgeCleaner(cache)

        const memoized = (async (...args) => {
            const key = JSON.stringify(args)
            const cachedPromise = promiseCache.get(key)
            if (cachedPromise) {
                return cachedPromise
            }

            const cachedValue = cache.get(key)
            if (cachedValue) {
                return cachedValue.data
            }

            try {
                const promise = fn(...args)

                promiseCache.set(key, promise)
                // oxlint-disable-next-line typescript/await-thenable -- T may return a Promise
                const result = await promise

                cache.set(key, { data: result, maxAge: Date.now() + ttl })

                return result
            } finally {
                promiseCache.delete(key)
            }
        }) as T

        return memoized
    }

    /**
     * Recursively encodes all string values in an object or string using encodeURIComponent.
     * For objects, it creates a deep clone and processes all string values.
     * For strings, it directly applies the encoding.
     *
     * @param data Input data to encode - can be an object or string
     * @returns Deep cloned object with encoded string values, or encoded string if input was string
     * @example
     * ```typescript
     * const data = { name: 'John Doe', email: 'john@example.com' }
     * const encoded = ApplicationUtils.encodeValuesWithIterator(data)
     * // Result: { name: 'John%20Doe', email: 'john%40example.com' }
     * ```
     */
    static encodeValuesWithIterator(data: object | string): object | string {
        return this.processValues(data, encodeURIComponent)
    }

    /**
     * Recursively decodes all string values in an object or string using decodeURIComponent.
     * For objects, it creates a deep clone and processes all string values.
     * For strings, it directly applies the decoding.
     *
     * @param data Input data to decode - can be an object or string
     * @returns Deep cloned object with decoded string values, or decoded string if input was string
     * @example
     * ```typescript
     * const data = { name: 'John%20Doe', email: 'john%40example.com' }
     * const decoded = ApplicationUtils.decodeValuesWithIterator(data)
     * // Result: { name: 'John Doe', email: 'john@example.com' }
     * ```
     */
    static decodeValuesWithIterator(data: object | string): object | string {
        return this.processValues(data, decodeURIComponent)
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

    private static toApiError(err: OriginError): ApiError {
        const { type, code, message, data = {}, keyValue } = err
        const processCode = data.processCode

        if (code === 11000 && keyValue) {
            data.keyValue = keyValue
        }

        return new ApiError(message, code || HttpStatusCode.INTERNAL_SERVER_ERROR, data, processCode, type)
    }

    private static getPackageJson(): PackageJson {
        const packageJsonPath = path.resolve(process.cwd(), 'package.json')

        return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) // nosemgrep: eslint.detect-non-literal-fs-filename
    }

    private static processObject(obj: unknown, processor: ProcessObjectCallback): unknown {
        if (typeof obj === 'string') {
            try {
                return processor(obj)
            } catch {
                return obj
            }
        }

        if (Array.isArray(obj)) {
            return obj.map((item) => {
                return this.processObject(item, processor)
            })
        }

        if (obj && typeof obj === 'object') {
            if (
                obj instanceof Date ||
                obj instanceof RegExp ||
                obj instanceof Map ||
                obj instanceof Set ||
                obj instanceof Error ||
                obj instanceof URL ||
                obj instanceof URLSearchParams
            ) {
                return obj
            }

            const result: Record<string, unknown> = {}
            for (const [key, value] of Object.entries(obj)) {
                result[key] = this.processObject(value, processor)
            }

            return result
        }

        return obj
    }

    private static processValues(data: object | string, processor: ProcessObjectCallback): object | string {
        if (typeof data === 'string') {
            try {
                return processor(data)
            } catch {
                return data
            }
        }

        const clonedData = cloneDeep(data)

        return this.processObject(clonedData, processor) as object | string
    }
}
