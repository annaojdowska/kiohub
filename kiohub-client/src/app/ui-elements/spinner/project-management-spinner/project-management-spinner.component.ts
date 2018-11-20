import { Component, OnInit } from '@angular/core';
import { UpdatableSpinner } from '../updatable-spinner';
import { EditProjectGeneralTabComponent } from 'src/app/edit-project-general-tab/edit-project-general-tab.component';
import { EditProjectManagementTabComponent } from 'src/app/edit-project-management-tab/edit-project-management-tab.component';
import { ErrorType } from 'src/app/error-info/error-type.enum';

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
    console.log('Zakończono update projektu.');
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
    this.dbg('+ dodanie współpracownika ' + student);
    this.addSuccess('dodanie współpracownika ' + student);
  }

  addNewCollaboratorFail(student: string) {
    this.dbg('- dodanie współpracownika ' + student);
    this.addFail('dodanie współpracownika ' + student);
  }

  addNewEmailSuccess(studentEmail: string) {
    this.dbg('+ wysłanie maila do ' + studentEmail);
    this.addSuccess('wysłanie maila do ' + studentEmail);
  }

  addNewEmailFail(studentEmail: string) {
    this.dbg('- wysłanie maila do ' + studentEmail);
    this.addSuccess('wysłanie maila do ' + studentEmail);
  }

  removeCollaboratorSuccess(studentEmail: string) {
    this.dbg('+ usunięcie użytkownika ' + studentEmail);
    this.addSuccess('usunięcie użytkownika ' + studentEmail);
  }

  removeCollaboratorFail(studentEmail: string) {
    this.dbg('- usunięcie użytkownika ' + studentEmail);
    this.addFail('usunięcie użytkownika ' + studentEmail);
  }

  addVisibilitySuccess(elementName: string) {
    this.dbg('+ zmiana widoczności współpracownika ' + elementName);
    this.addSuccess('zmiana widoczności współpracownika ' + elementName);
  }

  addVisibilityFail(elementName: string) {
    this.dbg('- zmiana widoczności współpracownika ' + elementName);
    this.addFail('zmiana widoczności współpracownika ' + elementName);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    super.ngOnInit();
    this.setInheritedElements();
  }

  dbg(text: string) {
    console.log(text);
  }

}
