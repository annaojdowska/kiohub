import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnloggedSearchComponent } from './unlogged-search/unlogged-search.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { EditProjectTabComponent } from './edit-project-tab/edit-project-tab.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';

const routes: Routes = [
  { path: 'home', component: UnloggedSearchComponent },
  { path: 'add-project', component: AddProjectComponent },
  { path: 'edit-project/:id', component: EditProjectTabComponent, data : {invitationsOk : false} },
  { path: 'projects-base', component: AdvancedSearchComponent },
  { path: 'details/:id', component: ProjectViewComponent },
  { path: 'my-projects', component: MyProjectsComponent },
  { path: '**', component: UnloggedSearchComponent }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
