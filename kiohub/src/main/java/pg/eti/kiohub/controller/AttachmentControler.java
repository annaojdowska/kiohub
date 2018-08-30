/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;


import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import pg.eti.kiohub.entity.enums.Type;
import pg.eti.kiohub.entity.enums.Visibility;
import pg.eti.kiohub.entity.model.Attachment;
import pg.eti.kiohub.entity.model.AttachmentFile;
import pg.eti.kiohub.entity.model.Project;

/**
 *
 * @author Tomasz
 */
@Controller
@RequestMapping(path = "/attachment")
public class AttachmentControler extends MainController {   
   
    @CrossOrigin
    @PostMapping(path = "/upload", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity upload(
            @RequestParam("File") MultipartFile multipartFile, 
            @RequestParam("Type") String type,
            @RequestParam("ProjectId") String projectId,
            @RequestParam("Visibility") String visibility,
            @RequestParam("MainPhoto") String mainPhoto){
        
        Attachment attachment = new Attachment();
        
        try {
            Project project = super.projectRepository.getOne(Long.parseLong(projectId));
            String filename = new File(multipartFile.getOriginalFilename()).getName();
            attachment.setFileName(filename);
            attachment.setFileSize(multipartFile.getSize());
            attachment.setType(Type.valueOf(type));
            attachment.setProject(project);
            attachment.setVisibility(Visibility.valueOf(visibility));
            attachment.setMainPhoto(Boolean.parseBoolean(mainPhoto));
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
        
        try {
        attachment = attachmentRepository.saveAndFlush(attachment);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
        
        try {
            byte[] fileBytes = multipartFile.getBytes();
            Blob blob = new javax.sql.rowset.serial.SerialBlob(fileBytes);
            AttachmentFile af = new AttachmentFile();
            af.setFile(blob);
            af.setId(attachment.getId()); //get Id from attachment
            attachmentFileRepository.save(af);
        } catch (SQLException ex) {
            return new ResponseEntity<>("SQL", HttpStatus.BAD_REQUEST);
        } catch (IOException ex) {
            return new ResponseEntity<>("File error", HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
        
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @CrossOrigin
    @PostMapping(path = "/remove")
    public ResponseEntity removeAttachment(@RequestBody List<Long> attachmentsToRemove){
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
        if(attachmentFile.isPresent() && attachment.isPresent() && attachment.get().getType() == Type.PHOTO){
            try{
                String name = attachment.get().getFileName();
                String extension = FilenameUtils.getExtension(name);
                Blob blob = attachmentFile.get().getFile();
                
                InputStream in = blob.getBinaryStream();
                response.setContentType(getContentType(extension));
                IOUtils.copy(in, response.getOutputStream());                
            }
            catch(Exception ex){
                return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    private String getContentType(String extension){
        switch(extension){
            case "jpg" : return MediaType.IMAGE_JPEG_VALUE;
            case "jpeg" : return MediaType.IMAGE_JPEG_VALUE;
            case "png" : return MediaType.IMAGE_PNG_VALUE;
            case "gif" : return MediaType.IMAGE_GIF_VALUE;
            default : return MediaType.IMAGE_JPEG_VALUE;
            
        }
    }
}

