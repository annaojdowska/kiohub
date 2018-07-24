import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchInputComponent } from './search-input/search-input.component';
import { UnloggedSearchComponent } from './unlogged-search/unlogged-search.component';



const routes: Routes = [
  { path: 'home', component: UnloggedSearchComponent }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
