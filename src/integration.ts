export class IntegrationUtils {
    static getRetryDelay(retry: number, timeLeft: number, initDelay: number, maxDelay: number, multiplier: number): number {
        const delay = Math.min(initDelay * Math.pow(multiplier, retry), maxDelay)

        return Math.min(delay, timeLeft)
    }
}
