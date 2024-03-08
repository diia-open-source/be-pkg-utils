import TestKit from '@diia-inhouse/test'
import {
    ContactsResponse,
    PlatformType,
    ProfileFeature,
    PublicServiceContextMenu,
    PublicServiceContextMenuType,
    PublicServiceSettings,
    PublicServiceStatus,
    SessionType,
} from '@diia-inhouse/types'

import { AuthProviderName } from '../../src/interfaces/publicService'
import { PublicServiceUtils } from '../../src/publicService'

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

    describe('isAvailable', () => {
        it('should return false if service is not active', () => {
            const { user } = testKit.session.getUserSession()
            const headers = testKit.session.getHeaders()

            const settings = testKit.public.getPublicServiceSettings({
                status: PublicServiceStatus.inactive,
            })

            const result = PublicServiceUtils.isAvailable(settings, user, headers)

            expect(result).toBe(false)
        })

        it("should return false if session type doesn't match", () => {
            const { user } = testKit.session.getUserSession()
            const headers = testKit.session.getHeaders()

            const settings = testKit.public.getPublicServiceSettings({
                sessionTypes: [SessionType.EResident],
            })

            const result = PublicServiceUtils.isAvailable(settings, user, headers)

            expect(result).toBe(false)
        })

        it("should return false if provided profile feature doesn't match", () => {
            const { user } = testKit.session.getUserSession()
            const headers = testKit.session.getHeaders()

            const settings = testKit.public.getPublicServiceSettings({
                sessionTypes: [SessionType.User],
                profileFeature: ProfileFeature.office,
            })

            const result = PublicServiceUtils.isAvailable(settings, user, headers)

            expect(result).toBe(false)
        })

        it('should return true if no appVersions by session type', () => {
            const { user } = testKit.session.getUserSession()
            const headers = testKit.session.getHeaders()

            const settings = testKit.public.getPublicServiceSettings({
                sessionTypes: [SessionType.User],
            })

            const result = PublicServiceUtils.isAvailable(settings, user, headers)

            expect(result).toBe(true)
        })

        it("should return false if app version doesn't match", () => {
            const { user } = testKit.session.getUserSession()
            const headers = testKit.session.getHeaders({
                platformType: PlatformType.Android,
                appVersion: '2.0.0',
            })

            const settings = testKit.public.getPublicServiceSettings({
                sessionTypes: [SessionType.User],
                appVersions: {
                    [SessionType.User]: {
                        minVersion: { [PlatformType.Android]: '3.0.0' },
                    },
                },
            })

            const result = PublicServiceUtils.isAvailable(settings, user, headers)

            expect(result).toBe(false)
        })

        it('should return true if all conditions satisfied', () => {
            const { user } = testKit.session.getUserSession()
            const headers = testKit.session.getHeaders({
                platformType: PlatformType.Android,
                appVersion: '4.0.0',
            })

            const settings = testKit.public.getPublicServiceSettings({
                sessionTypes: [SessionType.User],
                appVersions: {
                    [SessionType.User]: {
                        minVersion: { [PlatformType.Android]: '3.0.0' },
                    },
                },
            })

            const result = PublicServiceUtils.isAvailable(settings, user, headers)

            expect(result).toBe(true)
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
