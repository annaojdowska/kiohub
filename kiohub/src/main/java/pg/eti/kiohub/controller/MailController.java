/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.model.User;

@CrossOrigin
@Controller
@RequestMapping(path = "/email")
public class MailController extends MainController {

    @PostMapping(path = "/sendinvitation")
    @PreAuthorize("@securityService.isLoggedAndSupervisor(#request)")
    public ResponseEntity sendInvitation (
            @RequestParam("titlePl") String titlePl,
            @RequestParam("collaborators") String emails,
            HttpServletRequest request) {

        List<String> mails = Arrays.asList(emails.split(", "));
        try {
            mailService.sendInvitation(titlePl, mails);
        }
        catch (AddressException e) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        catch (MessagingException e) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity(HttpStatus.OK);
    }
}
