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
import { BtcFlowRiskJob } from './btc-flow-risk-job';


export interface BtcRiskSummaryJob { 
    bqJob?: string;
    createdTime?: Date;
    creatorId?: number;
    flowRiskJob?: BtcFlowRiskJob;
    flowRiskJobId?: number;
    id?: number;
    updatedTime?: Date;
    updaterId?: number;
}
