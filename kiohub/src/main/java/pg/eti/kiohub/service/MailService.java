
package pg.eti.kiohub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.repository.ProjectRepository;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.List;
import java.util.Properties;

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

    @Value("${mail.invitation.address:http://kiohub.eti.pg.gda.pl/edit-project/{projectId}}")
    private String address;
    
    @Value("${mail.invitation.host:smtp.gmail.com}")
    private String host;
    
    @Value("${mail.invitation.port:587}")
    private String port;

    @Autowired
    private ProjectRepository projectRepository;

    public void sendInvitation(Long projectId, List<String> emails) throws AddressException, MessagingException {

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", port);

        Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        Project project = projectRepository.getOne(projectId);
        String link = address.replaceAll("\\{projectId\\}", project.getId().toString());
        String messageText = text.replaceAll("\\{projectLink\\}", link);
        messageText = messageText.replaceAll("\\{projectName\\}", project.getTitle());
        subject = subject.replaceAll("\\{projectName\\}", project.getTitle());

        for (String email : emails) {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email)); //recipients
            message.setSubject(subject);

            message.setContent(messageText, "text/html");

            Transport.send(message);
        }
    }
}
