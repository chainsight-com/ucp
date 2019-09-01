/**
 * UnBlock RESTful Web API
 * An blockchain analysis service
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface BtcFlowJob { 
    address?: string;
    bqJob?: string;
    createdTime?: Date;
    creatorId?: number;
    destDataset?: string;
    destProjectId?: string;
    destTable?: string;
    directionType?: BtcFlowJob.DirectionTypeEnum;
    endingTime?: Date;
    id?: number;
    maxLevel?: number;
    startingTime?: Date;
    updatedTime?: Date;
    updaterId?: number;
}
export namespace BtcFlowJob {
    export type DirectionTypeEnum = 'FORWARD' | 'BACKWARD';
    export const DirectionTypeEnum = {
        FORWARD: 'FORWARD' as DirectionTypeEnum,
        BACKWARD: 'BACKWARD' as DirectionTypeEnum
    };
}

