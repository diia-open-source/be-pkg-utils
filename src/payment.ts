import { ApplicationUtils } from './applicationUtils.js'

// oxlint-disable-next-line typescript/no-extraneous-class
export class PaymentUtils {
    private static readonly config = {
        defaultMinCommission: 1,
        commissionPercent: 1.5,
    }

    static getPaymentPayCommission(amount: number): number {
        const { commissionPercent, defaultMinCommission } = this.config

        const rawAmount = Math.ceil(amount * commissionPercent)
        const rawCommission = rawAmount / 100

        const commission = Math.max(rawCommission, defaultMinCommission)

        return ApplicationUtils.toDecimalPlaces(commission, 2)
    }

    static getPaymentTotalAmount(amount: number, commission: number): number {
        return ApplicationUtils.toDecimalPlaces(amount + commission, 2)
    }
}
