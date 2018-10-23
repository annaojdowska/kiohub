import { ValueUtils } from './value-utils';

/**
 * Class storing possible file formats for attachments of different types.
 */
export class FileUtils {
    readonly EXT_PDF = 'application/pdf';
    readonly EXT_DOC = 'application/msword';
    readonly EXT_DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    readonly EXT_TXT = 'text/plain';
    readonly EXT_TEX = 'application/x-tex';
    readonly EXT_DVI = 'application/x-dvi';
    readonly EXT_ZIP = 'application/zip';
    readonly EXT_ZIP_2 = 'multipart/x-zip';
    readonly EXT_ZIP_3 = 'application/x-zip-compressed';
    readonly EXT_TGZ = 'application/tgz';
    readonly EXT_GIF = 'image/gif';
    readonly EXT_JPG = 'image/jpeg';
    readonly EXT_JPEG = 'image/jpeg';
    readonly EXT_PNG = 'image/png';
    readonly EXT_ODT = 'application/vnd.oasis.opendocument.text';

    readonly thesisExtensions = [this.EXT_PDF, this.EXT_DOC, this.EXT_DOCX, this.EXT_TXT, this.EXT_TEX, this.EXT_DVI, this.EXT_ODT];
    readonly sourceCodeExtensions = [this.EXT_ZIP, this.EXT_ZIP_2, this.EXT_ZIP_3, this.EXT_TGZ];
    readonly imageExtensions = [this.EXT_GIF, this.EXT_JPG, this.EXT_JPEG, this.EXT_PNG];
    readonly manualExtensions = this.thesisExtensions;
    readonly manualStartupExtensions = this.thesisExtensions;
    readonly otherFileExtensions = [this.EXT_PDF, this.EXT_DOC, this.EXT_DOCX, this.EXT_TXT, this.EXT_TEX, this.EXT_DVI, this.EXT_ZIP, this.EXT_ZIP_2, this.EXT_ZIP_3, this.EXT_ODT,
    this.EXT_TGZ, this.EXT_GIF, this.EXT_JPG, this.EXT_JPEG, this.EXT_PNG];

    valueUtils = new ValueUtils();

    // ******** ACCEPTABLE FORMATS FOR DIFFERENT ATTACHMENT TYPES ********
    getThesisExtensions() {
        return '.pdf, .doc, .docx, .txt, .tex, .dvi, .odt';
    }

    getSourceCodeExtensions() {
        return '.zip, .tgz';
    }

    getImageExtensions() {
        return '.gif, .jpg, .jpeg, .png';
    }

    getManualExtensions() {
        return this.getThesisExtensions();
    }

    getManualStartupExtensions() {
        return this.getThesisExtensions();
    }

    getOtherFileExtensions() {
        return '.pdf, .doc, .docx, .txt, .tex, .dvi, .zip, .odt, .tgz, .gif, .jpg, .jpeg, .png';
    }

    // ******** CHECK IF ATTACHMENT IS ACCEPTABLE ********
    isThesisType(type: string) {
        return this.isTypeInArrayOfTypes(type, this.thesisExtensions);
    }

    isSourceCodeType(type: string) {
        return this.isTypeInArrayOfTypes(type, this.sourceCodeExtensions);
    }

    isImageType(type: string) {
        return this.isTypeInArrayOfTypes(type, this.imageExtensions);
    }

    isManualType(type: string) {
        return this.isTypeInArrayOfTypes(type, this.manualExtensions);
    }

    isManualStartupType(type: string) {
        return this.isTypeInArrayOfTypes(type, this.manualStartupExtensions);
    }

    isOtherFileType(type: string) {
        return this.isTypeInArrayOfTypes(type, this.otherFileExtensions);
    }

    private isTypeInArrayOfTypes(type: string, typeArray: string[]) {
        const isType = typeArray.find(ext => ext === type);
        return !this.valueUtils.isNullOrUndefined(isType);
    }

}
