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
var http_1 = require("@angular/common/http");
var SearchService = /** @class */ (function () {
    function SearchService(http) {
        this.http = http;
        // this.searchResults = new Observable<Project[]>();
        this.searchResults = this.http.get('http://kiohub.eti.pg.gda.pl:8080/project/all', { responseType: 'json' });
    }
    SearchService.prototype.search = function (phrase) {
        var params = new http_1.HttpParams().set('phrase', phrase);
        this.searchResults = this.http.get('http://kiohub.eti.pg.gda.pl:8080/project/quick-search', { responseType: 'json', params: params });
        return this.searchResults;
    };
    SearchService.prototype.getSearchResults = function () {
        return this.searchResults;
    };
    SearchService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_1.HttpClient)),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], SearchService);
    return SearchService;
}());
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map