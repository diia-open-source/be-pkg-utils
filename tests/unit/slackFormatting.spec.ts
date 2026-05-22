import { describe, expect, it } from 'vitest'

import { SlackFormattingUtils } from '../../src'

describe('SlackFormattingUtils', () => {
    describe('getValue', () => {
        const utils = new SlackFormattingUtils()

        it('should return formatted value with green circle by default', () => {
            const result = utils.getValue('Test', 'value')

            expect(result).toEqual([
                { type: 'emoji', name: 'large_green_circle' },
                { type: 'text', text: ' Test: ', style: { bold: true } },
                { type: 'text', text: 'value\n', style: { code: true } },
            ])
        })

        it('should return formatted value with red circle when isError is true', () => {
            const result = utils.getValue('Test', 'error', { isError: true })

            expect(result).toEqual([
                { type: 'emoji', name: 'red_circle' },
                { type: 'text', text: ' Test: ', style: { bold: true } },
                { type: 'text', text: 'error\n', style: { code: true } },
            ])
        })

        it('should handle undefined value with red circle by default', () => {
            const result = utils.getValue('Test', undefined)

            expect(result).toEqual([
                { type: 'emoji', name: 'red_circle' },
                { type: 'text', text: ' Test:', style: { bold: true } },
                { type: 'text', text: ' -\n' },
            ])
        })

        it('should handle undefined value with green circle when isError is true', () => {
            const result = utils.getValue('Test', undefined, { isError: true })

            expect(result).toEqual([
                { type: 'emoji', name: 'large_green_circle' },
                { type: 'text', text: ' Test:', style: { bold: true } },
                { type: 'text', text: ' -\n' },
            ])
        })

        it('should handle zero value with green circle even when isError is true', () => {
            const result = utils.getValue('Test', 0, { isError: true })

            expect(result).toEqual([
                { type: 'emoji', name: 'large_green_circle' },
                { type: 'text', text: ' Test: ', style: { bold: true } },
                { type: 'text', text: '0\n', style: { code: true } },
            ])
        })

        it('should handle numeric values', () => {
            const result = utils.getValue('Test', 123)

            expect(result).toEqual([
                { type: 'emoji', name: 'large_green_circle' },
                { type: 'text', text: ' Test: ', style: { bold: true } },
                { type: 'text', text: '123\n', style: { code: true } },
            ])
        })
    })
})
