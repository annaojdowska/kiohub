/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import pg.eti.kiohub.repository.ProjectRepository;

/**
 *
 * @author Aleksander Kania <kania>
 */
@Controller
public class MainController {

        @Autowired
        protected ProjectRepository projectRepository;

        @RequestMapping(path = "/")
        public String homePage() {
                return "homePage.html";
        }
}
