import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {en_US, NgZorroAntdModule, NZ_I18N} from 'ng-zorro-antd';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/zh';
import {HttpClientModule} from '@angular/common/http';
// import G6 from '@antv/g6';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthServiceConfig, GoogleLoginProvider, SocialLoginModule} from 'angularx-social-login';
import {JwtModule} from '@auth0/angular-jwt';
import {ScanPageComponent} from './pages/scan-page/scan-page.component';
import {ScanHistoryPageComponent} from './pages/scan-history-page/scan-history-page.component';
import {NewScanPageComponent} from './pages/new-scan-page/new-scan-page.component';
import {DashboardPageComponent} from './pages/dashboard-page/dashboard-page.component';
import {BASE_PATH} from '@profyu/unblock-ng-sdk';
import {environment} from 'src/environments/environment';
import {BtcScanResultPageComponent} from './pages/btc-scan-result-page/btc-scan-result-page.component';
import {CryptoPipe} from './pipes/crypto.pipe';
import {EthScanResultPageComponent} from './pages/eth-scan-result-page/eth-scan-result-page.component';
import {XrpScanResultPageComponent} from './pages/xrp-scan-result-page/xrp-scan-result-page.component';
import {QuickScanComponent} from './pages/quick-scan/quick-scan.component';
import {HolderComponent} from './pages/holder/holder.component';
import {HolderScanScheduleAddComponent} from './pages/holder-scan-schedule-add/holder-scan-schedule-add.component';
import {HolderScanScheduleComponent} from './pages/holder-scan-schedule/holder-scan-schedule.component';
import {HolderScanResultComponent} from './pages/holder-scan-result/holder-scan-result.component';
import {HolderScanComponent} from './pages/holder-scan/holder-scan.component';
import {ZilScanResultPageComponent} from './pages/zil-scan-result-page/zil-scan-result-page.component';
import {CoreNgZorroModule, JwtService} from '@profyu/core-ng-zorro';
import {QuickScanAddFormComponent} from './component/quick-scan-add-form/quick-scan-add-form.component';
import {QuickScanAddComponent} from './pages/quick-scan-add/quick-scan-add.component';
import {QuickScanResultComponent} from './pages/quick-scan-result/quick-scan-result.component';
import {NamespaceComponent} from './pages/namespace/namespace.component';
import {NamespaceAddComponent} from './pages/namespace-add/namespace-add.component';
import {HolderAddComponent} from './pages/holder-add/holder-add.component';
import {HolderDetailProfileComponent} from './pages/holder-detail-profile/holder-detail-profile.component';
import {HolderDetailScanHistoryComponent} from './pages/holder-detail-scan-history/holder-detail-scan-history.component';
import {HolderDetailAddressAddComponent} from './pages/holder-detail-address-add/holder-detail-address-add.component';
import {HolderDetailAddressComponent} from './pages/holder-detail-address/holder-detail-address.component';

