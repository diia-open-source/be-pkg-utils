import { isFunction } from 'lodash'

import { ApiError } from '@diia-inhouse/errors'
import {
    AcquirerSession,
    ActionSession,
    OnBeforeApplicationShutdown,
    OnDestroy,
    OnHealthCheck,
    OnInit,
    OnRegistrationsFinished,
    ServiceEntranceSession,
    UserSession,
} from '@diia-inhouse/types'

export const Guards = {
    isError(value: unknown): value is Error {
        return value instanceof Error
    },

    apiError(err: Error): err is ApiError {
        return err instanceof ApiError
    },

    isUserSession(session: ActionSession | undefined): session is UserSession {
        if (!session) {
            return false
        }

        return (session as UserSession).user !== undefined
    },

    isAcquirerSession(session: ActionSession | undefined): session is AcquirerSession {
        if (!session) {
            return false
        }

        return (session as AcquirerSession).acquirer !== undefined
    },

    isServiceEntranceSession(session: ActionSession | undefined): session is ServiceEntranceSession {
        if (!session) {
            return false
        }

        return (session as ServiceEntranceSession).entrance !== undefined
    },

    hasOnInitHook(instance: unknown): instance is OnInit {
        return isFunction((instance as OnInit)?.onInit)
    },

    hasOnHealthCheckHook(instance: unknown): instance is OnHealthCheck {
        return isFunction((instance as OnHealthCheck)?.onHealthCheck)
    },

    hasOnDestroyHook(instance: unknown): instance is OnDestroy {
        return isFunction((instance as OnDestroy)?.onDestroy)
    },

    hasOnRegistrationsFinishedHook(instance: unknown): instance is OnRegistrationsFinished {
        return isFunction((instance as OnRegistrationsFinished)?.onRegistrationsFinished)
    },

    hasOnBeforeApplicationShutdownHook(instance: unknown): instance is OnBeforeApplicationShutdown {
        return isFunction((instance as OnBeforeApplicationShutdown)?.onBeforeApplicationShutdown)
    },

    isSettledError(value: PromiseSettledResult<unknown>): value is PromiseRejectedResult {
        return value.status === 'rejected'
    },
}
