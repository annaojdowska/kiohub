/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import pg.eti.kiohub.entity.model.User;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import java.util.logging.Level;
import java.util.logging.Logger;

@CrossOrigin
@Controller
public class LoginController extends MainController {


    @RequestMapping(path = "/login/isLogged")
    public ResponseEntity<Boolean> isLogged(HttpServletRequest request) {
        Boolean isValid = loginService.isUserLogged(request);
        return new ResponseEntity<>(isValid, HttpStatus.OK);
    }

    @RequestMapping(path = "/login/isSupervisor")
    @PreAuthorize("@securityService.isLogged(#request)")
    public ResponseEntity<Boolean> isSupervisor(HttpServletRequest request) throws Exception {
        User loggedUser = loginService.getLoggedUser(request);
        if (loggedUser == null) {
            return new ResponseEntity<>(false, HttpStatus.OK);
        }
        return new ResponseEntity<>(loggedUser.getIsSupervisor(), HttpStatus.OK);
    }

    @RequestMapping(path = "/login/isStudent")
    @PreAuthorize("@securityService.isLogged(#request)")
    public ResponseEntity<Boolean> isStudent(HttpServletRequest request) throws Exception {
        User loggedUser = loginService.getLoggedUser(request);
        if (loggedUser == null) {
            return new ResponseEntity<>(false, HttpStatus.OK);
        }
        return new ResponseEntity<>(!loggedUser.getIsSupervisor(), HttpStatus.OK);
    }

    @RequestMapping(path = "/login/getLogged")
    @PreAuthorize("@securityService.isLogged(#request)")
    public ResponseEntity<User> getLogged(HttpServletRequest request) throws Exception {
       User user = loginService.getLoggedUser(request);
//       return new ResponseEntity<>(userRepository.getOne(437l), HttpStatus.OK); - testy
       return new ResponseEntity<>(user, HttpStatus.OK); // THIS
    }

    @RequestMapping(path = "/login/logout")
    @PreAuthorize("@securityService.isLogged(#request)")
    public String logout(HttpServletRequest request) {
        try {
            request.logout();
            request.getSession().invalidate();
        } catch (ServletException ex) {
            Logger.getLogger(LoginController.class.getName()).log(Level.SEVERE, null, ex);
        }
        return "redirect:https://logowanie.pg.gda.pl/logout?service=http://kiohub.eti.pg.gda.pl";
    }

    @RequestMapping(path = "/login")
    public String login(HttpServletRequest request) throws Exception {
        //dodać if request.isLogin()
        User user = loginService.userToLogIn(request);

        // ustawienie, że użytkownik jest zalogowany
//        Authentication auth = new UsernamePasswordAuthenticationToken(user, null,
//                AuthorityUtils.createAuthorityList("ROLE_USER"));
//        SecurityContextHolder.getContext().setAuthentication(auth);
//        return "OK";
        return "redirect:http://kiohub.eti.pg.gda.pl";
    }
}
