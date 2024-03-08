import moment from 'moment'

import { NotFoundError } from '@diia-inhouse/errors'
import { Block, EducationDocument, EducationDocumentType, RowType } from '@diia-inhouse/types'

export default class EducationDocumentService {
    private static readonly dateFormat: string = 'DD.MM.YYYY'

    private static readonly strategies: Record<EducationDocumentType, (data: EducationDocument, isShowDocEngBlock: boolean) => Block[]> = {
        [EducationDocumentType.CertificateOfBasicGeneralSecondaryEducation]: this.getSecondaryEducation.bind(this),
        [EducationDocumentType.CertificateOfBasicGeneralSecondaryEducationUnderSpecialProgram]: this.getSecondaryEducation.bind(this),
        [EducationDocumentType.CertificateOfBasicSecondaryEducation]: this.getSecondaryEducation.bind(this),
        [EducationDocumentType.CertificateOfBasicSecondaryEducationWithSpecialConditions]: this.getSecondaryEducation.bind(this),
        [EducationDocumentType.CertificateOfCompleteGeneralSecondaryEducation]: this.getSecondaryEducation.bind(this),
        [EducationDocumentType.AttestationOfCompleteGeneralSecondaryEducation]: this.getSecondaryEducation.bind(this),
        [EducationDocumentType.DiplomaOfSkilledWorker]: this.getQualificationEducation.bind(this),
        [EducationDocumentType.CertificateOfStateApprovedWorkingQualification]: this.getQualificationEducation.bind(this),
        [EducationDocumentType.DiplomaOfJuniorSpecialist]: this.getDiplomaOfJunior.bind(this),
        [EducationDocumentType.DiplomaOfJuniorBachelor]: this.getDiplomaOfJunior.bind(this),
        [EducationDocumentType.DiplomaOfProfessionalJuniorBachelor]: this.getDiplomaOfJunior.bind(this),
        [EducationDocumentType.DiplomaOfBachelor]: this.getDiplomaOfBachelor.bind(this),
        [EducationDocumentType.DiplomaOfSpecialist]: this.getDiplomaOfSpecialist.bind(this),
        [EducationDocumentType.DiplomaOfMaster]: this.getDiplomaOfMaster.bind(this),
        [EducationDocumentType.DiplomaOfDoctorOfPhilosophy]: this.getDiplomaOfDoctor.bind(this),
        [EducationDocumentType.DiplomaOfDoctorOfArts]: this.getDiplomaOfDoctor.bind(this),
    }

    static getEducationBlocks(data: EducationDocument, isShowDocEngBlock: boolean): Block[] {
        const { subtype } = data

        const strategy = this.strategies[subtype]

        if (!strategy) {
            throw new NotFoundError(`Education document strategy not found`)
        }

        return strategy(data, isShowDocEngBlock)
    }

    private static getSecondaryEducation(data: EducationDocument, isShowDocEngBlock: boolean): Block[] {
        const {
            educationUniversityName,
            educationUniversityNameEn,
            educationEndDate,
            issueDate,
            birthDate,
            issuedByUniversityName,
            issuedByUniversityNameEn,
            bossFullName,
            bossFullNameEn,
            series,
            number,
            isDuplicate,
            beginningUniversityName,
            beginningUniversityNameEn,
            beginningUniversityYear,
        } = data

        return [
            ...(birthDate ? [this.getDateOfBirthBlock(isShowDocEngBlock, birthDate, this.dateFormat)] : []),
            this.getNameOfEducationalInstitutionGraduatedBlock(isShowDocEngBlock, educationUniversityName, educationUniversityNameEn),
            this.getDateOfIssueBlock(isShowDocEngBlock, issueDate, this.dateFormat),
            this.getDateOfGraduationBlock(isShowDocEngBlock, educationEndDate, this.dateFormat),
            { hasSeparator: true, marginBottom: 16 },
            this.getDirectorBlock(isShowDocEngBlock, bossFullName, bossFullNameEn),
            ...(isDuplicate ? [this.getDuplicateBlock(isShowDocEngBlock, series, number)] : []),
            ...(issuedByUniversityName
                ? [this.getNameOfAwardingInstitutionBlock(isShowDocEngBlock, issuedByUniversityName, issuedByUniversityNameEn)]
                : []),
            ...(beginningUniversityName || beginningUniversityYear ? [{ hasSeparator: true, marginBottom: 16 }] : []),
            ...(beginningUniversityName
                ? [this.getBeginningUniversityNameBlock(isShowDocEngBlock, beginningUniversityName, beginningUniversityNameEn)]
                : []),
            ...(beginningUniversityYear
                ? [this.getBeginningUniversityYearBlock(isShowDocEngBlock, beginningUniversityYear, this.dateFormat)]
                : []),
        ]
    }

