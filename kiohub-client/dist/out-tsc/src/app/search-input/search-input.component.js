"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var search_service_1 = require("../services/search.service");
var operators_1 = require("rxjs/operators");
var router_1 = require("@angular/router");
var project_details_service_1 = require("../services/project-details-service");
var SearchInputComponent = /** @class */ (function () {
    function SearchInputComponent(searchService, router, projectDetailsService) {
        this.searchService = searchService;
        this.router = router;
        this.projectDetailsService = projectDetailsService;
        this.results = [];
        this.queryField = new forms_1.FormControl();
    }
    SearchInputComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.queryField.valueChanges
            .pipe(operators_1.debounceTime(100))
            .subscribe(function (queryField) { return _this.searchService.search(queryField).subscribe(function (res) { return _this.mapResults(res, queryField); }); });
    };
    SearchInputComponent.prototype.goToSearchResults = function () {
        this.router.navigate(['/projects-base']);
    };
    SearchInputComponent.prototype.mapResults = function (res, phrase) {
        this.results = res;
    };
    SearchInputComponent.prototype.goToProjectView = function (event) {
        this.proxyValue = event.option.value.title;
        this.projectDetailsService.setSelectedProject(event.option.value);
        this.router.navigate(['/project-details', event.option.value.id]);
    };
    SearchInputComponent = __decorate([
        core_1.Component({
            selector: 'app-search-input',
            templateUrl: './search-input.component.html',
            styleUrls: ['./search-input.component.css']
        }),
        __param(0, core_1.Inject(search_service_1.SearchService)), __param(1, core_1.Inject(router_1.Router)),
        __param(2, core_1.Inject(project_details_service_1.ProjectDetailsService)),
        __metadata("design:paramtypes", [search_service_1.SearchService, router_1.Router,
            project_details_service_1.ProjectDetailsService])
    ], SearchInputComponent);
    return SearchInputComponent;
}());
exports.SearchInputComponent = SearchInputComponent;
//# sourceMappingURL=search-input.component.js.map