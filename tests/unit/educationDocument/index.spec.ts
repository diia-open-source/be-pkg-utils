import moment from 'moment'

import { NotFoundError } from '@diia-inhouse/errors'
import { EducationDocumentType } from '@diia-inhouse/types'

import EducationDocumentService from '../../../src/educationDocument'
import { getValidEducationDocument } from '../../mocks/educationDocument'

const validEducationDocument = getValidEducationDocument()
const dateFormat = 'DD.MM.YYYY'

describe('EducationDocumentService', () => {
    describe('getEducationBlocks', () => {
        it.each([
            [
                EducationDocumentType.CertificateOfBasicGeneralSecondaryEducation,
                { ...validEducationDocument, subtype: EducationDocumentType.CertificateOfBasicGeneralSecondaryEducation },
                [
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата народження:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.birthDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Education University Name',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата видачі:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.issueDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата закінчення навчання:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.educationEndDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Директор:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'FullName',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, що видав документ:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Issued by University Name',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, до якого іноземець вступив на початку навчання в Україні:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Beginning University Name',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Початок навчання в Україні:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.beginningUniversityYear).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                ],
            ],
            [
                EducationDocumentType.DiplomaOfSkilledWorker,
                { ...validEducationDocument, subtype: EducationDocumentType.DiplomaOfSkilledWorker },
                [
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата народження:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.birthDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Education University Name',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата видачі:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.issueDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата закінчення навчання:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.educationEndDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Професія:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'ProfessionText',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Ректор:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'FullName',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, що видав документ:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Issued by University Name',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, до якого іноземець вступив на початку навчання в Україні:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Beginning University Name',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Початок навчання в Україні:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.beginningUniversityYear).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                ],
            ],
            [
                EducationDocumentType.DiplomaOfJuniorSpecialist,
                { ...validEducationDocument, subtype: EducationDocumentType.DiplomaOfJuniorSpecialist },
                [
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата народження:',
                                    },
                                    secondaryText: {
                                        content: 'Date of birth',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.birthDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти:',
                                    },
                                    secondaryText: {
                                        content: 'Educational institution',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Education University Name',
                                    },
                                    secondaryText: {
                                        content: 'Education University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата видачі:',
                                    },
                                    secondaryText: {
                                        content: 'Date of issue',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.issueDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата закінчення навчання:',
                                    },
                                    secondaryText: {
                                        content: 'Date of graduation',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.educationEndDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Спеціальність:',
                                    },
                                    secondaryText: {
                                        content: 'Programme Subject Area',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'SpecialityName',
                                    },
                                    secondaryText: {
                                        content: 'SpecialityNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Спеціалізація:',
                                    },
                                    secondaryText: {
                                        content: 'Specialization',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'SpecializationName',
                                    },
                                    secondaryText: {
                                        content: 'SpecializationNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Освітня програма:',
                                    },
                                    secondaryText: {
                                        content: 'Educational Programme',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'StudyProgramName',
                                    },
                                    secondaryText: {
                                        content: 'StudyProgramNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Професійна кваліфікація:',
                                    },
                                    secondaryText: {
                                        content: 'Professional qualification',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'QualificationName',
                                    },
                                    secondaryText: {
                                        content: 'QualificationNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Орган акредитації:',
                                    },
                                    secondaryText: {
                                        content: 'Accreditation Authority',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Accreditation Institution Name',
                                    },
                                    secondaryText: {
                                        content: 'Accreditation Institution Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Ректор:',
                                    },
                                    secondaryText: {
                                        content: 'Rector',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'FullName',
                                    },
                                    secondaryText: {
                                        content: 'FullNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, що видав документ:',
                                    },
                                    secondaryText: {
                                        content: 'Name of awarding institution',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Issued by University Name',
                                    },
                                    secondaryText: {
                                        content: 'Issued by University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, до якого іноземець вступив на початку навчання в Україні:',
                                    },
                                    secondaryText: {
                                        content: 'The educational institution a foreigner entered at the beginning of studies in Ukraine',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Beginning University Name',
                                    },
                                    secondaryText: {
                                        content: 'Beginning University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Початок навчання в Україні:',
                                    },
                                    secondaryText: {
                                        content: 'Start of studies in Ukraine',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.beginningUniversityYear).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                ],
            ],
            [
                EducationDocumentType.DiplomaOfBachelor,
                { ...validEducationDocument, subtype: EducationDocumentType.DiplomaOfBachelor },
                [
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата народження:',
                                    },
                                    secondaryText: {
                                        content: 'Date of birth',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.birthDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти:',
                                    },
                                    secondaryText: {
                                        content: 'Educational institution',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Education University Name',
                                    },
                                    secondaryText: {
                                        content: 'Education University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Ступінь вищої освіти:',
                                    },
                                    secondaryText: {
                                        content: 'Degree',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Бакалавр',
                                    },
                                    secondaryText: {
                                        content: 'Bachelor’s',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата видачі:',
                                    },
                                    secondaryText: {
                                        content: 'Date of issue',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.issueDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата закінчення навчання:',
                                    },
                                    secondaryText: {
                                        content: 'Date of graduation',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.educationEndDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Спеціальність:',
                                    },
                                    secondaryText: {
                                        content: 'Programme Subject Area',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'SpecialityName',
                                    },
                                    secondaryText: {
                                        content: 'SpecialityNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Спеціалізація:',
                                    },
                                    secondaryText: {
                                        content: 'Specialization',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'SpecializationName',
                                    },
                                    secondaryText: {
                                        content: 'SpecializationNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Освітня програма:',
                                    },
                                    secondaryText: {
                                        content: 'Educational Programme',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'StudyProgramName',
                                    },
                                    secondaryText: {
                                        content: 'StudyProgramNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Професійна кваліфікація:',
                                    },
                                    secondaryText: {
                                        content: 'Professional qualification',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'QualificationName',
                                    },
                                    secondaryText: {
                                        content: 'QualificationNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Орган акредитації:',
                                    },
                                    secondaryText: {
                                        content: 'Accreditation Authority',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Accreditation Institution Name',
                                    },
                                    secondaryText: {
                                        content: 'Accreditation Institution Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Ректор:',
                                    },
                                    secondaryText: {
                                        content: 'Rector',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'FullName',
                                    },
                                    secondaryText: {
                                        content: 'FullNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, що видав документ:',
                                    },
                                    secondaryText: {
                                        content: 'Name of awarding institution',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Issued by University Name',
                                    },
                                    secondaryText: {
                                        content: 'Issued by University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, до якого іноземець вступив на початку навчання в Україні:',
                                    },
                                    secondaryText: {
                                        content: 'The educational institution a foreigner entered at the beginning of studies in Ukraine',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Beginning University Name',
                                    },
                                    secondaryText: {
                                        content: 'Beginning University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Початок навчання в Україні:',
                                    },
                                    secondaryText: {
                                        content: 'Start of studies in Ukraine',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.beginningUniversityYear).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                ],
            ],
            [
                EducationDocumentType.DiplomaOfSpecialist,
                { ...validEducationDocument, subtype: EducationDocumentType.DiplomaOfSpecialist },
                [
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата народження:',
                                    },
                                    secondaryText: {
                                        content: 'Date of birth',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.birthDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти:',
                                    },
                                    secondaryText: {
                                        content: 'Educational institution',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Education University Name',
                                    },
                                    secondaryText: {
                                        content: 'Education University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата видачі:',
                                    },
                                    secondaryText: {
                                        content: 'Date of issue',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.issueDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата закінчення навчання:',
                                    },
                                    secondaryText: {
                                        content: 'Date of graduation',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.educationEndDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Спеціальність:',
                                    },
                                    secondaryText: {
                                        content: 'Programme Subject Area',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'SpecialityName',
                                    },
                                    secondaryText: {
                                        content: 'SpecialityNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Спеціалізація:',
                                    },
                                    secondaryText: {
                                        content: 'Specialization',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'SpecializationName',
                                    },
                                    secondaryText: {
                                        content: 'SpecializationNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Освітня програма:',
                                    },
                                    secondaryText: {
                                        content: 'Educational Programme',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'StudyProgramName',
                                    },
                                    secondaryText: {
                                        content: 'StudyProgramNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Професійна кваліфікація:',
                                    },
                                    secondaryText: {
                                        content: 'Professional qualification',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'QualificationName',
                                    },
                                    secondaryText: {
                                        content: 'QualificationNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Орган акредитації:',
                                    },
                                    secondaryText: {
                                        content: 'Accreditation Authority',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Accreditation Institution Name',
                                    },
                                    secondaryText: {
                                        content: 'Accreditation Institution Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Ректор:',
                                    },
                                    secondaryText: {
                                        content: 'Rector',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'FullName',
                                    },
                                    secondaryText: {
                                        content: 'FullNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, що видав документ:',
                                    },
                                    secondaryText: {
                                        content: 'Name of awarding institution',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Issued by University Name',
                                    },
                                    secondaryText: {
                                        content: 'Issued by University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, до якого іноземець вступив на початку навчання в Україні:',
                                    },
                                    secondaryText: {
                                        content: 'The educational institution a foreigner entered at the beginning of studies in Ukraine',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Beginning University Name',
                                    },
                                    secondaryText: {
                                        content: 'Beginning University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Початок навчання в Україні:',
                                    },
                                    secondaryText: {
                                        content: 'Start of studies in Ukraine',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.beginningUniversityYear).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                ],
            ],
            [
                EducationDocumentType.DiplomaOfMaster,
                { ...validEducationDocument, subtype: EducationDocumentType.DiplomaOfMaster },
                [
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата народження:',
                                    },
                                    secondaryText: {
                                        content: 'Date of birth',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.birthDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти:',
                                    },
                                    secondaryText: {
                                        content: 'Educational institution',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Education University Name',
                                    },
                                    secondaryText: {
                                        content: 'Education University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Ступінь вищої освіти:',
                                    },
                                    secondaryText: {
                                        content: 'Degree',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Магістр',
                                    },
                                    secondaryText: {
                                        content: 'Master’s',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата видачі:',
                                    },
                                    secondaryText: {
                                        content: 'Date of issue',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.issueDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата закінчення навчання:',
                                    },
                                    secondaryText: {
                                        content: 'Date of graduation',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.educationEndDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Спеціальність:',
                                    },
                                    secondaryText: {
                                        content: 'Programme Subject Area',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'SpecialityName',
                                    },
                                    secondaryText: {
                                        content: 'SpecialityNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Спеціалізація:',
                                    },
                                    secondaryText: {
                                        content: 'Specialization',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'SpecializationName',
                                    },
                                    secondaryText: {
                                        content: 'SpecializationNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Освітня програма:',
                                    },
                                    secondaryText: {
                                        content: 'Educational Programme',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'StudyProgramName',
                                    },
                                    secondaryText: {
                                        content: 'StudyProgramNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Професійна кваліфікація:',
                                    },
                                    secondaryText: {
                                        content: 'Professional qualification',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'QualificationName',
                                    },
                                    secondaryText: {
                                        content: 'QualificationNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Орган акредитації:',
                                    },
                                    secondaryText: {
                                        content: 'Accreditation Authority',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Accreditation Institution Name',
                                    },
                                    secondaryText: {
                                        content: 'Accreditation Institution Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Ректор:',
                                    },
                                    secondaryText: {
                                        content: 'Rector',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'FullName',
                                    },
                                    secondaryText: {
                                        content: 'FullNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, що видав документ:',
                                    },
                                    secondaryText: {
                                        content: 'Name of awarding institution',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Issued by University Name',
                                    },
                                    secondaryText: {
                                        content: 'Issued by University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, до якого іноземець вступив на початку навчання в Україні:',
                                    },
                                    secondaryText: {
                                        content: 'The educational institution a foreigner entered at the beginning of studies in Ukraine',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Beginning University Name',
                                    },
                                    secondaryText: {
                                        content: 'Beginning University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Початок навчання в Україні:',
                                    },
                                    secondaryText: {
                                        content: 'Start of studies in Ukraine',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.beginningUniversityYear).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                ],
            ],
            [
                EducationDocumentType.DiplomaOfDoctorOfPhilosophy,
                { ...validEducationDocument, subtype: EducationDocumentType.DiplomaOfDoctorOfPhilosophy },
                [
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата народження:',
                                    },
                                    secondaryText: {
                                        content: 'Date of birth',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.birthDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти:',
                                    },
                                    secondaryText: {
                                        content: 'Educational institution',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Education University Name',
                                    },
                                    secondaryText: {
                                        content: 'Education University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, в спеціалізованій раді якого здійснювався захист дисертації:',
                                    },
                                    secondaryText: {
                                        content:
                                            'Educational institution, in the specialized council of which the dissertation was defended',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'ScientificCouncilUniversityName',
                                    },
                                    secondaryText: {
                                        content: 'ScientificCouncilUniversityNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата видачі:',
                                    },
                                    secondaryText: {
                                        content: 'Date of issue',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.issueDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата закінчення навчання:',
                                    },
                                    secondaryText: {
                                        content: 'Date of graduation',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.educationEndDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Науковий ступінь присуджено:',
                                    },
                                    secondaryText: {
                                        content: 'The academic degree was awarded on',
                                    },
                                },
                                {
                                    primaryText: { content: moment(validEducationDocument.educationEndDate).format(dateFormat) },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Спеціальність:',
                                    },
                                    secondaryText: {
                                        content: 'Programme Subject Area',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'SpecialityName',
                                    },
                                    secondaryText: {
                                        content: 'SpecialityNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Спеціалізація:',
                                    },
                                    secondaryText: {
                                        content: 'Specialization',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'SpecializationName',
                                    },
                                    secondaryText: {
                                        content: 'SpecializationNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Освітня програма:',
                                    },
                                    secondaryText: {
                                        content: 'Educational Programme',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'StudyProgramName',
                                    },
                                    secondaryText: {
                                        content: 'StudyProgramNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Орган акредитації:',
                                    },
                                    secondaryText: {
                                        content: 'Accreditation Authority',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Accreditation Institution Name',
                                    },
                                    secondaryText: {
                                        content: 'Accreditation Institution Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Ректор:',
                                    },
                                    secondaryText: {
                                        content: 'Rector',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'FullName',
                                    },
                                    secondaryText: {
                                        content: 'FullNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, що видав документ:',
                                    },
                                    secondaryText: {
                                        content: 'Name of awarding institution',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Issued by University Name',
                                    },
                                    secondaryText: {
                                        content: 'Issued by University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, до якого іноземець вступив на початку навчання в Україні:',
                                    },
                                    secondaryText: {
                                        content: 'The educational institution a foreigner entered at the beginning of studies in Ukraine',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Beginning University Name',
                                    },
                                    secondaryText: {
                                        content: 'Beginning University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Початок навчання в Україні:',
                                    },
                                    secondaryText: {
                                        content: 'Start of studies in Ukraine',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.beginningUniversityYear).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                ],
            ],
            [
                EducationDocumentType.CertificateOfBasicGeneralSecondaryEducationUnderSpecialProgram,
                {
                    ...validEducationDocument,
                    subtype: EducationDocumentType.CertificateOfBasicGeneralSecondaryEducationUnderSpecialProgram,
                    beginningUniversityName: '',
                    beginningUniversityNameEn: '',
                    beginningUniversityYear: '',
                },
                [
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата народження:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.birthDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Education University Name',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата видачі:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.issueDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата закінчення навчання:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.educationEndDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Директор:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'FullName',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, що видав документ:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Issued by University Name',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                ],
            ],
            [
                EducationDocumentType.CertificateOfStateApprovedWorkingQualification,
                {
                    ...validEducationDocument,
                    subtype: EducationDocumentType.CertificateOfStateApprovedWorkingQualification,
                    beginningUniversityName: '',
                    beginningUniversityNameEn: '',
                    beginningUniversityYear: '',
                    isDuplicate: true,
                },
                [
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата народження:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.birthDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Education University Name',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата видачі:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.issueDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата закінчення навчання:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.educationEndDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Професія:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'ProfessionText',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Ректор:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'FullName',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дублікат:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: `${validEducationDocument.series} ${validEducationDocument.id}`,
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, що видав документ:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Issued by University Name',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                ],
            ],
            [
                EducationDocumentType.DiplomaOfJuniorBachelor,
                {
                    ...validEducationDocument,
                    subtype: EducationDocumentType.DiplomaOfJuniorBachelor,
                    beginningUniversityName: '',
                    beginningUniversityNameEn: '',
                    beginningUniversityYear: '',
                    isDuplicate: true,
                },
                [
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата народження:',
                                    },
                                    secondaryText: {
                                        content: 'Date of birth',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.birthDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти:',
                                    },
                                    secondaryText: {
                                        content: 'Educational institution',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Education University Name',
                                    },
                                    secondaryText: {
                                        content: 'Education University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата видачі:',
                                    },
                                    secondaryText: {
                                        content: 'Date of issue',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.issueDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата закінчення навчання:',
                                    },
                                    secondaryText: {
                                        content: 'Date of graduation',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.educationEndDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Спеціальність:',
                                    },
                                    secondaryText: {
                                        content: 'Programme Subject Area',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'SpecialityName',
                                    },
                                    secondaryText: {
                                        content: 'SpecialityNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Спеціалізація:',
                                    },
                                    secondaryText: {
                                        content: 'Specialization',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'SpecializationName',
                                    },
                                    secondaryText: {
                                        content: 'SpecializationNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Освітня програма:',
                                    },
                                    secondaryText: {
                                        content: 'Educational Programme',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'StudyProgramName',
                                    },
                                    secondaryText: {
                                        content: 'StudyProgramNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Професійна кваліфікація:',
                                    },
                                    secondaryText: {
                                        content: 'Professional qualification',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'QualificationName',
                                    },
                                    secondaryText: {
                                        content: 'QualificationNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Орган акредитації:',
                                    },
                                    secondaryText: {
                                        content: 'Accreditation Authority',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Accreditation Institution Name',
                                    },
                                    secondaryText: {
                                        content: 'Accreditation Institution Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Ректор:',
                                    },
                                    secondaryText: {
                                        content: 'Rector',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'FullName',
                                    },
                                    secondaryText: {
                                        content: 'FullNameEn',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дублікат:',
                                    },
                                    secondaryText: {
                                        content: 'Duplicate',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: `${validEducationDocument.series} ${validEducationDocument.id}`,
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, що видав документ:',
                                    },
                                    secondaryText: {
                                        content: 'Name of awarding institution',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Issued by University Name',
                                    },
                                    secondaryText: {
                                        content: 'Issued by University Name En',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                ],
            ],
            [
                `${EducationDocumentType.DiplomaOfBachelor} (duplicate)`,
                {
                    ...validEducationDocument,
                    subtype: EducationDocumentType.DiplomaOfBachelor,
                    beginningUniversityName: '',
                    beginningUniversityNameEn: '',
                    beginningUniversityYear: '',
                    isDuplicate: true,
                },
                [
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата народження:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.birthDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Education University Name',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Ступінь вищої освіти:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Бакалавр',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата видачі:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.issueDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата закінчення навчання:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.educationEndDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Спеціальність:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'SpecialityName',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Спеціалізація:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'SpecializationName',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Освітня програма:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'StudyProgramName',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: { content: 'Професійна кваліфікація:' },
                                },
                                {
                                    primaryText: { content: 'QualificationName' },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Орган акредитації:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Accreditation Institution Name',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Ректор:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'FullName',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дублікат:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: `${validEducationDocument.series} ${validEducationDocument.id}`,
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, що видав документ:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Issued by University Name',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                ],
            ],
            [
                `${EducationDocumentType.DiplomaOfSpecialist} (duplicate)`,
                {
                    ...validEducationDocument,
                    subtype: EducationDocumentType.DiplomaOfSpecialist,
                    beginningUniversityName: '',
                    beginningUniversityNameEn: '',
                    beginningUniversityYear: '',
                    isDuplicate: true,
                },
                [
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата народження:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.birthDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Education University Name',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата видачі:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.issueDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дата закінчення навчання:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: moment(validEducationDocument.educationEndDate).format(dateFormat),
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Спеціальність:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'SpecialityName',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Спеціалізація:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'SpecializationName',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Освітня програма:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'StudyProgramName',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: { content: 'Професійна кваліфікація:' },
                                },
                                {
                                    primaryText: { content: 'QualificationName' },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Орган акредитації:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Accreditation Institution Name',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        hasSeparator: true,
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Ректор:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'FullName',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Дублікат:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: `${validEducationDocument.series} ${validEducationDocument.id}`,
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                    {
                        tableBlock: [
                            [
                                'twoColumns',
                                {
                                    primaryText: {
                                        content: 'Заклад освіти, що видав документ:',
                                    },
                                },
                                {
                                    primaryText: {
                                        content: 'Issued by University Name',
                                    },
                                },
                            ],
                        ],
                        marginBottom: 16,
                    },
                ],
            ],
        ])(
            'should successfully compose and return education blocks based on education document data when subtype is %s',
            (_subtype, educationDocument, expectedResult) => {
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
                const isShowDocNameEn = bilingualDocuments.includes(<EducationDocumentType>_subtype)

                const result = EducationDocumentService.getEducationBlocks(educationDocument, isShowDocNameEn)

                expect(result).toEqual(expectedResult)
            },
        )

        it('should fail with error in case education document strategy not found', () => {
            expect(() => {
                EducationDocumentService.getEducationBlocks({ ...validEducationDocument, subtype: <EducationDocumentType>'unknown' }, false)
            }).toThrow(new NotFoundError(`Education document strategy not found`))
        })
    })
})
