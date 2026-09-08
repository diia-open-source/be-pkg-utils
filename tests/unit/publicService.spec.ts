import { describe, expect, it, vi } from 'vitest'

import { ContactsResponse, DSBodyItem } from '@diia-inhouse/design-system'
import TestKit from '@diia-inhouse/test'
import { Logger } from '@diia-inhouse/types'
import { emailRuValidation, emailValidation, phoneNumberWithoutPlusValidation } from '@diia-inhouse/validators'

import { PublicServiceUtils } from '../../src'
import { AuthProviderName } from '../../src/interfaces/publicService'

describe('Public service utils', () => {
    const testKit = new TestKit()

    describe('getContacts', () => {
        it('should return contacts response', () => {
            const { user } = testKit.session.getUserSession()

            const contacts = PublicServiceUtils.getContacts(user)

            expect(contacts).toEqual<ContactsResponse>({
                title: 'Контактні дані',
                text: expect.any(String),
                phoneNumber: user.phoneNumber,
                email: user.email,
                attentionMessage: undefined,
            })
        })
    })

    describe('getContactsComponent', () => {
        it('should return contacts response', () => {
            const { user } = testKit.session.getUserSession({ phoneNumber: '+380123123' })
            const { email } = user

            const contacts = PublicServiceUtils.getContactsComponent(user)

            expect(contacts).toEqual<DSBodyItem>({
                titleLabelMlc: {
                    label: 'Контактні дані',
                },
                attentionMessageMlc: undefined,
                textLabelMlc: {
                    componentId: expect.any(String),
                    text: expect.any(String),
                    parameters: [],
                },
                questionFormsOrg: {
                    id: 'question_form',
                    items: [
                        {
                            inputPhoneCodeOrg: {
                                componentId: 'phone_with_code',
                                label: 'Контактний номер телефону',
                                mandatory: true,
                                inputCode: 'phone',
                                codeValueIsEditable: false,
                                codeValueId: 'ua',
                                inputPhoneMlc: {
                                    componentId: 'phone',
                                    value: '123123',
                                    validation: [],
                                },
                                codes: [
                                    {
                                        id: 'ua',
                                        maskCode: '## ### ####',
                                        placeholder: '00 000 0000',
                                        label: '+380',
                                        description: '🇺🇦 Україна (+380)',
                                        value: '380',
                                        icon: '🇺🇦',
                                        validation: [phoneNumberWithoutPlusValidation],
                                    },
                                ],
                            },
                        },
                        {
                            inputTextMlc: {
                                id: 'email',
                                componentId: 'email',
                                inputCode: 'email',
                                mandatory: true,
                                value: email,
                                label: 'Email',
                                placeholder: 'hello@diia.gov.ua',
                                validation: [emailValidation, emailRuValidation],
                            },
                        },
                    ],
                },
            })
        })

        it('should return contacts response with empty phone number', () => {
            const { user } = testKit.session.getUserSession({ phoneNumber: '123123213' })
            const { email } = user

            const contacts = PublicServiceUtils.getContactsComponent(user)

            expect(contacts).toEqual<DSBodyItem>({
                titleLabelMlc: {
                    label: 'Контактні дані',
                },
                attentionMessageMlc: undefined,
                textLabelMlc: undefined,
                questionFormsOrg: {
                    id: 'question_form',
                    items: [
                        {
                            inputPhoneCodeOrg: {
                                componentId: 'phone_with_code',
                                label: 'Контактний номер телефону',
                                mandatory: true,
                                inputCode: 'phone',
                                codeValueIsEditable: false,
                                codeValueId: 'ua',
                                inputPhoneMlc: {
                                    componentId: 'phone',
                                    value: '',
                                    validation: [],
                                },
                                codes: [
                                    {
                                        id: 'ua',
                                        maskCode: '## ### ####',
                                        placeholder: '00 000 0000',
                                        label: '+380',
                                        description: '🇺🇦 Україна (+380)',
                                        value: '380',
                                        icon: '🇺🇦',
                                        validation: [phoneNumberWithoutPlusValidation],
                                    },
                                ],
                            },
                        },
                        {
                            inputTextMlc: {
                                id: 'email',
                                componentId: 'email',
                                inputCode: 'email',
                                mandatory: true,
                                value: email,
                                label: 'Email',
                                placeholder: 'hello@diia.gov.ua',
                                validation: [emailValidation, emailRuValidation],
                            },
                        },
                    ],
                },
            })
        })
    })

    describe('getContactsText', () => {
        it('should return no contacts text when user has no contacts', () => {
            const { user } = testKit.session.getUserSession({
                authEntryPoint: testKit.session.getAuthEntryPoint({ isBankId: true, target: AuthProviderName.BankId }),
                phoneNumber: '',
                email: '',
            })

            const text = PublicServiceUtils.getContactsText(user)

            expect(text).toBe('Будь ласка, заповніть контактні дані.')
        })

        it('should return no contacts text when user authorized not via banks', () => {
            const { user } = testKit.session.getUserSession({
                authEntryPoint: testKit.session.getAuthEntryPoint({ isBankId: false, target: AuthProviderName.Nfc }),
            })

            const text = PublicServiceUtils.getContactsText(user)

            expect(text).toBe('Будь ласка, заповніть контактні дані.')
        })

        it('should return contacts from bankId text when user has contacts and authorized via bankId', () => {
            const { user } = testKit.session.getUserSession({
                authEntryPoint: testKit.session.getAuthEntryPoint({ isBankId: true, target: AuthProviderName.BankId }),
            })

            const text = PublicServiceUtils.getContactsText(user)

            expect(text).toBe('Дані заповнені з вашого BankID. Перевірте їх та виправте за потреби.')
        })

        it('should return contacts from bank text when user has contacts and authorized via bank', () => {
            const { user } = testKit.session.getUserSession({
                authEntryPoint: testKit.session.getAuthEntryPoint({ isBankId: false, target: AuthProviderName.PrivatBank }),
            })

            const text = PublicServiceUtils.getContactsText(user)

            expect(text).toBe('Дані заповнені з вашого банку. Перевірте їх та виправте за потреби.')
        })
    })

    describe('extractPhoneNumber', () => {
        it('should successfully extract valid phone number', () => {
            const result = PublicServiceUtils.extractPhoneNumber('380123456789', 'ua')

            expect(result).toBe('123456789')
        })

        it('should successfully extract valid phone number with plus prefix', () => {
            const result = PublicServiceUtils.extractPhoneNumber('+380123456789', 'ua')

            expect(result).toBe('123456789')
        })

        it('should throw error when country code is invalid', () => {
            expect(() => {
                PublicServiceUtils.extractPhoneNumber('380123456789', 'invalid')
            }).toThrow('Invalid country code')
        })

        it('should throw error when phone number does not start with country code', () => {
            expect(() => {
                PublicServiceUtils.extractPhoneNumber('48123456789', 'ua')
            }).toThrow('Phone number must start with country code 380')
        })

        it('should throw error when phone number contains non-digit characters', () => {
            expect(() => {
                PublicServiceUtils.extractPhoneNumber('380abc123456', 'ua')
            }).toThrow('Phone number must contain only digits')
        })

        it('should work with different country codes', () => {
            const result = PublicServiceUtils.extractPhoneNumber('48123456789', 'pl')

            expect(result).toBe('123456789')
        })

        it('should throw error when phone contains spaces', () => {
            expect(() => {
                PublicServiceUtils.extractPhoneNumber('380 123 456 789', 'ua')
            }).toThrow('Phone number must contain only digits')
        })
    })

    describe('extractPhoneNumberSafe', () => {
        const getLoggerMock = (): Logger => ({ warn: vi.fn<Logger['warn']>() }) as unknown as Logger

        it('should extract valid phone number without logging', () => {
            const logger = getLoggerMock()

            const result = PublicServiceUtils.extractPhoneNumberSafe('+380123456789', 'ua', logger)

            expect(result).toBe('123456789')
            expect(logger.warn).not.toHaveBeenCalled()
        })

        it('should return undefined and log warning when phone number does not match the country code', () => {
            const logger = getLoggerMock()

            const result = PublicServiceUtils.extractPhoneNumberSafe('48123456789', 'ua', logger)

            expect(result).toBeUndefined()
            expect(logger.warn).toHaveBeenCalledWith('Failed to extract phone number by country code', {
                err: new Error('Phone number must start with country code 380'),
                phoneCodeValue: 'ua',
            })
        })

        it('should return undefined and log warning when the country code is invalid', () => {
            const logger = getLoggerMock()

            const result = PublicServiceUtils.extractPhoneNumberSafe('380123456789', 'invalid', logger)

            expect(result).toBeUndefined()
            expect(logger.warn).toHaveBeenCalledWith('Failed to extract phone number by country code', {
                err: new Error('Invalid country code'),
                phoneCodeValue: 'invalid',
            })
        })

        it('should return undefined and log warning when phone number contains non-digit characters', () => {
            const logger = getLoggerMock()

            const result = PublicServiceUtils.extractPhoneNumberSafe('380abc123456', 'ua', logger)

            expect(result).toBeUndefined()
            expect(logger.warn).toHaveBeenCalledWith('Failed to extract phone number by country code', {
                err: new Error('Phone number must contain only digits'),
                phoneCodeValue: 'ua',
            })
        })
    })
})
