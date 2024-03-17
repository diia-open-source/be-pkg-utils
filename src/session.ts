import { DiiaOfficeStatus, EResidentSession, ProfileFeature, UserFeatures, UserSession } from '@diia-inhouse/types'

export function profileFeaturesToList(features: UserFeatures): ProfileFeature[] {
    const featuresList: ProfileFeature[] = []

    Object.entries(features).forEach(([key, value]: [string, unknown]) => {
      if (!value) return
      if (feature !== ProfileFeature.office) {
        featuresList.push(true)
        return
      }

      featuresList.push(value?.status === DiiaOfficeStatus.ACTIVE)
    });

    return featuresList
}

export function extractProfileFeatures(session: UserSession | EResidentSession): ProfileFeature[] {
    if (!('features' in session) || !session.features) {
        return []
    }

    return profileFeaturesToList(session.features)
}
