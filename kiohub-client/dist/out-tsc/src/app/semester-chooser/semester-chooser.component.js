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
var semester_service_1 = require("../services/semester-service");
var animations_1 = require("@angular/animations");
var SemesterChooserComponent = /** @class */ (function () {
    function SemesterChooserComponent(semesterService) {
        this.semesterService = semesterService;
        this.pageScope = 12;
        this.beginIndex = 4 * 12;
        this.endIndex = this.beginIndex + this.pageScope;
        this.pathToLeftArrow = '../../assets/left-arrow.png';
        this.pathToRightArrow = '../../assets/right-arrow.png';
        this.chosenSemesters = [];
        this.semesters = [];
    }
    SemesterChooserComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.semesterService.getSemesters().subscribe(function (result) { return _this.semesters = result; });
    };
    SemesterChooserComponent.prototype.getSemestersToDisplay = function (begin, end) {
        if (!this.semesters) {
            return;
        }
        return this.semesters.slice(begin, end);
    };
    SemesterChooserComponent.prototype.moveToNext = function () {
        this.beginIndex += this.pageScope;
        this.endIndex += this.pageScope;
    };
    SemesterChooserComponent.prototype.moveToPrevious = function () {
        this.beginIndex -= this.pageScope;
        this.endIndex -= this.pageScope;
    };
    SemesterChooserComponent.prototype.chooseSemester = function (chosenSemester) {
        var index = this.chosenSemesters.findIndex(function (sem) { return sem.id === chosenSemester.id; });
        if (index !== -1) {
            this.chosenSemesters.splice(index, 1);
        }
        else {
            this.chosenSemesters.push(chosenSemester);
        }
        console.log(this.chosenSemesters);
    };
    SemesterChooserComponent.prototype.getColor = function (chosenSemester) {
        var index = this.chosenSemesters.findIndex(function (sem) { return sem.id === chosenSemester.id; });
        if (index !== -1) {
            return 'rgb(208, 211, 233)';
        }
        else {
            return 'whitesmoke';
        }
    };
    SemesterChooserComponent = __decorate([
        core_1.Component({
            selector: 'app-semester-chooser',
            templateUrl: './semester-chooser.component.html',
            styleUrls: ['./semester-chooser.component.css'],
            animations: [
                animations_1.trigger('enterAnimation', [
                    animations_1.transition(':enter', [
                        animations_1.style({ transform: 'translateX(100%)', opacity: 0 }),
                        animations_1.animate('500ms', animations_1.style({ transform: 'translateX(0)', opacity: 1 }))
                    ]),
                    animations_1.transition(':leave', [
                        animations_1.style({ transform: 'translateX(0)', opacity: 1 }),
                        animations_1.animate('500ms', animations_1.style({ transform: 'translateX(100%)', opacity: 0 }))
                    ]),
                ])
            ],
        }),
        __param(0, core_1.Inject(semester_service_1.SemesterService)),
        __metadata("design:paramtypes", [semester_service_1.SemesterService])
    ], SemesterChooserComponent);
    return SemesterChooserComponent;
}());
exports.SemesterChooserComponent = SemesterChooserComponent;
//# sourceMappingURL=semester-chooser.component.js.map