    private static getQualificationEducation(data: EducationDocument, isShowDocEngBlock: boolean): Block[] {
        const {
            educationUniversityName,
            educationUniversityNameEn,
            educationEndDate,
            issueDate,
            birthDate,
            issuedByUniversityName,
            issuedByUniversityNameEn,
            bossFullName,
            bossFullNameEn,
            professionText,
            series,
            number,
            isDuplicate,
            beginningUniversityName,
            beginningUniversityNameEn,
            beginningUniversityYear,
        } = data

        return [
            ...(birthDate ? [this.getDateOfBirthBlock(isShowDocEngBlock, birthDate, this.dateFormat)] : []),
            this.getNameOfEducationalInstitutionGraduatedBlock(isShowDocEngBlock, educationUniversityName, educationUniversityNameEn),
            this.getDateOfIssueBlock(isShowDocEngBlock, issueDate, this.dateFormat),
            this.getDateOfGraduationBlock(isShowDocEngBlock, educationEndDate, this.dateFormat),
            ...(professionText ? [this.getProfessionBlock(professionText)] : []),
            { hasSeparator: true, marginBottom: 16 },
            this.getRectorBlock(isShowDocEngBlock, bossFullName, bossFullNameEn),
            ...(isDuplicate ? [this.getDuplicateBlock(isShowDocEngBlock, series, number)] : []),
            ...(issuedByUniversityName
                ? [this.getNameOfAwardingInstitutionBlock(isShowDocEngBlock, issuedByUniversityName, issuedByUniversityNameEn)]
                : []),
            ...(beginningUniversityName || beginningUniversityYear ? [{ hasSeparator: true, marginBottom: 16 }] : []),
            ...(beginningUniversityName
                ? [this.getBeginningUniversityNameBlock(isShowDocEngBlock, beginningUniversityName, beginningUniversityNameEn)]
                : []),
            ...(beginningUniversityYear
                ? [this.getBeginningUniversityYearBlock(isShowDocEngBlock, beginningUniversityYear, this.dateFormat)]
                : []),
        ]
    }

    private static getDiplomaOfJunior(data: EducationDocument, isShowDocEngBlock: boolean): Block[] {
        const {
            educationUniversityName,
            educationUniversityNameEn,
            educationEndDate,
            issueDate,
            birthDate,
            issuedByUniversityName,
            issuedByUniversityNameEn,
            bossFullName,
            bossFullNameEn,
            fieldOfStudy,
            fieldOfStudyEn,
            specialityName,
            specialityNameEn,
            specializationName,
            specializationNameEn,
            studyProgramName,
            studyProgramNameEn,
            qualificationName,
            qualificationNameEn,
            accreditationInstitutionName,
            accreditationInstitutionNameEn,
            series,
            number,
            isDuplicate,
            beginningUniversityName,
            beginningUniversityNameEn,
            beginningUniversityYear,
        } = data

        return [
            ...(birthDate ? [this.getDateOfBirthBlock(isShowDocEngBlock, birthDate, this.dateFormat)] : []),
            this.getNameOfEducationalInstitutionGraduatedBlock(isShowDocEngBlock, educationUniversityName, educationUniversityNameEn),
            this.getDateOfIssueBlock(isShowDocEngBlock, issueDate, this.dateFormat),
            this.getDateOfGraduationBlock(isShowDocEngBlock, educationEndDate, this.dateFormat),
            ...(fieldOfStudy ||
            specialityName ||
            specializationName ||
            studyProgramName ||
            qualificationName ||
            accreditationInstitutionName
                ? [{ hasSeparator: true, marginBottom: 16 }]
                : []),
            ...(fieldOfStudy ? [this.getFieldOfStudyBlock(isShowDocEngBlock, fieldOfStudy, fieldOfStudyEn)] : []),
            ...(specialityName ? [this.getProgrammeSubjectAreaBlock(isShowDocEngBlock, specialityName, specialityNameEn)] : []),
            ...(specializationName ? [this.getSpecializationBlock(isShowDocEngBlock, specializationName, specializationNameEn)] : []),
            ...(studyProgramName ? [this.getEducationalProgrammeBlock(isShowDocEngBlock, studyProgramName, studyProgramNameEn)] : []),
            ...(qualificationName
                ? [this.getProfessionalQualificationBlock(isShowDocEngBlock, qualificationName, qualificationNameEn)]
                : []),
            ...(accreditationInstitutionName
                ? [this.getAccreditationAuthorityBlock(isShowDocEngBlock, accreditationInstitutionName, accreditationInstitutionNameEn)]
                : []),
            { hasSeparator: true, marginBottom: 16 },
            this.getRectorBlock(isShowDocEngBlock, bossFullName, bossFullNameEn),
            ...(isDuplicate ? [this.getDuplicateBlock(isShowDocEngBlock, series, number)] : []),
            ...(issuedByUniversityName
                ? [this.getNameOfAwardingInstitutionBlock(isShowDocEngBlock, issuedByUniversityName, issuedByUniversityNameEn)]
                : []),
            ...(beginningUniversityName || beginningUniversityYear ? [{ hasSeparator: true, marginBottom: 16 }] : []),
            ...(beginningUniversityName
                ? [this.getBeginningUniversityNameBlock(isShowDocEngBlock, beginningUniversityName, beginningUniversityNameEn)]
                : []),
            ...(beginningUniversityYear
                ? [this.getBeginningUniversityYearBlock(isShowDocEngBlock, beginningUniversityYear, this.dateFormat)]
                : []),
        ]
    }

