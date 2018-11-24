import { ErrorInfoComponent } from '../error-info/error-info.component';
import { Semester } from '../model/semester.interface';
import { ProjectType } from '../model/project-type.interface';
import { Licence } from '../model/licence.interface';
import { MatDatepickerInput } from '@angular/material';

/**
 * Interface allowing advanced search component to be validated.
 */
export interface IAdvancedSearchFormValidation {
    errorSupervisor: ErrorInfoComponent;
    errorTag: ErrorInfoComponent;
    errorTitle: ErrorInfoComponent;
    errorDescription: ErrorInfoComponent;
    errorDate: ErrorInfoComponent;
    searchError: ErrorInfoComponent;

    dateInputFrom: MatDatepickerInput<Date>;
    dateInputTo: MatDatepickerInput<Date>;
    supervisorInput: any;
    titleInput: any;
    descriptionInput: any;
    tagInput: any;

    chosenSemesters: Semester[];
    selectedType: ProjectType;
    selectedLicence: Licence;
    // correctly validated dates
    dateFrom: Date;
    dateTo: Date;
    // dates provided by user (not necessarilly correct); used to validate all elements
    enteredDateFrom: Date;
    enteredDateTo: Date;

    addTag();
}
