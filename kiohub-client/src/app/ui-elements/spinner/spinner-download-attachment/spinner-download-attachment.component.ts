import { Component } from '@angular/core';
import { ProjectViewComponent } from 'src/app/project-view/project-view.component';
import { ValueUtils } from 'src/app/utils/value-utils';
import { UpdatableSpinner } from '../updatable-spinner';

@Component({
  selector: 'app-spinner-download-attachment',
  templateUrl: '../spinner.component.html',
  styleUrls: ['../spinner.component.css']
})
export class SpinnerDownloadAttachmentComponent extends UpdatableSpinner {
  valueUtils = new ValueUtils();
  viewComponent: ProjectViewComponent;

  constructor() {
    super();
  }

  protected onUpdateCompleted() {
    this.resetSpinner();
    this.viewComponent.onDownloadingCompleted();
  }

  protected setInheritedElements() {
    this.currentlyBeingSavedText = 'Trwa pobieranie załączników:';
    this.savedElementsText = 'Pobrano załączniki:';
    this.failedElementsText = 'Nie udało się pobrać następujących załączników:';
  }


  begin(view: ProjectViewComponent) {
    if (this.valueUtils.isNullOrUndefined(this.elementsToSave)) {
      // no files were being downloaded before
      super.beginUpload(view, 1, '');
    } else {
      // downloading files had been completed
      if (this.isUpdateCompleted()) {
        super.beginUpload(view, 1, '');
      } else {
        // files are still being downloaded
        this.elementsToSave += 1;
        this.setDisplay(true);
        this.updateInfoText();
      }
    }
  }

  protected setViewComponent(view) {
    this.viewComponent = view;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    super.ngOnInit();
    this.setInheritedElements();
  }
}
