import { DiiaOfficeStatus, EResidentSession, ProfileFeature, UserFeatures, UserSession } from '@diia-inhouse/types'

export function profileFeaturesToList(features: UserFeatures): ProfileFeature[] {
    return Object.entries(features).reduce((acc: ProfileFeature[], [feature, value]: [string, any]) => {
        if (!value) return acc
        if (feature !== ProfileFeature.office || value.status === DiiaOfficeStatus.ACTIVE) {
            acc.push(feature as ProfileFeature)
        }
        return acc
    }, [])
}

export function extractProfileFeatures(session: UserSession | EResidentSession): ProfileFeature[] {
    if (!('features' in session) || !session.features) {
        return []
    }

    return profileFeaturesToList(session.features)
}