const menus: any[] = [

  {
    id: 'home',
    name: 'Home',
    path: 'dashboard',
    url: null,
    level: 1,
    icon: 'lock',
    children: [],
    disabled: true,

  },
  {
    id: 'address-scan',
    name: 'ADDRESS SCAN',
    path: null,
    url: null,
    level: 1,
    icon: 'area-chart',
    children: [
      {
        id: 'new-scan',
        name: 'NEW SCAN',
        subtitle: 'Start a new quick scan',
        path: 'new-scan',
        url: null,
        level: 2,
        children: [],
        icon: 'file',
      },
      {
        id: 'scan-history',
        name: 'SCAN HISTORY',
        path: 'scan-history',
        url: null,
        level: 2,
        icon: 'file',
        children: []
      }
    ]
  },
  {
    id: 'quick-scan',
    name: 'QUICK SCAN',
    subtitle: 'Start a new quick scan',
    context: null,
    path: 'quick-scan',
    url: null,
    icon: 'lock',
    disabled: true,
    level: 1,
    children: []
  },
  {
    id: 'kyc-lookup',
    name: 'KYC LOOKUP',
    context: null,
    path: 'kyc-lookup',
    url: null,
    icon: 'lock',
    disabled: true,
    level: 1,
    children: []
  },
  {
    id: 'holder-mgt',
    name: 'HOLDER MANAGEMENT',
    path: null,
    url: null,
    level: 1,
    icon: 'area-chart',
    children: [
      {
        id: 'namespace',
        name: 'NAMESPACE',
        path: 'namespace',
        url: null,
        icon: 'lock',
        disabled: true,
        level: 2,
        children: []
      },
      {
        id: 'holder',
        name: 'HOLDER',
        path: 'holder',
        url: null,
        level: 2,
        icon: 'lock',
        disabled: true,
        children: []
      }
    ]
  },
  {
    id: 'holder-scan',
    name: 'HOLDER SCAN',
    path: null,
    url: null,
    level: 1,
    icon: 'area-chart',
    children: [
      {
        id: 'scan',
        name: 'SCAN',
        path: 'holder-scan',
        url: null,
        icon: 'lock',
        disabled: true,
        level: 2,
        children: []
      },
      {
        id: 'schedule',
        name: 'SCHEDULE',
        path: 'holder-scan-schedule',
        url: null,
        level: 2,
        icon: 'lock',
        disabled: true,
        children: []
      },
      {
        id: 'tx-monitoring',
        name: 'TX MONITORING',
        path: 'tx-monitoring',
        url: null,
        level: 2,
        icon: 'lock',
        disabled: true,
        children: []
      }
    ]
  },
  {
    id: 'ubo-identification',
    name: 'UBO IDENTIFICATION',
    path: 'ubo-identification',
    url: null,
    level: 1,
    icon: 'lock',
    disabled: true,
    children: []
  },
  {
    id: 'settings',
    name: 'SETTINGS',
    path: '/',
    url: null,
    level: 1,
    icon: 'area-chart',
    children: [
      {
        id: 'wallet-config',
        name: 'WALLET CONFIG',
        path: 'wallet-config',
        url: null,
        icon: 'lock',
        disabled: true,
        level: 2,
        children: []
      },
      {
        id: 'role-permission',
        name: 'ROLE & PERMISSION',
        path: 'role-permission',
        url: null,
        level: 2,
        icon: 'lock',
        disabled: true,
        children: []
      },
      {
        id: 'billing',
        name: 'BILLING',
        path: 'billing',
        url: null,
        level: 2,
        icon: 'lock',
        disabled: true,
        children: []
      }
    ]
  }
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
    ScanPageComponent,
    ScanHistoryPageComponent,
    NewScanPageComponent,
    DashboardPageComponent,
    BtcScanResultPageComponent,
    EthScanResultPageComponent,
    XrpScanResultPageComponent,
    ZilScanResultPageComponent,
    CryptoPipe,
    HolderComponent,
    HolderScanScheduleAddComponent,
    HolderScanScheduleComponent,
    HolderScanResultComponent,
    HolderScanComponent,
    QuickScanComponent,
    QuickScanAddComponent,
    QuickScanAddFormComponent,
    QuickScanResultComponent,
    NamespaceComponent,
    NamespaceAddComponent,
    HolderAddComponent,
    HolderDetailProfileComponent,
    HolderDetailScanHistoryComponent,
    HolderDetailAddressAddComponent,
    HolderDetailAddressComponent,
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
    CoreNgZorroModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['unblock-analysis.com', 'localhost']
      }
    })
  ],
  providers: [
    JwtService,
    {provide: BASE_PATH, useValue: environment.baseApiUrl},
    {provide: NZ_I18N, useValue: en_US},
    // {provide: NZ_ICONS, useValue: icons},
    {
      provide: AuthServiceConfig,
      useFactory: authServiceConfigFactory
    },
    // {provide: HTTP_INTERCEPTORS, useClass: LogoutInterceptor, multi: true},
    // {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
    {provide: 'MENU_TREE_DATA', useValue: menus}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
