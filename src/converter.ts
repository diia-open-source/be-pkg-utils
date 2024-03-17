/* eslint-disable no-continue */
import { ObjectId } from 'bson'
import { cloneDeep, isObject } from 'lodash'

import { ArrayRule, ObjectRule, ValidationSchema, ValidationRule } from '@diia-inhouse/validators'

import { TypeUtils } from './typeUtils'

function convertPrimitiveDueRule(value: unknown, rule: ValidationRule): any {
    if (rule.convert === false || value === null) {
        return value
    }

    if (rule.type === 'objectId') {
        return new ObjectId(<string>value)
    }

    if (rule.type === 'date') {
        return new Date(<string>value)
    }

    if (rule.type === 'number' && rule.convert && rule.convert === true) {
        if (typeof value === 'string') {
            if (rule.integer === true) {
                return parseInt(value, 10)
            }

            return parseFloat(value)
        }
    }

    return value
}

function convertObjectDueRules(params: Record<string, any>, rules: ValidationSchema): void {
    for (const [key, value] of Object.entries(params)) {
        if (rules?.[key]) {
            if (TypeUtils.isBuffer(value)) {
                params[key] = Buffer.from(value)
                continue
            }

            if (TypeUtils.isObject(value)) {
                const rule = (<ObjectRule>rules[key]).props!

                convertObjectDueRules(value, rule)
                continue
            }

            if (TypeUtils.isArray(value)) {
                const rule = <ArrayRule>rules[key]!

                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                convertArrayDueRules(value, rule)
                continue
            }

            if (rules[key]) {
                params[key] = convertPrimitiveDueRule(value, rules[key])
            }
        }
    }
}

function convertArrayDueRules(value: any[], rule: ArrayRule): void {
    if (!rule?.items) {
        return
    }

    const { items } = rule
    if (isObject(items)) {
        if (items.type === 'array') {
            value.forEach((v) => convertArrayDueRules(v, items))
        }

        if (items.type === 'object') {
            value.forEach((v) => convertObjectDueRules(v, items.props!))
        }

        return
    }

    value.forEach((val: any, key: number) => {
        value[key] = convertPrimitiveDueRule(val, items)
    })
}

export function convertParamsByRules(params: Record<string, any>, rules: ValidationSchema): any {
    const cloneParams = cloneDeep(params)

    convertObjectDueRules(cloneParams, rules)

    return cloneParams
}
