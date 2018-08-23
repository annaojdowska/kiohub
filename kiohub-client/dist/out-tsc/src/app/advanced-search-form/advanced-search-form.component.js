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
var project_type_service_1 = require("../services/project-type-service");
var licence_service_1 = require("../services/licence-service");
var AdvancedSearchFormComponent = /** @class */ (function () {
    function AdvancedSearchFormComponent(projectTypeService, licenceService) {
        this.projectTypeService = projectTypeService;
        this.licenceService = licenceService;
    }
    AdvancedSearchFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.semestersHidden = false;
        this.projectTypeService.getTypes().subscribe(function (result) { return _this.project_types = result; });
        this.licenceService.getLicences().subscribe(function (result) { return _this.licences = result; });
        console.log(this.licences);
    };
    AdvancedSearchFormComponent.prototype.toggleSemesters = function () {
        this.semestersHidden = !this.semestersHidden;
    };
    AdvancedSearchFormComponent = __decorate([
        core_1.Component({
            selector: 'app-advanced-search-form',
            templateUrl: './advanced-search-form.component.html',
            styleUrls: ['./advanced-search-form.component.css'],
        }),
        __param(0, core_1.Inject(project_type_service_1.ProjectTypeService)),
        __param(1, core_1.Inject(licence_service_1.LicenceService)),
        __metadata("design:paramtypes", [project_type_service_1.ProjectTypeService,
            licence_service_1.LicenceService])
    ], AdvancedSearchFormComponent);
    return AdvancedSearchFormComponent;
}());
exports.AdvancedSearchFormComponent = AdvancedSearchFormComponent;
//# sourceMappingURL=advanced-search-form.component.js.map