import { GrpcStatusCode, HttpStatusCode } from '@diia-inhouse/types'

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

        if (code >= 100 && code < 600) {
            return true
        }

        return false
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
