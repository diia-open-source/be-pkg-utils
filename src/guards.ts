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

export class Guards {
    static isError(value: unknown): value is Error {
        return value instanceof Error
    }

    static apiError(err: Error): err is ApiError {
        return err instanceof ApiError
    }

    static isUserSession(session: ActionSession | undefined): session is UserSession {
        if (!session) {
            return false
        }

        return (<UserSession>session).user !== undefined
    }

    static isAcquirerSession(session: ActionSession | undefined): session is AcquirerSession {
        if (!session) {
            return false
        }

        return (<AcquirerSession>session).acquirer !== undefined
    }

    static isServiceEntranceSession(session: ActionSession | undefined): session is ServiceEntranceSession {
        if (!session) {
            return false
        }

        return (<ServiceEntranceSession>session).entrance !== undefined
    }

    static hasOnInitHook(instance: unknown): instance is OnInit {
        return isFunction((<OnInit>instance)?.onInit)
    }

    static hasOnHealthCheckHook(instance: unknown): instance is OnHealthCheck {
        return isFunction((<OnHealthCheck>instance)?.onHealthCheck)
    }

    static hasOnDestroyHook(instance: unknown): instance is OnDestroy {
        return isFunction((<OnDestroy>instance)?.onDestroy)
    }

    static hasOnRegistrationsFinishedHook(instance: unknown): instance is OnRegistrationsFinished {
        return isFunction((<OnRegistrationsFinished>instance)?.onRegistrationsFinished)
    }

    static hasOnBeforeApplicationShutdownHook(instance: unknown): instance is OnBeforeApplicationShutdown {
        return isFunction((<OnBeforeApplicationShutdown>instance)?.onBeforeApplicationShutdown)
    }

    static isSettledError(value: PromiseSettledResult<unknown>): value is PromiseRejectedResult {
        if (value.status === 'rejected') {
            return true
        }

        return false
    }
}
