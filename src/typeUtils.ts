import { isObject } from 'lodash'

export class TypeUtils {
    static isObject(value: any): boolean {
        return isObject(value)
    }

    static isArray(value: any): boolean {
        return Array.isArray(value)
    }

    static isBuffer(value: any): boolean {
        return Buffer.isBuffer(value)
    }
}
