import { BadRequestError, UnauthorizedError } from '@diia-inhouse/errors'
import { TokenData, VerifiedBaseTokenData } from '@diia-inhouse/types'

import { AssertsContainer } from './interfaces/asserts'

export const Asserts: AssertsContainer = {
    isRefreshTokenExists(tokenData: TokenData): asserts tokenData is VerifiedBaseTokenData<TokenData> {
        if (!tokenData.refreshToken) {
            throw new UnauthorizedError('RefreshToken does not exists')
        }
    },

    assertObjectHasOnlyOneOf<T extends object>(object: T, ...keys: (keyof T)[]): void | never {
        if (keys.filter((key) => key in object).length > 1) {
            throw new BadRequestError(`Expected to have only one of [${keys.join(', ')}]`)
        }

        if (!keys.some((key) => key in object)) {
            throw new BadRequestError(`Expected to have one of [${keys.join(', ')}]`)
        }
    },
}
