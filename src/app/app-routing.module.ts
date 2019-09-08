import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ScanPageComponent } from './pages/scan-page/scan-page.component';
import { MainLayoutPageComponent } from './pages/main-layout-page/main-layout-page.component';
import { NewScanPageComponent } from './pages/new-scan-page/new-scan-page.component';
import { ScanHistoryPageComponent } from './pages/scan-history-page/scan-history-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { BtcScanResultPageComponent } from './pages/btc-scan-result-page/btc-scan-result-page.component';
import { EthScanResultPageComponent } from './pages/eth-scan-result-page/eth-scan-result-page.component';


const routes: Routes = [
  { path: 'login', component: LoginPageComponent },

  {
    path: 'main-layout',
    component: MainLayoutPageComponent,
    children: [
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'new-scan', component: NewScanPageComponent },
      { path: 'scan-history', component: ScanHistoryPageComponent },
      { path: 'btc-scan-result/:id', component: BtcScanResultPageComponent },
      { path: 'eth-scan-result/:id', component: EthScanResultPageComponent },
      { path: 'qr-scan', component: ScanPageComponent},

    ]
  },
  // { path: 'search', component: SearchComponent },
  // { path: 'result/:keyword/:maxDist/:starting/:ending', component: SearchResultPageComponent },
  { path: '**', component: LoginPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
