import { ErrorType } from 'src/app/error-info/error-type.enum';
import { Component } from '@angular/core';
import { UpdatableSpinner } from '../updatable-spinner';
import { EditProjectGeneralTabComponent } from 'src/app/edit-project-general-tab/edit-project-general-tab.component';

@Component({
  selector: 'app-spinner-update-project',
  templateUrl: '../spinner.component.html',
  styleUrls: ['../spinner.component.css']
})
export class SpinnerUpdateProjectComponent extends UpdatableSpinner {
  viewComponent: EditProjectGeneralTabComponent;

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
    const data = this.getDataToView();
    this.viewComponent.onCompleted(data.text, data.type);
  }

  begin(view: any, attachmentsToSave: number, infoString: string) {
    super.beginUpload(view, attachmentsToSave, infoString);
  }

  protected setViewComponent(view) {
    this.viewComponent = view;
  }

  private getDataToView() {
    const errorAmount = this.failedList.length;
    let text: string;
    let errorType: ErrorType;

    if (errorAmount > 0) {
      if (errorAmount === this.elementsToSave) {
        errorType = ErrorType.ERROR;
        text = this.infoString + 'A załączniki? Nie udało się zapisać żadnego z załączników. ';
      } else {
        errorType = ErrorType.WARNING;
        text = this.infoString + 'A załączniki? Zapisano ' + (this.elementsToSave - errorAmount) +
          ' załączników. Nie udało się zapisać następujących załączników: ' + this.valueUtils.formatStringArrayToView(this.failedList) + '. ';
      }
    } else {
      errorType = ErrorType.SUCCESS;
      text = this.infoString + 'A załączniki? Zapisano ' + (this.elementsToSave - errorAmount) + ' załączników.';
    }
    return { type: errorType, text: text };
  }
}
