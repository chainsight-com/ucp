import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {NgZorroAntdModule, NZ_I18N, en_US, NZ_ICONS, NzIconModule} from 'ng-zorro-antd';
import {
  NotificationOutline,
  LaptopOutline,
  UserOutline,
  MailOutline,
  GoogleOutline,
  ArrowLeftOutline,
  QrcodeOutline,
  LockOutline,
  SecurityScanOutline,
  DashboardOutline,
  MenuFoldOutline,
  ReloadOutline,
  LogoutOutline,
  SwapLeftOutline,
  SwapRightOutline,
  ExperimentOutline
} from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [UserOutline, LaptopOutline, NotificationOutline, MailOutline, GoogleOutline, ArrowLeftOutline, QrcodeOutline, LockOutline, SecurityScanOutline, DashboardOutline, MenuFoldOutline, ReloadOutline, LogoutOutline, SwapLeftOutline, SwapRightOutline, ExperimentOutline];
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/zh';
import {IconDefinition} from '@ant-design/icons-angular';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import G6 from '@antv/g6';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SocialLoginModule, AuthServiceConfig, GoogleLoginProvider} from 'angularx-social-login';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {JwtModule} from '@auth0/angular-jwt';
import {LOCAL_TOKEN_KEY} from './services/jwt.service';
import {ScanPageComponent} from './pages/scan-page/scan-page.component';
import {MainLayoutPageComponent} from './pages/main-layout-page/main-layout-page.component';
import {ScanHistoryPageComponent} from './pages/scan-history-page/scan-history-page.component';
import {NewScanPageComponent} from './pages/new-scan-page/new-scan-page.component';
import {DashboardPageComponent} from './pages/dashboard-page/dashboard-page.component';
import {BASE_PATH, Configuration, ConfigurationParameters, ApiModule} from '@profyu/unblock-ng-sdk';
import {environment} from 'src/environments/environment';
// import { NoopInterceptor } from '@angular/common/http/src/interceptor';
import {LogoutInterceptor} from './interceptors/LogoutInterceptor';
import {JwtInterceptor} from './interceptors/JwtInterceptor';
import {BtcScanResultPageComponent} from './pages/btc-scan-result-page/btc-scan-result-page.component';
import {CryptoPipe} from './pipes/crypto.pipe';
import {RouteReuseStrategy} from '@angular/router';
import {EthScanResultPageComponent} from './pages/eth-scan-result-page/eth-scan-result-page.component';
import {XrpScanResultPageComponent} from './pages/xrp-scan-result-page/xrp-scan-result-page.component';
import { QuickScanComponent } from './pages/quick-scan/quick-scan.component';
import { NameSpaceComponent } from './pages/name-space/name-space.component';
import { HolderComponent } from './pages/holder/holder.component';
import { HolderScanScheduleAddComponent } from './pages/holder-scan-schedule-add/holder-scan-schedule-add.component';
import { HolderScanScheduleComponent } from './pages/holder-scan-schedule/holder-scan-schedule.component';
import { HolderDetailComponent } from './pages/holder-detail/holder-detail.component';
import { HolderScanResultComponent } from './pages/holder-scan-result/holder-scan-result.component';
import { HolderScanComponent } from './pages/holder-scan/holder-scan.component';
import { QuickScanAddComponent } from './component/quick-scan-add/quick-scan-add.component';

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
G6.track(false);

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ScanPageComponent,
    MainLayoutPageComponent,
    ScanHistoryPageComponent,
    NewScanPageComponent,
    DashboardPageComponent,
    BtcScanResultPageComponent,
    EthScanResultPageComponent,
    XrpScanResultPageComponent,
    CryptoPipe,
    QuickScanComponent,
    NameSpaceComponent,
    HolderComponent,
    HolderScanScheduleAddComponent,
    HolderScanScheduleComponent,
    HolderDetailComponent,
    HolderScanResultComponent,
    HolderScanComponent,
    QuickScanAddComponent
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
    NzIconModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['unblock-analysis.com', 'localhost']
      }
    })
  ],
  providers: [
    {provide: BASE_PATH, useValue: environment.baseApiUrl},
    {provide: NZ_I18N, useValue: en_US},
    {provide: NZ_ICONS, useValue: icons},
    {
      provide: AuthServiceConfig,
      useFactory: authServiceConfigFactory
    },
    {provide: HTTP_INTERCEPTORS, useClass: LogoutInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
