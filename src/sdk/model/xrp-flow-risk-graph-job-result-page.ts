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
import { XrpFlowRiskGraphRecord } from './xrp-flow-risk-graph-record';
import { XrpFlowRiskGraphJob } from './xrp-flow-risk-graph-job';


export interface XrpFlowRiskGraphJobResultPage { 
    hasNextPage?: boolean;
    job?: XrpFlowRiskGraphJob;
    nextPageToken?: string;
    records?: Array<XrpFlowRiskGraphRecord>;
    totalRecords?: number;
}
