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
var keycodes_1 = require("@angular/cdk/keycodes");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var project_type_service_1 = require("../services/project-type-service");
var licence_service_1 = require("../services/licence-service");
var project_status_service_1 = require("../services/project-status-service");
var EditProjectGeneralTabComponent = /** @class */ (function () {
    function EditProjectGeneralTabComponent(projectTypeService, licenceService, projectStatusService) {
        this.projectTypeService = projectTypeService;
        this.licenceService = licenceService;
        this.projectStatusService = projectStatusService;
        this.attachments = {
            thesis: [],
            programs: [],
            images: [],
            instructions: [],
            instructionsStart: [],
            others: [],
        };
        this.tags = {
            tag: [],
        };
        this.tagControl = new forms_1.FormControl();
        this.tagOptions = ['aplikacja', 'sztucznainteligencja', 'java'];
    }
    EditProjectGeneralTabComponent.prototype.toggleSemesters = function () {
        this.semestersHidden = !this.semestersHidden;
    };
    EditProjectGeneralTabComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.projectTypeService.getTypes().subscribe(function (result) { return _this.project_types = result; });
        this.licenceService.getLicences().subscribe(function (result) { return _this.licences = result; });
        this.projectStatusService.getStatuses().subscribe(function (result) { return _this.statuses = result; });
        this.semestersHidden = true;
        this.tagFilteredOptions = this.tagControl.valueChanges.pipe(operators_1.startWith(null), operators_1.map(function (value) { return value ? _this._filter(value) : _this.tagOptions; }));
    };
    // Functions for tag input
    EditProjectGeneralTabComponent.prototype.keyUpTag = function (event) {
        switch (event.keyCode) {
            case keycodes_1.ENTER:
            case keycodes_1.SPACE:
            case keycodes_1.COMMA: {
                var value = event.target.value.replace(/[^a-zA-Z0-9]/g, '');
                event.target.value = '';
                this.addTag(value);
                break;
            }
        }
    };
    EditProjectGeneralTabComponent.prototype.tagSelectionChanged = function (event) {
        this.addTag(event.option.viewValue);
        this.tagControl.setValue(null);
    };
    EditProjectGeneralTabComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        return this.tagOptions.filter(function (option) { return option.toLowerCase().includes(filterValue); });
    };
    // Functions for itemsList (add and recive attachments and tags)
    EditProjectGeneralTabComponent.prototype.addThesis = function (event) {
        var filename = event.target.files[0].name;
        this.thesisList.add(filename);
    };
    EditProjectGeneralTabComponent.prototype.addProgram = function (event) {
        var filename = event.target.files[0].name;
        this.programsList.add(filename);
    };
    EditProjectGeneralTabComponent.prototype.addImage = function (event) {
        var filename = event.target.files[0].name;
        this.imagesList.add(filename);
    };
    EditProjectGeneralTabComponent.prototype.addInstruction = function (event) {
        var filename = event.target.files[0].name;
        this.instructionsList.add(filename);
    };
    EditProjectGeneralTabComponent.prototype.addInstructionStart = function (event) {
        var filename = event.target.files[0].name;
        this.instructionsStartList.add(filename);
    };
    EditProjectGeneralTabComponent.prototype.addOther = function (event) {
        var filename = event.target.files[0].name;
        this.othersList.add(filename);
    };
    EditProjectGeneralTabComponent.prototype.addTag = function (event) {
        this.tagsList.add(event);
    };
    EditProjectGeneralTabComponent.prototype.recieveThesis = function (event) {
        var _this = this;
        this.attachments.thesis = [];
        event.map(function (name) { return _this.attachments.thesis.push({ name: name }); });
    };
    EditProjectGeneralTabComponent.prototype.recievePrograms = function (event) {
        var _this = this;
        this.attachments.programs = [];
        event.map(function (name) { return _this.attachments.programs.push({ name: name }); });
    };
    EditProjectGeneralTabComponent.prototype.recieveImages = function (event) {
        var _this = this;
        this.attachments.images = [];
        event.map(function (name) { return _this.attachments.images.push({ name: name }); });
    };
    EditProjectGeneralTabComponent.prototype.recieveInstructions = function (event) {
        var _this = this;
        this.attachments.instructions = [];
        event.map(function (name) { return _this.attachments.instructions.push({ name: name }); });
    };
    EditProjectGeneralTabComponent.prototype.recieveInstructionsStart = function (event) {
        var _this = this;
        this.attachments.instructionsStart = [];
        event.map(function (name) { return _this.attachments.instructionsStart.push({ name: name }); });
    };
    EditProjectGeneralTabComponent.prototype.recieveOthers = function (event) {
        var _this = this;
        this.attachments.others = [];
        event.map(function (name) { return _this.attachments.others.push({ name: name }); });
    };
    EditProjectGeneralTabComponent.prototype.recieveTags = function (event) {
        var _this = this;
        this.tags.tag = [];
        event.map(function (name) { return _this.tags.tag.push({ name: name }); });
    };
    __decorate([
        core_1.ViewChild('thesisList'),
        __metadata("design:type", Object)
    ], EditProjectGeneralTabComponent.prototype, "thesisList", void 0);
    __decorate([
        core_1.ViewChild('programsList'),
        __metadata("design:type", Object)
    ], EditProjectGeneralTabComponent.prototype, "programsList", void 0);
    __decorate([
        core_1.ViewChild('imagesList'),
        __metadata("design:type", Object)
    ], EditProjectGeneralTabComponent.prototype, "imagesList", void 0);
    __decorate([
        core_1.ViewChild('instructionsList'),
        __metadata("design:type", Object)
    ], EditProjectGeneralTabComponent.prototype, "instructionsList", void 0);
    __decorate([
        core_1.ViewChild('instructionsStartList'),
        __metadata("design:type", Object)
    ], EditProjectGeneralTabComponent.prototype, "instructionsStartList", void 0);
    __decorate([
        core_1.ViewChild('othersList'),
        __metadata("design:type", Object)
    ], EditProjectGeneralTabComponent.prototype, "othersList", void 0);
    __decorate([
        core_1.ViewChild('tagsList'),
        __metadata("design:type", Object)
    ], EditProjectGeneralTabComponent.prototype, "tagsList", void 0);
    EditProjectGeneralTabComponent = __decorate([
        core_1.Component({
            selector: 'app-edit-project-general-tab',
            templateUrl: './edit-project-general-tab.component.html',
            styleUrls: ['./edit-project-general-tab.component.css']
        }),
        __param(0, core_1.Inject(project_type_service_1.ProjectTypeService)),
        __param(1, core_1.Inject(licence_service_1.LicenceService)),
        __param(2, core_1.Inject(project_status_service_1.ProjectStatusService)),
        __metadata("design:paramtypes", [project_type_service_1.ProjectTypeService,
            licence_service_1.LicenceService,
            project_status_service_1.ProjectStatusService])
    ], EditProjectGeneralTabComponent);
    return EditProjectGeneralTabComponent;
}());
exports.EditProjectGeneralTabComponent = EditProjectGeneralTabComponent;
//# sourceMappingURL=edit-project-general-tab.component.js.map