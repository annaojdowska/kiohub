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
Object.defineProperty(exports, "__esModule", { value: true });
var keycodes_1 = require("@angular/cdk/keycodes");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var InputListComponent = /** @class */ (function () {
    function InputListComponent() {
        var _this = this;
        this.removable = false;
        this.hideInput = false;
        this.orientation = 'horizontal';
        this.elements = null;
        this.predefiniedElements = 'Apple, Lemon, Lime, Orange, Strawberry';
        this.placeholder = 'Kolejne adresy e-mail rozdziel przecinkami, spacjami lub wciśnij enter';
        this.focusedStyle = '';
        this.changeElements = new core_1.EventEmitter();
        this.visible = true;
        this.selectable = false;
        this.addOnBlur = false;
        this.separatorKeysCodes = [keycodes_1.ENTER, keycodes_1.COMMA, keycodes_1.SPACE];
        this.elementCtrl = new forms_1.FormControl();
        this.filteredElements = this.elementCtrl.valueChanges.pipe(operators_1.startWith(null), operators_1.map(function (fruit) { return fruit ? _this._filter(fruit) : _this._predefiniedElements.slice(); }));
    }
    InputListComponent.prototype.sendElements = function () {
        console.log('Cos sie dzieje');
        this.changeElements.emit(this._elements);
    };
    InputListComponent.prototype.ngOnInit = function () {
        this._removable = this.removable;
        this._hideInput = this.hideInput;
        this._orientation = this.orientation;
        if (this.elements === '' || this.elements == null) {
            this._elements = [];
        }
        else {
            this._elements = this.elements.split(',');
        }
        this._predefiniedElements = this.predefiniedElements.split(',').map(function (element) { return element.trim(); });
        this._placeholder = this.placeholder;
        console.log(this.hideInput);
        this.sendElements();
    };
    InputListComponent.prototype.addMatChip = function (event) {
        var input = event.input;
        var value = event.value;
        // Add our element
        if ((value || '').trim()) {
            this._elements.push(value.trim());
            this.sendElements();
        }
        // Reset the input value
        if (input) {
            input.value = '';
        }
        this.elementCtrl.setValue(null);
    };
    InputListComponent.prototype.add = function (element) {
        if ((element || '').trim()) {
            this._elements.push(element.trim());
            this.sendElements();
        }
    };
    InputListComponent.prototype.inputFocus = function () {
        this.focusedStyle = 'mat-focused';
    };
    InputListComponent.prototype.inputFocusOut = function () {
        this.focusedStyle = '';
    };
    InputListComponent.prototype.remove = function (fruit) {
        var index = this._elements.indexOf(fruit);
        if (index >= 0) {
            this._elements.splice(index, 1);
            this.sendElements();
        }
    };
    InputListComponent.prototype.selected = function (event) {
        this._elements.push(event.option.viewValue);
        this.sendElements();
        this.fruitInput.nativeElement.value = '';
        this.elementCtrl.setValue(null);
    };
    InputListComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        return this._predefiniedElements.filter(function (fruit) { return fruit.toLowerCase().indexOf(filterValue) === 0; });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], InputListComponent.prototype, "removable", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], InputListComponent.prototype, "hideInput", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], InputListComponent.prototype, "orientation", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], InputListComponent.prototype, "elements", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], InputListComponent.prototype, "predefiniedElements", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], InputListComponent.prototype, "placeholder", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], InputListComponent.prototype, "changeElements", void 0);
    __decorate([
        core_1.ViewChild('elementInput'),
        __metadata("design:type", core_1.ElementRef)
    ], InputListComponent.prototype, "fruitInput", void 0);
    InputListComponent = __decorate([
        core_1.Component({
            selector: 'app-input-list',
            templateUrl: 'input-list.component.html',
            styleUrls: ['input-list.component.css'],
        }),
        __metadata("design:paramtypes", [])
    ], InputListComponent);
    return InputListComponent;
}());
exports.InputListComponent = InputListComponent;
//# sourceMappingURL=input-list.component.js.map