import { ObjectId } from 'bson'

import { convertParamsByRules } from '../../src'

describe('convertParamsByRules', () => {
    it('should convert strings to primitive', () => {
        const date = new Date().toString()
        const params = {
            testInt: '1',
            testFloat: '1.1',
            testNumberWithoutConvertation: '1.1',
            testObjectId: new ObjectId().toString(),
            testDate: date,
            testBuffer: Buffer.from(''),
            testObject: {
                testInnerKey: 'string',
                testInnerNumberKey: '1',
            },
            testArrayWithoutRules: ['string', '1.1'],
            testArray: ['string', '1.1'],
            testArrayWithInternalArray: [['innerValue']],
            testArrayWithInternalObject: [
                {
                    objectInternalKeyNumber: '10',
                },
            ],
            testArrayWithPrimitives: ['1.1', '2.2', '3.3'],
        }

        const result = convertParamsByRules(params, {
            testInt: {
                type: 'number',
                integer: true,
                convert: true,
            },
            testFloat: {
                type: 'number',
                convert: true,
                integer: false,
            },
            testNumberWithoutConvertation: {
                type: 'number',
                convert: false,
            },
            testObjectId: {
                type: 'objectId',
                convert: true,
            },
            testDate: {
                type: 'date',
                convert: true,
            },
            testBuffer: {
                type: 'buffer',
            },
            testObject: {
                type: 'object',
                props: {
                    testInnerKey: {
                        type: 'string',
                    },
                    testInnerNumberKey: {
                        type: 'number',
                        convert: true,
                        integer: true,
                    },
                },
            },
            testArrayWithoutRules: {
                type: 'array',
            },
            testArray: {
                type: 'array',
                items: {
                    type: 'string',
                },
            },
            testArrayWithInternalArray: {
                type: 'array',
                items: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
            },
            testArrayWithInternalObject: {
                type: 'array',
                items: {
                    type: 'object',
                    props: {
                        objectInternalKeyNumber: {
                            type: 'number',
                            convert: true,
                            integer: true,
                        },
                    },
                },
            },
            testArrayWithPrimitives: {
                type: 'array',
                items: 'date',
            },
        })

        expect(result).toMatchObject({
            testInt: 1,
            testFloat: 1.1,
            testNumberWithoutConvertation: '1.1',
            testObjectId: expect.any(ObjectId),
            testDate: expect.any(Date),
            testBuffer: expect.any(Buffer),
            testObject: {
                testInnerKey: 'string',
                testInnerNumberKey: 1,
            },
            testArrayWithoutRules: ['string', '1.1'],
            testArray: ['string', '1.1'],
            testArrayWithInternalArray: [['innerValue']],
            testArrayWithInternalObject: [
                {
                    objectInternalKeyNumber: 10,
                },
            ],
            testArrayWithPrimitives: ['1.1', '2.2', '3.3'],
        })
    })
})
