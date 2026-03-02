import type { RichTextElement, RichTextEmoji } from '@slack/types'

import { GetListValueOptions } from './interfaces/slack'

export class SlackFormattingUtils {
    readonly greenCircleEmoji: RichTextEmoji = { type: 'emoji', name: 'large_green_circle' }
    readonly redCircleEmoji: RichTextEmoji = { type: 'emoji', name: 'red_circle' }

    getValue(name: string, value: string | number | undefined, { isError }: GetListValueOptions = {}): RichTextElement[] {
        const isZero = value === 0
        if (value === undefined) {
            return [
                isError ? this.greenCircleEmoji : this.redCircleEmoji,
                { type: 'text', text: ` ${name}:`, style: { bold: true } },
                { type: 'text', text: ' -\n' },
            ]
        }

        return [
            isError && !isZero ? this.redCircleEmoji : this.greenCircleEmoji,
            { type: 'text', text: ` ${name}: `, style: { bold: true } },
            { type: 'text', text: `${value}\n`, style: { code: true } },
        ]
    }
}
