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
import { Account } from './account';
import { XrpFlowJob } from './xrp-flow-job';


export interface XrpFlowAddressTagJob { 
    address?: string;
    backwardFlowJob?: XrpFlowJob;
    backwardFlowJobId?: number;
    bqJob?: string;
    createdTime?: Date;
    creatorId?: number;
    destDataset?: string;
    destProjectId?: string;
    destTable?: string;
    forwardFlowJob?: XrpFlowJob;
    forwardFlowJobId?: number;
    id?: number;
    updatedTime?: Date;
    updater?: Account;
}

