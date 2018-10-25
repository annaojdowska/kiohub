import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerDownloadAttachmentComponent } from './spinner-download-attachment.component';

describe('SpinnerDownloadAttachmentComponent', () => {
  let component: SpinnerDownloadAttachmentComponent;
  let fixture: ComponentFixture<SpinnerDownloadAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnerDownloadAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerDownloadAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
