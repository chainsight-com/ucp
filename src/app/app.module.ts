import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { SearchComponent } from './search/search.component';
import { SearchResultPageComponent } from './search-result-page/search-result-page.component';
import { NgZorroAntdModule, NZ_I18N, en_US, NZ_ICONS, NzSliderModule } from 'ng-zorro-antd';

import { NotificationOutline, LaptopOutline, UserOutline, MailOutline, GoogleOutline, ArrowLeftOutline } from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [UserOutline, LaptopOutline, NotificationOutline, MailOutline, GoogleOutline, ArrowLeftOutline];

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/zh';
import { IconDefinition } from '@ant-design/icons-angular';
import { HttpClientModule } from '@angular/common/http';
import G6 from '@antv/g6';
import { GraphViewComponent } from './graph-view/graph-view.component';
import { FormsModule } from '@angular/forms';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from "angularx-social-login";
import { LoginPageComponent } from './login-page/login-page.component';
import { JwtModule } from '@auth0/angular-jwt';
import { LOCAL_TOKEN_KEY } from './jwt.service';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("466384466007-o3q9dn55qd62i8imadajfoo80blkjc0f.apps.googleusercontent.com")
  }
]);

export function provideSocialAuthConfig() {
  return config;
}

export function tokenGetter() {
  return localStorage.getItem(LOCAL_TOKEN_KEY);
}

registerLocaleData(en);
G6.track(false);

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    SearchResultPageComponent,
    GraphViewComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    NgZorroAntdModule,
    HttpClientModule,
    FormsModule,
    SocialLoginModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['unblock-analysis.com']
      }
    })
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons },
    {
      provide: AuthServiceConfig,
      useFactory: provideSocialAuthConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
