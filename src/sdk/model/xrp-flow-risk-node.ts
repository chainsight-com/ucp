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


export interface XrpFlowRiskNode { 
    address?: string;
    amount?: number;
    confidence?: number;
    score?: number;
    scoreEv?: number;
    tags?: Array<string>;
    tx?: string;
    txTime?: Date;
}
