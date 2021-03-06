
package pg.eti.kiohub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import pg.eti.kiohub.entity.model.Tag;

@Controller
@RequestMapping(path = "/tag")
public class TagController extends MainController {

    @GetMapping(path = "/all")
    public ResponseEntity<Iterable<Tag>> getAllTags() {
        return new ResponseEntity<>(tagRepository.findAll(), HttpStatus.OK);
    }
}