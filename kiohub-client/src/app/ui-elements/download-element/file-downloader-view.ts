export interface FileDownloaderView {
    /**
     * Pass itself into DownloadElement.
     */
    setDownloadElements();
    /**
     * Actions taken when the file's download begins.
     */
    onBeginDownloding(filename: string);
    /**
     * Actions taken when the file's download ends.
     */
    onDownloadingCompleted();
}
