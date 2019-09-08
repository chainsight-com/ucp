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
import { EthFlowRiskJob } from './eth-flow-risk-job';


export interface EthFlowAddressTaintJob { 
    bqJob?: string;
    createdTime?: Date;
    creatorId?: number;
    destDataset?: string;
    destProjectId?: string;
    destTable?: string;
    flowRiskJob?: EthFlowRiskJob;
    flowRiskJobId?: number;
    id?: number;
    updatedTime?: Date;
    updater?: Account;
}

