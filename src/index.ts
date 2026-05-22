import { AddressUtils } from './address.js'
import { ApplicationUtils } from './applicationUtils.js'
import { Asserts } from './asserts.js'
import { Guards } from './guards.js'
import { IntegrationUtils } from './integration.js'
import { NetworkUtils } from './network.js'
import { PaymentUtils } from './payment.js'
import { PdfUtils } from './pdfUtils.js'
import { PublicServiceUtils } from './publicService.js'
import { RandomUtils } from './random.js'
import { SlackFormattingUtils } from './slackFormatting.js'
import { TypeUtils } from './typeUtils.js'

const asserts: typeof Asserts = Asserts
const guards: typeof Guards = Guards
const utils: typeof ApplicationUtils = ApplicationUtils
const pdfUtils: typeof PdfUtils = PdfUtils

export { asserts, guards, utils, pdfUtils }

export { TypeUtils } from './typeUtils.js'

export { PaymentUtils } from './payment.js'

export { PublicServiceUtils } from './publicService.js'

export { phoneticChecker } from './phoneticChecker/index.js'

export { NetworkUtils } from './network.js'

export { IntegrationUtils } from './integration.js'

export { RandomUtils } from './random.js'

export { AddressUtils } from './address.js'

export * from './session.js'

export * from './slackFormatting.js'

export class Utils {
    address: typeof AddressUtils = AddressUtils
    application: typeof ApplicationUtils = ApplicationUtils
    network: typeof NetworkUtils = NetworkUtils
    payment: typeof PaymentUtils = PaymentUtils
    slackFormatting: typeof SlackFormattingUtils = SlackFormattingUtils

    asserts: typeof Asserts = Asserts
    guards: typeof Guards = Guards
    integration: typeof IntegrationUtils = IntegrationUtils
    pdf: typeof PdfUtils = PdfUtils
    publicService: typeof PublicServiceUtils = PublicServiceUtils
    random: typeof RandomUtils = RandomUtils
    type: typeof TypeUtils = TypeUtils
}
