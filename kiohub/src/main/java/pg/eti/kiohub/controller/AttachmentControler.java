/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;


import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import pg.eti.kiohub.entity.model.AttachmentFile;
import pg.eti.kiohub.entity.repository.AttachmentFileRepository;

/**
 *
 * @author Tomasz
 */
@Controller
@RequestMapping(path = "/file")
public class AttachmentControler {   
   
    @Autowired
    private AttachmentFileRepository attachmentFileRepository;   
    
    @RequestMapping(method = RequestMethod.POST, path = "/upload") 
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file) {
        try {
            byte[] fileBytes = file.getBytes();
            try {
                Blob blob = new javax.sql.rowset.serial.SerialBlob(fileBytes);
                AttachmentFile af = new AttachmentFile();
                af.setFile(blob);
                af.setId(2L); //get Id from attachment
                attachmentFileRepository.save(af);
            } catch (SQLException ex) {
                return new ResponseEntity<>("SQL", HttpStatus.BAD_REQUEST);
            }
        } catch (IOException ex) {
            return new ResponseEntity<>("File error", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    
}
