"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var menu_button_component_1 = require("./menu-button.component");
describe('a menu-button component', function () {
    var component;
    var fixture;
    // register all needed dependencies
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({ providers: [menu_button_component_1.MenuButtonComponent] });
    });
    // instantiation through framework injection
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(menu_button_component_1.MenuButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should have an instance', function () {
        expect(component).toBeDefined();
    });
});
//# sourceMappingURL=menu-button.component.spec.js.map