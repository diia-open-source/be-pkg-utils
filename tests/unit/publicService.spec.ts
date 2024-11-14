import { describe, expect, it } from 'vitest'

import TestKit from '@diia-inhouse/test'
import {
    ContactsResponse,
    PlatformType,
    PublicServiceContextMenu,
    PublicServiceContextMenuType,
    PublicServiceSettings,
} from '@diia-inhouse/types'
import { DSBodyItem } from '@diia-inhouse/types/dist/types/generated/designSystem/item'
import { emailRuValidation, emailValidation, phoneNumberValidation } from '@diia-inhouse/validators'

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
                                codeValueId: 'UA',
                                inputPhoneMlc: {
                                    componentId: 'phone',
                                    value: '123123',
                                    validation: [],
                                },
                                codes: [
                                    {
                                        id: 'UA',
                                        maskCode: '## ### ####',
                                        placeholder: '00 000 0000',
                                        label: '+380',
                                        description: '🇺🇦 Україна (+380)',
                                        value: '+380',
                                        icon: '🇺🇦',
                                        validation: [phoneNumberValidation],
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
                                codeValueId: 'UA',
                                inputPhoneMlc: {
                                    componentId: 'phone',
                                    value: '',
                                    validation: [],
                                },
                                codes: [
                                    {
                                        id: 'UA',
                                        maskCode: '## ### ####',
                                        placeholder: '00 000 0000',
                                        label: '+380',
                                        description: '🇺🇦 Україна (+380)',
                                        value: '+380',
                                        icon: '🇺🇦',
                                        validation: [phoneNumberValidation],
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

    describe('extractContextMenu', () => {
        it('should filter by app versions and return context menu', () => {
            const validContextMenu = {
                name: 'name',
                type: PublicServiceContextMenuType.assistantScreen,
                appVersions: {
                    maxVersion: { [PlatformType.Android]: '12.0.0' },
                    minVersion: { [PlatformType.Android]: '1.0.0' },
                    versions: {
                        Android: ['13'],
                        Browser: [],
                        Huawei: [],
                        iOS: [],
                    },
                },
            } as PublicServiceContextMenu

            expect(
                PublicServiceUtils.extractContextMenu({ contextMenu: [validContextMenu] } as PublicServiceSettings, {
                    appVersion: '2.0.0',
                    platformType: PlatformType.Android,
                    platformVersion: '13',
                }),
            ).toEqual([validContextMenu])
        })

        it('should not extract context menu in case it is undefined', () => {
            expect(
                PublicServiceUtils.extractContextMenu({} as PublicServiceSettings, {
                    appVersion: '2.0.0',
                    platformType: PlatformType.Android,
                    platformVersion: '13',
                }),
            ).toBeUndefined()
        })
    })

    describe('extractNavigationPanel', () => {
        it('should successfully extract navigation pannel', () => {
            const validContextMenu = {
                name: 'Navigation',
                type: PublicServiceContextMenuType.assistantScreen,
                appVersions: {
                    maxVersion: { [PlatformType.Android]: '12.0.0' },
                    minVersion: { [PlatformType.Android]: '1.0.0' },
                    versions: {
                        Android: ['13'],
                        Browser: [],
                        Huawei: [],
                        iOS: [],
                    },
                },
            } as PublicServiceContextMenu

            expect(
                PublicServiceUtils.extractNavigationPanel(
                    { name: 'Navigation', contextMenu: [validContextMenu] } as PublicServiceSettings,
                    {
                        appVersion: '2.0.0',
                        platformType: PlatformType.Android,
                        platformVersion: '13',
                    },
                ),
            ).toEqual({ header: 'Navigation', contextMenu: [validContextMenu] })
        })
    })
})
