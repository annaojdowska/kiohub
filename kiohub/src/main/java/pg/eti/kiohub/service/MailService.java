/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.repository.ProjectRepository;

/**
 *
 * @author Tomasz
 */
@Service
public class MailService {
    
@Value("${mail.invitation.username}")
    private String username;

    @Value("${mail.invitation.password}")
    private String password; 
    
    @Value("${mail.invitation.subject:Zaproszenie do projektu}")
    private String subject; 
    
    @Value("${mail.invitation.text:Bierzesz udział w projekcie - {projectName} {projectLink}}")
    private String text; 
    
    @Value("${mail.invitation.address:kiohub.pg.edu.pl/edit-project/{projectId}}")
    private String address; 
    
   @Autowired
    private ProjectRepository projectRepository;
  
    public void sendInvitation(Long projectId, List<String> emails) throws AddressException, MessagingException {
        
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        Project project = projectRepository.getOne(projectId);
        String link = address.replaceAll("\\{projectId\\}", project.getId().toString());
        String messageText = text.replaceAll("\\{projectLink\\}", link);
        messageText = messageText.replaceAll("\\{projectName\\}", project.getTitle());
        
        for (String email: emails) {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email)); //recipients
            message.setSubject(subject);
            
            message.setText(messageText);

            Transport.send(message);     
        }            
    }
}
