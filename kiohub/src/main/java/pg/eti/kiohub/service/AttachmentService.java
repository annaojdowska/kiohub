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
import pg.eti.kiohub.entity.model.AttachmentFile;
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

@Service
public class AttachmentService {
    @Autowired
    AttachmentRepository attachmentRepository;
    @Autowired
    AttachmentRepository attachmentFileRepository;

    public void prepareAndSaveAttachment(Optional<Attachment> attachmentOpt,
                                         Optional<AttachmentFile> attachmentFileOpt,
                                         HttpServletResponse response) throws SQLException, IOException {
        Attachment attachment = attachmentOpt.get();
        AttachmentFile attachmentFile = attachmentFileOpt.get();

        String name = attachment.getFileName();
        String extension = FilenameUtils.getExtension(name);
        Blob blob = attachmentFile.getFile();

        InputStream in = blob.getBinaryStream();
        response.setContentType(FileUtils.getMimeType(extension));
        IOUtils.copy(in, response.getOutputStream());
    }

    public boolean attachmentExists(Optional<AttachmentFile> attachmentFile, Optional<Attachment> attachment) {
        return attachmentFile.isPresent() && attachment.isPresent();
    }

    public void rollbackSaveAttachment(Attachment attachment) {
        if (attachment != null) {
            if (attachment.getId() != null) {
                attachmentRepository.deleteById(attachment.getId());
                attachmentFileRepository.deleteById(attachment.getId());
            }
        }
    }
    
    public boolean saveAttachmentToDisk(InputStream inputStream) throws IOException {
        try {
            File targetFile = new File("/home/attachments/wyjscie.txt");
            OutputStream outputStream = new FileOutputStream(targetFile);
                byte[] buffer = new byte[8 * 1024];
                    int bytesRead;
                    while ((bytesRead = inputStream.read(buffer)) != -1) {
                            outputStream.write(buffer, 0, bytesRead);
                        }
                        IOUtils.closeQuietly(inputStream);
                        IOUtils.closeQuietly(outputStream);
                        return true;
        } catch (FileNotFoundException ex) {
            Logger.getLogger(AttachmentService.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                inputStream.close();
            } catch (IOException ex) {
                Logger.getLogger(AttachmentService.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return true;
    }
}
