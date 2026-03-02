import { AddressUtils } from './address'
import { ApplicationUtils } from './applicationUtils'
import { Asserts } from './asserts'
import { Guards } from './guards'
import { IntegrationUtils } from './integration'
import { NetworkUtils } from './network'
import { PaymentUtils } from './payment'
import { PdfUtils } from './pdfUtils'
import { PublicServiceUtils } from './publicService'
import { RandomUtils } from './random'
import { SlackFormattingUtils } from './slackFormatting'
import { TypeUtils } from './typeUtils'

const asserts = Asserts
const guards = Guards
const utils = ApplicationUtils
const pdfUtils = PdfUtils

export { asserts, guards, utils, pdfUtils }

export { TypeUtils } from './typeUtils'

export { PaymentUtils } from './payment'

export { PublicServiceUtils } from './publicService'

export { phoneticChecker } from './phoneticChecker'

export { NetworkUtils } from './network'

export { IntegrationUtils } from './integration'

export { RandomUtils } from './random'

export { AddressUtils } from './address'

export * from './session'

export * from './slackFormatting'

export class Utils {
    address = AddressUtils
    application = ApplicationUtils
    network = NetworkUtils
    payment = PaymentUtils
    slackFormatting = SlackFormattingUtils

    asserts = Asserts
    guards = Guards
    integration = IntegrationUtils
    pdf = PdfUtils
    publicService = PublicServiceUtils
    random = RandomUtils
    type = TypeUtils
}
