import {
    ContactsResponse,
    NavigationPanel,
    PlatformAppVersion,
    PublicServiceContextMenu,
    PublicServiceSettings,
    UserTokenData,
} from '@diia-inhouse/types'

import { ApplicationUtils } from './applicationUtils'
import { AuthProviderName } from './interfaces/publicService'

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

        const isBankApp = [AuthProviderName.PrivatBank, AuthProviderName.Monobank].includes(<AuthProviderName>target)
        const isAuthorizedWithBank = isBankId || isBankApp

        if (isAuthorizedWithBank && phoneNumber && email) {
            return isBankId
                ? 'Дані заповнені з вашого BankID. Перевірте їх та виправте за потреби.'
                : 'Дані заповнені з вашого банку. Перевірте їх та виправте за потреби.'
        }

        return 'Будь ласка, заповніть контактні дані.'
    },
    extractContextMenu(
        settings: PublicServiceSettings,
        appVersion: PlatformAppVersion | undefined,
    ): PublicServiceContextMenu[] | undefined {
        const { contextMenu } = settings
        if (!contextMenu) {
            return contextMenu
        }

        return ApplicationUtils.filterByAppVersions(contextMenu, appVersion)
    },
    extractNavigationPanel(
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
    },
}
