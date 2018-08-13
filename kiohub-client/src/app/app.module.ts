import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { MatButtonModule, MatInputModule, MatFormFieldModule, MatAutocompleteModule, MatTabsModule,
  MatChipsModule, MAT_CHIPS_DEFAULT_OPTIONS, MatIconModule, MatGridListModule} from '@angular/material';
import { MatSelectModule, MatDialogModule } from '@angular/material';
import { MenuButtonComponent } from './menu-button/menu-button.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { MenuBarNotLoggedComponent } from './menu-bar-not-logged/menu-bar-not-logged.component';
import { ContentContainerComponent } from './content-container/content-container.component';
import { AppRoutingModule } from './/app-routing.module';
import { FormsModule } from '@angular/forms';
import { SearchService } from './search-service/search.service';
import { SearchInputComponent } from 'src/app/search-input/search-input.component';
import { UnloggedSearchComponent } from './unlogged-search/unlogged-search.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { EditProjectTabComponent } from './edit-project-tab/edit-project-tab.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditProjectGeneralTabComponent } from './edit-project-general-tab/edit-project-general-tab.component';
import { UserService } from './user-data/user.service';
import { EditProjectManagementTabComponent } from './edit-project-management-tab/edit-project-management-tab.component';
import { EmailInvitationService } from './email-invitation-service/email-invitation.service';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import { SemesterChooserComponent } from './semester-chooser/semester-chooser.component';
import { InputListComponent } from './input-list/input-list.component';
import { SemesterService } from './semester-chooser/semester-service';
import { SearchResultSingleProjectComponent } from './search-result-single-project/search-result-single-project.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    MenuBarNotLoggedComponent,
    MenuButtonComponent,
    SearchInputComponent,
    ContentContainerComponent,
    UnloggedSearchComponent,
    AddProjectComponent,
    EditProjectTabComponent,
    EditProjectGeneralTabComponent,
    EditProjectManagementTabComponent,
    SemesterChooserComponent,
    InputListComponent,
    SearchResultSingleProjectComponent,
    AdvancedSearchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatAutocompleteModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatDialogModule,
    MatChipsModule,
    MatIconModule,
    MatGridListModule
  ],
  providers: [
    SearchService,
    UserService,
    SemesterService,
    EmailInvitationService,
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA]
      }
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
