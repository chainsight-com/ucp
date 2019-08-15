import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { SearchResultPageComponent } from './search-result-page/search-result-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ScanPageComponent } from './scan-page/scan-page.component';


const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'scan', component: ScanPageComponent },
  { path: 'search', component: SearchComponent },
  { path: 'result/:keyword/:maxDist/:starting/:ending', component: SearchResultPageComponent },
  { path: '**', component: LoginPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
