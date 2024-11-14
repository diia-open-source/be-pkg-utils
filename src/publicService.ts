import {
    ContactsResponse,
    DSBodyItem,
    InputPhoneCodeOrg,
    InputTextMlc,
    NavigationPanel,
    PlatformAppVersion,
    PublicServiceContextMenu,
    PublicServiceSettings,
    TextLabelMlc,
    UserTokenData,
} from '@diia-inhouse/types'
import { emailRuValidation, emailValidation } from '@diia-inhouse/validators'

import { ApplicationUtils } from './applicationUtils'
import { phoneCodes } from './dictionaries/phoneCodes'
import { AuthProviderName, InputPhoneCodeOrgParams } from './interfaces/publicService'

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

        const inputPhoneCodeOrg = this.getInputPhoneCodeOrg({ inputCode, phoneValue: rawPhoneNumber, codeValueId: 'UA', codeIds: ['UA'] })
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
    getInputPhoneCodeOrg(params: InputPhoneCodeOrgParams): InputPhoneCodeOrg {
        const { inputCode = 'phone', phoneValue, codeValueId, codeIds = [], hint } = params
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
            codeValueIsEditable: false,
            codeValueId,
            codes,
        }
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
