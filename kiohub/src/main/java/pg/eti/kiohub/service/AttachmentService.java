package pg.eti.kiohub.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pg.eti.kiohub.entity.model.Attachment;
import pg.eti.kiohub.entity.repository.AttachmentRepository;
import pg.eti.kiohub.utils.FileUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Value;

@Service
public class AttachmentService {
    @Autowired
    AttachmentRepository attachmentRepository;
    @Autowired
    AttachmentRepository attachmentFileRepository;

    public boolean attachmentExists(Optional<Attachment> attachment) {
        Attachment att = attachment.get();
        return attachment.isPresent() && new File(att.getFullPath()).exists();
    }

    public void rollbackSaveAttachment(Attachment attachment) {
        if (attachment != null) {
            if (attachment.getId() != null) {
                attachmentRepository.deleteById(attachment.getId());
            }
        }
    }
    
    public boolean saveAttachmentToDisk(InputStream inputStream, String filepath) throws IOException {
        try {
            File targetFile = new File(filepath);
            OutputStream outputStream = new FileOutputStream(targetFile);
                byte[] buffer = new byte[8 * 1024];
                    int bytesRead;
                    while ((bytesRead = inputStream.read(buffer)) != -1) {
                            outputStream.write(buffer, 0, bytesRead);
                        }
                        IOUtils.closeQuietly(inputStream);
                        IOUtils.closeQuietly(outputStream);
        } catch (FileNotFoundException ex) {
            Logger.getLogger(AttachmentService.class.getName()).log(Level.SEVERE, null, ex);
            return false;
        } finally {
            try {
                inputStream.close();
            } catch (IOException ex) {
                Logger.getLogger(AttachmentService.class.getName()).log(Level.SEVERE, null, ex);
                return false;
            }
        }
        return true;
    }
    
        public InputStream getAttachmentFromDisk(Attachment attachment) throws FileNotFoundException {
        String path = attachment.getFullPath();
        String name = attachment.getFileName();
        String extension = FilenameUtils.getExtension(name);

        File fileToDownload = new File(path);
        File fileNameToDownload = new File(name);
        fileToDownload.renameTo(fileNameToDownload);
        InputStream inputStream = new FileInputStream(fileToDownload);
        return inputStream;
    }
        
        private void deleteAttachmentFromDisk(Attachment attachment) throws IOException {
            File file = new File(attachment.getFullPath());
            if (!file.delete()) {
                throw new IOException();
            }
        }

    public void remove(Attachment attachment) throws IOException {
        deleteAttachmentFromDisk(attachment);
        attachmentRepository.deleteById(attachment.getId());
    }

        

}
