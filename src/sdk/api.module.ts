import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { AccountApiService } from './api/account.service';
import { AuthApiService } from './api/auth.service';
import { BtcAddressScanPipelineApiService } from './api/btc-address-scan-pipeline.service';
import { BtcFlowAddressTagJobApiService } from './api/btc-flow-address-tag-job.service';
import { BtcFlowAddressTaintJobApiService } from './api/btc-flow-address-taint-job.service';
import { BtcFlowJobApiService } from './api/btc-flow-job.service';
import { BtcFlowRiskGraphJobApiService } from './api/btc-flow-risk-graph-job.service';
import { BtcFlowRiskJobApiService } from './api/btc-flow-risk-job.service';
import { BtcRiskSummaryJobApiService } from './api/btc-risk-summary-job.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    AccountApiService,
    AuthApiService,
    BtcAddressScanPipelineApiService,
    BtcFlowAddressTagJobApiService,
    BtcFlowAddressTaintJobApiService,
    BtcFlowJobApiService,
    BtcFlowRiskGraphJobApiService,
    BtcFlowRiskJobApiService,
    BtcRiskSummaryJobApiService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