    private static getDiplomaOfBachelor(data: EducationDocument, isShowDocEngBlock: boolean): Block[] {
        const {
            educationUniversityName,
            educationUniversityNameEn,
            educationEndDate,
            issueDate,
            birthDate,
            issuedByUniversityName,
            issuedByUniversityNameEn,
            bossFullName,
            bossFullNameEn,
            fieldOfStudy,
            fieldOfStudyEn,
            specialityName,
            specialityNameEn,
            specializationName,
            specializationNameEn,
            studyProgramName,
            studyProgramNameEn,
            qualificationName,
            qualificationNameEn,
            accreditationInstitutionName,
            accreditationInstitutionNameEn,
            series,
            number,
            isDuplicate,
            beginningUniversityName,
            beginningUniversityNameEn,
            beginningUniversityYear,
        } = data

        return [
            ...(birthDate ? [this.getDateOfBirthBlock(isShowDocEngBlock, birthDate, this.dateFormat)] : []),
            this.getNameOfEducationalInstitutionGraduatedBlock(isShowDocEngBlock, educationUniversityName, educationUniversityNameEn),
            this.getDegreeBlock(isShowDocEngBlock, 'Бакалавр', 'Bachelor’s'),
            this.getDateOfIssueBlock(isShowDocEngBlock, issueDate, this.dateFormat),
            this.getDateOfGraduationBlock(isShowDocEngBlock, educationEndDate, this.dateFormat),
            ...(fieldOfStudy ||
            specialityName ||
            specializationName ||
            studyProgramName ||
            qualificationName ||
            accreditationInstitutionName
                ? [{ hasSeparator: true, marginBottom: 16 }]
                : []),
            ...(fieldOfStudy ? [this.getFieldOfStudyBlock(isShowDocEngBlock, fieldOfStudy, fieldOfStudyEn)] : []),
            ...(specialityName ? [this.getProgrammeSubjectAreaBlock(isShowDocEngBlock, specialityName, specialityNameEn)] : []),
            ...(specializationName ? [this.getSpecializationBlock(isShowDocEngBlock, specializationName, specializationNameEn)] : []),
            ...(studyProgramName ? [this.getEducationalProgrammeBlock(isShowDocEngBlock, studyProgramName, studyProgramNameEn)] : []),
            ...(qualificationName
                ? [this.getProfessionalQualificationBlock(isShowDocEngBlock, qualificationName, qualificationNameEn)]
                : []),
            ...(accreditationInstitutionName
                ? [this.getAccreditationAuthorityBlock(isShowDocEngBlock, accreditationInstitutionName, accreditationInstitutionNameEn)]
                : []),
            { hasSeparator: true, marginBottom: 16 },
            this.getRectorBlock(isShowDocEngBlock, bossFullName, bossFullNameEn),
            ...(isDuplicate ? [this.getDuplicateBlock(isShowDocEngBlock, series, number)] : []),
            ...(issuedByUniversityName
                ? [this.getNameOfAwardingInstitutionBlock(isShowDocEngBlock, issuedByUniversityName, issuedByUniversityNameEn)]
                : []),
            ...(beginningUniversityName || beginningUniversityYear ? [{ hasSeparator: true, marginBottom: 16 }] : []),
            ...(beginningUniversityName
                ? [this.getBeginningUniversityNameBlock(isShowDocEngBlock, beginningUniversityName, beginningUniversityNameEn)]
                : []),
            ...(beginningUniversityYear
                ? [this.getBeginningUniversityYearBlock(isShowDocEngBlock, beginningUniversityYear, this.dateFormat)]
                : []),
        ]
    }

