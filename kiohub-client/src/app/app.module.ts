import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { MatButtonModule, MatInputModule, MatFormFieldModule } from '@angular/material';
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

@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    MenuBarNotLoggedComponent,
    MenuButtonComponent,
    SearchInputComponent,
    ContentContainerComponent,
    UnloggedSearchComponent,
    AddProjectComponent
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
  ],
  providers: [ SearchService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
