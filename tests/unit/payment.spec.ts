import { describe, expect, it } from 'vitest'

import { PaymentUtils } from '../../src/payment'

describe('Payment utils', () => {
    describe('getPaymentPayCommission', () => {
        it('should return calculated commission', () => {
            const amount = 100

            const commission = PaymentUtils.getPaymentPayCommission(amount)

            expect(commission).toBe(1.5)
        })

        it('should return min commission if calculated less then min', () => {
            const amount = 1

            const commission = PaymentUtils.getPaymentPayCommission(amount)

            expect(commission).toBe(1)
        })
    })

    describe('getPaymentTotalAmount', () => {
        it('should return sum of amount and commission', () => {
            const amount = 0.2
            const commission = 0.1

            const total = PaymentUtils.getPaymentTotalAmount(amount, commission)

            expect(total).toBe(0.3)
        })
    })
})
