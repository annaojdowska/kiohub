/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *
 * @author Tomasz
 */
@CrossOrigin
@Controller
public class ErrorController extends MainController {
    @RequestMapping(path = "/error")
    public String error() throws Exception {
        return "redirect:http://kiohub.eti.pg.gda.pl/my-projects";
    }
}
