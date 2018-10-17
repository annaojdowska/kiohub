/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;


import java.io.*;
import java.sql.*;
import java.util.List;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import javax.sql.rowset.serial.SerialBlob;

import lombok.extern.jbosslog.JBossLog;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.glassfish.jersey.internal.util.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
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
import pg.eti.kiohub.entity.model.AttachmentFile;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.utils.ExceptionHandlingUtils;
import pg.eti.kiohub.utils.FileUtils;

/**
 * @author Tomasz
 */
@JBossLog
@CrossOrigin
@Controller
@RequestMapping(path = "/attachment")
public class AttachmentControler extends MainController {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    private ApplicationContext appContext;


    @PreAuthorize("@securityService.isCollaborator(#request, #projectId)")
    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity upload(
            @RequestParam("File") MultipartFile multipartFile,
            @RequestParam("Type") String type,
            @RequestParam("ProjectId") String projectId,
            @RequestParam("Visibility") String visibility,
            @RequestParam("MainPhoto") String mainPhoto,
            HttpServletRequest request) {

        log.info("_____________________________ NEW REQUEST ________________________________");
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
        } catch (Exception ex) {
            return ExceptionHandlingUtils.handleException(ex);
        }

        try {
            attachment = attachmentRepository.saveAndFlush(attachment);
        } catch (Exception ex) {
            return ExceptionHandlingUtils.handleException(ex);
        }

        try {

            log.info("SAVED ATTACHMENT WITH ID " + attachment.getId() + ", FILE SIZE = " + attachment.getFileSize());
            DataSource ds = (DataSource) appContext.getBean("dataSource");
            String insertQuery = "INSERT INTO `attachments_files` (attachments_id, file) VALUES (?, ?)";

            try (
                    Connection connection = ds.getConnection();
                    PreparedStatement preparedStatement = connection.prepareStatement(insertQuery)
            ) {

                preparedStatement.setLong(1, attachment.getId());
                preparedStatement.setBinaryStream(2, multipartFile.getInputStream());
                int affectedRows = preparedStatement.executeUpdate();
                if (affectedRows == 0) {
                    log.info("ERROR: affectedRows = 0");
                    return new ResponseEntity<>("ERROR: PREPARED STATEMENT AFFECTED 0 ROWS", HttpStatus.EXPECTATION_FAILED);
                }
                log.info("EVERYTHING OK! SAVED " + affectedRows + " ROWS!");

            }
//
//            Connection connection = DriverManager.g;
//            Blob blob2 = new SerialBlob('d');
//
//
//            byte[] fileBytes = IOUtils.toByteArray(multipartFile.getInputStream(), attachment.getFileSize());
//
//            Blob blob = new SerialBlob(fileBytes);
//            AttachmentFile af = new AttachmentFile();
//            af.setFile(blob);
//            af.setId(attachment.getId()); //get Id from attachment
//            attachmentFileRepository.saveAndFlush(af);
        } catch (SQLException ex) {
            return ExceptionHandlingUtils.handleException(ex);
        }
        catch (OutOfMemoryError ex) {
            return ExceptionHandlingUtils.handleException(ex);
        }
        catch (Exception ex) {
            return ExceptionHandlingUtils.handleException(ex);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }


    @PreAuthorize("@securityService.isCollaborator(#request, #projectId)")
    @PostMapping(path = "/updateMetadata")
    public ResponseEntity updateMetadata(
            @RequestParam("projectId") String projectId,
            @RequestParam("attachmentId") String attachmentId,
            @RequestParam("visibility") String visibility,
            @RequestParam("mainPhoto") String mainPhoto,
            HttpServletRequest request) {
        System.out.println("Aktualizuję ");
        Attachment attachment = attachmentRepository.getOne(Long.parseLong(attachmentId));
        attachment.setVisibility(Visibility.valueOf(visibility));
        attachment.setMainPhoto(Boolean.parseBoolean(mainPhoto));
        attachmentRepository.save(attachment);
        return new ResponseEntity(HttpStatus.OK);
    }

    @GetMapping(path = "/download")
    public ResponseEntity downloadAttachment(@RequestParam("id") long id, HttpServletResponse response) {
        Optional<AttachmentFile> attachmentFile = attachmentFileRepository.findById(id);
        Optional<Attachment> attachment = attachmentRepository.findById(id);
        if (attachmentExists(attachmentFile, attachment)) {
            try {
                prepareAndSaveAttachment(attachment, attachmentFile, response);
                return new ResponseEntity<>(HttpStatus.OK);
            } catch (Exception ex) {
                return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PreAuthorize("@securityService.isCollaborator(#request, #projectId)")
    @PostMapping(path = "/remove")
    public ResponseEntity removeAttachment(@RequestBody List<Long> attachmentsToRemove,
                                           @RequestParam("projectId") long projectId,
                                           HttpServletRequest request) {
        try {
            for (Long a : attachmentsToRemove) {
                attachmentFileRepository.deleteById(a);
                attachmentRepository.deleteById(a);
            }
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/downloadPhoto")
    public ResponseEntity downloadPhoto(@RequestParam("id") long id, HttpServletResponse response) {
        Optional<AttachmentFile> attachmentFile = attachmentFileRepository.findById(id);
        Optional<Attachment> attachment = attachmentRepository.findById(id);
        if (attachmentExists(attachmentFile, attachment) && attachment.get().getType() == AttachmentType.PHOTO) {
            try {
                prepareAndSaveAttachment(attachment, attachmentFile, response);
            } catch (Exception ex) {
                return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    private void prepareAndSaveAttachment(Optional<Attachment> attachmentOpt,
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

    private boolean attachmentExists(Optional<AttachmentFile> attachmentFile, Optional<Attachment> attachment) {
        return attachmentFile.isPresent() && attachment.isPresent();
    }
}

