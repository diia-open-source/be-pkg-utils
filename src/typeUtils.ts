/* eslint-disable @typescript-eslint/no-explicit-any */
export const TypeUtils = {
    isObject(value: any): boolean {
        return value && typeof value === 'object' && value.constructor === Object
    },

    isArray(value: any): boolean {
        return value && typeof value === 'object' && value.constructor === Array
    },

    isBuffer(value: any): boolean {
        return value && (value.type === 'Buffer' || Buffer.isBuffer(value))
    },
}
