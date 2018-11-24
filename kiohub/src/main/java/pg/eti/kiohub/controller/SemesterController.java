
package pg.eti.kiohub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import pg.eti.kiohub.entity.model.Semester;

@Controller
@RequestMapping(path = "/semester")
public class SemesterController extends MainController {

    @GetMapping(path = "/all")
    public ResponseEntity<Iterable<Semester>> getAllSemesters() {
        return new ResponseEntity<>(semesterRepository.findAll(), HttpStatus.OK);
    }
}
