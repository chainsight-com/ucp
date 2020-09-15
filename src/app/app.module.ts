import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {en_US, NgZorroAntdModule, NZ_I18N} from 'ng-zorro-antd';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/zh';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthServiceConfig, GoogleLoginProvider, SocialLoginModule} from 'angularx-social-login';
import {JwtModule} from '@auth0/angular-jwt';
import {ScanPageComponent} from './pages/scan-page/scan-page.component';
import {AddressScanAddPageComponent} from './pages/address-scan/address-scan-add-page/address-scan-add-page.component';
import {DashboardPageComponent} from './pages/dashboard-page/dashboard-page.component';
import {BASE_PATH} from '@profyu/unblock-ng-sdk';
import {environment} from 'src/environments/environment';
import {CryptoPipe} from './pipes/crypto.pipe';
import {AddressScanPageComponent} from './pages/address-scan/address-scan-page/address-scan-page.component';
import {QuickScanAddFormComponent} from './component/quick-scan-add-form/quick-scan-add-form.component';

import {MarkdownModule} from 'ngx-markdown';
import {JwtInterceptor} from './interceptors/JwtInterceptor';
import {LogoutInterceptor} from './interceptors/LogoutInterceptor';

import {FlowLabelingPageComponent} from './pages/flow-labeling/flow-labeling-page/flow-labeling-page.component';
import {FlowLabelingAddComponent} from './pages/flow-labeling/flow-labeling-add/flow-labeling-add.component';
import {AddressScanDetailPageComponent} from "./pages/address-scan/address-scan-detail-page/address-scan-detail-page.component";
import { CcPipe } from './pipes/cc.pipe';
import { NotAuthorizedPageComponent } from './pages/not-authorized-page/not-authorized-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import {LayoutComponent} from "./shared/layout/layout.component";
import {SideMenuComponent} from "./shared/side-menu/side-menu.component";
import {UserService} from "./services/user.service";
import {TableComponent} from "./shared/table/table.component";
import {MenuTreeService} from "./services/menu-tree.service";
import { AddressScanBatchPageComponent } from './pages/address-scan-batch/address-scan-batch-page/address-scan-batch-page.component';
import { AddressScanBatchAddPageComponent } from './pages/address-scan-batch/address-scan-batch-add-page/address-scan-batch-add-page.component';
import {HighlightDirective} from "./directives/text-highlight.directive";
import { AddressCasePageComponent } from './pages/address-case/address-case-page/address-case-page.component';
import { AddressCaseAddPageComponent } from './pages/address-case/address-case-add-page/address-case-add-page.component';
import { AddressCaseDetailPageComponent } from './pages/address-case/address-case-detail-page/address-case-detail-page.component';
import { SummedClusterGraphComponent } from './component/summed-cluster-graph/summed-cluster-graph.component';
import { AddressInfoComponent } from './component/address-info/address-info.component';
import { HolderAddressTableComponent } from './component/holder-address/holder-address-table/holder-address-table.component';
import { ScoredTagComponent } from './component/scored-tag/scored-tag.component';
import { IncidentDetailPageComponent } from './pages/incident/incident-detail-page/incident-detail-page.component';
import { AddressScanTableComponent } from './component/address-scan/address-scan-table/address-scan-table.component';
import { IncidentClusterGraphComponent } from './component/incident-cluster-graph/incident-cluster-graph.component';
import { AddressScanFormComponent } from './component/address-scan/address-scan-form/address-scan-form.component';
import { IncidentTableComponent } from './component/incident/incident-table/incident-table.component';
import { IncidentFormComponent } from './component/incident/incident-form/incident-form.component';
import { IncidentPageComponent } from './pages/incident/incident-page/incident-page.component';

