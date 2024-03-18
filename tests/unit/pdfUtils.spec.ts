import { randomUUID } from 'crypto'

import TestKit from '@diia-inhouse/test'
import { DocumentType, RowType } from '@diia-inhouse/types'

jest.mock('../../src/educationDocument', () => ({ getEducationBlocks: (): [] => [] }))

import { PdfUtils } from '../../src/pdfUtils'
import { getValidEducationDocument } from '../mocks/educationDocument'

describe('PdfUtils', () => {
    const testKit = new TestKit()
    const { user } = testKit.session.getUserSession()
    const validDriverLicense = testKit.docs.getDriverLicense()
    const validForeignPassport = testKit.docs.getForeignPassport()
    const validResidencePermit = testKit.docs.getResidencePermit({ registration: 'City\nStreet' })
    const validTaxpayerCard = testKit.docs.getTaxpayerCard()
    const validInternalPassport = testKit.docs.getInternalPassport()
    const validEducationDocument = getValidEducationDocument()

    const { identifier: requester } = user
    const requestDateTime = new Date().toISOString()
    const requestIdentifier = randomUUID()

    describe('method getPdfFileName', () => {
        it('should successfully compose and return pdf file name', () => {
            const name = 'document'
            const id = randomUUID()
            const expectedResult = `${[name, id, requestDateTime].join('-')}.pdf`

            expect(PdfUtils.getPdfFileName(name, id, requestDateTime)).toBe(expectedResult)
        })
    })

    describe('method getSharingRenderDataByDocumentType', () => {
        it.each([
            [
                DocumentType.DriverLicense,
                validDriverLicense,
                {
                    documentTitle: 'Driver License',
                    blocks: [
                        {
                            logoBlock: {
                                header: 'Driving Licence',
                                title: 'Посвідчення водія',
                                subtitle: 'Ukraine • Україна',
                            },
                            marginBottom: 16,
                        },
                        {
                            hasSeparator: true,
                            marginBottom: 24,
                        },
                        {
                            identityBlock: {
                                lastName: 'Lastnameen',
                                firstName: 'Firstnameen',
                                fullName: [
                                    validDriverLicense.lastNameUA,
                                    validDriverLicense.firstNameUA,
                                    validDriverLicense.middleNameUA,
                                ].join(' '),
                                documentNumber: validDriverLicense.docNumber,
                                photo: validDriverLicense.photo,
                            },
                            marginBottom: 0,
                        },
                        {
                            hasSeparator: true,
                            marginBottom: 16,
                        },
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
                                    'threeColumns',
                                    {
                                        primaryText: validDriverLicense.eng?.lastName.code,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.lastName.name,
                                        secondaryText: validDriverLicense.ua?.lastName.name,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.lastName.value,
                                        secondaryText: validDriverLicense.ua?.lastName.value,
                                    },
                                ],
                                [
                                    'threeColumns',
                                    {
                                        primaryText: validDriverLicense.eng?.firstName.code,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.firstName.name,
                                        secondaryText: validDriverLicense.ua?.firstName.name,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.firstName.value,
                                        secondaryText: validDriverLicense.ua?.firstName.value,
                                    },
                                ],
                                [
                                    'threeColumns',
                                    {
                                        primaryText: validDriverLicense.eng?.birth.code,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.birth.name,
                                        secondaryText: validDriverLicense.ua?.birth.name,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.birth.value.split('\n')[0],
                                        secondaryText: validDriverLicense.ua?.birth.value.split('\n')[1],
                                    },
                                ],
                                [
                                    'threeColumns',
                                    {
                                        primaryText: validDriverLicense.eng?.issueDate.code,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.issueDate.name,
                                        secondaryText: validDriverLicense.ua?.issueDate.name,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.issueDate.value,
                                    },
                                ],
                                [
                                    'threeColumns',
                                    {
                                        primaryText: validDriverLicense.eng?.expiryDate.code,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.expiryDate.name,
                                        secondaryText: validDriverLicense.ua?.expiryDate.name,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.expiryDate.value,
                                    },
                                ],
                                [
                                    'threeColumns',
                                    {
                                        primaryText: validDriverLicense.eng?.department.code,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.department.name,
                                        secondaryText: validDriverLicense.ua?.department.name,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.department.value,
                                    },
                                ],
                                [
                                    'threeColumns',
                                    {
                                        primaryText: validDriverLicense.eng?.identifier.code,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.identifier.name,
                                        secondaryText: validDriverLicense.ua?.identifier.name,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.identifier.value,
                                    },
                                ],
                                [
                                    'threeColumns',
                                    {
                                        primaryText: validDriverLicense.eng?.documentNumber.code,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.documentNumber.name,
                                        secondaryText: validDriverLicense.ua?.documentNumber.name,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.documentNumber.value,
                                    },
                                ],
                                [
                                    'threeColumns',
                                    {
                                        primaryText: validDriverLicense.eng?.category.code,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.category.name,
                                        secondaryText: validDriverLicense.ua?.category.name,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.category.value.split('\n'),
                                    },
                                ],
                                [
                                    'threeColumns',
                                    {
                                        primaryText: validDriverLicense.eng?.categoryOpeningDate.code,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.categoryOpeningDate.name,
                                        secondaryText: validDriverLicense.ua?.categoryOpeningDate.name,
                                    },
                                    {
                                        primaryText: validDriverLicense.eng?.categoryOpeningDate.value.split('\n'),
                                    },
                                ],
                            ],
                        },
                    ],
                },
            ],
            [
                DocumentType.ForeignPassport,
                validForeignPassport,
                {
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
                                lastName: validForeignPassport.lastNameEN,
                                firstName: validForeignPassport.firstNameEN,
                                fullName: [validForeignPassport.lastNameUA, validForeignPassport.firstNameUA].join(' '),
                                documentNumber: validForeignPassport.docNumber,
                                photo: validForeignPassport.photo,
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
                                    {
                                        primaryText: validForeignPassport.eng?.gender.name,
                                        secondaryText: validForeignPassport.ua?.gender.name,
                                    },
                                    {
                                        primaryText: validForeignPassport.eng?.gender.value,
                                        secondaryText: validForeignPassport.ua?.gender.value,
                                    },
                                ],
                                [
                                    RowType.TwoColumns,
                                    {
                                        primaryText: validForeignPassport.eng?.birthDate.name,
                                        secondaryText: validForeignPassport.ua?.birthDate.name,
                                    },
                                    { primaryText: validForeignPassport.eng?.birthDate.value },
                                ],
                                [
                                    RowType.TwoColumns,
                                    {
                                        primaryText: validForeignPassport.eng?.nationality.name,
                                        secondaryText: validForeignPassport.ua?.nationality.name,
                                    },
                                    {
                                        primaryText: validForeignPassport.eng?.nationality.value,
                                        secondaryText: validForeignPassport.ua?.nationality.value,
                                    },
                                ],
                                [
                                    RowType.TwoColumns,
                                    {
                                        primaryText: validForeignPassport.eng?.department.name,
                                        secondaryText: validForeignPassport.ua?.department.name,
                                    },
                                    { primaryText: validForeignPassport.eng?.department.value },
                                ],
                                [
                                    RowType.TwoColumns,
                                    {
                                        primaryText: validForeignPassport.eng?.issueDate.name,
                                        secondaryText: validForeignPassport.ua?.issueDate.name,
                                    },
                                    { primaryText: validForeignPassport.eng?.issueDate.value },
                                ],
                                [
                                    RowType.TwoColumns,
                                    {
                                        primaryText: validForeignPassport.eng?.expiryDate.name,
                                        secondaryText: validForeignPassport.ua?.expiryDate.name,
                                    },
                                    { primaryText: validForeignPassport.eng?.expiryDate.value },
                                ],
                                [
                                    RowType.TwoColumns,
                                    {
                                        primaryText: validForeignPassport.eng?.identifier.name,
                                        secondaryText: validForeignPassport.ua?.identifier.name,
                                    },
                                    { primaryText: validForeignPassport.eng?.identifier.value },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: validForeignPassport.eng?.type.name, secondaryText: validForeignPassport.ua?.type.name },
                                    { primaryText: validForeignPassport.eng?.type.value },
                                ],
                                [
                                    RowType.TwoColumns,
                                    {
                                        primaryText: validForeignPassport.eng?.countryCode.name,
                                        secondaryText: validForeignPassport.ua?.countryCode.name,
                                    },
                                    { primaryText: validForeignPassport.eng?.countryCode.value },
                                ],
                                [
                                    RowType.TwoColumns,
                                    {
                                        primaryText: validForeignPassport.eng?.taxpayer?.name,
                                        secondaryText: validForeignPassport.ua?.taxpayer?.name,
                                    },
                                    {
                                        primaryText: ['', ''],
                                        secondaryText: validForeignPassport.ua?.taxpayer?.statusDescription,
                                    },
                                ],
                                [
                                    RowType.TwoColumns,
                                    {
                                        primaryText: validForeignPassport.eng?.birthPlace.name,
                                        secondaryText: validForeignPassport.ua?.birthPlace.name,
                                    },
                                    {
                                        primaryText: ` • `,
                                    },
                                ],
                                [
                                    RowType.TwoColumns,
                                    {
                                        primaryText: validForeignPassport.eng?.residenceRegistrationPlace.name,
                                        secondaryText: validForeignPassport.ua?.residenceRegistrationPlace.name,
                                    },
                                    { primaryText: validForeignPassport.eng?.residenceRegistrationPlace.value },
                                ],
                                [RowType.TwoColumnsWithSign, { primaryText: 'Підпис:' }, { primaryText: validForeignPassport.sign }],
                            ],
                        },
                    ],
                },
            ],
            [
                DocumentType.TaxpayerCard,
                validTaxpayerCard,
                {
                    documentTitle: 'Taxpayer card',
                    blocks: [
                        { logoBlock: { logoHeader: ['Реєстраційний номер облікової', 'картки платника податків'] }, marginBottom: 24 },
                        { hasSeparator: true, marginBottom: 24 },
                        { textBlock: { content: validTaxpayerCard.docNumber, fontSize: 38 }, marginBottom: 24 },
                        {
                            textBlock: [
                                'Верифіковано у реєстрі Державної податкової служби за запитом ',
                                `від ${validTaxpayerCard.creationDate}.`,
                            ],
                            marginBottom: 24,
                        },
                        { hasSeparator: true, marginBottom: 24 },
                        {
                            textBlock: {
                                content: [validTaxpayerCard.lastNameUA, validTaxpayerCard.firstNameUA, validTaxpayerCard.middleNameUA],
                                fontSize: 24,
                            },
                            marginBottom: 24,
                        },
                        {
                            tableBlock: [
                                [RowType.TwoColumns, { primaryText: 'Дата народження:' }, { primaryText: validTaxpayerCard.birthday }],
                            ],
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
                },
            ],
            [
                DocumentType.InternalPassport,
                validInternalPassport,
                {
                    documentTitle: 'Internal Passport',
                    blocks: [
                        { logoBlock: { logoHeader: ['Паспорт громадянина', 'України'], trident: true }, marginBottom: 24 },
                        { hasSeparator: true, marginBottom: 24 },
                        {
                            identityBlock: {
                                lastName: validInternalPassport.lastNameUA,
                                firstName: validInternalPassport.firstNameUA,
                                middleName: validInternalPassport.middleNameUA,
                                fullName: [validInternalPassport.lastNameEN, validInternalPassport.firstNameEN].join(' '),
                                documentNumber: validInternalPassport.docNumber,
                                photo: validInternalPassport.photo,
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
                                [RowType.TwoColumns, { primaryText: 'Стать:' }, { primaryText: validInternalPassport.genderUA }],
                                [RowType.TwoColumns, { primaryText: 'Дата народження:' }, { primaryText: validInternalPassport.birthday }],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Громадянство:' },
                                    { primaryText: validInternalPassport.nationalityUA },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Орган, що видав:' },
                                    { primaryText: validInternalPassport.department },
                                ],
                                [RowType.TwoColumns, { primaryText: 'Дата видачі:' }, { primaryText: validInternalPassport.issueDate }],
                                [RowType.TwoColumns, { primaryText: 'Дійсний до:' }, { primaryText: validInternalPassport.expirationDate }],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'РНОКПП:' },
                                    {
                                        primaryText: [
                                            validInternalPassport?.taxpayerCard?.number,
                                            `(Верифіковано у реєстрі Державної податкової служби за запитом від ${validInternalPassport.taxpayerCard?.creationDate})`,
                                        ],
                                    },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Запис № (УНЗР):' },
                                    { primaryText: validInternalPassport.recordNumber },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Місце народження:' },
                                    { primaryText: validInternalPassport.birthPlaceUA },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Місце реєстрації проживання:' },
                                    { primaryText: validInternalPassport.currentRegistrationPlaceUA },
                                ],
                                [RowType.TwoColumnsWithSign, { primaryText: 'Підпис:' }, { primaryText: validInternalPassport.sign }],
                            ],
                        },
                    ],
                },
            ],
            [
                DocumentType.EducationDocument,
                validEducationDocument,
                {
                    blocks: [
                        {
                            logoBlock: {
                                header: `${validEducationDocument.subtypeName}/${validEducationDocument.subtypeName}En`,
                                title: 'Additional Award Info En • Additional Award Info',
                            },
                            marginBottom: 16,
                        },
                        { hasSeparator: true, marginBottom: 24 },
                        {
                            identityBlock: {
                                lastName: validEducationDocument.lastName,
                                firstName: validEducationDocument.firstName,
                                middleName: validEducationDocument.middleName,
                                fullName: [validEducationDocument.lastNameEn, validEducationDocument.firstNameEn].join(' '),
                                documentNumber: `${validEducationDocument.series} ${validEducationDocument.number}`,
                            },
                            marginBottom: 24,
                        },
                        { hasSeparator: true, marginBottom: 16 },
                        {
                            textBlock: [
                                `The digital document copy requested on ${requestDateTime}`,
                                `Request initiator: ${requester}`,
                                `Request ID: ${requestIdentifier}`,
                            ],
                        },
                    ],
                },
            ],
        ])('should successfully compose and return sharing render data for %s', (documentType, documentData, expectedResult) => {
            const result = PdfUtils.getSharingRenderDataByDocumentType(
                documentType,
                documentData,
                requester,
                requestDateTime,
                requestIdentifier,
            )

            expect(result).toEqual(expectedResult)
        })

        it('should fail with error in case unknown document type', () => {
            const documentType = 'unknowm'

            expect(() => {
                PdfUtils.getSharingRenderDataByDocumentType(<DocumentType>documentType, {}, requester, requestDateTime, requestIdentifier)
            }).toThrow(new TypeError(`Unknown scope ${documentType}`))
        })
    })

    describe('method getResidencePermitTemporarySharingRenderData', () => {
        it('should successfully compose and return sharing render data for ResidencePermitTemporary', () => {
            const result = PdfUtils.getResidencePermitTemporarySharingRenderData(
                validResidencePermit,
                requester,
                requestDateTime,
                requestIdentifier,
            )

            expect(result).toEqual({
                documentTitle: 'Residence permit temporary',
                blocks: [
                    { logoBlock: { logoHeader: ['Посвідка на тимчасове', 'проживання'] }, marginBottom: 24 },
                    { hasSeparator: true, marginBottom: 24 },
                    {
                        identityBlock: {
                            lastName: validResidencePermit.lastNameUA,
                            firstName: validResidencePermit.firstNameUA,
                            fullName: [validResidencePermit.lastNameEN, validResidencePermit.firstNameEN].join(' '),
                            documentNumber: validResidencePermit.docNumber,
                            photo: validResidencePermit.photo,
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
                            [RowType.TwoColumns, { primaryText: 'Стать:' }, { primaryText: validResidencePermit.gender }],
                            [RowType.TwoColumns, { primaryText: 'Громадянство:' }, { primaryText: validResidencePermit.nationality }],
                            [RowType.TwoColumns, { primaryText: 'Дата народження:' }, { primaryText: validResidencePermit.birthday }],
                            [RowType.TwoColumns, { primaryText: 'Місце народження:' }, { primaryText: validResidencePermit.birthCountry }],
                            [RowType.TwoColumns, { primaryText: 'РНОКПП:' }, { primaryText: validResidencePermit.taxpayerCard?.number }],
                            [RowType.TwoColumns, { primaryText: 'Зареєстроване місце проживання:' }, { primaryText: ['City', 'Street'] }],
                            [RowType.TwoColumns, { primaryText: 'Номер запису:' }, { primaryText: validResidencePermit.recordNumber }],
                            [RowType.TwoColumns, { primaryText: 'Орган, що видав:' }, { primaryText: validResidencePermit.authority }],
                            [
                                RowType.TwoColumns,
                                { primaryText: 'Підстава для отримання:' },
                                { primaryText: validResidencePermit.issueReason },
                            ],
                            [RowType.TwoColumns, { primaryText: 'Дата видачі:' }, { primaryText: validResidencePermit.issueDate }],
                            [RowType.TwoColumns, { primaryText: 'Дійсний до:' }, { primaryText: validResidencePermit.expirationDate }],
                        ],
                    },
                ],
            })
        })
    })
})
