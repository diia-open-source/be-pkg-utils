import {
    BirthCertificate,
    DocumentType,
    DriverLicense,
    EducationDocument,
    EducationDocumentType,
    ForeignPassport,
    GenericData,
    InternalPassport,
    OwnerType,
    PensionCard,
    RefInternallyDisplacedPerson,
    ResidencePermit,
    RowType,
    StudentCard,
    StudentCardType,
    TaxpayerCard,
    TextBlock,
    VehicleLicense,
} from '@diia-inhouse/types'

import { ApplicationUtils } from './applicationUtils'
import EducationDocumentService from './educationDocument'

export class PdfUtils {
    static getPdfFileName(name: string, id: string, requestDateTime?: string): string {
        return `${ApplicationUtils.getFileName(name, id, requestDateTime)}.pdf`
    }

    static getSharingRenderDataByDocumentType(
        documentType: DocumentType,
        data: unknown,
        requester: string,
        requestDateTime: string,
        requestIdentifier: string,
    ): GenericData {
        switch (documentType) {
            case DocumentType.DriverLicense:
                return PdfUtils.getDriverLicenseSharingRenderData(<DriverLicense>data, requester, requestDateTime, requestIdentifier)
            case DocumentType.VehicleLicense:
                return PdfUtils.getVehicleLicenseSharingRenderData(<VehicleLicense>data, requester, requestDateTime, requestIdentifier)
            case DocumentType.StudentIdCard:
                return PdfUtils.getStudentIdCardSharingRenderData(<StudentCard>data, requester, requestDateTime, requestIdentifier)
            case DocumentType.ForeignPassport:
                return PdfUtils.getForeignPassportSharingRenderData(<ForeignPassport>data, requester, requestDateTime, requestIdentifier)
            case DocumentType.ResidencePermitPermanent:
                return PdfUtils.getResidencePermitPermanentSharingRenderData(
                    <ResidencePermit>data,
                    requester,
                    requestDateTime,
                    requestIdentifier,
                )
            case DocumentType.TaxpayerCard:
                return PdfUtils.getTaxpayerCardSharingRenderData(<TaxpayerCard>data, requester, requestDateTime, requestIdentifier)
            case DocumentType.RefInternallyDisplacedPerson:
                return this.getRefInternallyDisplacedPersonSharingRenderData(
                    <RefInternallyDisplacedPerson>data,
                    requester,
                    requestDateTime,
                    requestIdentifier,
                )
            case DocumentType.BirthCertificate:
                return PdfUtils.getBirthCertificateSharingRenderData(<BirthCertificate>data, requester, requestDateTime, requestIdentifier)
            case DocumentType.InternalPassport:
                return PdfUtils.getInternalPassportSharingRenderData(<InternalPassport>data, requester, requestDateTime, requestIdentifier)
            case DocumentType.PensionCard:
                return PdfUtils.getPensionCardSharingRenderData(<PensionCard>data, requester, requestDateTime, requestIdentifier)
            case DocumentType.EducationDocument:
                return PdfUtils.getEducationDocumentSharingRenderData(
                    <EducationDocument>data,
                    requester,
                    requestDateTime,
                    requestIdentifier,
                )
            default: {
                throw new TypeError(`Unknown scope ${documentType}`)
            }
        }
    }

