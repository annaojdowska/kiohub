
package pg.eti.kiohub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import pg.eti.kiohub.entity.model.ProjectType;

@Controller
@RequestMapping(path = "/type")
public class ProjectTypeController extends MainController {
        
    @GetMapping(path = "/all")
    public ResponseEntity<Iterable<ProjectType>> getAllProjectTypes() {
        return new ResponseEntity<>(projectTypeRepository.findAll(), HttpStatus.OK);
    }
}
