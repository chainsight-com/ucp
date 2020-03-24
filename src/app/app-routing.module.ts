import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScanPageComponent } from './pages/scan-page/scan-page.component';
import { NewScanPageComponent } from './pages/new-scan-page/new-scan-page.component';
import { ScanHistoryPageComponent } from './pages/scan-history-page/scan-history-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { BtcScanResultPageComponent } from './pages/btc-scan-result-page/btc-scan-result-page.component';
import { EthScanResultPageComponent } from './pages/eth-scan-result-page/eth-scan-result-page.component';
import { XrpScanResultPageComponent } from './pages/xrp-scan-result-page/xrp-scan-result-page.component';
import { QuickScanComponent } from './pages/quick-scan/quick-scan.component';
import { HolderComponent } from './pages/holder/holder.component';
import { HolderScanResultComponent } from './pages/holder-scan-result/holder-scan-result.component';
import { HolderScanScheduleComponent } from './pages/holder-scan-schedule/holder-scan-schedule.component';
import { HolderScanScheduleAddComponent } from './pages/holder-scan-schedule-add/holder-scan-schedule-add.component';
import { HolderScanComponent } from './pages/holder-scan/holder-scan.component';
import { ZilScanResultPageComponent } from './pages/zil-scan-result-page/zil-scan-result-page.component';
import { QuickScanAddComponent } from './pages/quick-scan-add/quick-scan-add.component';
import { HolderAddComponent } from './pages/holder-add/holder-add.component';
import { HolderDetailProfileComponent } from './pages/holder-detail-profile/holder-detail-profile.component';
import { HolderDetailAddressComponent } from './pages/holder-detail-address/holder-detail-address.component';
import { HolderDetailAddressAddComponent } from './pages/holder-detail-address-add/holder-detail-address-add.component';
import { HolderDetailScanHistoryComponent } from './pages/holder-detail-scan-history/holder-detail-scan-history.component';
import { HolderGroupAddComponent } from './pages/holder-group-add/holder-group-add.component';
import { HolderGroupComponent } from './pages/holder-group/holder-group.component';
import {FlowLabelingComponent} from './pages/flow-labeling/flow-labeling.component';
import {FlowLabelingAddComponent} from './pages/flow-labeling-add/flow-labeling-add.component';


const routes: Routes = [
  {path: 'new-scan', component: NewScanPageComponent},
  {path: 'dashboard', component: DashboardPageComponent},
  {path: 'new-scan', component: NewScanPageComponent},
  {path: 'scan-history', component: ScanHistoryPageComponent},
  {path: 'btc-scan-result/:id', component: BtcScanResultPageComponent},
  {path: 'eth-scan-result/:id', component: EthScanResultPageComponent},
  {path: 'xrp-scan-result/:id', component: XrpScanResultPageComponent},
  {path: 'zil-scan-result/:id', component: ZilScanResultPageComponent},
  {path: 'qr-scan', component: ScanPageComponent},
  {path: 'quick-scan', component: QuickScanComponent},
  {path: 'quick-scan-add', component: QuickScanAddComponent},
  {path: 'holder-group', component: HolderGroupComponent},
  {path: 'holder-group-add', component: HolderGroupAddComponent},
  {path: 'holder-group-add/:id', component: HolderGroupAddComponent},
  {path: 'holder', component: HolderComponent},
  {path: 'holder-add', component: HolderAddComponent},
  {path: 'holder-add/:id', component: HolderAddComponent},
  {path: 'holder-detail-profile/:id', component: HolderDetailProfileComponent},
  {path: 'holder-detail-address/:id', component: HolderDetailAddressComponent},
  {path: 'holder-detail-address-add/:id', component: HolderDetailAddressAddComponent},
  {path: 'holder-detail-scan-history/:id', component: HolderDetailScanHistoryComponent},
  {path: 'holder-scan', component: HolderScanComponent},
  {path: 'holder-scan-result/:id', component: HolderScanResultComponent},
  {path: 'holder-scan-schedule', component: HolderScanScheduleComponent},
  {path: 'holder-scan-schedule-add', component: HolderScanScheduleAddComponent},
  {path: 'flow-labeling', component: FlowLabelingComponent},
  {path: 'flow-labeling-add', component: FlowLabelingAddComponent},
  {path: '**', component: NewScanPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