    private static getDriverLicenseSharingRenderData(
        document: DriverLicense,
        requester: string,
        requestDateTime: string,
        requestIdentifier: string,
    ): GenericData {
        const { lastNameEN, firstNameEN, lastNameUA, firstNameUA, middleNameUA, docNumber, photo, eng, ua } = document

        return {
            documentTitle: 'Driver License',
            blocks: [
                {
                    logoBlock: {
                        header: 'Driving Licence',
                        title: ApplicationUtils.getDocumentName(DocumentType.DriverLicense),
                        subtitle: 'Ukraine • Україна',
                    },
                    marginBottom: 16,
                },
                { hasSeparator: true, marginBottom: 24 },
                {
                    identityBlock: {
                        lastName: lastNameEN,
                        firstName: firstNameEN,
                        fullName: ApplicationUtils.getFullName(lastNameUA, firstNameUA, middleNameUA),
                        documentNumber: docNumber,
                        photo,
                    },
                    marginBottom: 0,
                },
                { hasSeparator: true, marginBottom: 16 },
                {
                    textBlock: [
                        `The digital document copy requested on ${requestDateTime}`,
                        `Request initiator: ${requester}`,
                        `Request ID: ${requestIdentifier}`,
                    ],
                },
                {
                    tableBlock: [
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.lastName?.code },
                            { primaryText: eng?.lastName?.name, secondaryText: ua?.lastName?.name },
                            { primaryText: eng?.lastName?.value, secondaryText: ua?.lastName?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.firstName?.code },
                            { primaryText: eng?.firstName?.name, secondaryText: ua?.firstName?.name },
                            { primaryText: eng?.firstName?.value, secondaryText: ua?.firstName?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.birth?.code },
                            { primaryText: eng?.birth?.name, secondaryText: ua?.birth?.name },
                            { primaryText: eng?.birth?.value?.split('\n')?.[0], secondaryText: ua?.birth?.value?.split('\n')?.[1] },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.issueDate?.code },
                            { primaryText: eng?.issueDate?.name, secondaryText: ua?.issueDate?.name },
                            { primaryText: eng?.issueDate?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.expiryDate?.code },
                            { primaryText: eng?.expiryDate?.name, secondaryText: ua?.expiryDate?.name },
                            { primaryText: eng?.expiryDate?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.department?.code },
                            { primaryText: eng?.department?.name, secondaryText: ua?.department?.name },
                            { primaryText: eng?.department?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.identifier?.code },
                            { primaryText: eng?.identifier?.name, secondaryText: ua?.identifier?.name },
                            { primaryText: eng?.identifier?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.documentNumber?.code },
                            { primaryText: eng?.documentNumber?.name, secondaryText: ua?.documentNumber?.name },
                            { primaryText: eng?.documentNumber?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.category?.code },
                            { primaryText: eng?.category?.name, secondaryText: ua?.category?.name },
                            { primaryText: eng?.category?.value?.split('\n') },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.categoryOpeningDate?.code },
                            { primaryText: eng?.categoryOpeningDate?.name, secondaryText: ua?.categoryOpeningDate?.name },
                            { primaryText: eng?.categoryOpeningDate?.value?.split('\n') },
                        ],
                    ],
                },
            ],
        }
    }

    private static getVehicleLicenseSharingRenderData(
        document: VehicleLicense,
        requester: string,
        requestDateTime: string,
        requestIdentifier: string,
    ): GenericData {
        const { lastNameEN, firstNameEN, lastNameUA, firstNameUA, middleNameUA, licensePlate, brand, model, eng, ua, ownerType } = document

        return {
            documentTitle: 'Vehicle registration certificate',
            blocks: [
                {
                    logoBlock: {
                        header: 'Vehicle Registration Certificate',
                        title: 'Cвідоцтво про реєстрацію транспортного засобу',
                        subtitle: 'Ukraine • Україна',
                    },
                    marginBottom: 24,
                },
                { hasSeparator: true, marginBottom: 24 },
                {
                    identityBlock: {
                        lastName: lastNameEN,
                        firstName: firstNameEN,
                        fullName: ApplicationUtils.getFullName(lastNameUA, firstNameUA, middleNameUA),
                        documentNumber: licensePlate,
                        documentDetail: [brand, model].join(' ').trim(),
                    },
                    marginBottom: 16,
                },
                { hasSeparator: true, marginBottom: 16 },
                {
                    textBlock: [
                        `The digital document copy requested on ${requestDateTime}`,
                        `Request initiator: ${requester}`,
                        `Request ID: ${requestIdentifier}`,
                    ],
                },
                {
                    tableBlock: [
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.licensePlate?.code },
                            { primaryText: eng?.licensePlate?.name, secondaryText: ua?.licensePlate?.name },
                            { primaryText: ua?.licensePlate?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.firstRegistrationDate?.code },
                            { primaryText: eng?.firstRegistrationDate?.name, secondaryText: ua?.firstRegistrationDate?.name },
                            { primaryText: ua?.firstRegistrationDate?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.makeYear?.code },
                            { primaryText: eng?.makeYear?.name, secondaryText: ua?.makeYear?.name },
                            { primaryText: ua?.makeYear?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.registrationDate?.code },
                            { primaryText: eng?.registrationDate?.name, secondaryText: ua?.registrationDate?.name },
                            { primaryText: ua?.registrationDate?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            {},
                            { primaryText: eng?.documentNumber?.name, secondaryText: ua?.documentNumber?.name },
                            { primaryText: ua?.documentNumber?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            {},
                            { primaryText: eng?.department?.name, secondaryText: ua?.department?.name },
                            { primaryText: ua?.department?.value },
                        ],
                    ],
                },
                {
                    tableBlock: <[RowType, TextBlock?, TextBlock?, TextBlock?][]>[
                        [
                            RowType.OneColumn,
                            {
                                primaryText: { content: 'Ownership', fontSize: 18, marginBottom: 0 },
                                secondaryText: { content: 'Право власності', fontSize: 14, marginBottom: 24 },
                            },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.lastName?.code },
                            { primaryText: eng?.lastName?.name, secondaryText: ua?.lastName?.name },
                            { primaryText: eng?.lastName?.value, secondaryText: ua?.lastName?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.firstName?.code },
                            { primaryText: eng?.firstName?.name, secondaryText: ua?.firstName?.name },
                            { primaryText: eng?.firstName?.value, secondaryText: ua?.firstName?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.address?.code },
                            { primaryText: eng?.address?.name, secondaryText: ua?.address?.name },
                            { primaryText: ua?.address?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.ownership?.code },
                            { primaryText: eng?.ownership?.name, secondaryText: ua?.ownership?.name },
                            { primaryText: ua?.ownership?.value },
                        ],
                        ownerType === OwnerType.owner &&
                            eng?.properUser &&
                            ua?.properUser && [
                                RowType.ThreeColumns,
                                {},
                                { primaryText: eng?.properUser?.name, secondaryText: ua?.properUser?.name },
                                { primaryText: eng?.properUser?.value, secondaryText: ua?.properUser?.value },
                            ],
                        eng?.properUserExpirationDate &&
                            ua?.properUserExpirationDate && [
                                RowType.ThreeColumns,
                                {},
                                { primaryText: eng?.properUserExpirationDate?.name, secondaryText: ua?.properUserExpirationDate?.name },
                                { primaryText: ua?.properUserExpirationDate?.value },
                            ],
                    ].filter(Boolean),
                },
                {
                    tableBlock: [
                        [
                            RowType.OneColumn,
                            {
                                primaryText: { content: 'Vehicle', fontSize: 18, marginBottom: 0 },
                                secondaryText: { content: 'Транспортний засіб', fontSize: 14, marginBottom: 24 },
                            },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.brand?.code },
                            { primaryText: eng?.brand?.name, secondaryText: ua?.brand?.name },
                            { primaryText: ua?.brand?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.model?.code },
                            { primaryText: eng?.model?.name, secondaryText: ua?.model?.name },
                            { primaryText: ua?.model?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.vin?.code },
                            { primaryText: eng?.vin?.name, secondaryText: ua?.vin?.name },
                            { primaryText: ua?.vin?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.totalWeight?.code },
                            { primaryText: eng?.totalWeight?.name, secondaryText: ua?.totalWeight?.name },
                            { primaryText: ua?.totalWeight?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.ownWeight?.code },
                            { primaryText: eng?.ownWeight?.name, secondaryText: ua?.ownWeight?.name },
                            { primaryText: ua?.ownWeight?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.rankCategory?.code },
                            { primaryText: eng?.rankCategory?.name, secondaryText: ua?.rankCategory?.name },
                            { primaryText: ua?.rankCategory?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.capacity?.code },
                            { primaryText: eng?.capacity?.name, secondaryText: ua?.capacity?.name },
                            { primaryText: ua?.capacity?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.fuel?.code },
                            { primaryText: eng?.fuel?.name, secondaryText: ua?.fuel?.name },
                            { primaryText: ua?.fuel?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.color?.code },
                            { primaryText: eng?.color?.name, secondaryText: ua?.color?.name },
                            { primaryText: ua?.color?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.nseating?.code },
                            { primaryText: eng?.nseating?.name, secondaryText: ua?.nseating?.name },
                            { primaryText: ua?.nseating?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.nstandup?.code },
                            { primaryText: eng?.nstandup?.name, secondaryText: ua?.nstandup?.name },
                            { primaryText: ua?.nstandup?.value },
                        ],
                        [
                            RowType.ThreeColumns,
                            { primaryText: eng?.kindBody?.code },
                            { primaryText: eng?.kindBody?.name, secondaryText: ua?.kindBody?.name },
                            { primaryText: ua?.kindBody?.value },
                        ],
                    ],
                },
            ],
        }
    }

    private static getStudentIdCardSharingRenderData(
        document: StudentCard,
        requester: string,
        requestDateTime: string,
        requestIdentifier: string,
    ): GenericData {
        const {
            docType,
            lastNameUA,
            firstNameUA,
            middleNameUA,
            docNumber,
            photo,
            collegeName,
            facultyName,
            issueDate,
            expirationDate,
            educationType,
        } = document

        return {
            documentTitle: 'Student Card',
            blocks: [
                {
                    logoBlock: { logoHeader: docType === StudentCardType.Pupil ? ['Учнівський', 'квиток'] : ['Студентський', 'квиток'] },
                    marginBottom: 24,
                },
                { hasSeparator: true, marginBottom: 24 },
                {
                    identityBlock: {
                        lastName: lastNameUA,
                        firstName: firstNameUA,
                        middleName: middleNameUA,
                        documentNumber: docNumber,
                        photo,
                    },
                    marginBottom: 16,
                },
                { hasSeparator: true, marginBottom: 16 },
                {
                    textBlock: [
                        `Запит на цифрові копії документів від ${requestDateTime}`,
                        `Ініціатор запиту: ${requester}`,
                        `Ідентифікатор запиту: ${requestIdentifier}`,
                    ],
                    marginBottom: 32,
                },
                {
                    tableBlock: [
                        [RowType.TwoColumns, { primaryText: 'Навчальний заклад:' }, { primaryText: collegeName }],
                        [RowType.TwoColumns, { primaryText: 'Факультет:' }, { primaryText: facultyName }],
                        [RowType.TwoColumns, { primaryText: 'Виданий:' }, { primaryText: issueDate }],
                        [RowType.TwoColumns, { primaryText: 'Дійсний до:' }, { primaryText: expirationDate }],
                        [RowType.TwoColumns, { primaryText: 'Форма навчання:' }, { primaryText: educationType }],
                    ],
                },
            ],
        }
    }

    private static getForeignPassportSharingRenderData(
        document: ForeignPassport,
        requester: string,
        requestDateTime: string,
        requestIdentifier: string,
    ): GenericData {
        const { lastNameEN, firstNameEN, lastNameUA, firstNameUA, middleNameUA, docNumber, photo, sign, eng, ua } = document

        return {
            documentTitle: 'International Passport',
            blocks: [
                {
                    logoBlock: {
                        header: 'International Passport',
                        title: 'Закордонний паспорт',
                        subtitle: 'Ukraine • Україна',
                    },
                    marginBottom: 24,
                },
                { hasSeparator: true, marginBottom: 24 },
                {
                    identityBlock: {
                        lastName: lastNameEN,
                        firstName: firstNameEN,
                        fullName: ApplicationUtils.getFullName(lastNameUA, firstNameUA, middleNameUA),
                        documentNumber: docNumber,
                        photo,
                    },
                    marginBottom: 16,
                },
                { hasSeparator: true, marginBottom: 16 },
                {
                    textBlock: [
                        `The digital document copy requested on ${requestDateTime}`,
                        `Request initiator: ${requester}`,
                        `Request ID: ${requestIdentifier}`,
                    ],
                },
                {
                    tableBlock: [
                        [
                            RowType.TwoColumns,
                            { primaryText: eng?.gender?.name, secondaryText: ua?.gender?.name },
                            { primaryText: eng?.gender?.value, secondaryText: ua?.gender?.value },
                        ],
                        [
                            RowType.TwoColumns,
                            { primaryText: eng?.birthDate?.name, secondaryText: ua?.birthDate?.name },
                            { primaryText: eng?.birthDate?.value },
                        ],
                        [
                            RowType.TwoColumns,
                            { primaryText: eng?.nationality?.name, secondaryText: ua?.nationality?.name },
                            { primaryText: eng?.nationality?.value, secondaryText: ua?.nationality?.value },
                        ],
                        [
                            RowType.TwoColumns,
                            { primaryText: eng?.department?.name, secondaryText: ua?.department?.name },
                            { primaryText: eng?.department?.value },
                        ],
                        [
                            RowType.TwoColumns,
                            { primaryText: eng?.issueDate?.name, secondaryText: ua?.issueDate?.name },
                            { primaryText: eng?.issueDate?.value },
                        ],
                        [
                            RowType.TwoColumns,
                            { primaryText: eng?.expiryDate?.name, secondaryText: ua?.expiryDate?.name },
                            { primaryText: eng?.expiryDate?.value },
                        ],
                        [
                            RowType.TwoColumns,
                            { primaryText: eng?.identifier?.name, secondaryText: ua?.identifier?.name },
                            { primaryText: eng?.identifier?.value },
                        ],
                        [
                            RowType.TwoColumns,
                            { primaryText: eng?.type?.name, secondaryText: ua?.type?.name },
                            { primaryText: eng?.type?.value },
                        ],
                        [
                            RowType.TwoColumns,
                            { primaryText: eng?.countryCode?.name, secondaryText: ua?.countryCode?.name },
                            { primaryText: eng?.countryCode?.value },
                        ],
                        [
                            RowType.TwoColumns,
                            { primaryText: eng?.taxpayer?.name, secondaryText: ua?.taxpayer?.name },
                            {
                                primaryText: [eng?.taxpayer?.value || '', eng?.taxpayer?.statusDescription || ''],
                                secondaryText: ua?.taxpayer?.statusDescription,
                            },
                        ],
                        [
                            RowType.TwoColumns,
                            { primaryText: eng?.birthPlace?.name, secondaryText: ua?.birthPlace?.name },
                            { primaryText: `${eng?.birthPlace?.value || ''} • ${ua?.birthPlace?.value || ''}` },
                        ],
                        [
                            RowType.TwoColumns,
                            { primaryText: eng?.residenceRegistrationPlace?.name, secondaryText: ua?.residenceRegistrationPlace?.name },
                            { primaryText: eng?.residenceRegistrationPlace?.value },
                        ],
                        [RowType.TwoColumnsWithSign, { primaryText: 'Підпис:' }, { primaryText: sign }],
                    ],
                },
            ],
        }
    }

    private static getResidencePermitPermanentSharingRenderData(
        document: ResidencePermit,
        requester: string,
        requestDateTime: string,
        requestIdentifier: string,
    ): GenericData {
        const {
            lastNameEN,
            firstNameEN,
            lastNameUA,
            firstNameUA,
            docNumber,
            photo,
            gender,
            nationality,
            birthday,
            birthCountry,
            taxpayerCard,
            registration,
            recordNumber,
            authority,
            issueReason,
            issueDate,
            expirationDate,
        } = document

        return {
            documentTitle: 'Residence permit permanent',
            blocks: [
                { logoBlock: { logoHeader: ['Посвідка на постійне', 'проживання'] }, marginBottom: 24 },
                { hasSeparator: true, marginBottom: 24 },
                {
                    identityBlock: {
                        lastName: lastNameUA,
                        firstName: firstNameUA,
                        fullName: ApplicationUtils.getFullName(lastNameEN, firstNameEN),
                        documentNumber: docNumber,
                        photo,
                    },
                    marginBottom: 16,
                },
                { hasSeparator: true, marginBottom: 16 },
                {
                    textBlock: [
                        `Запит на цифрові копії документів від ${requestDateTime}`,
                        `Ініціатор запиту: ${requester}`,
                        `Ідентифікатор запиту: ${requestIdentifier}`,
                    ],
                    marginBottom: 32,
                },
                {
                    tableBlock: <[RowType, TextBlock?, TextBlock?, TextBlock?][]>(
                        [
                            [RowType.TwoColumns, { primaryText: 'Стать:' }, { primaryText: gender }],
                            [RowType.TwoColumns, { primaryText: 'Громадянство:' }, { primaryText: nationality }],
                            [RowType.TwoColumns, { primaryText: 'Дата народження:' }, { primaryText: birthday }],
                            [RowType.TwoColumns, { primaryText: 'Місце народження:' }, { primaryText: birthCountry }],
                            [RowType.TwoColumns, { primaryText: 'РНОКПП:' }, { primaryText: taxpayerCard?.number }],
                            registration && [
                                RowType.TwoColumns,
                                { primaryText: 'Зареєстроване місце проживання:' },
                                { primaryText: registration.split('\n') },
                            ],
                            [RowType.TwoColumns, { primaryText: 'Номер запису:' }, { primaryText: recordNumber }],
                            [RowType.TwoColumns, { primaryText: 'Орган, що видав:' }, { primaryText: authority }],
                            [RowType.TwoColumns, { primaryText: 'Підстава для отримання:' }, { primaryText: issueReason }],
                            [RowType.TwoColumns, { primaryText: 'Дата видачі:' }, { primaryText: issueDate }],
                            [RowType.TwoColumns, { primaryText: 'Дійсний до:' }, { primaryText: expirationDate }],
                        ].filter(Boolean)
                    ),
                },
            ],
        }
    }

    static getResidencePermitTemporarySharingRenderData(
        document: ResidencePermit,
        requester: string,
        requestDateTime: string,
        requestIdentifier: string,
    ): GenericData {
        const {
            lastNameEN,
            firstNameEN,
            lastNameUA,
            firstNameUA,
            docNumber,
            photo,
            gender,
            nationality,
            birthday,
            birthCountry,
            taxpayerCard,
            registration,
            recordNumber,
            authority,
            issueReason,
            issueDate,
            expirationDate,
        } = document

        return {
            documentTitle: 'Residence permit temporary',
            blocks: [
                { logoBlock: { logoHeader: ['Посвідка на тимчасове', 'проживання'] }, marginBottom: 24 },
                { hasSeparator: true, marginBottom: 24 },
                {
                    identityBlock: {
                        lastName: lastNameUA,
                        firstName: firstNameUA,
                        fullName: ApplicationUtils.getFullName(lastNameEN, firstNameEN),
                        documentNumber: docNumber,
                        photo,
                    },
                    marginBottom: 16,
                },
                { hasSeparator: true, marginBottom: 16 },
                {
                    textBlock: [
                        `Запит на цифрові копії документів від ${requestDateTime}`,
                        `Ініціатор запиту: ${requester}`,
                        `Ідентифікатор запиту: ${requestIdentifier}`,
                    ],
                    marginBottom: 32,
                },
                {
                    tableBlock: <[RowType, TextBlock?, TextBlock?, TextBlock?][]>(
                        [
                            [RowType.TwoColumns, { primaryText: 'Стать:' }, { primaryText: gender }],
                            [RowType.TwoColumns, { primaryText: 'Громадянство:' }, { primaryText: nationality }],
                            [RowType.TwoColumns, { primaryText: 'Дата народження:' }, { primaryText: birthday }],
                            [RowType.TwoColumns, { primaryText: 'Місце народження:' }, { primaryText: birthCountry }],
                            [RowType.TwoColumns, { primaryText: 'РНОКПП:' }, { primaryText: taxpayerCard?.number }],
                            registration && [
                                RowType.TwoColumns,
                                { primaryText: 'Зареєстроване місце проживання:' },
                                { primaryText: registration.split('\n') },
                            ],
                            [RowType.TwoColumns, { primaryText: 'Номер запису:' }, { primaryText: recordNumber }],
                            [RowType.TwoColumns, { primaryText: 'Орган, що видав:' }, { primaryText: authority }],
                            [RowType.TwoColumns, { primaryText: 'Підстава для отримання:' }, { primaryText: issueReason }],
                            [RowType.TwoColumns, { primaryText: 'Дата видачі:' }, { primaryText: issueDate }],
                            [RowType.TwoColumns, { primaryText: 'Дійсний до:' }, { primaryText: expirationDate }],
                        ].filter(Boolean)
                    ),
                },
            ],
        }
    }

    private static getTaxpayerCardSharingRenderData(
        document: TaxpayerCard,
        requester: string,
        requestDateTime: string,
        requestIdentifier: string,
    ): GenericData {
        const { lastNameUA, firstNameUA, middleNameUA, docNumber, birthday, creationDate } = document

        return {
            documentTitle: 'Taxpayer card',
            blocks: [
                { logoBlock: { logoHeader: ['Реєстраційний номер облікової', 'картки платника податків'] }, marginBottom: 24 },
                { hasSeparator: true, marginBottom: 24 },
                { textBlock: { content: docNumber, fontSize: 38 }, marginBottom: 24 },
                { textBlock: ['Верифіковано у реєстрі Державної податкової служби за запитом ', `від ${creationDate}.`], marginBottom: 24 },
                { hasSeparator: true, marginBottom: 24 },
                { textBlock: { content: [lastNameUA, firstNameUA, middleNameUA], fontSize: 24 }, marginBottom: 24 },
                {
                    tableBlock: [[RowType.TwoColumns, { primaryText: 'Дата народження:' }, { primaryText: birthday }]],
                    marginBottom: 12,
                },
                { hasSeparator: true, marginBottom: 16 },
                {
                    textBlock: [
                        `Запит на цифрові копії документів від ${requestDateTime}`,
                        `Ініціатор запиту: ${requester}`,
                        `Ідентифікатор запиту: ${requestIdentifier}`,
                    ],
                },
            ],
        }
    }

    private static getRefInternallyDisplacedPersonSharingRenderData(
        document: RefInternallyDisplacedPerson,
        requester: string,
        requestDateTime: string,
        requestIdentifier: string,
    ): GenericData {
        const { lastName, firstName, middleName, docNumber, issueDate, birthDate, gender, docIdentity, address } = document

        return {
            documentTitle: 'Reference internally displaced person',
            blocks: [
                { logoBlock: { logoHeader: ['Довідка про взяття на облік', 'внутрішньо переміщеної особи'] }, marginBottom: 24 },
                { hasSeparator: true, marginBottom: 24 },
                { textBlock: { content: [lastName, firstName, middleName], fontSize: 24 }, marginBottom: 34 },
                { textBlock: { content: docNumber, fontSize: 38 }, marginBottom: 16 },
                { hasSeparator: true, marginBottom: 16 },
                {
                    textBlock: [
                        `Запит на цифрові копії документів від ${requestDateTime}`,
                        `Ініціатор запиту: ${requester}`,
                        `Ідентифікатор запиту: ${requestIdentifier}`,
                    ],
                    marginBottom: 32,
                },
                {
                    tableBlock: [
                        [RowType.TwoColumns, { primaryText: 'Дата видачі:' }, { primaryText: issueDate }],
                        [RowType.TwoColumns, { primaryText: 'Дата народження:' }, { primaryText: birthDate }],
                        [RowType.TwoColumns, { primaryText: 'Стать:' }, { primaryText: gender }],
                    ],
                    marginBottom: 40,
                },
                {
                    tableBlock: [
                        [RowType.OneColumn, { primaryText: { content: 'Документ, що посвідчує особу', fontSize: 18, marginBottom: 14 } }],
                        [RowType.TwoColumns, { primaryText: 'Серія та номер:' }, { primaryText: docIdentity.number }],
                        [RowType.TwoColumns, { primaryText: 'Дата видачі:' }, { primaryText: docIdentity.issueDate }],
                        [RowType.TwoColumns, { primaryText: 'Ким і коли виданий:' }, { primaryText: docIdentity.department }],
                    ],
                    marginBottom: 40,
                },
                {
                    tableBlock: [
                        [RowType.OneColumn, { primaryText: { content: 'Проживання', fontSize: 18, marginBottom: 14 } }],
                        [RowType.TwoColumns, { primaryText: 'Місце народження:' }, { primaryText: address.birth }],
                        [RowType.TwoColumns, { primaryText: 'Місце реєстрації проживання:' }, { primaryText: address.registration }],
                        [RowType.TwoColumns, { primaryText: 'Фактичне місце проживання/перебування:' }, { primaryText: address.actual }],
                    ],
                    marginBottom: 40,
                },
            ],
        }
    }

    private static getBirthCertificateSharingRenderData(
        document: BirthCertificate,
        requester: string,
        requestDateTime: string,
        requestIdentifier: string,
    ): GenericData {
        const { child, document: doc, parents, act, documents } = document

        return {
            documentTitle: 'Birth certificate',
            blocks: [
                { logoBlock: { logoHeader: ['Відомості актового запису', 'про народження'] }, marginBottom: 24 },
                { hasSeparator: true, marginBottom: 24 },
                { textBlock: { content: [child.lastName, child.firstName, child.middleName], fontSize: 24 }, marginBottom: 24 },
                { hasSeparator: true, marginBottom: 16 },
                {
                    textBlock: [
                        `Запит на цифрові копії документів від ${requestDateTime}`,
                        `Ініціатор запиту: ${requester}`,
                        `Ідентифікатор запиту: ${requestIdentifier}`,
                    ],
                    marginBottom: 32,
                },
                {
                    tableBlock: <[RowType, TextBlock?, TextBlock?, TextBlock?][]>(
                        [
                            [
                                RowType.TwoColumns,
                                { primaryText: 'Стать:' },
                                { primaryText: ApplicationUtils.capitalizeFirstLetter(child.gender) },
                            ],
                            [RowType.TwoColumns, { primaryText: 'Дата народження:' }, { primaryText: child.birthDate }],
                            child.rnokpp && [RowType.TwoColumns, { primaryText: 'РНОКПП:' }, { primaryText: child.rnokpp }],
                            [RowType.TwoColumns, { primaryText: 'Місце народження:' }, { primaryText: child.birthPlace }],
                            child.citizenship && [
                                (RowType.TwoColumns,
                                { primaryText: 'Громадянство/підданство для дитини:' },
                                { primaryText: child.citizenship }),
                            ],
                        ].filter(Boolean)
                    ),
                    marginBottom: 24,
                },
                { hasSeparator: true, marginBottom: 24 },
                { textBlock: { content: 'Інформація про батьків', fontSize: 18 }, marginBottom: 24 },
                {
                    tableBlock: <[RowType, TextBlock?, TextBlock?, TextBlock?][]>(
                        [
                            [RowType.TwoColumns, { primaryText: 'Батько:' }, { primaryText: parents.father.fullName }],
                            [RowType.TwoColumns, { primaryText: 'Громадянство:' }, { primaryText: parents.father.citizenship }],
                            parents.father.rnokpp && [
                                RowType.TwoColumns,
                                { primaryText: 'РНОКПП:' },
                                { primaryText: parents.father.rnokpp },
                            ],
                            [RowType.TwoColumns, { primaryText: 'Дата народження:' }, { primaryText: parents.father.birthDate }],
                        ].filter(Boolean)
                    ),
                    marginBottom: 12,
                },
                {
                    tableBlock: <[RowType, TextBlock?, TextBlock?, TextBlock?][]>(
                        [
                            [RowType.TwoColumns, { primaryText: 'Мати:' }, { primaryText: parents.mother.fullName }],
                            [RowType.TwoColumns, { primaryText: 'Громадянство:' }, { primaryText: parents.mother.citizenship }],
                            parents.mother.rnokpp && [
                                RowType.TwoColumns,
                                { primaryText: 'РНОКПП:' },
                                { primaryText: parents.mother.rnokpp },
                            ],
                            [RowType.TwoColumns, { primaryText: 'Дата народження:' }, { primaryText: parents.mother.birthDate }],
                        ].filter(Boolean)
                    ),
                    marginBottom: 12,
                },
                { hasSeparator: true, marginBottom: 24 },
                { textBlock: { content: 'Актовий запис', fontSize: 18 }, marginBottom: 24 },
                {
                    tableBlock: [
                        [RowType.TwoColumns, { primaryText: 'Номер запису:' }, { primaryText: act.number }],
                        [
                            RowType.TwoColumns,
                            { primaryText: 'Орган державної реєстрації актів цивільного стану, що видав свідоцтво:' },
                            { primaryText: doc.department },
                        ],
                        [RowType.TwoColumns, { primaryText: 'Дата складання:' }, { primaryText: doc.issueDate }],
                    ],
                    marginBottom: 12,
                },
                { hasSeparator: true, marginBottom: 24 },
                { textBlock: { content: 'Видані свідоцтва', fontSize: 18 }, marginBottom: 24 },
                ...(documents?.map(({ serieNumber, issueDate }) => {
                    return {
                        tableBlock: <[RowType, TextBlock?, TextBlock?][]>[
                            [RowType.TwoColumns, { primaryText: 'Номер свідоцтва:' }, { primaryText: serieNumber }],
                            [RowType.TwoColumns, { primaryText: 'Дата видачі:' }, { primaryText: issueDate }],
                        ],
                        marginBottom: 12,
                    }
                }) ?? []),
                { hasSeparator: false, marginBottom: 40 },
            ],
        }
    }

    private static getInternalPassportSharingRenderData(
        document: InternalPassport,
        requester: string,
        requestDateTime: string,
        requestIdentifier: string,
    ): GenericData {
        const {
            lastNameEN,
            firstNameEN,
            lastNameUA,
            firstNameUA,
            middleNameUA,
            docNumber,
            photo,
            genderUA,
            birthday,
            nationalityUA,
            department,
            issueDate,
            expirationDate,
            taxpayerCard,
            recordNumber,
            birthPlaceUA,
            currentRegistrationPlaceUA,
            documentRegistrationPlaceUA,
            sign,
        } = document

        return {
            documentTitle: 'Internal Passport',
            blocks: [
                { logoBlock: { logoHeader: ['Паспорт громадянина', 'України'], trident: true }, marginBottom: 24 },
                { hasSeparator: true, marginBottom: 24 },
                {
                    identityBlock: {
                        lastName: lastNameUA,
                        firstName: firstNameUA,
                        middleName: middleNameUA,
                        fullName: ApplicationUtils.getFullName(lastNameEN, firstNameEN),
                        documentNumber: docNumber,
                        photo,
                    },
                    marginBottom: 16,
                },
                { hasSeparator: true, marginBottom: 16 },
                {
                    textBlock: [
                        `Запит на цифрові копії документів від ${requestDateTime}`,
                        `Ініціатор запиту: ${requester}`,
                        `Ідентифікатор запиту: ${requestIdentifier}`,
                    ],
                    marginBottom: 32,
                },
                {
                    tableBlock: [
                        [RowType.TwoColumns, { primaryText: 'Стать:' }, { primaryText: genderUA }],
                        [RowType.TwoColumns, { primaryText: 'Дата народження:' }, { primaryText: birthday }],
                        [RowType.TwoColumns, { primaryText: 'Громадянство:' }, { primaryText: nationalityUA }],
                        [RowType.TwoColumns, { primaryText: 'Орган, що видав:' }, { primaryText: department }],
                        [RowType.TwoColumns, { primaryText: 'Дата видачі:' }, { primaryText: issueDate }],
                        [RowType.TwoColumns, { primaryText: 'Дійсний до:' }, { primaryText: expirationDate }],
                        [
                            RowType.TwoColumns,
                            { primaryText: 'РНОКПП:' },
                            {
                                primaryText: [
                                    taxpayerCard?.number || '',
                                    `(Верифіковано у реєстрі Державної податкової служби за запитом від ${
                                        taxpayerCard?.creationDate || ''
                                    })`,
                                ],
                            },
                        ],
                        [RowType.TwoColumns, { primaryText: 'Запис № (УНЗР):' }, { primaryText: recordNumber }],
                        [RowType.TwoColumns, { primaryText: 'Місце народження:' }, { primaryText: birthPlaceUA }],
                        [
                            RowType.TwoColumns,
                            { primaryText: 'Місце реєстрації проживання:' },
                            { primaryText: currentRegistrationPlaceUA || documentRegistrationPlaceUA },
                        ],
                        [RowType.TwoColumnsWithSign, { primaryText: 'Підпис:' }, { primaryText: sign }],
                    ],
                },
            ],
        }
    }

    private static getPensionCardSharingRenderData(
        document: PensionCard,
        requester: string,
        requestDateTime: string,
        requestIdentifier: string,
    ): GenericData {
        const {
            lastNameUA,
            firstNameUA,
            middleNameUA,
            docNumber,
            photo,
            birthday,
            issueDate,
            expirationDate,
            gender,
            pensionCaseNumber,
            pensionType,
        } = document

        return {
            documentTitle: 'Pension card',
            blocks: [
                { logoBlock: { logoHeader: ['Пенсійне', 'посвідчення'] }, marginBottom: 24 },
                { hasSeparator: true, marginBottom: 24 },
                {
                    identityBlock: {
                        lastName: lastNameUA,
                        firstName: firstNameUA,
                        middleName: middleNameUA,
                        documentNumber: docNumber,
                        photo,
                    },
                    marginBottom: 16,
                },
                { hasSeparator: true, marginBottom: 16 },
                {
                    textBlock: [
                        `Запит на цифрові копії документів від ${requestDateTime}`,
                        `Ініціатор запиту: ${requester}`,
                        `Ідентифікатор запиту: ${requestIdentifier}`,
                    ],
                    marginBottom: 32,
                },
                {
                    tableBlock: [
                        [RowType.TwoColumns, { primaryText: 'Стать:' }, { primaryText: gender }],
                        [RowType.TwoColumns, { primaryText: 'Дата народження:' }, { primaryText: birthday }],
                    ],
                    marginBottom: 40,
                },
                {
                    tableBlock: [
                        [RowType.TwoColumns, { primaryText: 'Номер пенсійної справи:' }, { primaryText: pensionCaseNumber }],
                        [RowType.TwoColumns, { primaryText: 'Вид пенсії:' }, { primaryText: pensionType }],
                    ],
                    marginBottom: 40,
                },
                {
                    tableBlock: [
                        [RowType.TwoColumns, { primaryText: 'Дата документа:' }, { primaryText: issueDate }],
                        [RowType.TwoColumns, { primaryText: 'Дійсний до:' }, { primaryText: expirationDate }],
                    ],
                    marginBottom: 40,
                },
            ],
        }
    }

    private static getEducationDocumentSharingRenderData(
        document: EducationDocument,
        requester: string,
        requestDateTime: string,
        requestIdentifier: string,
    ): GenericData {
        const {
            subtype,
            subtypeName,
            subtypeNameEn,
            additionalAwardInfo,
            additionalAwardInfoEn,
            lastName,
            firstName,
            middleName,
            lastNameEn,
            firstNameEn,
            number,
            series,
        } = document

        const bilingualDocuments: EducationDocumentType[] = [
            EducationDocumentType.DiplomaOfJuniorSpecialist,
            EducationDocumentType.DiplomaOfBachelor,
            EducationDocumentType.DiplomaOfSpecialist,
            EducationDocumentType.DiplomaOfMaster,
            EducationDocumentType.DiplomaOfDoctorOfPhilosophy,
            EducationDocumentType.DiplomaOfJuniorBachelor,
            EducationDocumentType.DiplomaOfProfessionalJuniorBachelor,
            EducationDocumentType.DiplomaOfDoctorOfArts,
        ]
        const isShowDocEngBlock = bilingualDocuments.includes(subtype)

        const educationBlocks = EducationDocumentService.getEducationBlocks(document, isShowDocEngBlock)

        return {
            blocks: [
                {
                    logoBlock: {
                        header: isShowDocEngBlock && subtypeNameEn ? `${subtypeName}/${subtypeNameEn}` : subtypeName,
                        title:
                            isShowDocEngBlock && additionalAwardInfoEn && additionalAwardInfo
                                ? `${additionalAwardInfoEn} • ${additionalAwardInfo}`
                                : additionalAwardInfo,
                    },
                    marginBottom: 16,
                },
                { hasSeparator: true, marginBottom: 24 },
                {
                    identityBlock: {
                        lastName: lastName,
                        firstName: firstName,
                        middleName: middleName,
                        fullName: ApplicationUtils.getFullName(lastNameEn ?? '', firstNameEn ?? ''),
                        documentNumber: `${series} ${number}`,
                    },
                    marginBottom: 24,
                },
                { hasSeparator: true, marginBottom: 16 },
                {
                    textBlock: isShowDocEngBlock
                        ? [
                              `The digital document copy requested on ${requestDateTime}`,
                              `Request initiator: ${requester}`,
                              `Request ID: ${requestIdentifier}`,
                          ]
                        : [
                              `Запит на цифрові копії документів від ${requestDateTime}`,
                              `Ініціатор запиту: ${requester}`,
                              `Ідентифікатор запиту: ${requestIdentifier}`,
                          ],
                },
                ...educationBlocks,
            ],
        }
    }
}