    private static getDiplomaOfSpecialist(data: EducationDocument, isShowDocEngBlock: boolean): Block[] {
        const {
            educationUniversityName,
            educationUniversityNameEn,
            educationEndDate,
            issueDate,
            birthDate,
            issuedByUniversityName,
            issuedByUniversityNameEn,
            bossFullName,
            bossFullNameEn,
            specialityName,
            specialityNameEn,
            specializationName,
            specializationNameEn,
            studyProgramName,
            studyProgramNameEn,
            qualificationName,
            qualificationNameEn,
            accreditationInstitutionName,
            accreditationInstitutionNameEn,
            series,
            number,
            isDuplicate,
            beginningUniversityName,
            beginningUniversityNameEn,
            beginningUniversityYear,
        } = data

        return [
            ...(birthDate ? [this.getDateOfBirthBlock(isShowDocEngBlock, birthDate, this.dateFormat)] : []),
            this.getNameOfEducationalInstitutionGraduatedBlock(isShowDocEngBlock, educationUniversityName, educationUniversityNameEn),
            this.getDateOfIssueBlock(isShowDocEngBlock, issueDate, this.dateFormat),
            this.getDateOfGraduationBlock(isShowDocEngBlock, educationEndDate, this.dateFormat),
            ...(specialityName || specializationName || studyProgramName || qualificationName || accreditationInstitutionName
                ? [{ hasSeparator: true, marginBottom: 16 }]
                : []),
            ...(specialityName ? [this.getProgrammeSubjectAreaBlock(isShowDocEngBlock, specialityName, specialityNameEn)] : []),
            ...(specializationName ? [this.getSpecializationBlock(isShowDocEngBlock, specializationName, specializationNameEn)] : []),
            ...(studyProgramName ? [this.getEducationalProgrammeBlock(isShowDocEngBlock, studyProgramName, studyProgramNameEn)] : []),
            ...(qualificationName
                ? [this.getProfessionalQualificationBlock(isShowDocEngBlock, qualificationName, qualificationNameEn)]
                : []),
            ...(accreditationInstitutionName
                ? [this.getAccreditationAuthorityBlock(isShowDocEngBlock, accreditationInstitutionName, accreditationInstitutionNameEn)]
                : []),
            { hasSeparator: true, marginBottom: 16 },
            this.getRectorBlock(isShowDocEngBlock, bossFullName, bossFullNameEn),
            ...(isDuplicate ? [this.getDuplicateBlock(isShowDocEngBlock, series, number)] : []),
            ...(issuedByUniversityName
                ? [this.getNameOfAwardingInstitutionBlock(isShowDocEngBlock, issuedByUniversityName, issuedByUniversityNameEn)]
                : []),
            ...(beginningUniversityName || beginningUniversityYear ? [{ hasSeparator: true, marginBottom: 16 }] : []),
            ...(beginningUniversityName
                ? [this.getBeginningUniversityNameBlock(isShowDocEngBlock, beginningUniversityName, beginningUniversityNameEn)]
                : []),
            ...(beginningUniversityYear
                ? [this.getBeginningUniversityYearBlock(isShowDocEngBlock, beginningUniversityYear, this.dateFormat)]
                : []),
        ]
    }

