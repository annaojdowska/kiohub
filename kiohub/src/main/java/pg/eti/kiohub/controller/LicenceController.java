package pg.eti.kiohub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import pg.eti.kiohub.entity.model.Licence;

@Controller
@RequestMapping(path = "/licence")
public class LicenceController extends MainController {

    @GetMapping(path = "/all")
    public ResponseEntity<Iterable<Licence>> getAllLicences() {
        return new ResponseEntity<>(licenceRepository.findAll(), HttpStatus.OK);
    }
}
