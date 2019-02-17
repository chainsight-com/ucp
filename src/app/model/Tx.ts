/**
 * UnBlock RESTful Web API
 * An Bitcoin analysis service
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import * as models from './models';

export interface Tx {
    block?: models.Block;

    hash?: string;

    id?: number;

    idObject?: models.IdObject;

    lockTime?: number;

    time?: number;

    type?: string;

    version?: number;

    vins?: Array<models.Vout>;

    vouts?: Array<models.Vout>;

}
