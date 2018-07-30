import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchInputComponent } from './search-input/search-input.component';
import { UnloggedSearchComponent } from './unlogged-search/unlogged-search.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { EditProjectTabComponent } from './edit-project-tab/edit-project-tab.component';
import { SemesterChooserComponent } from './semester-chooser/semester-chooser.component';


const routes: Routes = [
  { path: 'home', component: UnloggedSearchComponent },
  { path: 'add-project', component: AddProjectComponent },
  { path: 'edit-project', component: EditProjectTabComponent },
  { path: 'semester', component: SemesterChooserComponent },
  { path: '**', component: UnloggedSearchComponent }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
