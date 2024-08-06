import TestKit from '@diia-inhouse/test'
import {
    ContactsResponse,
    PlatformType,
    PublicServiceContextMenu,
    PublicServiceContextMenuType,
    PublicServiceSettings,
} from '@diia-inhouse/types'

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
            const validContextMenu = <PublicServiceContextMenu>{
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
            }

            expect(
                PublicServiceUtils.extractContextMenu(<PublicServiceSettings>{ contextMenu: [validContextMenu] }, {
                    appVersion: '2.0.0',
                    platformType: PlatformType.Android,
                    platformVersion: '13',
                }),
            ).toEqual([validContextMenu])
        })

        it('should not extract context menu in case it is undefined', () => {
            expect(
                PublicServiceUtils.extractContextMenu(<PublicServiceSettings>{}, {
                    appVersion: '2.0.0',
                    platformType: PlatformType.Android,
                    platformVersion: '13',
                }),
            ).toBeUndefined()
        })
    })

    describe('extractNavigationPanel', () => {
        it('should successfully extract navigation pannel', () => {
            const validContextMenu = <PublicServiceContextMenu>{
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
            }

            expect(
                PublicServiceUtils.extractNavigationPanel(<PublicServiceSettings>{ name: 'Navigation', contextMenu: [validContextMenu] }, {
                    appVersion: '2.0.0',
                    platformType: PlatformType.Android,
                    platformVersion: '13',
                }),
            ).toEqual({ header: 'Navigation', contextMenu: [validContextMenu] })
        })
    })
})