    private static getDiplomaOfMaster(data: EducationDocument, isShowDocEngBlock: boolean): Block[] {
        const {
            educationUniversityName,
            educationUniversityNameEn,
            educationEndDate,
            issueDate,
            birthDate,
            issuedByUniversityName,
            issuedByUniversityNameEn,
            bossFullName,
            bossFullNameEn,
            specialityName,
            specialityNameEn,
            specializationName,
            specializationNameEn,
            studyProgramName,
            studyProgramNameEn,
            qualificationName,
            qualificationNameEn,
            accreditationInstitutionName,
            accreditationInstitutionNameEn,
            fieldOfStudy,
            fieldOfStudyEn,
            series,
            number,
            isDuplicate,
            beginningUniversityName,
            beginningUniversityNameEn,
            beginningUniversityYear,
        } = data

        return [
            ...(birthDate ? [this.getDateOfBirthBlock(isShowDocEngBlock, birthDate, this.dateFormat)] : []),
            this.getNameOfEducationalInstitutionGraduatedBlock(isShowDocEngBlock, educationUniversityName, educationUniversityNameEn),
            this.getDegreeBlock(isShowDocEngBlock, 'Магістр', 'Master’s'),
            this.getDateOfIssueBlock(isShowDocEngBlock, issueDate, this.dateFormat),
            this.getDateOfGraduationBlock(isShowDocEngBlock, educationEndDate, this.dateFormat),
            ...(fieldOfStudy ||
            specialityName ||
            specializationName ||
            studyProgramName ||
            qualificationName ||
            accreditationInstitutionName
                ? [{ hasSeparator: true, marginBottom: 16 }]
                : []),
            ...(fieldOfStudy ? [this.getFieldOfStudyBlock(isShowDocEngBlock, fieldOfStudy, fieldOfStudyEn)] : []),
            ...(specialityName ? [this.getProgrammeSubjectAreaBlock(isShowDocEngBlock, specialityName, specialityNameEn)] : []),
            ...(specializationName ? [this.getSpecializationBlock(isShowDocEngBlock, specializationName, specializationNameEn)] : []),
            ...(studyProgramName ? [this.getEducationalProgrammeBlock(isShowDocEngBlock, studyProgramName, studyProgramNameEn)] : []),
            ...(qualificationName
                ? [this.getProfessionalQualificationBlock(isShowDocEngBlock, qualificationName, qualificationNameEn)]
                : []),
            ...(accreditationInstitutionName
                ? [this.getAccreditationAuthorityBlock(isShowDocEngBlock, accreditationInstitutionName, accreditationInstitutionNameEn)]
                : []),
            { hasSeparator: true, marginBottom: 16 },
            this.getRectorBlock(isShowDocEngBlock, bossFullName, bossFullNameEn),
            ...(isDuplicate ? [this.getDuplicateBlock(isShowDocEngBlock, series, number)] : []),
            ...(issuedByUniversityName
                ? [this.getNameOfAwardingInstitutionBlock(isShowDocEngBlock, issuedByUniversityName, issuedByUniversityNameEn)]
                : []),
            ...(beginningUniversityName || beginningUniversityYear ? [{ hasSeparator: true, marginBottom: 16 }] : []),
            ...(beginningUniversityName
                ? [this.getBeginningUniversityNameBlock(isShowDocEngBlock, beginningUniversityName, beginningUniversityNameEn)]
                : []),
            ...(beginningUniversityYear
                ? [this.getBeginningUniversityYearBlock(isShowDocEngBlock, beginningUniversityYear, this.dateFormat)]
                : []),
        ]
    }

