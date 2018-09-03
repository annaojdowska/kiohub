import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from '@angular/http';
import { AppComponent } from './app.component';

import { MatButtonModule, MatInputModule, MatFormFieldModule, MatAutocompleteModule, MatTabsModule,
  MatChipsModule, MAT_CHIPS_DEFAULT_OPTIONS, MatIconModule, MatGridListModule, MatDatepickerModule,
  MatNativeDateModule, MatTableModule, MatPaginatorModule, MatPaginatorIntl} from '@angular/material';
import { MatSelectModule, MatDialogModule } from '@angular/material';
import { MenuButtonComponent } from './menu-button/menu-button.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { MenuBarNotLoggedComponent } from './menu-bar-not-logged/menu-bar-not-logged.component';
import { ContentContainerComponent } from './content-container/content-container.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { SearchService } from './services/search.service';
import { SearchInputComponent } from './search-input/search-input.component';
import { UnloggedSearchComponent } from './unlogged-search/unlogged-search.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { EditProjectTabComponent } from './edit-project-tab/edit-project-tab.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditProjectGeneralTabComponent } from './edit-project-general-tab/edit-project-general-tab.component';
import { UserService } from './services/user.service';
import { EditProjectManagementTabComponent } from './edit-project-management-tab/edit-project-management-tab.component';
import { EmailInvitationService } from './email-invitation-service/email-invitation.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { SemesterChooserComponent } from './semester-chooser/semester-chooser.component';
import { InputListComponent } from './input-list/input-list.component';
import { SemesterService } from './services/semester-service';
import { SearchResultSingleProjectComponent } from './search-result-single-project/search-result-single-project.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { TestPostComponent } from './test-post/test-post.component';
import { AdvancedSearchFormComponent } from './advanced-search-form/advanced-search-form.component';
import { MAT_DATE_LOCALE} from '@angular/material/core';
import { ProjectTypeService } from './services/project-type-service';
import { LicenceService } from './services/licence-service';
import { ProjectStatusService } from './services/project-status-service';
import { ProjectViewComponent } from './project-view/project-view.component';
import { ProjectDetailsService } from './services/project-details-service';
import { ProjectService } from './services/project.service';
import { ErrorInfoComponent } from './error-info/error-info.component';
import { FooterComponent } from './footer/footer.component';
import { FooterMainPageComponent } from './footer-main-page/footer-main-page.component';
import { TagService } from './services/tag.service';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { DownloadElementComponent } from './ui-elements/download-element/download-element.component';
import { SliderModule } from 'angular-image-slider';
import { SlideshowModule } from 'ng-simple-slideshow';
import { getPolishPaginatorIntl } from './advanced-search/polish-paginator-intl';

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
    AdvancedSearchComponent,
    TestPostComponent,
    AdvancedSearchFormComponent,
    ProjectViewComponent,
    ErrorInfoComponent,
    FooterComponent,
    FooterMainPageComponent,
    ImageSliderComponent,
    DownloadElementComponent
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
    MatGridListModule,
    HttpModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    BrowserModule,
    SliderModule,
    SlideshowModule
  ],
  providers: [
    SearchService,
    UserService,
    SemesterService,
    EmailInvitationService,
    ProjectTypeService,
    LicenceService,
    ProjectStatusService,
    ProjectDetailsService,
    ProjectService,
    TagService,
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA]
      }
    },
    { provide: MAT_DATE_LOCALE, useValue: 'pl' },
    { provide: MatPaginatorIntl, useValue: getPolishPaginatorIntl() },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
