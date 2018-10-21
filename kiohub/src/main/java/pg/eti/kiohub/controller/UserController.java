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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import pg.eti.kiohub.entity.model.User;

import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author Kasia
 */

@Controller
@RequestMapping(path = "/user")
public class UserController extends MainController {

    @PreAuthorize("@securityService.isCollaborator(#request, #projectId)")
    @GetMapping(path = "/{id}")
    public ResponseEntity<User> getUserById(
            @PathVariable("id") Long id,
            @RequestParam("projectId") Long projectId,
            HttpServletRequest request) {
        return new ResponseEntity<>(userRepository.findById(id).get(), HttpStatus.OK);
    }  
}
