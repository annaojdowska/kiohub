import { OnInit } from '@angular/core';
import { Validation } from '../error-info/validation-patterns';
import { MatDatepickerInputEvent } from '@angular/material';
import { ENTER } from '@angular/cdk/keycodes';
import { IAdvancedSearchFormValidation } from './iadvanced-search-form';
import { SearchType } from './search-type.enum';

/**
 * Class validating AdvancedSearchForm and MyProjectsSearchForm.
 */
export class AdvancedSearchFormValidation implements OnInit {
    private validation = new Validation();
    private searchForm: IAdvancedSearchFormValidation;
    private searchType: SearchType;

    constructor(searchForm: IAdvancedSearchFormValidation, searchType: SearchType) {
        this.searchForm = searchForm;
        this.searchType = searchType;
    }

    ngOnInit(): void {
    }

    // ******** GETTERS ********
    getTitlePattern() {
        return this.validation.getTitlePattern();
    }

    getSupervisorPattern() {
        return this.validation.getSupervisorPattern();
    }

    getIsLetterOrNumberPattern() {
        return this.validation.isLetterOrNumberPattern();
    }

    getDescriptionPattern() {
        return this.validation.getDescriptionPattern();
    }

    // ******** FUNCTION CALLED WHEN ELEMENT'S VALUE CHANGES ********
    public dateFromChanged(type: string, event: MatDatepickerInputEvent<Date>) {
        if (this.checkValidityDates(event.value, this.searchForm.dateTo)) {
            this.searchForm.dateFrom = event.value;
        }
        this.searchForm.enteredDateFrom = event.value;
        this.hideSearchResultsError();
    }

    public dateToChanged(type: string, event: MatDatepickerInputEvent<Date>) {
        if (this.checkValidityDates(this.searchForm.dateFrom, event.value)) {
            this.searchForm.dateTo = event.value;
        }
        this.searchForm.enteredDateTo = event.value;
        this.hideSearchResultsError();
    }

    onSupervisorChange(event) {
        this.checkValiditySupervisor();
        this.hideSearchResultsError();
    }

    onTitlePlChange(event) {
        this.checkValidityTitle();
        this.hideSearchResultsError();
    }

    onDescriptionPlChange(event) {
        this.checkValidityDescription();
        this.hideSearchResultsError();
    }

    onKeyUpTag(event: KeyboardEvent) {
        switch (event.keyCode) {
            case ENTER: {
                if (this.checkValidityTag()) {
                    // const value = (<HTMLInputElement>event.target).value;
                    this.searchForm.addTag();
                }
                break;
            }
            default: {
                this.checkValidityTag();
                break;
            }
        }
        this.hideSearchResultsError();
    }

    // ******** CHECK VALIDITY ********
    checkValidityTitle() {
        return this.validation.validate(this.searchForm.errorTitle, this.validation.validateInputWithPattern(this.searchForm.titleInput));
    }

    checkValidityDescription() {
        return this.validation.validate(this.searchForm.errorDescription, this.validation.validateInputWithPattern(this.searchForm.descriptionInput));
    }

    checkValiditySupervisor() {
        return this.validation.validate(this.searchForm.errorSupervisor, this.validation.validateInputWithPattern(this.searchForm.supervisorInput));
    }

    checkValidityDates(from: Date, to: Date) {
        return this.validation.validate(this.searchForm.errorDate, this.validation.validateDatesOrder(from, to));
    }

    checkValidityDatesNotNull(from: Date, to: Date) {
        return this.validation.validate(this.searchForm.errorDate, this.validation.validateDatesOrderNotNull(from, to));
    }

    checkValidityTag() {
        return this.validation.validate(this.searchForm.errorTag, this.validation.validateInputTag(this.searchForm.tagInput));
    }

    /**
     * Called after every value change. If user provided wrong data and clicked 'Apply filters', he will get an error;
     * On any value change this error should be hidden because this error is out-of-date due to change in filters.
     */
    hideSearchResultsError() {
        this.searchForm.searchError.setDisplay(false);
    }

    validateAllElements() {
        let validationOk = true;
        validationOk = this.checkValidityTitle() && validationOk;
        validationOk = this.checkValidityTag() && validationOk;
        if (this.searchType === SearchType.PROJECTS_BASE) {
            validationOk = this.checkValiditySupervisor() && validationOk;
            validationOk = this.checkValidityDescription() && validationOk;
        }
        // console.log(validationOk);
        validationOk = this.checkValidityDates(this.searchForm.enteredDateFrom, this.searchForm.enteredDateTo) && validationOk;
        // console.log(validationOk);

        return validationOk;
    }
}
