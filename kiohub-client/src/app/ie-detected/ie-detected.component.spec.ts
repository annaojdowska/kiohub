import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IEDetectedComponent } from './ie-detected.component';

describe('IEDetectedComponent', () => {
  let component: IEDetectedComponent;
  let fixture: ComponentFixture<IEDetectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IEDetectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IEDetectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
