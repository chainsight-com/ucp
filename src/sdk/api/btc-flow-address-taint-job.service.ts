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

import { BtcFlowAddressTaintJob } from '../model/btc-flow-address-taint-job';
import { BtcFlowAddressTaintJobResultPage } from '../model/btc-flow-address-taint-job-result-page';
import { BtcFlowAddressTaintJobStatus } from '../model/btc-flow-address-taint-job-status';
import { BtcSingleAddressRoot } from '../model/btc-single-address-root';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable({
  providedIn: 'root'
})
export class BtcFlowAddressTaintJobApiService {

    protected basePath = 'http://localhost:45531';
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
     * createFlowAddressTaintJob
     * @param body body
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createFlowAddressTaintJobUsingPOSTDefault(body: BtcFlowAddressTaintJob, observe?: 'body', reportProgress?: boolean): Observable<BtcFlowAddressTaintJob>;
    public createFlowAddressTaintJobUsingPOSTDefault(body: BtcFlowAddressTaintJob, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BtcFlowAddressTaintJob>>;
    public createFlowAddressTaintJobUsingPOSTDefault(body: BtcFlowAddressTaintJob, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BtcFlowAddressTaintJob>>;
    public createFlowAddressTaintJobUsingPOSTDefault(body: BtcFlowAddressTaintJob, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling createFlowAddressTaintJobUsingPOSTDefault.');
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

        return this.httpClient.post<BtcFlowAddressTaintJob>(`${this.configuration.basePath}/api/btc-flow-address-taint-job`,
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
     * getFlowAddressTaintJobResult
     * @param id id
     * @param page page
     * @param size size
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getFlowAddressTaintJobResultUsingGETDefault(id: number, page: number, size: number, observe?: 'body', reportProgress?: boolean): Observable<BtcFlowAddressTaintJobResultPage>;
    public getFlowAddressTaintJobResultUsingGETDefault(id: number, page: number, size: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BtcFlowAddressTaintJobResultPage>>;
    public getFlowAddressTaintJobResultUsingGETDefault(id: number, page: number, size: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BtcFlowAddressTaintJobResultPage>>;
    public getFlowAddressTaintJobResultUsingGETDefault(id: number, page: number, size: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getFlowAddressTaintJobResultUsingGETDefault.');
        }
        if (page === null || page === undefined) {
            throw new Error('Required parameter page was null or undefined when calling getFlowAddressTaintJobResultUsingGETDefault.');
        }
        if (size === null || size === undefined) {
            throw new Error('Required parameter size was null or undefined when calling getFlowAddressTaintJobResultUsingGETDefault.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (page !== undefined && page !== null) {
            queryParameters = queryParameters.set('page', <any>page);
        }
        if (size !== undefined && size !== null) {
            queryParameters = queryParameters.set('size', <any>size);
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


        return this.httpClient.get<BtcFlowAddressTaintJobResultPage>(`${this.configuration.basePath}/api/btc-flow-address-taint-job/${encodeURIComponent(String(id))}/result`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * getFlowAddressTaintJobStatus
     * @param id id
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getFlowAddressTaintJobStatusUsingGETDefault(id: number, observe?: 'body', reportProgress?: boolean): Observable<BtcFlowAddressTaintJobStatus>;
    public getFlowAddressTaintJobStatusUsingGETDefault(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BtcFlowAddressTaintJobStatus>>;
    public getFlowAddressTaintJobStatusUsingGETDefault(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BtcFlowAddressTaintJobStatus>>;
    public getFlowAddressTaintJobStatusUsingGETDefault(id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getFlowAddressTaintJobStatusUsingGETDefault.');
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


        return this.httpClient.get<BtcFlowAddressTaintJobStatus>(`${this.configuration.basePath}/api/btc-flow-address-taint-job/${encodeURIComponent(String(id))}/status`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * nextFlowAddressTaintJobResult
     * @param id id
     * @param token token
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public nextFlowAddressTaintJobResultUsingGETDefault(id: number, token?: string, observe?: 'body', reportProgress?: boolean): Observable<BtcFlowAddressTaintJobResultPage>;
    public nextFlowAddressTaintJobResultUsingGETDefault(id: number, token?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BtcFlowAddressTaintJobResultPage>>;
    public nextFlowAddressTaintJobResultUsingGETDefault(id: number, token?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BtcFlowAddressTaintJobResultPage>>;
    public nextFlowAddressTaintJobResultUsingGETDefault(id: number, token?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling nextFlowAddressTaintJobResultUsingGETDefault.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (token !== undefined && token !== null) {
            queryParameters = queryParameters.set('token', <any>token);
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


        return this.httpClient.get<BtcFlowAddressTaintJobResultPage>(`${this.configuration.basePath}/api/btc-flow-address-taint-job/${encodeURIComponent(String(id))}/next-page`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * runFlowAddressTaintJob
     * @param page page
     * @param size size
     * @param body body
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public runFlowAddressTaintJobUsingPOSTDefault(page: number, size: number, body: BtcSingleAddressRoot, observe?: 'body', reportProgress?: boolean): Observable<BtcFlowAddressTaintJobResultPage>;
    public runFlowAddressTaintJobUsingPOSTDefault(page: number, size: number, body: BtcSingleAddressRoot, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BtcFlowAddressTaintJobResultPage>>;
    public runFlowAddressTaintJobUsingPOSTDefault(page: number, size: number, body: BtcSingleAddressRoot, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BtcFlowAddressTaintJobResultPage>>;
    public runFlowAddressTaintJobUsingPOSTDefault(page: number, size: number, body: BtcSingleAddressRoot, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (page === null || page === undefined) {
            throw new Error('Required parameter page was null or undefined when calling runFlowAddressTaintJobUsingPOSTDefault.');
        }
        if (size === null || size === undefined) {
            throw new Error('Required parameter size was null or undefined when calling runFlowAddressTaintJobUsingPOSTDefault.');
        }
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling runFlowAddressTaintJobUsingPOSTDefault.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (page !== undefined && page !== null) {
            queryParameters = queryParameters.set('page', <any>page);
        }
        if (size !== undefined && size !== null) {
            queryParameters = queryParameters.set('size', <any>size);
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

        return this.httpClient.post<BtcFlowAddressTaintJobResultPage>(`${this.configuration.basePath}/api/btc-flow-address-taint-job/run`,
            body,
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