    private static getDiplomaOfDoctor(data: EducationDocument, isShowDocEngBlock: boolean): Block[] {
        const {
            educationUniversityName,
            educationUniversityNameEn,
            educationEndDate,
            issueDate,
            birthDate,
            issuedByUniversityName,
            issuedByUniversityNameEn,
            bossFullName,
            bossFullNameEn,
            specialityName,
            specialityNameEn,
            specializationName,
            specializationNameEn,
            studyProgramName,
            studyProgramNameEn,
            accreditationInstitutionName,
            accreditationInstitutionNameEn,
            fieldOfStudy,
            fieldOfStudyEn,
            scientificDegreeDate,
            scientificCouncilUniversityName,
            scientificCouncilUniversityNameEn,
            series,
            number,
            isDuplicate,
            beginningUniversityName,
            beginningUniversityNameEn,
            beginningUniversityYear,
        } = data

        return [
            ...(birthDate ? [this.getDateOfBirthBlock(isShowDocEngBlock, birthDate, this.dateFormat)] : []),
            this.getNameOfEducationalInstitutionGraduatedBlock(isShowDocEngBlock, educationUniversityName, educationUniversityNameEn),
            ...(scientificCouncilUniversityName
                ? [this.getSpecializedCouncilBlock(isShowDocEngBlock, scientificCouncilUniversityName, scientificCouncilUniversityNameEn)]
                : []),
            this.getDateOfIssueBlock(isShowDocEngBlock, issueDate, this.dateFormat),
            this.getDateOfGraduationBlock(isShowDocEngBlock, educationEndDate, this.dateFormat),
            ...(scientificDegreeDate ? [this.getAcademicAwardBlock(isShowDocEngBlock, scientificDegreeDate, this.dateFormat)] : []),
            ...(fieldOfStudy || specialityName || specializationName || studyProgramName || accreditationInstitutionName
                ? [{ hasSeparator: true, marginBottom: 16 }]
                : []),
            ...(fieldOfStudy ? [this.getFieldOfStudyBlock(isShowDocEngBlock, fieldOfStudy, fieldOfStudyEn)] : []),
            ...(specialityName ? [this.getProgrammeSubjectAreaBlock(isShowDocEngBlock, specialityName, specialityNameEn)] : []),
            ...(specializationName ? [this.getSpecializationBlock(isShowDocEngBlock, specializationName, specializationNameEn)] : []),
            ...(studyProgramName ? [this.getEducationalProgrammeBlock(isShowDocEngBlock, studyProgramName, studyProgramNameEn)] : []),
            ...(accreditationInstitutionName
                ? [this.getAccreditationAuthorityBlock(isShowDocEngBlock, accreditationInstitutionName, accreditationInstitutionNameEn)]
                : []),
            { hasSeparator: true, marginBottom: 16 },
            this.getRectorBlock(isShowDocEngBlock, bossFullName, bossFullNameEn),
            ...(isDuplicate ? [this.getDuplicateBlock(isShowDocEngBlock, series, number)] : []),
            ...(issuedByUniversityName
                ? [this.getNameOfAwardingInstitutionBlock(isShowDocEngBlock, issuedByUniversityName, issuedByUniversityNameEn)]
                : []),
            ...(beginningUniversityName || beginningUniversityYear ? [{ hasSeparator: true, marginBottom: 16 }] : []),
            ...(beginningUniversityName
                ? [this.getBeginningUniversityNameBlock(isShowDocEngBlock, beginningUniversityName, beginningUniversityNameEn)]
                : []),
            ...(beginningUniversityYear
                ? [this.getBeginningUniversityYearBlock(isShowDocEngBlock, beginningUniversityYear, this.dateFormat)]
                : []),
        ]
    }

