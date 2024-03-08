import { compare } from 'compare-versions'

import {
    AppUser,
    ContactsResponse,
    NavigationPanel,
    PlatformAppVersion,
    ProfileFeature,
    PublicServiceCode,
    PublicServiceContextMenu,
    PublicServiceSettings,
    PublicServiceStatus,
    UserFeatures,
    UserTokenData,
} from '@diia-inhouse/types'

import { ApplicationUtils } from './applicationUtils'
import { AuthProviderName } from './interfaces/publicService'
import { profileFeaturesToList } from './session'

export class PublicServiceUtils {
    private static readonly serviceAvailabilityStrategies: Partial<Record<PublicServiceCode, (features: UserFeatures) => boolean>> = {
        [PublicServiceCode.officeOfficialWorkspace]: (features) => features[ProfileFeature.office]?.googleWorkspace === 'true',
    }

    static getContacts(user: UserTokenData): ContactsResponse {
        const { phoneNumber, email } = user

        return {
            title: 'Контактні дані',
            text: this.getContactsText(user),
            phoneNumber,
            email,
            attentionMessage: undefined,
        }
    }

    static getContactsText(user: UserTokenData): string {
        const { phoneNumber, email, authEntryPoint } = user
        const { isBankId, target } = authEntryPoint || {}

        const isBankApp = [AuthProviderName.PrivatBank, AuthProviderName.Monobank].includes(<AuthProviderName>target)
        const isAuthorizedWithBank = isBankId || isBankApp

        if (isAuthorizedWithBank && phoneNumber && email) {
            return isBankId
                ? 'Дані заповнені з вашого BankID. Перевірте їх та виправте за потреби.'
                : 'Дані заповнені з вашого банку. Перевірте їх та виправте за потреби.'
        }

        return 'Будь ласка, заповніть контактні дані.'
    }

    static extractContextMenu(
        settings: PublicServiceSettings,
        appVersion: PlatformAppVersion | undefined,
    ): PublicServiceContextMenu[] | undefined {
        const { contextMenu } = settings
        if (!contextMenu) {
            return contextMenu
        }

        return ApplicationUtils.filterByAppVersions(contextMenu, appVersion)
    }

    static extractNavigationPanel(
        settings: PublicServiceSettings,
        appVersion: PlatformAppVersion | undefined,
        header?: string,
    ): NavigationPanel | undefined {
        const { name } = settings
        const contextMenu = this.extractContextMenu(settings, appVersion) ?? []

        return {
            header: header || name,
            contextMenu,
        }
    }

    static isAvailable(
        settings: PublicServiceSettings,
        user: AppUser,
        platformAppVersion: PlatformAppVersion,
        userFeatures: UserFeatures = {},
    ): boolean {
        const { code, status, sessionTypes, profileFeature, platformMinVersion, appVersions } = settings
        const { sessionType } = user
        const { platformType, platformVersion, appVersion } = platformAppVersion

        if (status !== PublicServiceStatus.active) {
            return false
        }

        if (!sessionTypes.includes(sessionType)) {
            return false
        }

        const featuresList = profileFeaturesToList(userFeatures)
        if (profileFeature && !featuresList?.includes(profileFeature)) {
            return false
        }

        const strategy = this.serviceAvailabilityStrategies[code]
        if (strategy && !strategy(userFeatures)) {
            return false
        }

        const platformMinVersionValue = platformMinVersion?.[platformType]
        if (platformMinVersionValue && compare(platformVersion, platformMinVersionValue, '<')) {
            return false
        }

        const appVersionsBySession = appVersions?.[sessionType]
        if (!appVersionsBySession) {
            return true
        }

        return ApplicationUtils.isAppVersionMatch(appVersion, platformType, appVersionsBySession)
    }
}
