package pg.eti.kiohub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;

@CrossOrigin
@Controller
@RequestMapping(path = "/email")
public class MailController extends MainController {

    @PostMapping(path = "/sendinvitation")
   // @PreAuthorize("@securityService.isLoggedAndSupervisor(#request)")
    public ResponseEntity sendInvitation(
            @RequestParam("projectId") String projectId,
            @RequestParam("collaborators") String emails,
            HttpServletRequest request) {

        Long _projectId = Long.parseLong(projectId);
        List<String> mails = Arrays.asList(emails.split(", "));
        try {
            mailService.sendInvitation(_projectId, mails);
        } catch (AddressException e) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        } catch (MessagingException e) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity(HttpStatus.OK);
    }
}
