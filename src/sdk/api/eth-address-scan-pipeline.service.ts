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
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

import { EthAddressScanPipeline } from '../model/eth-address-scan-pipeline';
import { EthSingleAddressRoot } from '../model/eth-single-address-root';
import { PageOfEthAddressScanPipeline } from '../model/page-of-eth-address-scan-pipeline';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable({
  providedIn: 'root'
})
export class EthAddressScanPipelineApiService {

    protected basePath = 'http://localhost:43125';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {

        if (configuration) {
            this.configuration = configuration;
            this.configuration.basePath = configuration.basePath || basePath || this.basePath;

        } else {
            this.configuration.basePath = basePath || this.basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }



    /**
     * createBteAddressScanPipeline
     * @param body body
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createBteAddressScanPipelineUsingPOSTDefault1(body: EthSingleAddressRoot, observe?: 'body', reportProgress?: boolean): Observable<EthAddressScanPipeline>;
    public createBteAddressScanPipelineUsingPOSTDefault1(body: EthSingleAddressRoot, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<EthAddressScanPipeline>>;
    public createBteAddressScanPipelineUsingPOSTDefault1(body: EthSingleAddressRoot, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<EthAddressScanPipeline>>;
    public createBteAddressScanPipelineUsingPOSTDefault1(body: EthSingleAddressRoot, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling createBteAddressScanPipelineUsingPOSTDefault1.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<EthAddressScanPipeline>(`${this.configuration.basePath}/api/eth-address-scan-pipeline`,
            body,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * getEthAddressScanPipeline
     * @param id id
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getEthAddressScanPipelineUsingGETDefault(id: number, observe?: 'body', reportProgress?: boolean): Observable<EthAddressScanPipeline>;
    public getEthAddressScanPipelineUsingGETDefault(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<EthAddressScanPipeline>>;
    public getEthAddressScanPipelineUsingGETDefault(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<EthAddressScanPipeline>>;
    public getEthAddressScanPipelineUsingGETDefault(id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getEthAddressScanPipelineUsingGETDefault.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<EthAddressScanPipeline>(`${this.configuration.basePath}/api/eth-address-scan-pipeline/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * paginateEthAddressScanPipelines
     * @param page page
     * @param size size
     * @param creatorId creatorId
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public paginateEthAddressScanPipelinesUsingGETDefault(page?: number, size?: number, creatorId?: number, observe?: 'body', reportProgress?: boolean): Observable<PageOfEthAddressScanPipeline>;
    public paginateEthAddressScanPipelinesUsingGETDefault(page?: number, size?: number, creatorId?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<PageOfEthAddressScanPipeline>>;
    public paginateEthAddressScanPipelinesUsingGETDefault(page?: number, size?: number, creatorId?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<PageOfEthAddressScanPipeline>>;
    public paginateEthAddressScanPipelinesUsingGETDefault(page?: number, size?: number, creatorId?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (page !== undefined && page !== null) {
            queryParameters = queryParameters.set('page', <any>page);
        }
        if (size !== undefined && size !== null) {
            queryParameters = queryParameters.set('size', <any>size);
        }
        if (creatorId !== undefined && creatorId !== null) {
            queryParameters = queryParameters.set('creatorId', <any>creatorId);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<PageOfEthAddressScanPipeline>(`${this.configuration.basePath}/api/eth-address-scan-pipeline`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
