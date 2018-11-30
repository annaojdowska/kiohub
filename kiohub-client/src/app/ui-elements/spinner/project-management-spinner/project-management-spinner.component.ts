import { Component, OnInit } from '@angular/core';
import { UpdatableSpinner } from '../updatable-spinner';
import { EditProjectGeneralTabComponent } from '../../../edit-project-general-tab/edit-project-general-tab.component';
import { EditProjectManagementTabComponent } from '../../../edit-project-management-tab/edit-project-management-tab.component';
import { ErrorType } from '../../../error-info/error-type.enum';

@Component({
  selector: 'app-spinner-update-management',
  templateUrl: '../spinner.component.html',
  styleUrls: ['../spinner.component.css']
})
export class ProjectManagementSpinnerComponent extends UpdatableSpinner {
  viewComponent: EditProjectManagementTabComponent;


  protected onUpdateCompleted() {
    const updateResult = this.text;
    let textToView;
    let errorType;
    if (this.succesList.length > 0) {
      if (this.failedList.length === 0) {
        textToView = 'Zapisano.';
        errorType = ErrorType.SUCCESS;
      } else {
        textToView = 'Wystąpił problem z zapisaniem części zmian. Odśwież stronę, by zobaczyć co zostało zmienione.';
        errorType = ErrorType.WARNING;
      }
    } else if (this.failedList.length === 0) {
      textToView = 'Zapisano.';
      errorType = ErrorType.SUCCESS;
    } else {
      textToView = 'Nie udało się zapisać zmian.';
      errorType = ErrorType.ERROR;
    }
    this.viewComponent.onUpdateCompleted(updateResult, textToView, errorType);
  }

  protected setInheritedElements() {
    this.failedElementsText = 'Wystąpiły problemy z następującymi zmianami:';
    this.currentlyBeingSavedText = 'Trwa aktualizowanie danych';
    this.savedElementsText = 'Zapisane zmiany: ';
  }

  protected setViewComponent(view: any) {
    this.viewComponent = view;
  }

  constructor() {
    super();
  }

  addNewCollaboratorSuccess(student: string) {
    this.addSuccess('dodanie współpracownika ' + student);
  }

  addNewCollaboratorFail(student: string) {
    this.addFail('dodanie współpracownika ' + student);
  }

  addNewEmailSuccess(studentEmail: string) {
    this.addSuccess('wysłanie maila do ' + studentEmail);
  }

  addNewEmailFail(studentEmail: string) {
    this.addSuccess('wysłanie maila do ' + studentEmail);
  }

  removeCollaboratorSuccess(studentEmail: string) {
    this.addSuccess('usunięcie użytkownika ' + studentEmail);
  }

  removeCollaboratorFail(studentEmail: string) {
    this.addFail('usunięcie użytkownika ' + studentEmail);
  }

  addVisibilitySuccess(elementName: string) {
    this.addSuccess('zmiana widoczności współpracownika ' + elementName);
  }

  addVisibilityFail(elementName: string) {
    this.addFail('zmiana widoczności współpracownika ' + elementName);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    super.ngOnInit();
    this.setInheritedElements();
  }

}