const menus: any[] = [

  {
    id: 'home',
    name: 'Home',
    path: 'dashboard',
    url: null,
    level: 1,
    icon: 'home',
    children: [],
    disabled: false,
  },
  {
    id: 'address-scan-page',
    name: 'Address Scan',
    subtitle: 'Address flow scanning',
    context: null,
    path: '/address-scan',
    url: null,
    icon: 'area-chart',
    disabled: false,
    level: 1,
    children: []
  },
  {
    id: 'address-scan-batch-page',
    name: 'Address Scan Batch',
    subtitle: 'Batch address flow scanning',
    context: null,
    path: '/address-scan-batch',
    url: null,
    icon: 'area-chart',
    disabled: false,
    level: 1,
    children: []
  },
  {
    id: 'address-case-page',
    name: 'Case Management',
    subtitle: 'Address case management',
    context: null,
    path: '/address-case',
    url: null,
    icon: 'area-chart',
    disabled: false,
    level: 1,
    children: []
  },
  {
    id: 'flow',
    name: 'Flow Labeling',
    path: '/flow-labeling-page',
    url: null,
    level: 1,
    icon: 'area-chart',
    children: []
  },
  {
    id: 'incident-page',
    name: 'Incident Management',
    subtitle: 'Incident management',
    context: null,
    path: '/incident',
    url: null,
    icon: 'area-chart',
    disabled: false,
    level: 1,
    children: []
  },
  // {
  //   id: 'kyc-lookup',
  //   name: 'KYC LOOKUP',
  //   context: null,
  //   path: '/kyc-lookup',
  //   url: null,
  //   icon: 'lock',
  //   disabled: true,
  //   level: 1,
  //   children: []
  // },
  // {
  //   id: 'holder-mgt',
  //   name: 'HOLDER MANAGEMENT',
  //   path: null,
  //   url: null,
  //   level: 1,
  //   icon: 'area-chart',
  //   children: [
  //     {
  //       id: 'holder-group',
  //       name: 'HOLDER GROUP',
  //       path: '/holder-group',
  //       url: null,
  //       icon: 'lock',
  //       disabled: true,
  //       level: 2,
  //       children: []
  //     },
  //     {
  //       id: 'holder',
  //       name: 'HOLDER',
  //       path: '/holder',
  //       url: null,
  //       level: 2,
  //       icon: 'lock',
  //       disabled: true,
  //       children: []
  //     }
  //   ]
  // },
  // {
  //   id: 'holder-scan',
  //   name: 'HOLDER SCAN',
  //   path: null,
  //   url: null,
  //   level: 1,
  //   icon: 'area-chart',
  //   children: [
  //     {
  //       id: 'scan',
  //       name: 'SCAN',
  //       path: '/holder-scan',
  //       url: null,
  //       icon: 'lock',
  //       // disabled: true,
  //       level: 2,
  //       children: []
  //     },
  //     {
  //       id: 'schedule',
  //       name: 'SCHEDULE',
  //       path: '/holder-scan-schedule',
  //       url: null,
  //       level: 2,
  //       icon: 'lock',
  //       // disabled: true,
  //       children: []
  //     },
  //     {
  //       id: 'tx-monitoring',
  //       name: 'TX MONITORING',
  //       path: '/tx-monitoring',
  //       url: null,
  //       level: 2,
  //       icon: 'lock',
  //       // disabled: true,
  //       children: []
  //     }
  //   ]
  // },
  // {
  //   id: 'ubo-identification',
  //   name: 'UBO IDENTIFICATION',
  //   path: '/ubo-identification',
  //   url: null,
  //   level: 1,
  //   icon: 'lock',
  //   disabled: true,
  //   children: []
  // },
  // {
  //   id: 'settings',
  //   name: 'SETTINGS',
  //   path: '/',
  //   url: null,
  //   level: 1,
  //   icon: 'area-chart',
  //   children: [
  //     {
  //       id: 'wallet-config',
  //       name: 'WALLET CONFIG',
  //       path: '/wallet-config',
  //       url: null,
  //       icon: 'lock',
  //       disabled: true,
  //       level: 2,
  //       children: []
  //     },
  //     {
  //       id: 'role-permission',
  //       name: 'ROLE & PERMISSION',
  //       path: '/role-permission',
  //       url: null,
  //       level: 2,
  //       icon: 'lock',
  //       disabled: true,
  //       children: []
  //     },
  //     {
  //       id: 'billing',
  //       name: 'BILLING',
  //       path: '/billing',
  //       url: null,
  //       level: 2,
  //       icon: 'lock',
  //       disabled: true,
  //       children: []
  //     }
  //   ]
  // }
];
export const LOCAL_TOKEN_KEY = 'access_token';

export function authServiceConfigFactory() {
  return new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(environment.googleOAuthClientId)
    }
  ]);
}

export function tokenGetter() {
  return localStorage.getItem(LOCAL_TOKEN_KEY);
}

// export function apiConfigFactory(): Configuration {
//   const params: ConfigurationParameters = {
//     accessToken: tokenGetter
//   };
//   return new Configuration(params);
// }

registerLocaleData(en);

// G6.track(false);

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    SideMenuComponent,
    TableComponent,
    ScanPageComponent,
    AddressScanAddPageComponent,
    DashboardPageComponent,
    AddressScanDetailPageComponent,
    CryptoPipe,
    HighlightDirective,
    AddressScanPageComponent,
    QuickScanAddFormComponent,
    FlowLabelingPageComponent,
    FlowLabelingAddComponent,
    CcPipe,
    NotAuthorizedPageComponent,
    LoginPageComponent,
    AddressScanBatchPageComponent,
    AddressScanBatchAddPageComponent,
    AddressCasePageComponent,
    AddressCaseAddPageComponent,
    AddressCaseDetailPageComponent,
    SummedClusterGraphComponent,
    AddressInfoComponent,
    HolderAddressTableComponent,
    ScoredTagComponent,
    IncidentDetailPageComponent,
    AddressScanTableComponent,
    IncidentClusterGraphComponent,
    AddressScanFormComponent,
    IncidentTableComponent,
    IncidentFormComponent,
    IncidentPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    NgZorroAntdModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    ZXingScannerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['unblock-analysis.com', 'localhost']
      }
    }),
    MarkdownModule.forRoot(),
  ],
  providers: [
    {provide: BASE_PATH, useValue: environment.baseApiUrl},
    {provide: NZ_I18N, useValue: en_US},
    // {provide: NZ_ICONS, useValue: icons},
    {
      provide: AuthServiceConfig,
      useFactory: authServiceConfigFactory
    },
    {provide: HTTP_INTERCEPTORS, useClass: LogoutInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: 'MENU_TREE_DATA', useValue: menus}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
