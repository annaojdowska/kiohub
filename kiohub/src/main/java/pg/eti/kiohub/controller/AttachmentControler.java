package pg.eti.kiohub.controller;


import java.io.*;
import java.net.URLEncoder;
import java.sql.*;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import javax.sql.rowset.serial.SerialBlob;
import javax.ws.rs.QueryParam;

import lombok.extern.jbosslog.JBossLog;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.glassfish.jersey.internal.util.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.provider.HibernateUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import pg.eti.kiohub.entity.enums.AttachmentType;
import pg.eti.kiohub.entity.enums.Visibility;
import pg.eti.kiohub.entity.model.Attachment;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.utils.ExceptionHandlingUtils;
import pg.eti.kiohub.utils.FileUtils;


@JBossLog
@CrossOrigin
@Controller
@RequestMapping(path = "/attachment")
public class AttachmentControler extends MainController {

    private static final int MAX_ATTACHMENT_SIZE_IN_BYTES = 1000000000;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    private ApplicationContext appContext;
    
    @Value("${attachments.directory:/home/attachments/}")
    private String attachmentsDirectory;



    @PostMapping(path = "/updateMetadata")
    @PreAuthorize("@securityService.isCollaborator(#request, #projectId)")
    public ResponseEntity updateMetadata(
            @RequestParam("projectId") String projectId,
            @RequestParam("attachmentId") String attachmentId,
            @RequestParam("visibility") String visibility,
            @RequestParam("mainPhoto") String mainPhoto,
            HttpServletRequest request) {
        log.info("Aktualizuje");
        Attachment attachment = attachmentRepository.getOne(Long.parseLong(attachmentId));
        attachment.setVisibility(Visibility.valueOf(visibility));
        attachment.setMainPhoto(Boolean.parseBoolean(mainPhoto));
        attachmentRepository.save(attachment);
        return new ResponseEntity(HttpStatus.OK);
    }
    
    @PostMapping(path = "/remove")
    @PreAuthorize("@securityService.isCollaborator(#request, #projectId)")
    public ResponseEntity removeAttachment(@RequestBody List<Long> attachmentsToRemove,
                                           @RequestParam("projectId") long projectId,
                                           HttpServletRequest request) {
        try {
            for (Long a : attachmentsToRemove) {
                Attachment attachment = attachmentRepository.getOne(a);
                attachmentService.remove(attachment);
            }
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("@securityService.isCollaborator(#request, #projectId)")
    public ResponseEntity uploadFile(
            @RequestParam("File") MultipartFile multipartFile,
            @RequestParam("Type") String type,
            @RequestParam("ProjectId") String projectId,
            @RequestParam("Visibility") String visibility,
            @RequestParam("MainPhoto") String mainPhoto,
            HttpServletRequest request) {

        if (multipartFile.getSize() < MAX_ATTACHMENT_SIZE_IN_BYTES) {
            Attachment attachment = new Attachment();

            try {
                Project project = super.projectRepository.getOne(Long.parseLong(projectId));
                String filename = new File(multipartFile.getOriginalFilename()).getName();
                attachment.setFileName(filename);
                attachment.setFileSize(multipartFile.getSize());
                attachment.setType(AttachmentType.valueOf(type));
                attachment.setProject(project);
                attachment.setVisibility(Visibility.valueOf(visibility));
                attachment.setMainPhoto(Boolean.parseBoolean(mainPhoto));
                attachment.setFileLocation(attachmentsDirectory);
            } catch (NumberFormatException ex) {
                return ExceptionHandlingUtils.handleException(ex);
            }

            try {
                attachment = attachmentRepository.saveAndFlush(attachment);
            } catch (Exception ex) {
                return ExceptionHandlingUtils.handleException(ex);
            }
            try {
                attachmentService.saveAttachmentToDisk(multipartFile.getInputStream(), attachment.getFullPath());

                return new ResponseEntity(HttpStatus.OK);
            } catch (IOException ex) {
                attachmentService.rollbackSaveAttachment(attachment);
                Logger.getLogger(AttachmentControler.class.getName()).log(Level.SEVERE, null, ex);
                return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
            }

        } else {
            String error = "Plik nie może być większy niż " + MAX_ATTACHMENT_SIZE_IN_BYTES + " bajtów.";
            log.info("Błąd. " + error);
            return new ResponseEntity(error, HttpStatus.BAD_REQUEST);
        }
        
        
        }
    
    @GetMapping(path = "/download")
    @PreAuthorize("@visibilityService.checkAttachmentVisibility(#request, #id)")
    public ResponseEntity downloadFile(@RequestParam("id") long id,
                                             HttpServletResponse response,
                                             HttpServletRequest request) {
        try {
            Attachment attachment = attachmentRepository.findById(id).get();
            InputStream inputStream = attachmentService.getAttachmentFromDisk(attachment);

            try {
                response.setContentType(FileUtils.getMimeType(FilenameUtils.getExtension(attachment.getFileName())));
                response.setHeader("Content-Disposition", "attachment; filename=" + URLEncoder.encode(attachment.getFileName(),"UTF-8").replace("+", "%20"));
                IOUtils.copy(inputStream, response.getOutputStream());
            } catch (IOException ex) {
                Logger.getLogger(AttachmentControler.class.getName()).log(Level.SEVERE, null, ex);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } finally {
                try {
                    inputStream.close();
                } catch (IOException ex) {
                    Logger.getLogger(AttachmentControler.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        } catch (NoSuchElementException | FileNotFoundException ex) {
            Logger.getLogger(AttachmentControler.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity(HttpStatus.OK);
    }
    

}

