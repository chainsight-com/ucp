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

import { XrpFlowRiskGraph } from '../model/xrp-flow-risk-graph';
import { XrpFlowRiskGraphJob } from '../model/xrp-flow-risk-graph-job';
import { XrpFlowRiskGraphJobResultPage } from '../model/xrp-flow-risk-graph-job-result-page';
import { XrpFlowRiskGraphJobStatus } from '../model/xrp-flow-risk-graph-job-status';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable({
  providedIn: 'root'
})
export class XrpFlowRiskGraphJobApiService {

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
     * createFlowRiskGraphJob
     * @param body body
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createFlowRiskGraphJobUsingPOSTDefault2(body: XrpFlowRiskGraphJob, observe?: 'body', reportProgress?: boolean): Observable<XrpFlowRiskGraphJob>;
    public createFlowRiskGraphJobUsingPOSTDefault2(body: XrpFlowRiskGraphJob, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<XrpFlowRiskGraphJob>>;
    public createFlowRiskGraphJobUsingPOSTDefault2(body: XrpFlowRiskGraphJob, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<XrpFlowRiskGraphJob>>;
    public createFlowRiskGraphJobUsingPOSTDefault2(body: XrpFlowRiskGraphJob, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling createFlowRiskGraphJobUsingPOSTDefault2.');
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

        return this.httpClient.post<XrpFlowRiskGraphJob>(`${this.configuration.basePath}/api/xrp-flow-risk-graph-job`,
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
     * getFlowRiskGraphJobResult
     * @param id id
     * @param page page
     * @param size size
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getFlowRiskGraphJobResultUsingGETDefault2(id: number, page: number, size: number, observe?: 'body', reportProgress?: boolean): Observable<XrpFlowRiskGraphJobResultPage>;
    public getFlowRiskGraphJobResultUsingGETDefault2(id: number, page: number, size: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<XrpFlowRiskGraphJobResultPage>>;
    public getFlowRiskGraphJobResultUsingGETDefault2(id: number, page: number, size: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<XrpFlowRiskGraphJobResultPage>>;
    public getFlowRiskGraphJobResultUsingGETDefault2(id: number, page: number, size: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getFlowRiskGraphJobResultUsingGETDefault2.');
        }
        if (page === null || page === undefined) {
            throw new Error('Required parameter page was null or undefined when calling getFlowRiskGraphJobResultUsingGETDefault2.');
        }
        if (size === null || size === undefined) {
            throw new Error('Required parameter size was null or undefined when calling getFlowRiskGraphJobResultUsingGETDefault2.');
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


        return this.httpClient.get<XrpFlowRiskGraphJobResultPage>(`${this.configuration.basePath}/api/xrp-flow-risk-graph-job/${encodeURIComponent(String(id))}/result`,
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
     * getFlowRiskGraphJobStatus
     * @param id id
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getFlowRiskGraphJobStatusUsingGETDefault2(id: number, observe?: 'body', reportProgress?: boolean): Observable<XrpFlowRiskGraphJobStatus>;
    public getFlowRiskGraphJobStatusUsingGETDefault2(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<XrpFlowRiskGraphJobStatus>>;
    public getFlowRiskGraphJobStatusUsingGETDefault2(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<XrpFlowRiskGraphJobStatus>>;
    public getFlowRiskGraphJobStatusUsingGETDefault2(id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getFlowRiskGraphJobStatusUsingGETDefault2.');
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


        return this.httpClient.get<XrpFlowRiskGraphJobStatus>(`${this.configuration.basePath}/api/xrp-flow-risk-graph-job/${encodeURIComponent(String(id))}/status`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * nextFlowRiskGraphJobResult
     * @param id id
     * @param token token
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public nextFlowRiskGraphJobResultUsingGETDefault2(id: number, token?: string, observe?: 'body', reportProgress?: boolean): Observable<XrpFlowRiskGraphJobResultPage>;
    public nextFlowRiskGraphJobResultUsingGETDefault2(id: number, token?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<XrpFlowRiskGraphJobResultPage>>;
    public nextFlowRiskGraphJobResultUsingGETDefault2(id: number, token?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<XrpFlowRiskGraphJobResultPage>>;
    public nextFlowRiskGraphJobResultUsingGETDefault2(id: number, token?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling nextFlowRiskGraphJobResultUsingGETDefault2.');
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


        return this.httpClient.get<XrpFlowRiskGraphJobResultPage>(`${this.configuration.basePath}/api/xrp-flow-risk-graph-job/${encodeURIComponent(String(id))}/next-page`,
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
     * runFlowRiskGraphJob
     * @param page page
     * @param size size
     * @param body body
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public runFlowRiskGraphJobUsingPOSTDefault2(page: number, size: number, body: XrpFlowRiskGraphJob, observe?: 'body', reportProgress?: boolean): Observable<XrpFlowRiskGraph>;
    public runFlowRiskGraphJobUsingPOSTDefault2(page: number, size: number, body: XrpFlowRiskGraphJob, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<XrpFlowRiskGraph>>;
    public runFlowRiskGraphJobUsingPOSTDefault2(page: number, size: number, body: XrpFlowRiskGraphJob, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<XrpFlowRiskGraph>>;
    public runFlowRiskGraphJobUsingPOSTDefault2(page: number, size: number, body: XrpFlowRiskGraphJob, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (page === null || page === undefined) {
            throw new Error('Required parameter page was null or undefined when calling runFlowRiskGraphJobUsingPOSTDefault2.');
        }
        if (size === null || size === undefined) {
            throw new Error('Required parameter size was null or undefined when calling runFlowRiskGraphJobUsingPOSTDefault2.');
        }
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling runFlowRiskGraphJobUsingPOSTDefault2.');
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

        return this.httpClient.post<XrpFlowRiskGraph>(`${this.configuration.basePath}/api/xrp-flow-risk-graph-job/run`,
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
