import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuBarNotLoggedComponent } from './menu-bar-not-logged.component';

describe('MenuBarNotLoggedComponent', () => {
  let component: MenuBarNotLoggedComponent;
  let fixture: ComponentFixture<MenuBarNotLoggedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuBarNotLoggedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuBarNotLoggedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
