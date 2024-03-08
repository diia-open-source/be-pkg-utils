import { randomUUID } from 'crypto'

import TestKit from '@diia-inhouse/test'
import { DocumentType, RowType } from '@diia-inhouse/types'

jest.mock('../../src/educationDocument', () => ({ getEducationBlocks: (): [] => [] }))

import { ApplicationUtils } from '../../src/applicationUtils'
import { PdfUtils } from '../../src/pdfUtils'
import { getValidEducationDocument } from '../mocks/educationDocument'

describe('PdfUtils', () => {
    const testKit = new TestKit()
    const { user } = testKit.session.getUserSession()
    const validDriverLicense = testKit.docs.getDriverLicense()
    const validVehicleLicense = testKit.docs.getVehicleLicense()
    const validStudentIdCard = testKit.docs.getStudentCard()
    const validForeignPassport = testKit.docs.getForeignPassport()
    const validResidencePermit = testKit.docs.getResidencePermit({ registration: 'City\nStreet' })
    const validTaxpayerCard = testKit.docs.getTaxpayerCard()
    const validRefInternallyDisplacedPerson = testKit.docs.getRefInternallyDisplacedPerson()
    const validBirthCertificate = testKit.docs.getBirthCertificate({
        child: { citizenship: 'Україна' },
        parents: { mother: { rnokpp: '1010101015' } },
    })
    const validInternalPassport = testKit.docs.getInternalPassport()
    const validPensionCard = testKit.docs.getPensionCard()
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
                DocumentType.VehicleLicense,
                validVehicleLicense,
                {
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
                                lastName: validVehicleLicense.lastNameEN,
                                firstName: validVehicleLicense.firstNameEN,
                                fullName: [
                                    validVehicleLicense.lastNameUA,
                                    validVehicleLicense.firstNameUA,
                                    validVehicleLicense.middleNameUA,
                                ].join(' '),
                                documentNumber: validVehicleLicense.licensePlate,
                                documentDetail: [validVehicleLicense.brand, validVehicleLicense.model].join(' ').trim(),
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
                                    { primaryText: validVehicleLicense.eng?.licensePlate.code },
                                    {
                                        primaryText: validVehicleLicense.eng?.licensePlate.name,
                                        secondaryText: validVehicleLicense.ua?.licensePlate.name,
                                    },
                                    { primaryText: validVehicleLicense.ua?.licensePlate.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.firstRegistrationDate.code },
                                    {
                                        primaryText: validVehicleLicense.eng?.firstRegistrationDate.name,
                                        secondaryText: validVehicleLicense.ua?.firstRegistrationDate.name,
                                    },
                                    { primaryText: validVehicleLicense.ua?.firstRegistrationDate.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.makeYear.code },
                                    {
                                        primaryText: validVehicleLicense.eng?.makeYear.name,
                                        secondaryText: validVehicleLicense.ua?.makeYear.name,
                                    },
                                    { primaryText: validVehicleLicense.ua?.makeYear.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.registrationDate.code },
                                    {
                                        primaryText: validVehicleLicense.eng?.registrationDate.name,
                                        secondaryText: validVehicleLicense.ua?.registrationDate.name,
                                    },
                                    { primaryText: validVehicleLicense.ua?.registrationDate.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    {},
                                    {
                                        primaryText: validVehicleLicense.eng?.documentNumber.name,
                                        secondaryText: validVehicleLicense.ua?.documentNumber.name,
                                    },
                                    { primaryText: validVehicleLicense.ua?.documentNumber.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    {},
                                    {
                                        primaryText: validVehicleLicense.eng?.department.name,
                                        secondaryText: validVehicleLicense.ua?.department.name,
                                    },
                                    { primaryText: validVehicleLicense.ua?.department.value },
                                ],
                            ],
                        },
                        {
                            tableBlock: [
                                [
                                    RowType.OneColumn,
                                    {
                                        primaryText: { content: 'Ownership', fontSize: 18, marginBottom: 0 },
                                        secondaryText: { content: 'Право власності', fontSize: 14, marginBottom: 24 },
                                    },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.lastName.code },
                                    {
                                        primaryText: validVehicleLicense.eng?.lastName.name,
                                        secondaryText: validVehicleLicense.ua?.lastName.name,
                                    },
                                    {
                                        primaryText: validVehicleLicense.eng?.lastName.value,
                                        secondaryText: validVehicleLicense.ua?.lastName.value,
                                    },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.firstName.code },
                                    {
                                        primaryText: validVehicleLicense.eng?.firstName.name,
                                        secondaryText: validVehicleLicense.ua?.firstName.name,
                                    },
                                    {
                                        primaryText: validVehicleLicense.eng?.firstName.value,
                                        secondaryText: validVehicleLicense.ua?.firstName.value,
                                    },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.address.code },
                                    {
                                        primaryText: validVehicleLicense.eng?.address.name,
                                        secondaryText: validVehicleLicense.ua?.address.name,
                                    },
                                    { primaryText: validVehicleLicense.ua?.address.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.ownership.code },
                                    {
                                        primaryText: validVehicleLicense.eng?.ownership.name,
                                        secondaryText: validVehicleLicense.ua?.ownership.name,
                                    },
                                    { primaryText: validVehicleLicense.ua?.ownership.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    {},
                                    {
                                        primaryText: validVehicleLicense.eng?.properUser?.name,
                                        secondaryText: validVehicleLicense.ua?.properUser?.name,
                                    },
                                    {
                                        primaryText: validVehicleLicense.eng?.properUser?.value,
                                        secondaryText: validVehicleLicense.ua?.properUser?.value,
                                    },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    {},
                                    {
                                        primaryText: validVehicleLicense.eng?.properUserExpirationDate?.name,
                                        secondaryText: validVehicleLicense.ua?.properUserExpirationDate?.name,
                                    },
                                    {
                                        primaryText: validVehicleLicense.eng?.properUserExpirationDate?.value,
                                    },
                                ],
                            ],
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
                                    { primaryText: validVehicleLicense.eng?.brand.code },
                                    { primaryText: validVehicleLicense.eng?.brand.name, secondaryText: validVehicleLicense.ua?.brand.name },
                                    { primaryText: validVehicleLicense.ua?.brand.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.model.code },
                                    { primaryText: validVehicleLicense.eng?.model.name, secondaryText: validVehicleLicense.ua?.model.name },
                                    { primaryText: validVehicleLicense.ua?.model.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.vin.code },
                                    { primaryText: validVehicleLicense.eng?.vin.name, secondaryText: validVehicleLicense.ua?.vin.name },
                                    { primaryText: validVehicleLicense.ua?.vin.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.totalWeight.code },
                                    {
                                        primaryText: validVehicleLicense.eng?.totalWeight.name,
                                        secondaryText: validVehicleLicense.ua?.totalWeight.name,
                                    },
                                    { primaryText: validVehicleLicense.ua?.totalWeight.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.ownWeight.code },
                                    {
                                        primaryText: validVehicleLicense.eng?.ownWeight.name,
                                        secondaryText: validVehicleLicense.ua?.ownWeight.name,
                                    },
                                    { primaryText: validVehicleLicense.ua?.ownWeight.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.rankCategory.code },
                                    {
                                        primaryText: validVehicleLicense.eng?.rankCategory.name,
                                        secondaryText: validVehicleLicense.ua?.rankCategory.name,
                                    },
                                    { primaryText: validVehicleLicense.ua?.rankCategory.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.capacity.code },
                                    {
                                        primaryText: validVehicleLicense.eng?.capacity.name,
                                        secondaryText: validVehicleLicense.ua?.capacity.name,
                                    },
                                    { primaryText: validVehicleLicense.ua?.capacity.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.fuel.code },
                                    { primaryText: validVehicleLicense.eng?.fuel.name, secondaryText: validVehicleLicense.ua?.fuel.name },
                                    { primaryText: validVehicleLicense.ua?.fuel.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.color.code },
                                    { primaryText: validVehicleLicense.eng?.color.name, secondaryText: validVehicleLicense.ua?.color.name },
                                    { primaryText: validVehicleLicense.ua?.color.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.nseating.code },
                                    {
                                        primaryText: validVehicleLicense.eng?.nseating.name,
                                        secondaryText: validVehicleLicense.ua?.nseating.name,
                                    },
                                    { primaryText: validVehicleLicense.ua?.nseating.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.nstandup.code },
                                    {
                                        primaryText: validVehicleLicense.eng?.nstandup.name,
                                        secondaryText: validVehicleLicense.ua?.nstandup.name,
                                    },
                                    { primaryText: validVehicleLicense.ua?.nstandup.value },
                                ],
                                [
                                    RowType.ThreeColumns,
                                    { primaryText: validVehicleLicense.eng?.kindBody.code },
                                    {
                                        primaryText: validVehicleLicense.eng?.kindBody.name,
                                        secondaryText: validVehicleLicense.ua?.kindBody.name,
                                    },
                                    { primaryText: validVehicleLicense.ua?.kindBody.value },
                                ],
                            ],
                        },
                    ],
                },
            ],
            [
                DocumentType.StudentIdCard,
                validStudentIdCard,
                {
                    documentTitle: 'Student Card',
                    blocks: [
                        {
                            logoBlock: {
                                logoHeader: ['Учнівський', 'квиток'],
                            },
                            marginBottom: 24,
                        },
                        { hasSeparator: true, marginBottom: 24 },
                        {
                            identityBlock: {
                                lastName: validStudentIdCard.lastNameUA,
                                firstName: validStudentIdCard.firstNameUA,
                                middleName: validStudentIdCard.middleNameUA,
                                documentNumber: validStudentIdCard.docNumber,
                                photo: validStudentIdCard.photo,
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
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Навчальний заклад:' },
                                    { primaryText: validStudentIdCard.collegeName },
                                ],
                                [RowType.TwoColumns, { primaryText: 'Факультет:' }, { primaryText: validStudentIdCard.facultyName }],
                                [RowType.TwoColumns, { primaryText: 'Виданий:' }, { primaryText: validStudentIdCard.issueDate }],
                                [RowType.TwoColumns, { primaryText: 'Дійсний до:' }, { primaryText: validStudentIdCard.expirationDate }],
                                [RowType.TwoColumns, { primaryText: 'Форма навчання:' }, { primaryText: validStudentIdCard.educationType }],
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
                DocumentType.ResidencePermitPermanent,
                validResidencePermit,
                {
                    documentTitle: 'Residence permit permanent',
                    blocks: [
                        { logoBlock: { logoHeader: ['Посвідка на постійне', 'проживання'] }, marginBottom: 24 },
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
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Місце народження:' },
                                    { primaryText: validResidencePermit.birthCountry },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'РНОКПП:' },
                                    { primaryText: validResidencePermit.taxpayerCard?.number },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Зареєстроване місце проживання:' },
                                    { primaryText: String(validResidencePermit.registration).split('\n') },
                                ],
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
                DocumentType.RefInternallyDisplacedPerson,
                validRefInternallyDisplacedPerson,
                {
                    documentTitle: 'Reference internally displaced person',
                    blocks: [
                        { logoBlock: { logoHeader: ['Довідка про взяття на облік', 'внутрішньо переміщеної особи'] }, marginBottom: 24 },
                        { hasSeparator: true, marginBottom: 24 },
                        {
                            textBlock: {
                                content: [
                                    validRefInternallyDisplacedPerson.lastName,
                                    validRefInternallyDisplacedPerson.firstName,
                                    validRefInternallyDisplacedPerson.middleName,
                                ],
                                fontSize: 24,
                            },
                            marginBottom: 34,
                        },
                        { textBlock: { content: validRefInternallyDisplacedPerson.docNumber, fontSize: 38 }, marginBottom: 16 },
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
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Дата видачі:' },
                                    { primaryText: validRefInternallyDisplacedPerson.issueDate },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Дата народження:' },
                                    { primaryText: validRefInternallyDisplacedPerson.birthDate },
                                ],
                                [RowType.TwoColumns, { primaryText: 'Стать:' }, { primaryText: validRefInternallyDisplacedPerson.gender }],
                            ],
                            marginBottom: 40,
                        },
                        {
                            tableBlock: [
                                [
                                    RowType.OneColumn,
                                    { primaryText: { content: 'Документ, що посвідчує особу', fontSize: 18, marginBottom: 14 } },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Серія та номер:' },
                                    { primaryText: validRefInternallyDisplacedPerson.docIdentity.number },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Дата видачі:' },
                                    { primaryText: validRefInternallyDisplacedPerson.docIdentity.issueDate },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Ким і коли виданий:' },
                                    { primaryText: validRefInternallyDisplacedPerson.docIdentity.department },
                                ],
                            ],
                            marginBottom: 40,
                        },
                        {
                            tableBlock: [
                                [RowType.OneColumn, { primaryText: { content: 'Проживання', fontSize: 18, marginBottom: 14 } }],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Місце народження:' },
                                    { primaryText: validRefInternallyDisplacedPerson.address.birth },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Місце реєстрації проживання:' },
                                    { primaryText: validRefInternallyDisplacedPerson.address.registration },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Фактичне місце проживання/перебування:' },
                                    { primaryText: validRefInternallyDisplacedPerson.address.actual },
                                ],
                            ],
                            marginBottom: 40,
                        },
                    ],
                },
            ],
            [
                DocumentType.BirthCertificate,
                validBirthCertificate,
                {
                    documentTitle: 'Birth certificate',
                    blocks: [
                        { logoBlock: { logoHeader: ['Відомості актового запису', 'про народження'] }, marginBottom: 24 },
                        { hasSeparator: true, marginBottom: 24 },
                        {
                            textBlock: {
                                content: [
                                    validBirthCertificate.child.lastName,
                                    validBirthCertificate.child.firstName,
                                    validBirthCertificate.child.middleName,
                                ],
                                fontSize: 24,
                            },
                            marginBottom: 24,
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
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Стать:' },
                                    { primaryText: ApplicationUtils.capitalizeFirstLetter(validBirthCertificate.child.gender) },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Дата народження:' },
                                    { primaryText: validBirthCertificate.child.birthDate },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Місце народження:' },
                                    { primaryText: validBirthCertificate.child.birthPlace },
                                ],
                                [(RowType.TwoColumns, { primaryText: 'Громадянство/підданство для дитини:' }, { primaryText: 'Україна' })],
                            ],
                            marginBottom: 24,
                        },
                        { hasSeparator: true, marginBottom: 24 },
                        { textBlock: { content: 'Інформація про батьків', fontSize: 18 }, marginBottom: 24 },
                        {
                            tableBlock: [
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Батько:' },
                                    { primaryText: validBirthCertificate.parents.father.fullName },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Громадянство:' },
                                    { primaryText: validBirthCertificate.parents.father.citizenship },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Дата народження:' },
                                    { primaryText: validBirthCertificate.parents.father.birthDate },
                                ],
                            ],
                            marginBottom: 12,
                        },
                        {
                            tableBlock: [
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Мати:' },
                                    { primaryText: validBirthCertificate.parents.mother.fullName },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Громадянство:' },
                                    { primaryText: validBirthCertificate.parents.mother.citizenship },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'РНОКПП:' },
                                    { primaryText: validBirthCertificate.parents.mother.rnokpp },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Дата народження:' },
                                    { primaryText: validBirthCertificate.parents.mother.birthDate },
                                ],
                            ],
                            marginBottom: 12,
                        },
                        { hasSeparator: true, marginBottom: 24 },
                        { textBlock: { content: 'Актовий запис', fontSize: 18 }, marginBottom: 24 },
                        {
                            tableBlock: [
                                [RowType.TwoColumns, { primaryText: 'Номер запису:' }, { primaryText: validBirthCertificate.act.number }],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Орган державної реєстрації актів цивільного стану, що видав свідоцтво:' },
                                    { primaryText: validBirthCertificate.document.department },
                                ],
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Дата складання:' },
                                    { primaryText: validBirthCertificate.document.issueDate },
                                ],
                            ],
                            marginBottom: 12,
                        },
                        { hasSeparator: true, marginBottom: 24 },
                        { textBlock: { content: 'Видані свідоцтва', fontSize: 18 }, marginBottom: 24 },
                        ...validBirthCertificate.documents!.map(({ serieNumber, issueDate }) => {
                            return {
                                tableBlock: [
                                    [RowType.TwoColumns, { primaryText: 'Номер свідоцтва:' }, { primaryText: serieNumber }],
                                    [RowType.TwoColumns, { primaryText: 'Дата видачі:' }, { primaryText: issueDate }],
                                ],
                                marginBottom: 12,
                            }
                        }),
                        { hasSeparator: false, marginBottom: 40 },
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
                DocumentType.PensionCard,
                validPensionCard,
                {
                    documentTitle: 'Pension card',
                    blocks: [
                        { logoBlock: { logoHeader: ['Пенсійне', 'посвідчення'] }, marginBottom: 24 },
                        { hasSeparator: true, marginBottom: 24 },
                        {
                            identityBlock: {
                                lastName: validPensionCard.lastNameUA,
                                firstName: validPensionCard.firstNameUA,
                                middleName: validPensionCard.middleNameUA,
                                documentNumber: validPensionCard.docNumber,
                                photo: validPensionCard.photo,
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
                                [RowType.TwoColumns, { primaryText: 'Стать:' }, { primaryText: validPensionCard.gender }],
                                [RowType.TwoColumns, { primaryText: 'Дата народження:' }, { primaryText: validPensionCard.birthday }],
                            ],
                            marginBottom: 40,
                        },
                        {
                            tableBlock: [
                                [
                                    RowType.TwoColumns,
                                    { primaryText: 'Номер пенсійної справи:' },
                                    { primaryText: validPensionCard.pensionCaseNumber },
                                ],
                                [RowType.TwoColumns, { primaryText: 'Вид пенсії:' }, { primaryText: validPensionCard.pensionType }],
                            ],
                            marginBottom: 40,
                        },
                        {
                            tableBlock: [
                                [RowType.TwoColumns, { primaryText: 'Дата документа:' }, { primaryText: validPensionCard.issueDate }],
                                [RowType.TwoColumns, { primaryText: 'Дійсний до:' }, { primaryText: validPensionCard.expirationDate }],
                            ],
                            marginBottom: 40,
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
