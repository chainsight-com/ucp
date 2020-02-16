import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {ScanPageComponent} from './pages/scan-page/scan-page.component';
import {MainLayoutPageComponent} from './pages/main-layout-page/main-layout-page.component';
import {NewScanPageComponent} from './pages/new-scan-page/new-scan-page.component';
import {ScanHistoryPageComponent} from './pages/scan-history-page/scan-history-page.component';
import {DashboardPageComponent} from './pages/dashboard-page/dashboard-page.component';
import {BtcScanResultPageComponent} from './pages/btc-scan-result-page/btc-scan-result-page.component';
import {EthScanResultPageComponent} from './pages/eth-scan-result-page/eth-scan-result-page.component';
import {XrpScanResultPageComponent} from './pages/xrp-scan-result-page/xrp-scan-result-page.component';
import {QuickScanComponent} from './pages/quick-scan/quick-scan.component';
import {NameSpaceComponent} from './pages/name-space/name-space.component';
import {HolderComponent} from './pages/holder/holder.component';
import {HolderDetailComponent} from './pages/holder-detail/holder-detail.component';
import {HolderScanResultComponent} from './pages/holder-scan-result/holder-scan-result.component';
import {HolderScanScheduleComponent} from './pages/holder-scan-schedule/holder-scan-schedule.component';
import {HolderScanScheduleAddComponent} from './pages/holder-scan-schedule-add/holder-scan-schedule-add.component';
import {HolderScanComponent} from './pages/holder-scan/holder-scan.component';
import { ZilScanResultPageComponent } from './pages/zil-scan-result-page/zil-scan-result-page.component';


const routes: Routes = [
<<<<<<< HEAD
  {path: 'login', component: LoginPageComponent},

  {
    path: 'main-layout',
    component: MainLayoutPageComponent,
    children: [
      {path: 'dashboard', component: DashboardPageComponent},
      {path: 'new-scan', component: NewScanPageComponent},
      {path: 'scan-history', component: ScanHistoryPageComponent},
      {path: 'btc-scan-result/:id', component: BtcScanResultPageComponent},
      {path: 'eth-scan-result/:id', component: EthScanResultPageComponent},
      {path: 'xrp-scan-result/:id', component: XrpScanResultPageComponent},
      {path: 'zil-scan-result/:id', component: ZilScanResultPageComponent},
      {path: 'qr-scan', component: ScanPageComponent},
      {path: 'quick-scan', component: QuickScanComponent},
      {path: 'namespace', component: NameSpaceComponent},
      {path: 'holder', component: HolderComponent},
      {path: 'holder-detail/:id', component: HolderDetailComponent},
      {path: 'holder-scan', component: HolderScanComponent},
      {path: 'holder-scan-result/:id', component: HolderScanResultComponent},
      {path: 'holder-scan-schedule', component: HolderScanScheduleComponent},
      {path: 'holder-scan-schedule-add', component: HolderScanScheduleAddComponent},

    ]
  },
  // { path: 'search', component: SearchComponent },
  // { path: 'result/:keyword/:maxDist/:starting/:ending', component: SearchResultPageComponent },
  {path: '**', component: LoginPageComponent}
=======
  // {path: 'login', component: LoginPageComponent},
  {path: 'new-scan', component: NewScanPageComponent},
  {path: 'dashboard', component: DashboardPageComponent},
  {path: 'new-scan', component: NewScanPageComponent},
  {path: 'scan-history', component: ScanHistoryPageComponent},
  {path: 'btc-scan-result/:id', component: BtcScanResultPageComponent},
  {path: 'eth-scan-result/:id', component: EthScanResultPageComponent},
  {path: 'xrp-scan-result/:id', component: XrpScanResultPageComponent},
  {path: 'qr-scan', component: ScanPageComponent},
  {path: 'quick-scan', component: QuickScanComponent},
  {path: 'namespace', component: NameSpaceComponent},
  {path: 'holder', component: HolderComponent},
  {path: 'holder-detail/:id', component: HolderDetailComponent},
  {path: 'holder-scan', component: HolderScanComponent},
  {path: 'holder-scan-result/:id', component: HolderScanResultComponent},
  {path: 'holder-scan-schedule', component: HolderScanScheduleComponent},
  {path: 'holder-scan-schedule-add', component: HolderScanScheduleAddComponent},
  {path: '**', component: DashboardPageComponent}
>>>>>>> 138e680399ceef2f517a8a5f18e0b96e21332629
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
