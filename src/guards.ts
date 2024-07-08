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

        return (<UserSession>session).user !== undefined
    },

    isAcquirerSession(session: ActionSession | undefined): session is AcquirerSession {
        if (!session) {
            return false
        }

        return (<AcquirerSession>session).acquirer !== undefined
    },

    isServiceEntranceSession(session: ActionSession | undefined): session is ServiceEntranceSession {
        if (!session) {
            return false
        }

        return (<ServiceEntranceSession>session).entrance !== undefined
    },

    hasOnInitHook(instance: unknown): instance is OnInit {
        return isFunction((<OnInit>instance)?.onInit)
    },

    hasOnHealthCheckHook(instance: unknown): instance is OnHealthCheck {
        return isFunction((<OnHealthCheck>instance)?.onHealthCheck)
    },

    hasOnDestroyHook(instance: unknown): instance is OnDestroy {
        return isFunction((<OnDestroy>instance)?.onDestroy)
    },

    hasOnRegistrationsFinishedHook(instance: unknown): instance is OnRegistrationsFinished {
        return isFunction((<OnRegistrationsFinished>instance)?.onRegistrationsFinished)
    },

    hasOnBeforeApplicationShutdownHook(instance: unknown): instance is OnBeforeApplicationShutdown {
        return isFunction((<OnBeforeApplicationShutdown>instance)?.onBeforeApplicationShutdown)
    },

    isSettledError(value: PromiseSettledResult<unknown>): value is PromiseRejectedResult {
        return value.status === 'rejected'
    },
}
