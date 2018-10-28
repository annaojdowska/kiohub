
export class ValueUtils {
    updatedProjectBoolean = 'updatedProject';
    savedNoteBoolean = 'savedNote';
    updatedProjectText = 'updatedProjectText';
    // SUCCESS, ERROR, WARNING
    updatedProjectStatus = 'udpatedProjectStatus';
    publishProjectBoolean = 'publishProject';
    publishProjectText = 'publishProjectText';
    publishProjectStatus = 'publishProjectStatus';
    // invitations
    invitationsOk = 'invitationsOk';
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
    findElementsWithId(array) {
        return array.elements.filter(e => (!e.id));
    }

    findElementsWithoutId(array) {
        return array.elements.filter(e => (e.id));
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
    getBooleanAndRemoveFromSession(key: string): boolean {
        // console.log('------1-' + key);
        const value = this.getAndRemoveDataFromSessionStorage(key);
        if (this.isNullOrUndefined(value)) {
            // console.log('------3-false, null!');
            return null;
        }
        const booleanValue = this.getBooleanFromString(value);
        if (typeof (booleanValue) === typeof (true)) {
            // console.log('------5-to boolean!');
            if (booleanValue) {
                // console.log('-----6--boolean: true');
                return true;
            } else {
                // console.log('-----6--boolean: false');
                return false;
            }
        } else {
            // console.log('------5-nie boolean!');
            return false;
        }
    }

    /**
    * Ex. change "true" to true
    */
    getBooleanFromString(value: string): boolean {
        if (value === 'true' || value === '\"true\"') {
            // console.log('------4-true!');
            return true;
        } else {
            // console.log('------4-false!');
            return false;
        }
    }

    private getAndRemoveDataFromSessionStorage(key: string): string {
        const value = sessionStorage.getItem(key);
        sessionStorage.removeItem(key);
        // console.log('------2-value: ' + value);
        return value;
    }
}
