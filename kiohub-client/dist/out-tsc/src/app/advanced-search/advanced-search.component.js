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
var search_service_1 = require("../services/search.service");
var animations_1 = require("@angular/animations");
var AdvancedSearchComponent = /** @class */ (function () {
    function AdvancedSearchComponent(searchService) {
        this.searchService = searchService;
    }
    AdvancedSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.searchService.getSearchResults().subscribe(function (result) { return _this.searchResults = result; });
    };
    AdvancedSearchComponent = __decorate([
        core_1.Component({
            selector: 'app-advanced-search',
            templateUrl: './advanced-search.component.html',
            styleUrls: ['./advanced-search.component.css'],
            animations: [
                animations_1.trigger('fadeInOut', [
                    animations_1.transition(':enter', [
                        animations_1.style({ opacity: 0 }),
                        animations_1.animate('500ms linear', animations_1.style({ opacity: 1 }))
                    ]),
                    animations_1.transition(':leave', [
                        animations_1.animate('500ms linear', animations_1.style({ opacity: 0 }))
                    ])
                ])
            ]
        }),
        __param(0, core_1.Inject(search_service_1.SearchService)),
        __metadata("design:paramtypes", [search_service_1.SearchService])
    ], AdvancedSearchComponent);
    return AdvancedSearchComponent;
}());
exports.AdvancedSearchComponent = AdvancedSearchComponent;
//# sourceMappingURL=advanced-search.component.js.map