import { ErrorInfoComponent } from './error-info.component';
import { SemesterChooserComponent } from '../semester-chooser/semester-chooser.component';

export class Validation {
    readonly MAX_SIZE_DESCRIPTION_PL = 2000;
    readonly MAX_SIZE_DESCRIPTION_EN = 2000;
    readonly MAX_SIZE_TAG = 30;

    // ******** REGEX PATTERNS ********
    // creates pattern string allowing to write any character <from,to> times
    getString(from, to) {
        return '^.{' + from + ',' + to + '}';
    }

    getTitlePattern() {
        return this.getString(0, 255);
    }

    isLetterOrNumberPattern() {
        return '^[a-zA-Z0-9ęóąśżźćńł]*$';
    }

    // validates element and displays error if invalid
    validateElementAndHandleError(element: ErrorInfoComponent, validationOk: boolean) {
        element.setDisplay(!validationOk);
        return validationOk;
    }

    // ******** COMPONENT VALIDATION ********

    validateTitlePl(titlePl) {
        return this.validateMandatoryInputWithPattern(titlePl);
    }

      validateTitleEn(titleEn) {
        return this.validateInputWithPattern(titleEn);
      }

      validateDescriptionPl(descriptionPl) {
        return this.validateTextArea(descriptionPl, this.MAX_SIZE_DESCRIPTION_PL);
      }

      validateDescriptionEn(descriptionEn) {
        return this.validateTextArea(descriptionEn, this.MAX_SIZE_DESCRIPTION_EN);
      }

      validateProjectType(projectType) {
        return this.validateSelectNotNull(projectType);
      }

      validateProjectStatus(projectStatus) {
        return this.validateSelectNotNull(projectStatus);
      }

      validateSemesterChooser(semesterChooser) {
        return this.validateSemesterChooserElement(semesterChooser);
      }

      validateInputTag(tagsListComponent) {
        return this.validateInputWithPattern(tagsListComponent) && this.validateMaxSize(tagsListComponent.nativeElement.value, this.MAX_SIZE_TAG);
      }

  // ******** COMPONENT TYPE VALIDATION ********

    validateInputWithPattern(element) {
        return element.nativeElement.validity.valid;
    }

    validateMandatoryInputWithPattern(element) {
        return element.nativeElement.validity.valid && !this.isNullOrEmpty(element.nativeElement.value);
    }

    validateTextArea(element, maxSize: number) {
        return this.validateMaxSize(element.nativeElement.value, maxSize);
    }

    validateSelectNotNull(element) {
        return this.isNullOrEmpty(element.value) ? false : true;
    }

    validateSemesterChooserElement(element: SemesterChooserComponent) {
        return !this.isNullOrUndefined(element) && element.semesters.length > 0;
    }

     // ******** VALUE VALIDATION ********
    validateMaxSize(stringValue, maxSize) {
        return stringValue.length < maxSize;
    }

    isNullOrEmpty(value: string) {
        if (this.isNullOrUndefined(value) || value.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    isNullOrUndefined(value) {
        return value === undefined || value === null;
    }
}
