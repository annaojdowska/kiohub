/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;


import java.io.*;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import javax.servlet.http.HttpServletResponse;
import javax.sql.rowset.serial.SerialBlob;

import lombok.extern.jbosslog.JBossLog;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.glassfish.jersey.internal.util.ExceptionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
import pg.eti.kiohub.utils.FileUtils;

/**
 * @author Tomasz
 */
@JBossLog
@Controller
@RequestMapping(path = "/attachment")
public class AttachmentControler extends MainController {

    @CrossOrigin
    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity upload(
            @RequestParam("File") MultipartFile multipartFile,
            @RequestParam("Type") String type,
            @RequestParam("ProjectId") String projectId,
            @RequestParam("Visibility") String visibility,
            @RequestParam("MainPhoto") String mainPhoto) {

        Attachment attachment = new Attachment();

        try {
            Project project = super.projectRepository.getOne(Long.parseLong(projectId));
            String filename = new File(multipartFile.getOriginalFilename()).getName();
            attachment.setFileName(filename);
            attachment.setFileSize(multipartFile.getSize());
            attachment.setType(AttachmentType.THESIS);
            attachment.setProject(project);
            attachment.setVisibility(Visibility.valueOf(visibility));
            attachment.setMainPhoto(Boolean.parseBoolean(mainPhoto));
        } catch (Exception ex) {
            return handleException(ex);
        }

        try {
            attachment = attachmentRepository.saveAndFlush(attachment);
        } catch (Exception ex) {
            return handleException(ex);
        }

        try {
            byte[] fileBytes = IOUtils.toByteArray(multipartFile.getInputStream());
            Blob blob = new SerialBlob(fileBytes);
            AttachmentFile af = new AttachmentFile();
            af.setFile(blob);
            af.setId(attachment.getId()); //get Id from attachment
            attachmentFileRepository.saveAndFlush(af);
        } catch (SQLException ex) {
            return handleException(ex);
        } catch (IOException ex) {
            return handleException(ex);
        } catch (Exception ex) {
            return handleException(ex);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private ResponseEntity handleException(Exception ex) {
        StringWriter sw=new StringWriter();
        ex.printStackTrace(new PrintWriter(sw));
        sw.append("||||||" + ex.getMessage() + "||||||");
        sw.append(ex.getCause().toString());
        return new ResponseEntity<>( sw, HttpStatus.BAD_REQUEST);
    }
    
    @PostMapping(path = "/updateMetadata")
    public ResponseEntity updateMetadata (
            @RequestParam("id") String id,
            @RequestParam("visibility") String visibility,
            @RequestParam("mainPhoto") String mainPhoto) {
        System.out.println("Aktualizuję ");
        Attachment attachment = attachmentRepository.getOne(Long.parseLong(id));
        attachment.setVisibility(Visibility.valueOf(visibility));
        attachment.setMainPhoto(Boolean.parseBoolean(mainPhoto));
        attachmentRepository.save(attachment);
        return new ResponseEntity(HttpStatus.OK);
    }

    @CrossOrigin
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

    @CrossOrigin
    @PostMapping(path = "/remove")
    public ResponseEntity removeAttachment(@RequestBody List<Long> attachmentsToRemove) {
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

    @CrossOrigin
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
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);    }

    private void prepareAndSaveAttachment(Optional<Attachment> attachmentOpt, Optional<AttachmentFile> attachmentFileOpt, HttpServletResponse response) throws SQLException, IOException {
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

