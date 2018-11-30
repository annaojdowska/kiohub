import { Component } from '@angular/core';
import { EditProjectGeneralTabComponent } from '../../../edit-project-general-tab/edit-project-general-tab.component';
import { ErrorType } from '../../../error-info/error-type.enum';
import { UpdatableSpinner } from '../updatable-spinner';

@Component({
  selector: 'app-spinner-update-project',
  templateUrl: '../spinner.component.html',
  styleUrls: ['../spinner.component.css']
})
export class SpinnerUpdateProjectComponent extends UpdatableSpinner {
  viewComponent: EditProjectGeneralTabComponent;
  metatadaToSave: number;
  savedMetadata: number;
  sendingOnlyMetadata: boolean;

  constructor() {
    super();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    super.ngOnInit();
    this.setInheritedElements();
  }

  protected setInheritedElements() {
    this.failedElementsText = 'Wystąpiły problemy z dodaniem załączników:';
    this.currentlyBeingSavedText = 'Trwa dodawanie załączników';
    this.savedElementsText = 'Zapisane załączniki: ';
  }

  protected onUpdateCompleted() {
    const updateResult = this.getUpdateResult();
    this.viewComponent.onCompleted(updateResult.text, updateResult.type);
  }

  begin(view: any, attachmentsToSave: number, metatadaToSave, infoString: string) {
    if (attachmentsToSave === 0) {
      this.sendingOnlyMetadata = true;
    } else {
      this.sendingOnlyMetadata = false;
    }
    super.beginUpload(view, attachmentsToSave, infoString);
    this.metatadaToSave = metatadaToSave;
    this.savedMetadata = 0;
  }

  protected setViewComponent(view) {
    this.viewComponent = view;
  }

  addMetadata() {
    this.savedMetadata++;
    this.updateSpinner();
  }

  private getUpdateResult() {
    const errorAmount = this.failedList.length;
    let text: string;
    let errorType: ErrorType;

    if (this.sendingOnlyMetadata) {
      errorType = ErrorType.SUCCESS;
      text = this.infoString;
    } else {
      if (errorAmount > 0) {
        if (errorAmount === this.elementsToSave) {
          errorType = ErrorType.ERROR;
          text = this.infoString + 'Nie udało się zapisać żadnego z załączników. ';
        } else {
          errorType = ErrorType.WARNING;
          text = this.infoString + 'Zapisano ' + (this.elementsToSave - errorAmount) +
            ' załączników. Nie udało się zapisać następujących załączników: ' + this.valueUtils.formatStringArrayToView(this.failedList) + '. ';
        }
      } else {
        errorType = ErrorType.SUCCESS;
        text = this.infoString + 'Zapisano ' + (this.elementsToSave - errorAmount) + ' załączników.';
      }
    }
    return { type: errorType, text: text };
  }

  /**
   * Overriden; update is completed when all attachments and all metadata had been saved
   */
  protected isUpdateCompleted() {
    return (this.elementsToSave === this.savedElements) && (this.metatadaToSave === this.savedMetadata);
  }

  /**
   * Overriden; different message if sending only metadata
   */
  protected updateInfoText() {
    if (this.sendingOnlyMetadata) {
      this.text = 'Trwa zapisywanie danych dotyczących załączników.';
    } else {
      super.updateInfoText();
    }
  }
}
