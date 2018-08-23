"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var forms_1 = require("@angular/forms");
var http_2 = require("@angular/http");
var app_component_1 = require("./app.component");
var material_1 = require("@angular/material");
var material_2 = require("@angular/material");
var menu_button_component_1 = require("./menu-button/menu-button.component");
var menu_bar_component_1 = require("./menu-bar/menu-bar.component");
var menu_bar_not_logged_component_1 = require("./menu-bar-not-logged/menu-bar-not-logged.component");
var content_container_component_1 = require("./content-container/content-container.component");
var app_routing_module_1 = require("./app-routing.module");
var forms_2 = require("@angular/forms");
var search_service_1 = require("./services/search.service");
var search_input_component_1 = require("./search-input/search-input.component");
var unlogged_search_component_1 = require("./unlogged-search/unlogged-search.component");
var add_project_component_1 = require("./add-project/add-project.component");
var edit_project_tab_component_1 = require("./edit-project-tab/edit-project-tab.component");
var animations_1 = require("@angular/platform-browser/animations");
var edit_project_general_tab_component_1 = require("./edit-project-general-tab/edit-project-general-tab.component");
var user_service_1 = require("./services/user.service");
var edit_project_management_tab_component_1 = require("./edit-project-management-tab/edit-project-management-tab.component");
var email_invitation_service_1 = require("./email-invitation-service/email-invitation.service");
var keycodes_1 = require("@angular/cdk/keycodes");
var semester_chooser_component_1 = require("./semester-chooser/semester-chooser.component");
var input_list_component_1 = require("./input-list/input-list.component");
var semester_service_1 = require("./services/semester-service");
var search_result_single_project_component_1 = require("./search-result-single-project/search-result-single-project.component");
var advanced_search_component_1 = require("./advanced-search/advanced-search.component");
var test_post_component_1 = require("./test-post/test-post.component");
var advanced_search_form_component_1 = require("./advanced-search-form/advanced-search-form.component");
var core_2 = require("@angular/material/core");
var project_type_service_1 = require("./services/project-type-service");
var licence_service_1 = require("./services/licence-service");
var project_status_service_1 = require("./services/project-status-service");
var project_view_component_1 = require("./project-view/project-view.component");
var project_details_service_1 = require("./services/project-details-service");
var project_service_1 = require("./services/project.service");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                menu_bar_component_1.MenuBarComponent,
                menu_bar_not_logged_component_1.MenuBarNotLoggedComponent,
                menu_button_component_1.MenuButtonComponent,
                search_input_component_1.SearchInputComponent,
                content_container_component_1.ContentContainerComponent,
                unlogged_search_component_1.UnloggedSearchComponent,
                add_project_component_1.AddProjectComponent,
                edit_project_tab_component_1.EditProjectTabComponent,
                edit_project_general_tab_component_1.EditProjectGeneralTabComponent,
                edit_project_management_tab_component_1.EditProjectManagementTabComponent,
                semester_chooser_component_1.SemesterChooserComponent,
                input_list_component_1.InputListComponent,
                search_result_single_project_component_1.SearchResultSingleProjectComponent,
                advanced_search_component_1.AdvancedSearchComponent,
                test_post_component_1.TestPostComponent,
                advanced_search_form_component_1.AdvancedSearchFormComponent,
                project_view_component_1.ProjectViewComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpClientModule,
                material_1.MatButtonModule,
                material_1.MatInputModule,
                app_routing_module_1.AppRoutingModule,
                forms_1.ReactiveFormsModule,
                material_1.MatFormFieldModule,
                forms_2.FormsModule,
                material_1.MatAutocompleteModule,
                material_1.MatTabsModule,
                animations_1.BrowserAnimationsModule,
                material_2.MatSelectModule,
                material_2.MatDialogModule,
                material_1.MatChipsModule,
                material_1.MatIconModule,
                material_1.MatGridListModule,
                http_2.HttpModule,
                material_1.MatDatepickerModule,
                material_1.MatNativeDateModule
            ],
            providers: [
                search_service_1.SearchService,
                user_service_1.UserService,
                semester_service_1.SemesterService,
                email_invitation_service_1.EmailInvitationService,
                project_type_service_1.ProjectTypeService,
                licence_service_1.LicenceService,
                project_status_service_1.ProjectStatusService,
                project_details_service_1.ProjectDetailsService,
                project_service_1.ProjectService,
                {
                    provide: material_1.MAT_CHIPS_DEFAULT_OPTIONS,
                    useValue: {
                        separatorKeyCodes: [keycodes_1.ENTER, keycodes_1.COMMA]
                    }
                },
                { provide: core_2.MAT_DATE_LOCALE, useValue: 'pl' },
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map