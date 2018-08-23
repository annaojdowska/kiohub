"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var content_container_component_1 = require("./content-container.component");
describe('a content-container component', function () {
    var component;
    var fixture;
    // register all needed dependencies
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({ providers: [content_container_component_1.ContentContainerComponent] });
    });
    // instantiation through framework injection
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(content_container_component_1.ContentContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should have an instance', function () {
        expect(component).toBeDefined();
    });
});
//# sourceMappingURL=content-container.component.spec.js.map