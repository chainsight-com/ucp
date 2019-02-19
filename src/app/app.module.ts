import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { SearchComponent } from './search/search.component';
import { SearchResultPageComponent } from './search-result-page/search-result-page.component';
import { NgZorroAntdModule, NZ_I18N, en_US, NZ_ICONS } from 'ng-zorro-antd';

import { NotificationOutline, LaptopOutline, UserOutline, MailOutline } from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [UserOutline, LaptopOutline, NotificationOutline, MailOutline ];

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/zh';
import { IconDefinition } from '@ant-design/icons-angular';
import { HttpClientModule } from '@angular/common/http';
import G6 from '@antv/g6';
import { GraphViewComponent } from './graph-view/graph-view.component';
import { FormsModule } from '@angular/forms';
registerLocaleData(en);
G6.track(false);

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    SearchResultPageComponent,
    GraphViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    NgZorroAntdModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
