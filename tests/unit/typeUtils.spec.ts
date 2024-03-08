import { TypeUtils } from '../../src'

describe('TypeUtils', () => {
    it('should return true for object', () => {
        const obj = {}

        expect(TypeUtils.isObject(obj)).toBeTruthy()
    })

    it('should return true for array', () => {
        const arr: never[] = []

        expect(TypeUtils.isArray(arr)).toBeTruthy()
    })

    it('should return true for Buffer', () => {
        const buff = Buffer.from('test')

        expect(TypeUtils.isBuffer(buff)).toBeTruthy()
    })

    it.each([
        ['array', []],
        ['buffer', Buffer.from('test')],
    ])('isObject should return false for %s', (_type, value) => {
        const result = TypeUtils.isObject(value)

        expect(result).toBeFalsy()
    })
    it.each([
        ['object', {}],
        ['buffer', Buffer.from('test')],
    ])('isArray should return false for %s', (_type, value) => {
        const result = TypeUtils.isArray(value)

        expect(result).toBeFalsy()
    })
    it.each([
        ['object', {}],
        ['array', []],
    ])('isBuffer should return false for %s', (_type, value) => {
        const result = TypeUtils.isBuffer(value)

        expect(result).toBeFalsy()
    })
})
