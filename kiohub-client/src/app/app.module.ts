import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { MatButtonModule, MatInputModule } from '@angular/material';
import { MenuButtonComponent } from './menu-button/menu-button.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { MenuBarNotLoggedComponent } from './menu-bar-not-logged/menu-bar-not-logged.component';
import { ContentContainerComponent } from './content-container/content-container.component';
import { AppRoutingModule } from './/app-routing.module';

import { SearchService } from './search-service/search.service';

@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    MenuBarNotLoggedComponent,
    MenuButtonComponent,
    SearchInputComponent,
    ContentContainerComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatInputModule,
    AppRoutingModule
  ],
  providers: [ SearchService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
