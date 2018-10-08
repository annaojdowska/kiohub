/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.jasig.cas.client.authentication.AttributePrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.model.User;
import pg.eti.kiohub.entity.model.UserEmail;

///**
// *
// * @author Tomasz
// */
//

@Controller
public class LoginController extends MainController {
        
    LoginController(HttpServletRequest request) {
        this.request = request;
    }
    
    @CrossOrigin
    @RequestMapping(path = "/login/isLogged")
    public ResponseEntity<Boolean> isLogged() {
        Boolean isValid = request.isRequestedSessionIdValid();
        return new ResponseEntity<>(isValid, HttpStatus.OK);
    }
    
    @CrossOrigin
    @RequestMapping(path = "/login/isSupervisor")
    public ResponseEntity<Boolean> isSupervisor() throws Exception {
        User loggedUser = getLogged().getBody();
        if (loggedUser == null) {
            return new ResponseEntity<>(false, HttpStatus.OK);
        }
        return new ResponseEntity<>(loggedUser.getIsSupervisor(), HttpStatus.OK);
    }
    
    @CrossOrigin
    @RequestMapping(path = "/login/isStudent")
    public ResponseEntity<Boolean> isStudent() throws Exception {
        User loggedUser = getLogged().getBody();
        if (loggedUser == null) {
            return new ResponseEntity<>(false, HttpStatus.OK);
        }
        return new ResponseEntity<>(!loggedUser.getIsSupervisor(), HttpStatus.OK);
    }
    
    @CrossOrigin
    @RequestMapping(path = "/login/getLogged")
    public ResponseEntity<User> getLogged() throws Exception {
       User user = null;
        if (isLogged().getBody()) { 
            System.out.println("getLogged: request=" + request);
            System.out.println("getLogged: userPrincipal=" + (AttributePrincipal)request.getUserPrincipal());
            System.out.println("getLogged: attributes=" + ((AttributePrincipal)request.getUserPrincipal()).getAttributes());
            Map<String, Object> attributes = ((AttributePrincipal)request.getUserPrincipal()).getAttributes();
            List<String> emails = (LinkedList)attributes.get("mail");

            int i = 0;
            while (i < emails.size() && user == null) {
                user = userRepository.findUserByEmail(emails.get(i));
                i++;
            }
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
    
    @CrossOrigin
    @RequestMapping(path = "/login/logout")
    public String logout() {
        try {
            request.logout();
            request.getSession().invalidate();
        } catch (ServletException ex) {
            Logger.getLogger(LoginController.class.getName()).log(Level.SEVERE, null, ex);
        }
        return "redirect:https://logowanie.pg.gda.pl/logout?service=http://kiohub.eti.pg.gda.pl";
    }
    
    @CrossOrigin
    @RequestMapping(path = "/login")
    public String login() throws Exception {
        //dodać if request.isLogin()
        User user = userToLogIn();
        return "redirect:http://kiohub.eti.pg.gda.pl";
    }
    
    @CrossOrigin
    @RequestMapping(path = "/login/userToLogIn")
    public User userToLogIn()  throws Exception {
        if (isLogged().getBody()) {
            Map<String, Object> attributes = ((AttributePrincipal)request.getUserPrincipal()).getAttributes();
            String firstName = attributes.get("firstName").toString();
            String lastName = attributes.get("lastName").toString();
            //Long personNumber = (Long)attributes.get("personNumber");
            List<String> emails = (LinkedList)attributes.get("mail");
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
        return null;
    }
}
