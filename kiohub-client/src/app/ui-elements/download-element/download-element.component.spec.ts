import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadElementComponent } from './download-element.component';

describe('DownloadElementComponent', () => {
  let component: DownloadElementComponent;
  let fixture: ComponentFixture<DownloadElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
