import { ApplicationUtils } from './applicationUtils'

export const PdfUtils = {
    getPdfFileName(name: string, id: string, requestDateTime?: string): string {
        return `${ApplicationUtils.getFileName(name, id, requestDateTime)}.pdf`
    },
}
