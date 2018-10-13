
export class ValueUtils {
    updatedProjectBoolean = 'updatedProject';
    savedNoteBoolean = 'savedNote';
    updatedProjectText = 'updatedProjectText';
    // SUCCESS, ERROR, WARNING
    updatedProjectStatus = 'udpatedProjectStatus';
    publishProjectBoolean = 'publishProject';
    publishProjectText = 'publishProjectText';
    publishProjectStatus = 'publishProjectStatus';
    /**
     * For strings
     */
    isNullOrEmpty(value: string) {
        if (this.isNullOrUndefined(value) || value.length === 0) {
            return true;
        } else {
            return false;
        }
    }

     /**
     * For any type
     */
    isNullOrUndefined(value) {
        return value === undefined || value === null;
    }

     /**
     * Check if string length is shortert than value
     */
    validateMaxSize(stringValue, maxSize) {
        return stringValue.length < maxSize;
    }

     /**
     * Return elements that doesn't have set id
     */
    findElementsToSaveInArray(array) {
        return array.elements.filter(e => (!e.id));
    }

     /**
     * New line + elements separated by ','
     */
    formatStringArrayToView(array: string[]) {
        let text = '\n';
        let i = 0;
        for (const s of array) {
            if (i++ !== array.length - 1) {
                text += s + ', ';
            } else {
                text += s;
            }
        }
        return text;
    }

    setDisplay(isVisible: boolean) {
        if (isVisible) {
            return 'block';
        } else {
            return 'none';
        }
    }

    /**
     * Save to session storage
     */
    saveToSession(key: string, value) {
        sessionStorage.setItem(key, value);
    }

     /**
     * Get from session storage
     */
    getAndRemoveFromSession(key: string) {
        return this.getAndRemoveDataFromSessionStorage(key);
    }

     /**
     * Get boolean from session storage
     */
    getBooleanAndRemoveFromSession(key: string) {
        const value = this.getAndRemoveDataFromSessionStorage(key);
        if (this.isNullOrUndefined(value)) {
            return false;
        }
        const booleanValue = this.getBooleanFromString(value);
        if (typeof (booleanValue) === typeof (true)) {
            if (booleanValue) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

     /**
     * Ex. change "true" to true
     */
    getBooleanFromString(value: string) {
        if (value === 'true' || value === '\"true\"' || value) {
            return true;
        } else {
            return false;
        }
    }

    private getAndRemoveDataFromSessionStorage(key: string) {
        const value = sessionStorage.getItem(key);
        sessionStorage.removeItem(key);
        console.log(value);
        return value;
    }
}
