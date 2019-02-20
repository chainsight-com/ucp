import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { SearchResultPageComponent } from './search-result-page/search-result-page.component';


const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'result/:keyword/:maxDist', component: SearchResultPageComponent },
  { path: '**', component: SearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
