import { TestBed, inject, ComponentFixture } from '@angular/core/testing';

import { MenuButtonComponent } from './menu-button.component';

describe('a menu-button component', () => {
let component: MenuButtonComponent;
let fixture: ComponentFixture<MenuButtonComponent>;

// register all needed dependencies
beforeEach(() => {
TestBed.configureTestingModule({
providers: [MenuButtonComponent]
});
});

// instantiation through framework injection
beforeEach(() => {
fixture = TestBed.createComponent(MenuButtonComponent);
component = fixture.componentInstance;
fixture.detectChanges();
});

it('should have an instance', () => {
expect(component).toBeDefined();
});
});
