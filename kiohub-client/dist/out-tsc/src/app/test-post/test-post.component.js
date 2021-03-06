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
var search_service_1 = require("../services/search.service");
var httpOptions = {
    headers: new http_1.HttpHeaders({
        'ContentType': 'application/json'
    })
};
var TestPostComponent = /** @class */ (function () {
    function TestPostComponent(http, searchService) {
        this.http = http;
        this.searchService = searchService;
    }
    TestPostComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.searchService.getSearchResults().subscribe(function (res) { return _this.results = res; });
    };
    TestPostComponent.prototype.send2 = function () {
        this.http.post('http://kiohub.eti.pg.gda.pl:8080/project/post', this.results[0], httpOptions)
            .subscribe(function (data) {
            alert('ok');
        }, function (error) {
            alert('nie ok');
        });
    };
    TestPostComponent = __decorate([
        core_1.Component({
            selector: 'app-test-post',
            templateUrl: './test-post.component.html',
            styleUrls: ['./test-post.component.css']
        }),
        __param(0, core_1.Inject(http_1.HttpClient)), __param(1, core_1.Inject(search_service_1.SearchService)),
        __metadata("design:paramtypes", [http_1.HttpClient, search_service_1.SearchService])
    ], TestPostComponent);
    return TestPostComponent;
}());
exports.TestPostComponent = TestPostComponent;
//# sourceMappingURL=test-post.component.js.map