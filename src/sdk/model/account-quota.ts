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


export interface AccountQuota { 
    /**
     * 剩餘可試用量。當授權方案為 `UNLIMITED` (無限配額)時，本欄位為 `null`
     */
    available?: number;
    /**
     * 授權方案
     */
    licenseType?: AccountQuota.LicenseTypeEnum;
    /**
     * 總試用量配額
     */
    total?: number;
    /**
     * 已使用量
     */
    used?: number;
}
export namespace AccountQuota {
    export type LicenseTypeEnum = 'TRIAL' | 'UNLIMITED';
    export const LicenseTypeEnum = {
        TRIAL: 'TRIAL' as LicenseTypeEnum,
        UNLIMITED: 'UNLIMITED' as LicenseTypeEnum
    };
}


