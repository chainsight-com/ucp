import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ZXingScannerModule } from '@zxing/ngx-scanner';

// import { SearchComponent } from './search/search.component';
// import { SearchResultPageComponent } from './search-result-page/search-result-page.component';
import { NgZorroAntdModule, NZ_I18N, en_US, NZ_ICONS, NzSliderModule } from 'ng-zorro-antd';

import { NotificationOutline, LaptopOutline, UserOutline, MailOutline, GoogleOutline, ArrowLeftOutline, QrcodeOutline, LockOutline, SecurityScanOutline, DashboardOutline, MenuFoldOutline } from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [UserOutline, LaptopOutline, NotificationOutline, MailOutline, GoogleOutline, ArrowLeftOutline, QrcodeOutline, LockOutline, SecurityScanOutline, DashboardOutline, MenuFoldOutline];

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/zh';
import { IconDefinition } from '@ant-design/icons-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import G6 from '@antv/g6';
// import { GraphViewComponent } from './graph-view/graph-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from "angularx-social-login";
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { JwtModule } from '@auth0/angular-jwt';
import { LOCAL_TOKEN_KEY } from './services/jwt.service';
import { ScanPageComponent } from './pages/scan-page/scan-page.component';
import { MainLayoutPageComponent } from './pages/main-layout-page/main-layout-page.component';
import { ScanHistoryPageComponent } from './pages/scan-history-page/scan-history-page.component';
import { NewScanPageComponent } from './pages/new-scan-page/new-scan-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { BASE_PATH, Configuration, ConfigurationParameters, ApiModule } from 'src/sdk';
import { environment } from 'src/environments/environment';
import { NoopInterceptor } from '@angular/common/http/src/interceptor';
import { LogoutInterceptor } from './interceptors/LogoutInterceptor';
import { JwtInterceptor } from './interceptors/JwtInterceptor';
import { BtcScanResultPageComponent } from './pages/btc-scan-result-page/btc-scan-result-page.component';
import { CryptoPipe } from './pipes/crypto.pipe';


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
    // SearchComponent,
    // SearchResultPageComponent,
    // GraphViewComponent,
    LoginPageComponent,
    ScanPageComponent,
    MainLayoutPageComponent,
    ScanHistoryPageComponent,
    NewScanPageComponent,
    DashboardPageComponent,
    BtcScanResultPageComponent,
    CryptoPipe
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
    })
  ],
  providers: [
    { provide: BASE_PATH, useValue: environment.baseApiUrl },
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons },
    {
      provide: AuthServiceConfig,
      useFactory: authServiceConfigFactory
    },
    { provide: HTTP_INTERCEPTORS, useClass: LogoutInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
