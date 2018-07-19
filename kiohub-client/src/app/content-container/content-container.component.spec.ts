import { TestBed, inject, ComponentFixture } from '@angular/core/testing';

import { ContentContainerComponent } from './content-container.component';

describe('a content-container component', () => {
let component: ContentContainerComponent;
let fixture: ComponentFixture<ContentContainerComponent>;

// register all needed dependencies
beforeEach(() => {
TestBed.configureTestingModule({providers: [ContentContainerComponent]});
});

// instantiation through framework injection
beforeEach(() => {
fixture = TestBed.createComponent(ContentContainerComponent);
component = fixture.componentInstance;
fixture.detectChanges();
});


it('should have an instance', () => {expect(component).toBeDefined();
});
});


