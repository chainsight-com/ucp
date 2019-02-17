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

export interface SearchRoot {
    bitcoinAddress?: Array<models.Address>;

    ethAddress?: Array<models.EthAddress>;

    person?: models.Person;

}
