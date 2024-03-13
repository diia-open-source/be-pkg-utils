export class TypeUtils {
    static isObject(value: any): boolean {
        return value && typeof value === 'object' && value.constructor === Object
    }

    static isArray(value: any): boolean {
        return Array.isArray(value)
    }

    static isBuffer(value: any): boolean {
        return value && (value.type === 'Buffer' || Buffer.isBuffer(value))
    }
}
