import { ApplicationUtils } from './applicationUtils.js'

export const PdfUtils = {
    getPdfFileName(name: string, id: string, requestDateTime?: string): string {
        return `${ApplicationUtils.getFileName(name, id, requestDateTime)}.pdf`
    },
}