    private static getDegreeBlock(isShowDocEngBlock: boolean, degree: string, degreeEn: string): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Ступінь вищої освіти:',
                        },
                        ...(isShowDocEngBlock && degreeEn
                            ? {
                                  secondaryText: {
                                      content: 'Degree',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: degree,
                        },
                        ...(isShowDocEngBlock && degreeEn
                            ? {
                                  secondaryText: {
                                      content: degreeEn,
                                  },
                              }
                            : {}),
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getProfessionalQualificationBlock(
        isShowDocEngBlock: boolean,
        qualificationName: string,
        qualificationNameEn?: string,
    ): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Професійна кваліфікація:',
                        },
                        ...(isShowDocEngBlock && qualificationNameEn
                            ? {
                                  secondaryText: {
                                      content: 'Professional qualification',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: qualificationName,
                        },
                        ...(isShowDocEngBlock && qualificationNameEn
                            ? {
                                  secondaryText: {
                                      content: qualificationNameEn,
                                  },
                              }
                            : {}),
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getDateOfBirthBlock(isShowDocEngBlock: boolean, birthDate: Date, dateFormat: string): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Дата народження:',
                        },
                        ...(isShowDocEngBlock
                            ? {
                                  secondaryText: {
                                      content: 'Date of birth',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: moment(birthDate).format(dateFormat),
                        },
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getNameOfEducationalInstitutionGraduatedBlock(
        isShowDocEngBlock: boolean,
        educationUniversityName: string,
        educationUniversityNameEn?: string,
    ): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Заклад освіти:',
                        },
                        ...(isShowDocEngBlock && educationUniversityNameEn
                            ? {
                                  secondaryText: {
                                      content: 'Educational institution',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: educationUniversityName,
                        },
                        ...(isShowDocEngBlock && educationUniversityNameEn
                            ? {
                                  secondaryText: {
                                      content: educationUniversityNameEn,
                                  },
                              }
                            : {}),
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getDateOfIssueBlock(isShowDocEngBlock: boolean, issueDate?: Date, dateFormat?: string): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Дата видачі:',
                        },
                        ...(isShowDocEngBlock
                            ? {
                                  secondaryText: {
                                      content: 'Date of issue',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: moment(issueDate).format(dateFormat),
                        },
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getDateOfGraduationBlock(isShowDocEngBlock: boolean, educationEndDate: Date, dateFormat: string): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Дата закінчення навчання:',
                        },
                        ...(isShowDocEngBlock
                            ? {
                                  secondaryText: {
                                      content: 'Date of graduation',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: moment(educationEndDate).format(dateFormat),
                        },
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getFieldOfStudyBlock(isShowDocEngBlock: boolean, fieldOfStudy: string, fieldOfStudyEn?: string): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Галузь знань:',
                        },
                        ...(isShowDocEngBlock && fieldOfStudyEn
                            ? {
                                  secondaryText: {
                                      content: 'Field(s) of Study',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: fieldOfStudy,
                        },
                        ...(isShowDocEngBlock && fieldOfStudyEn
                            ? {
                                  secondaryText: {
                                      content: fieldOfStudyEn,
                                  },
                              }
                            : {}),
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getProgrammeSubjectAreaBlock(isShowDocEngBlock: boolean, specialityName: string, specialityNameEn?: string): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Спеціальність:',
                        },
                        ...(isShowDocEngBlock && specialityNameEn
                            ? {
                                  secondaryText: {
                                      content: 'Programme Subject Area',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: specialityName,
                        },
                        ...(isShowDocEngBlock && specialityNameEn
                            ? {
                                  secondaryText: {
                                      content: specialityNameEn,
                                  },
                              }
                            : {}),
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getSpecializationBlock(isShowDocEngBlock: boolean, specializationName: string, specializationNameEn?: string): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Спеціалізація:',
                        },
                        ...(isShowDocEngBlock && specializationNameEn
                            ? {
                                  secondaryText: {
                                      content: 'Specialization',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: specializationName,
                        },
                        ...(isShowDocEngBlock && specializationNameEn
                            ? {
                                  secondaryText: {
                                      content: specializationNameEn,
                                  },
                              }
                            : {}),
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getEducationalProgrammeBlock(isShowDocEngBlock: boolean, studyProgramName: string, studyProgramNameEn?: string): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Освітня програма:',
                        },
                        ...(isShowDocEngBlock && studyProgramNameEn
                            ? {
                                  secondaryText: {
                                      content: 'Educational Programme',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: studyProgramName,
                        },
                        ...(isShowDocEngBlock && studyProgramNameEn
                            ? {
                                  secondaryText: {
                                      content: studyProgramNameEn,
                                  },
                              }
                            : {}),
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getAccreditationAuthorityBlock(
        isShowDocEngBlock: boolean,
        accreditationInstitutionName: string,
        accreditationInstitutionNameEn?: string,
    ): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Орган акредитації:',
                        },
                        ...(isShowDocEngBlock && accreditationInstitutionNameEn
                            ? {
                                  secondaryText: {
                                      content: 'Accreditation Authority',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: accreditationInstitutionName,
                        },
                        ...(isShowDocEngBlock && accreditationInstitutionNameEn
                            ? {
                                  secondaryText: {
                                      content: accreditationInstitutionNameEn,
                                  },
                              }
                            : {}),
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getDirectorBlock(isShowDocEngBlock: boolean, bossFullName: string, bossFullNameEn?: string): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Директор:',
                        },
                        ...(isShowDocEngBlock && bossFullNameEn
                            ? {
                                  secondaryText: {
                                      content: 'Director',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: bossFullName,
                        },
                        ...(isShowDocEngBlock && bossFullNameEn
                            ? {
                                  secondaryText: {
                                      content: bossFullNameEn,
                                  },
                              }
                            : {}),
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getRectorBlock(isShowDocEngBlock: boolean, bossFullName: string, bossFullNameEn?: string): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Ректор:',
                        },
                        ...(isShowDocEngBlock && bossFullNameEn
                            ? {
                                  secondaryText: {
                                      content: 'Rector',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: bossFullName,
                        },
                        ...(isShowDocEngBlock && bossFullNameEn
                            ? {
                                  secondaryText: {
                                      content: bossFullNameEn,
                                  },
                              }
                            : {}),
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getProfessionBlock(professionText: string): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Професія:',
                        },
                    },
                    {
                        primaryText: {
                            content: professionText,
                        },
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getNameOfAwardingInstitutionBlock(
        isShowDocEngBlock: boolean,
        issuedByUniversityName: string,
        issuedByUniversityNameEn?: string,
    ): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Заклад освіти, що видав документ:',
                        },
                        ...(isShowDocEngBlock && issuedByUniversityNameEn
                            ? {
                                  secondaryText: {
                                      content: 'Name of awarding institution',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: issuedByUniversityName,
                        },
                        ...(isShowDocEngBlock && issuedByUniversityNameEn
                            ? {
                                  secondaryText: {
                                      content: issuedByUniversityNameEn,
                                  },
                              }
                            : {}),
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getDuplicateBlock(isShowDocEngBlock: boolean, series: string, number: string): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Дублікат:',
                        },
                        ...(isShowDocEngBlock
                            ? {
                                  secondaryText: {
                                      content: 'Duplicate',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: `${series} ${number}`,
                        },
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getBeginningUniversityNameBlock(
        isShowDocEngBlock: boolean,
        beginningUniversityName: string,
        beginningUniversityNameEn?: string,
    ): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Заклад освіти, до якого іноземець вступив на початку навчання в Україні:',
                        },
                        ...(isShowDocEngBlock && beginningUniversityNameEn
                            ? {
                                  secondaryText: {
                                      content: 'The educational institution a foreigner entered at the beginning of studies in Ukraine',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: beginningUniversityName,
                        },
                        ...(isShowDocEngBlock && beginningUniversityNameEn
                            ? {
                                  secondaryText: {
                                      content: beginningUniversityNameEn,
                                  },
                              }
                            : {}),
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getBeginningUniversityYearBlock(isShowDocEngBlock: boolean, beginningUniversityYear: string, dateFormat: string): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Початок навчання в Україні:',
                        },
                        ...(isShowDocEngBlock
                            ? {
                                  secondaryText: {
                                      content: 'Start of studies in Ukraine',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: moment(beginningUniversityYear).format(dateFormat),
                        },
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getAcademicAwardBlock(isShowDocEngBlock: boolean, scientificDegreeDate: Date, dateFormat: string): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Науковий ступінь присуджено:',
                        },
                        ...(isShowDocEngBlock
                            ? {
                                  secondaryText: {
                                      content: 'The academic degree was awarded on',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: moment(scientificDegreeDate).format(dateFormat),
                        },
                    },
                ],
            ],
            marginBottom: 16,
        }
    }

    private static getSpecializedCouncilBlock(
        isShowDocEngBlock: boolean,
        scientificCouncilUniversityName: string,
        scientificCouncilUniversityNameEn?: string,
    ): Block {
        return {
            tableBlock: [
                [
                    RowType.TwoColumns,
                    {
                        primaryText: {
                            content: 'Заклад освіти, в спеціалізованій раді якого здійснювався захист дисертації:',
                        },
                        ...(isShowDocEngBlock && scientificCouncilUniversityNameEn
                            ? {
                                  secondaryText: {
                                      content: 'Educational institution, in the specialized council of which the dissertation was defended',
                                  },
                              }
                            : {}),
                    },
                    {
                        primaryText: {
                            content: scientificCouncilUniversityName,
                        },
                        ...(isShowDocEngBlock && scientificCouncilUniversityNameEn
                            ? {
                                  secondaryText: {
                                      content: scientificCouncilUniversityNameEn,
                                  },
                              }
                            : {}),
                    },
                ],
            ],
            marginBottom: 16,
        }
    }
}
