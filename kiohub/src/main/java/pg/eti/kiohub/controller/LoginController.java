/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.model.User;

///**
// *
// * @author Tomasz
// */
//

@Controller
@RequestMapping(path = "/logininfo")
public class LoginController extends MainController {
    
    @CrossOrigin
    @GetMapping(path = "/all")
    public ResponseEntity<List<Project>>
    getAllProjects() {
        return new ResponseEntity<>( projectRepository.findAll(), HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping(path = "/islogged")
    public ResponseEntity<Boolean> isLogged() throws Exception {
        Boolean isValid = request.isRequestedSessionIdValid();
        throw new Exception("eislogged " + isValid);
        //return new ResponseEntity<>(isValid, HttpStatus.OK);
    }
    
    @CrossOrigin
    @GetMapping(path = "/logout")
    public ResponseEntity logout() throws Exception {
        try {
            request.logout();
            request.getSession().invalidate();
        } catch (ServletException ex) {
            Logger.getLogger(LoginController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        throw new Exception("elogout");
        //return new ResponseEntity(HttpStatus.OK);
    }


}
