export enum AuthProviderName {
    Monobank = 'monobank',
    PrivatBank = 'privatbank',
    PhotoId = 'photoid',
    BankId = 'bankid',
    Nfc = 'nfc',
}

export interface InputPhoneCodeOrgParams {
    inputCode?: string
    phoneValue?: string
    codeValueId?: string
    codeIds?: string[]
    hint?: string
}
