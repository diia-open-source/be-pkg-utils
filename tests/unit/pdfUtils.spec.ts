import { randomUUID } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { PdfUtils } from '../../src/pdfUtils'

describe('PdfUtils', () => {
    const requestDateTime = new Date().toISOString()

    describe('method getPdfFileName', () => {
        it('should successfully compose and return pdf file name', () => {
            const name = 'document'
            const id = randomUUID()
            const expectedResult = `${[name, id, requestDateTime].join('-')}.pdf`

            expect(PdfUtils.getPdfFileName(name, id, requestDateTime)).toBe(expectedResult)
        })
    })
})
