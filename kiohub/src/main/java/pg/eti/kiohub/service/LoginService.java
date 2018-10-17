package pg.eti.kiohub.service;

import org.jasig.cas.client.authentication.AttributePrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pg.eti.kiohub.entity.model.User;
import pg.eti.kiohub.entity.model.UserEmail;
import pg.eti.kiohub.entity.repository.UserEmailRepository;
import pg.eti.kiohub.entity.repository.UserRepository;

import javax.servlet.http.HttpServletRequest;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Service
public class LoginService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserEmailRepository userEmailRepository;

    public boolean isUserLogged(HttpServletRequest request){
        return request.isRequestedSessionIdValid();
    }

    public User getLoggedUser(HttpServletRequest request){
        User user = null;
        if (isUserLogged(request)) {
            System.out.println("getLogged: request=" + request);
            System.out.println("getLogged: userPrincipal=" + (AttributePrincipal) request.getUserPrincipal());
            System.out.println("getLogged: attributes=" + ((AttributePrincipal) request.getUserPrincipal()).getAttributes());
            Map<String, Object> attributes = ((AttributePrincipal) request.getUserPrincipal()).getAttributes();
            List<String> emails = (LinkedList) attributes.get("mail");

            int i = 0;
            while (i < emails.size() && user == null) {
                user = userRepository.findUserByEmail(emails.get(i));
                i++;
            }
        }
        return user;
    }

    public User createAndSaveLoggingUser(List<String> emails, String firstName, String lastName){
        User user = null;
        int i = 0;
        while (i < emails.size() && user == null) {
            user = userRepository.findUserByEmail(emails.get(i));
            if (user != null) {
                user.setFirstName(firstName);
                user.setLastName(lastName);
            }
            i++;
        }
        if (user == null) {
            user = new User(firstName, lastName);
        }
        userRepository.save(user);
        UserEmail userEmail;
        for (String email : emails) {
            userEmail = userEmailRepository.findUserEmailByEmail(email);
            if (userEmail == null) {
                userEmail = new UserEmail(email, user);
            }
            if (!userEmail.isStudentMail()) {
                user.setIsSupervisor(true);
            }
            userEmailRepository.save(userEmail);
        }
        userRepository.save(user);
        return user;
    }

    public User userToLogIn(HttpServletRequest request)  throws Exception {
        if (isUserLogged(request)) {
            Map<String, Object> attributes = ((AttributePrincipal)request.getUserPrincipal()).getAttributes();
            String firstName = attributes.get("firstName").toString();
            String lastName = attributes.get("lastName").toString();

            List<String> emails = (LinkedList)attributes.get("mail");
            User user = createAndSaveLoggingUser(emails, firstName, lastName);
            return user;
        }
        return null;
    }
}
