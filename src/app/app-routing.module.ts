import {NgModule} from '@angular/core';
import {Route, RouterModule, Routes} from '@angular/router';
import {ScanPageComponent} from './pages/scan-page/scan-page.component';
import {AddressScanAddPageComponent} from './pages/address-scan/address-scan-add-page/address-scan-add-page.component';
import {DashboardPageComponent} from './pages/dashboard-page/dashboard-page.component';
import {AddressScanPageComponent} from './pages/address-scan/address-scan-page/address-scan-page.component';
import {FlowLabelingPageComponent} from './pages/flow-labeling/flow-labeling-page/flow-labeling-page.component';
import {FlowLabelingAddComponent} from './pages/flow-labeling/flow-labeling-add/flow-labeling-add.component';
import {AddressScanDetailPageComponent} from "./pages/address-scan/address-scan-detail-page/address-scan-detail-page.component";
import {AuthGuardService} from "./services/auth-guard.service";
import {LoginOutline} from "@ant-design/icons-angular/icons";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {LayoutComponent} from "./shared/layout/layout.component";
import {AddressScanBatchPageComponent} from "./pages/address-scan-batch/address-scan-batch-page/address-scan-batch-page.component";
import {AddressScanBatchAddPageComponent} from "./pages/address-scan-batch/address-scan-batch-add-page/address-scan-batch-add-page.component";
import {NotAuthorizedPageComponent} from "./pages/not-authorized-page/not-authorized-page.component";
import {PfyRoute} from "./shared/pfy-route";
import {AddressCasePageComponent} from "./pages/address-case/address-case-page/address-case-page.component";
import {AddressCaseAddPageComponent} from "./pages/address-case/address-case-add-page/address-case-add-page.component";
import {AddressCaseDetailPageComponent} from "./pages/address-case/address-case-detail-page/address-case-detail-page.component";
import {IncidentDetailPageComponent} from "./pages/incident/incident-detail-page/incident-detail-page.component";
import {IncidentPageComponent} from "./pages/incident/incident-page/incident-page.component";


const routes: Routes = [
  {
    path: '',
    children: [

      {path: 'dashboard', component: DashboardPageComponent},

      {path: 'address-case', component: AddressCasePageComponent, },
      {path: 'address-case/create', component: AddressCaseAddPageComponent, },
      {path: 'address-case/:id', component: AddressCaseDetailPageComponent, },

      {path: 'address-scan', component: AddressScanPageComponent, },
      {path: 'address-scan/create', component: AddressScanAddPageComponent, },
      {path: 'address-scan/:id', component: AddressScanDetailPageComponent, },
      {path: 'address-scan-batch', component: AddressScanBatchPageComponent, },
      {path: 'address-scan-batch/create', component: AddressScanBatchAddPageComponent, },

      {path: 'incident', component: IncidentPageComponent },
      {path: 'incident/:id', component: IncidentDetailPageComponent },

      {path: 'qr-scan', component: ScanPageComponent, },
      {path: 'flow-labeling-page', component: FlowLabelingPageComponent, },
      {path: 'flow-labeling-page/create', component: FlowLabelingAddComponent, },


    ],
    component: LayoutComponent,
    canActivate: [AuthGuardService]
  },
  {path: 'login', component: LoginPageComponent},
  {path: 'error/403', component: NotAuthorizedPageComponent},
  {path: '**', component: LoginPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
