import { ErrorData, ErrorType } from '@diia-inhouse/errors'

export type OriginError = Error & {
    code?: number
    data?: ErrorData
    type?: ErrorType
    keyValue?: unknown
}
