import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchInputComponent } from './search-input/search-input.component';


const routes: Routes = [
  { path: 'home', component: SearchInputComponent }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
