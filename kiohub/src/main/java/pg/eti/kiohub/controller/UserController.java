
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

@Controller
@RequestMapping(path = "/user")
public class UserController extends MainController {

    @GetMapping(path = "/{id}")
  //  @PreAuthorize("@securityService.isCollaborator(#request, #projectId)")
    public ResponseEntity<User> getUserById(
            @PathVariable("id") Long id,
            @RequestParam("projectId") Long projectId,
            HttpServletRequest request) {
        return new ResponseEntity<>(userRepository.findById(id).get(), HttpStatus.OK);
    }  
}
