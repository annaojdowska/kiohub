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
import javax.servlet.http.HttpSession;
import org.jasig.cas.client.authentication.AttributePrincipal;
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
@RequestMapping("/login")
public class LoginController extends MainController {
    
    
    public LoginController(HttpServletRequest requestL) {
        request = requestL;
    }
     
    @CrossOrigin
    @GetMapping(path = "/all")
    public ResponseEntity<List<Project>>
    getAllProjects() {
        return new ResponseEntity<>( projectRepository.findAll(), HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping(path = "/isLogged")
    public ResponseEntity<Boolean> isLogged() {
        System.out.println("isLogged2 request=" + request);
        Boolean isValid = request.isRequestedSessionIdValid();
        System.out.println("isLogged2 isValid=" + isValid);
        return new ResponseEntity<>(isValid, HttpStatus.OK);
    }
    
    @CrossOrigin
    @GetMapping(path = "/isSupervisor")
    public ResponseEntity<Boolean> isSupervisor() throws Exception {
        Boolean isValid = request.isRequestedSessionIdValid();
        throw new Exception("eislogged2 " + isValid);
        //return new ResponseEntity<>(isValid, HttpStatus.OK);
    }
    
    @CrossOrigin
    @GetMapping(path = "/isStudent")
    public ResponseEntity<Boolean> isStudent() throws Exception {
        Boolean isValid = request.isRequestedSessionIdValid();
        throw new Exception("eislogged2 " + isValid);
        //return new ResponseEntity<>(isValid, HttpStatus.OK);
    }
    
    @CrossOrigin
    @GetMapping(path = "/getLogged")
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
            }
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        return new ResponseEntity<>(user, HttpStatus.NOT_FOUND);
    }
    
    @CrossOrigin
    @GetMapping(path = "/logout")
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
    @GetMapping(path = "/")
    public String login() {
        System.out.println("Wszedlem2 do login()");
        User user = userToLogIn();
        if (user != null) {
            return "redirect:http://kiohub.eti.pg.gda.pl";
        }
        return "redirect:http://kiohub.eti.pg.gda.pl/login";
    }
    
    public User userToLogIn() {
        System.out.println("Wszedlem2 do userToLogin");
        System.out.println("isLoggedBody2 " + isLogged().getBody());
        if (isLogged().getBody()) {
            Map<String, Object> attributes = ((AttributePrincipal)request.getUserPrincipal()).getAttributes();
            String firstName = attributes.get("firstName").toString();
            System.out.println("userToLogin: po odczytaniu firstName");
            String lastName = attributes.get("lastName").toString();
            System.out.println("userToLogin: po odczytaniu lastName");
            //Long personNumber = (Long)attributes.get("personNumber");
            List<String> emails = (LinkedList)attributes.get("mail");
            System.out.println("userToLogin: po odczytaniu mail");
            User user = null;
            int i = 0;
            while (i < emails.size() && user == null) {
                System.out.println("userToLogin - while: przed findUserByEmail");
                user = userRepository.findUserByEmail(emails.get(i));
                System.out.println("userToLogin - while: po findUserByEmail");
                if (user != null) {
                    user.setFirstName(firstName);
                    user.setLastName(lastName);
                }
            }
            System.out.println("userToLogin: po petli while");
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
    
    

        //ale tego maila to gdzieś zapisz do bazy #FIXME
        //i tego usera tyż
        
        
//        throw new NullPointerException("Koniec " + firstName + " " + lastName + " " + personNumber + " " + email);
    
    


}
