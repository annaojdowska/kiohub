package pg.eti.kiohub.service;

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
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Optional;

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
}
