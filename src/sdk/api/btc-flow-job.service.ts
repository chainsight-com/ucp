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

import { BtcFlowJob } from '../model/btc-flow-job';
import { BtcFlowJobResultPage } from '../model/btc-flow-job-result-page';
import { BtcFlowJobStatus } from '../model/btc-flow-job-status';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable({
  providedIn: 'root'
})
export class BtcFlowJobApiService {

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
     * createFlowJob
     * @param body body
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createFlowJobUsingPOSTDefault(body: BtcFlowJob, observe?: 'body', reportProgress?: boolean): Observable<BtcFlowJob>;
    public createFlowJobUsingPOSTDefault(body: BtcFlowJob, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BtcFlowJob>>;
    public createFlowJobUsingPOSTDefault(body: BtcFlowJob, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BtcFlowJob>>;
    public createFlowJobUsingPOSTDefault(body: BtcFlowJob, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling createFlowJobUsingPOSTDefault.');
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

        return this.httpClient.post<BtcFlowJob>(`${this.configuration.basePath}/api/btc-flow-job`,
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
     * getFlowJobResult
     * @param id id
     * @param page page
     * @param size size
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getFlowJobResultUsingGETDefault(id: number, page: number, size: number, observe?: 'body', reportProgress?: boolean): Observable<BtcFlowJobResultPage>;
    public getFlowJobResultUsingGETDefault(id: number, page: number, size: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BtcFlowJobResultPage>>;
    public getFlowJobResultUsingGETDefault(id: number, page: number, size: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BtcFlowJobResultPage>>;
    public getFlowJobResultUsingGETDefault(id: number, page: number, size: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getFlowJobResultUsingGETDefault.');
        }
        if (page === null || page === undefined) {
            throw new Error('Required parameter page was null or undefined when calling getFlowJobResultUsingGETDefault.');
        }
        if (size === null || size === undefined) {
            throw new Error('Required parameter size was null or undefined when calling getFlowJobResultUsingGETDefault.');
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


        return this.httpClient.get<BtcFlowJobResultPage>(`${this.configuration.basePath}/api/btc-flow-job/${encodeURIComponent(String(id))}/result`,
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
     * getFlowJobStatus
     * @param id id
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getFlowJobStatusUsingGETDefault(id: number, observe?: 'body', reportProgress?: boolean): Observable<BtcFlowJobStatus>;
    public getFlowJobStatusUsingGETDefault(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BtcFlowJobStatus>>;
    public getFlowJobStatusUsingGETDefault(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BtcFlowJobStatus>>;
    public getFlowJobStatusUsingGETDefault(id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getFlowJobStatusUsingGETDefault.');
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


        return this.httpClient.get<BtcFlowJobStatus>(`${this.configuration.basePath}/api/btc-flow-job/${encodeURIComponent(String(id))}/status`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * nextFlowJobResult
     * @param id id
     * @param token token
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public nextFlowJobResultUsingGETDefault(id: number, token?: string, observe?: 'body', reportProgress?: boolean): Observable<BtcFlowJobResultPage>;
    public nextFlowJobResultUsingGETDefault(id: number, token?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BtcFlowJobResultPage>>;
    public nextFlowJobResultUsingGETDefault(id: number, token?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BtcFlowJobResultPage>>;
    public nextFlowJobResultUsingGETDefault(id: number, token?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling nextFlowJobResultUsingGETDefault.');
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


        return this.httpClient.get<BtcFlowJobResultPage>(`${this.configuration.basePath}/api/btc-flow-job/${encodeURIComponent(String(id))}/next-page`,
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
     * runFlowJob
     * @param page page
     * @param size size
     * @param body body
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public runFlowJobUsingPOSTDefault(page: number, size: number, body: BtcFlowJob, observe?: 'body', reportProgress?: boolean): Observable<BtcFlowJobResultPage>;
    public runFlowJobUsingPOSTDefault(page: number, size: number, body: BtcFlowJob, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<BtcFlowJobResultPage>>;
    public runFlowJobUsingPOSTDefault(page: number, size: number, body: BtcFlowJob, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<BtcFlowJobResultPage>>;
    public runFlowJobUsingPOSTDefault(page: number, size: number, body: BtcFlowJob, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (page === null || page === undefined) {
            throw new Error('Required parameter page was null or undefined when calling runFlowJobUsingPOSTDefault.');
        }
        if (size === null || size === undefined) {
            throw new Error('Required parameter size was null or undefined when calling runFlowJobUsingPOSTDefault.');
        }
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling runFlowJobUsingPOSTDefault.');
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

        return this.httpClient.post<BtcFlowJobResultPage>(`${this.configuration.basePath}/api/btc-flow-job/run`,
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
