import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnloggedSearchComponent } from './unlogged-search/unlogged-search.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { EditProjectTabComponent } from './edit-project-tab/edit-project-tab.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { SupervisorGuard } from './guards/supervisor.guard';
import { LoggedGuard } from './guards/logged.guard';
import { CollaboratorGuard } from './guards/collaborator.guard';
import { PublishedGuard } from './guards/published.guard';
import { RulesComponent } from './rules/rules.component';
import { OrGuard } from './guards/or.guard';

const routes: Routes = [
  { path: 'home', component: UnloggedSearchComponent },
  { path: 'add-project', component: AddProjectComponent, canActivate: [SupervisorGuard] },
  { path: 'edit-project/:id', component: EditProjectTabComponent, canActivate: [CollaboratorGuard] },
  { path: 'projects-base', component: AdvancedSearchComponent },
  { path: 'details/:id', component: ProjectViewComponent, canActivate: [new OrGuard(PublishedGuard, CollaboratorGuard)] },
  { path: 'my-projects', component: MyProjectsComponent, canActivate: [LoggedGuard] },
  { path: 'rules', component: RulesComponent },
  { path: '**', component: UnloggedSearchComponent }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
