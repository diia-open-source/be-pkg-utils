import { GrpcStatusCode, HttpStatusCode } from '@diia-inhouse/types'

// credits https://github.com/prettymuchbryce/http-status-codes/blob/c840bc674ab043551b87194d1ebb5415f222abbe/src/utils.ts#L2
const statusCodeToReasonPhraseMap = new Map([
    [202, "Accepted"],
    [502, "Bad Gateway"],
    [400, "Bad Request"],
    [409, "Conflict"],
    [100, "Continue"],
    [201, "Created"],
    [417, "Expectation Failed"],
    [424, "Failed Dependency"],
    [403, "Forbidden"],
    [504, "Gateway Timeout"],
    [410, "Gone"],
    [505, "HTTP Version Not Supported"],
    [418, "I'm a teapot"],
    [419, "Insufficient Space on Resource"],
    [507, "Insufficient Storage"],
    [500, "Internal Server Error"],
    [411, "Length Required"],
    [423, "Locked"],
    [420, "Method Failure"],
    [405, "Method Not Allowed"],
    [301, "Moved Permanently"],
    [302, "Moved Temporarily"],
    [207, "Multi-Status"],
    [300, "Multiple Choices"],
    [511, "Network Authentication Required"],
    [204, "No Content"],
    [203, "Non Authoritative Information"],
    [406, "Not Acceptable"],
    [404, "Not Found"],
    [501, "Not Implemented"],
    [304, "Not Modified"],
    [200, "OK"],
    [206, "Partial Content"],
    [402, "Payment Required"],
    [308, "Permanent Redirect"],
    [412, "Precondition Failed"],
    [428, "Precondition Required"],
    [102, "Processing"],
    [103, "Early Hints"],
    [426, "Upgrade Required"],
    [407, "Proxy Authentication Required"],
    [431, "Request Header Fields Too Large"],
    [408, "Request Timeout"],
    [413, "Request Entity Too Large"],
    [414, "Request-URI Too Long"],
    [416, "Requested Range Not Satisfiable"],
    [205, "Reset Content"],
    [303, "See Other"],
    [503, "Service Unavailable"],
    [101, "Switching Protocols"],
    [307, "Temporary Redirect"],
    [429, "Too Many Requests"],
    [401, "Unauthorized"],
    [451, "Unavailable For Legal Reasons"],
    [422, "Unprocessable Entity"],
    [415, "Unsupported Media Type"],
    [305, "Use Proxy"],
    [421, "Misdirected Request"]
])

export class NetworkUtils {
    private static readonly grpcStatusCodes = Object.values(GrpcStatusCode)

    private static readonly httpStatusCodeToGrpcCode: Record<number, GrpcStatusCode> = {
        [HttpStatusCode.PROCESSING]: GrpcStatusCode.OK,
        [HttpStatusCode.OK]: GrpcStatusCode.OK,
        [HttpStatusCode.CREATED]: GrpcStatusCode.OK,
        [HttpStatusCode.ACCEPTED]: GrpcStatusCode.OK,
        [HttpStatusCode.NO_CONTENT]: GrpcStatusCode.OK,
        [HttpStatusCode.PARTIAL_CONTENT]: GrpcStatusCode.OK,
        [HttpStatusCode.BAD_REQUEST]: GrpcStatusCode.INVALID_ARGUMENT,
        [HttpStatusCode.UNPROCESSABLE_ENTITY]: GrpcStatusCode.INVALID_ARGUMENT,
        [HttpStatusCode.UNAUTHORIZED]: GrpcStatusCode.UNAUTHENTICATED,
        [HttpStatusCode.FORBIDDEN]: GrpcStatusCode.PERMISSION_DENIED,
        [HttpStatusCode.NOT_FOUND]: GrpcStatusCode.NOT_FOUND,
        [HttpStatusCode.REQUEST_TIMEOUT]: GrpcStatusCode.DEADLINE_EXCEEDED,
        [HttpStatusCode.TOO_MANY_REQUESTS]: GrpcStatusCode.RESOURCE_EXHAUSTED,
        [HttpStatusCode.INTERNAL_SERVER_ERROR]: GrpcStatusCode.INTERNAL,
        [HttpStatusCode.NOT_IMPLEMENTED]: GrpcStatusCode.UNIMPLEMENTED,
        [HttpStatusCode.BAD_GATEWAY]: GrpcStatusCode.UNAVAILABLE,
        [HttpStatusCode.SERVICE_UNAVAILABLE]: GrpcStatusCode.UNAVAILABLE,
        [HttpStatusCode.GATEWAY_TIMEOUT]: GrpcStatusCode.DEADLINE_EXCEEDED,
    }

    /**
     * @see https://gist.github.com/hamakn/708b9802ca845eb59f3975dbb3ae2a01
     */
    private static readonly grpcCodeToHttpStatusCode: Record<GrpcStatusCode, number> = {
        [GrpcStatusCode.OK]: HttpStatusCode.OK,
        [GrpcStatusCode.CANCELLED]: 499,
        [GrpcStatusCode.UNKNOWN]: HttpStatusCode.INTERNAL_SERVER_ERROR,
        [GrpcStatusCode.INVALID_ARGUMENT]: HttpStatusCode.BAD_REQUEST,
        [GrpcStatusCode.DEADLINE_EXCEEDED]: HttpStatusCode.GATEWAY_TIMEOUT,
        [GrpcStatusCode.NOT_FOUND]: HttpStatusCode.NOT_FOUND,
        [GrpcStatusCode.ALREADY_EXISTS]: HttpStatusCode.CONFLICT,
        [GrpcStatusCode.PERMISSION_DENIED]: HttpStatusCode.FORBIDDEN,
        [GrpcStatusCode.RESOURCE_EXHAUSTED]: HttpStatusCode.TOO_MANY_REQUESTS,
        [GrpcStatusCode.FAILED_PRECONDITION]: HttpStatusCode.BAD_REQUEST,
        [GrpcStatusCode.ABORTED]: HttpStatusCode.CONFLICT,
        [GrpcStatusCode.OUT_OF_RANGE]: HttpStatusCode.BAD_REQUEST,
        [GrpcStatusCode.UNIMPLEMENTED]: HttpStatusCode.NOT_IMPLEMENTED,
        [GrpcStatusCode.INTERNAL]: HttpStatusCode.INTERNAL_SERVER_ERROR,
        [GrpcStatusCode.UNAVAILABLE]: HttpStatusCode.SERVICE_UNAVAILABLE,
        [GrpcStatusCode.DATA_LOSS]: HttpStatusCode.INTERNAL_SERVER_ERROR,
        [GrpcStatusCode.UNAUTHENTICATED]: HttpStatusCode.UNAUTHORIZED,
    }

    static isHttpCode(code: number | undefined): boolean {
        if (typeof code !== 'number') {
            return false
        }

        // do not delete. This will perform faster check than map lookup
        if (code < 100 || code >= 600) {
            return false
        }

        return statusCodeToReasonPhraseMap.has(code)
    }

    static isGrpcCode(code: number | undefined): boolean {
        if (typeof code !== 'number') {
            return false
        }

        return this.grpcStatusCodes.includes(code)
    }

    static getHttpStatusCodeByGrpcCode(code: GrpcStatusCode): number {
        return this.grpcCodeToHttpStatusCode[code] ?? HttpStatusCode.INTERNAL_SERVER_ERROR
    }

    static getGrpcCodeByHttpStatusCode(code: number): GrpcStatusCode {
        return this.httpStatusCodeToGrpcCode[code] ?? GrpcStatusCode.UNKNOWN
    }
}
