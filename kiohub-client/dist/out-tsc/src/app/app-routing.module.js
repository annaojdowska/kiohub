"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var unlogged_search_component_1 = require("./unlogged-search/unlogged-search.component");
var add_project_component_1 = require("./add-project/add-project.component");
var edit_project_tab_component_1 = require("./edit-project-tab/edit-project-tab.component");
var advanced_search_component_1 = require("./advanced-search/advanced-search.component");
var test_post_component_1 = require("./test-post/test-post.component");
var project_view_component_1 = require("./project-view/project-view.component");
var routes = [
    { path: 'home', component: unlogged_search_component_1.UnloggedSearchComponent },
    { path: 'add-project', component: add_project_component_1.AddProjectComponent },
    { path: 'edit-project', component: edit_project_tab_component_1.EditProjectTabComponent },
    { path: 'projects-base', component: advanced_search_component_1.AdvancedSearchComponent },
    { path: 'project-details/:id', component: project_view_component_1.ProjectViewComponent },
    { path: 'test-post', component: test_post_component_1.TestPostComponent },
    { path: '**', component: unlogged_search_component_1.UnloggedSearchComponent }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes)],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map