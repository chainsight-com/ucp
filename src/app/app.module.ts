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
import {HolderComponent} from './pages/holder/holder.component';
import {HolderScanScheduleAddComponent} from './pages/holder-scan-schedule-add/holder-scan-schedule-add.component';
import {HolderScanScheduleComponent} from './pages/holder-scan-schedule/holder-scan-schedule.component';
import {HolderScanResultComponent} from './pages/holder-scan-result/holder-scan-result.component';
import {HolderScanComponent} from './pages/holder-scan/holder-scan.component';
import {QuickScanAddFormComponent} from './component/quick-scan-add-form/quick-scan-add-form.component';
import {HolderAddComponent} from './pages/holder-add/holder-add.component';
import {HolderDetailProfileComponent} from './pages/holder-detail-profile/holder-detail-profile.component';
import {HolderDetailScanHistoryComponent} from './pages/holder-detail-scan-history/holder-detail-scan-history.component';
import {HolderDetailAddressAddComponent} from './pages/holder-detail-address-add/holder-detail-address-add.component';
import {HolderDetailAddressComponent} from './pages/holder-detail-address/holder-detail-address.component';
import {HolderGroupComponent} from './pages/holder-group/holder-group.component';
import {HolderGroupAddComponent} from './pages/holder-group-add/holder-group-add.component';
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
    id: 'flow',
    name: 'Flow Labeling',
    path: '/flow-labeling-page',
    url: null,
    level: 1,
    icon: 'area-chart',
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
    HolderComponent,
    HolderScanScheduleAddComponent,
    HolderScanScheduleComponent,
    HolderScanResultComponent,
    HolderScanComponent,
    AddressScanPageComponent,
    QuickScanAddFormComponent,
    HolderAddComponent,
    HolderDetailProfileComponent,
    HolderDetailScanHistoryComponent,
    HolderDetailAddressAddComponent,
    HolderDetailAddressComponent,
    HolderGroupComponent,
    HolderGroupAddComponent,
    FlowLabelingPageComponent,
    FlowLabelingAddComponent,
    CcPipe,
    NotAuthorizedPageComponent,
    LoginPageComponent,
    AddressScanBatchPageComponent,
    AddressScanBatchAddPageComponent,
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
