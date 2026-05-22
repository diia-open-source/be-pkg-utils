import {
    ContactsResponse,
    DSBodyItem,
    InputPhoneCodeItem,
    InputPhoneCodeOrg,
    InputTextMlc,
    TextLabelMlc,
} from '@diia-inhouse/design-system'
import { UserTokenData } from '@diia-inhouse/types'
import { emailRuValidation, emailValidation } from '@diia-inhouse/validators'

import { phoneCodes } from './dictionaries/phoneCodes.js'
import { AuthProviderName, InputPhoneCodeOrgParams } from './interfaces/publicService.js'

export const PublicServiceUtils = {
    getContacts(user: UserTokenData): ContactsResponse {
        const { phoneNumber, email } = user

        return {
            title: 'Контактні дані',
            text: this.getContactsText(user),
            phoneNumber,
            email,
            attentionMessage: undefined,
        }
    },
    getContactsText(user: UserTokenData): string {
        const { phoneNumber, email, authEntryPoint } = user
        const { isBankId, target } = authEntryPoint || {}

        const isBankApp = [AuthProviderName.PrivatBank, AuthProviderName.Monobank].includes(target as AuthProviderName)
        const isAuthorizedWithBank = isBankId || isBankApp

        if (isAuthorizedWithBank && phoneNumber && email) {
            return isBankId
                ? 'Дані заповнені з вашого BankID. Перевірте їх та виправте за потреби.'
                : 'Дані заповнені з вашого банку. Перевірте їх та виправте за потреби.'
        }

        return 'Будь ласка, заповніть контактні дані.'
    },
    getContactsComponent(user: UserTokenData, inputCode = 'phone'): DSBodyItem {
        const { phoneNumber, email } = user

        const rawPhoneNumber = phoneNumber && phoneNumber.includes('+380') ? phoneNumber.replaceAll(/\+380|\s+/g, '') : ''

        const inputPhoneCodeOrg = this.getInputPhoneCodeOrg({ inputCode, phoneValue: rawPhoneNumber, codeValueId: 'ua', codeIds: ['ua'] })
        const emailInputTextMlc = this.getEmailInputTextMlc(email)

        return {
            titleLabelMlc: {
                label: 'Контактні дані',
            },
            textLabelMlc: this.getContactsComponentTextLabel(user, rawPhoneNumber),
            attentionMessageMlc: undefined,
            questionFormsOrg: {
                id: 'question_form',
                items: [{ inputPhoneCodeOrg }, { inputTextMlc: emailInputTextMlc }],
            },
        }
    },
    /**
     * Creates an InputPhoneCodeOrg with specified parameters
     * @param params.codeIds - Optional array of allowed country code IDs
     * @returns InputPhoneCodeOrg
     * @example
     * // Create a phone input with Ukrainian code
     * const phoneInput = getInputPhoneCodeOrg({
     *   inputCode: 'phone',
     *   phoneValue: '501234567',
     *   codeValueId: 'ua',
     *   codeIds: ['ua', 'pl'],
     *   hint: 'Enter your phone number'
     * });
     */
    getInputPhoneCodeOrg(params: InputPhoneCodeOrgParams): InputPhoneCodeOrg {
        const { inputCode = 'phone', phoneValue, codeValueId, codeIds = [], hint, codeValueIsEditable = false } = params
        const codes = codeIds.length > 0 ? phoneCodes.filter((code) => codeIds.includes(code.id)) : phoneCodes

        return {
            componentId: 'phone_with_code',
            label: 'Контактний номер телефону',
            mandatory: true,
            inputCode,
            hint,
            inputPhoneMlc: {
                componentId: 'phone',
                value: phoneValue,
                validation: [],
            },
            codeValueIsEditable,
            codeValueId,
            codes,
        }
    },
    /**
     * Returns an array of phone code items, optionally filtered by provided code IDs
     * @param filter - Optional array of phone code IDs to filter by
     * @returns Array of phone code items matching the filter criteria, or all phone codes if no filter is provided
     * @example
     * // Get all phone codes
     * const allCodes = getInputPhoneCodeItems();
     *
     * @example
     * // Get only Ukrainian and Polish phone codes
     * const filteredCodes = getInputPhoneCodeItems(['ua', 'pl']);
     */
    getInputPhoneCodeItems(filter: string[] = []): InputPhoneCodeItem[] {
        return filter.length > 0 ? phoneCodes.filter((code) => filter.includes(code.id)) : phoneCodes
    },
    getEmailInputTextMlc(emailValue: string, inputCode = 'email'): InputTextMlc {
        return {
            componentId: 'email',
            id: 'email',
            inputCode,
            mandatory: true,
            value: emailValue,
            label: 'Email',
            placeholder: 'hello@diia.gov.ua',
            validation: [emailValidation, emailRuValidation],
        }
    },
    getContactsComponentTextLabel(user: UserTokenData, phoneNumber: string): TextLabelMlc | undefined {
        const { email, authEntryPoint } = user
        const { isBankId, target } = authEntryPoint || {}

        const isBankApp = [AuthProviderName.PrivatBank, AuthProviderName.Monobank].includes(target as AuthProviderName)
        const isAuthorizedWithBank = isBankId || isBankApp

        if (isAuthorizedWithBank && phoneNumber && email) {
            return {
                componentId: 'text_label',
                parameters: [],
                text: 'Дія автоматично підтягнула дані з вашого BankID. Перевірте інформацію та виправте за потреби.',
            }
        }
    },

    /**
     * Extracts the phone number from the phone number string
     *
     * @param phoneNumber - Phone number to extract the number from
     * @param phoneCodeValue - Phone country code in ISO 3166-1 alpha-2 format
     * @returns Extracted phone number (without country code)
     *
     * @example
     * extractPhoneNumber('+380123456789', 'ua') // 123456789
     *
     * @example
     * extractPhoneNumber('123456789', 'ua') // throws Error(`Phone number must start with country code 380`)
     *
     * @example
     * extractPhoneNumber('380123456789', 'invalid') // throws Error(`Invalid country code`)
     */
    extractPhoneNumber(phoneNumber: string, phoneCodeValue: string): string | never {
        const cleanPhoneNumber = phoneNumber.replace(/^\+/, '')
        if (!/^\d+$/.test(cleanPhoneNumber)) {
            throw new Error('Phone number must contain only digits')
        }

        const countryCode = phoneCodes.find((code) => code.id === phoneCodeValue)
        if (!countryCode) {
            throw new Error('Invalid country code')
        }

        if (!cleanPhoneNumber.startsWith(countryCode.value)) {
            throw new Error(`Phone number must start with country code ${countryCode.value}`)
        }

        return cleanPhoneNumber.slice(countryCode.value.length)
    },
}
