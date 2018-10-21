/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import pg.eti.kiohub.entity.model.UserPinnedProject;

/**
 *
 * @author Tomasz
 */
@Controller
@RequestMapping(path = "/userpinnedproject")
public class UserPinnedProjectController extends MainController {
    
    @CrossOrigin
    @GetMapping(path = "/user/{userId}")
    public ResponseEntity<Iterable<Long>> getUserPinnedProjectsIdsByUserId(@PathVariable("userId") Long userId) {
        List<UserPinnedProject> pinnedProjects = userPinnedProjectRepository.getPinnedProjects(userId);
        List<Long> pinnedIds = new ArrayList();
        for(UserPinnedProject upp : pinnedProjects) {
            pinnedIds.add(upp.getProjectId());
        }
         return new ResponseEntity<>(pinnedIds, HttpStatus.OK);
    }   
    
    @CrossOrigin
    @PostMapping(path = "/pin")
    public ResponseEntity<UserPinnedProject> pin (
            @RequestParam("userId") String userId,
            @RequestParam("projectId") String projectId) {
        System.out.println("Przypne " + userId + " " + projectId);
        UserPinnedProject userPinnedProject = new UserPinnedProject(Long.parseLong(userId), Long.parseLong(projectId));

        userPinnedProjectRepository.saveAndFlush(userPinnedProject);
        System.out.println("Udalo sie przypiac " + userPinnedProject);
        return new ResponseEntity<>(userPinnedProject, HttpStatus.OK);
    }
    @CrossOrigin
    @PostMapping(path = "/unpin")
    public ResponseEntity<UserPinnedProject> unPin (
            @RequestParam("userId") String userId,
            @RequestParam("projectId") String projectId) {
       
        Long _userId = Long.parseLong(userId);
        Long _projectId = Long.parseLong(projectId);
        System.out.println("OdPrzypne " + _userId + " " + _projectId);
            UserPinnedProject pinToDelete = this.userPinnedProjectRepository.getPinnedProject(_projectId, _userId);
            System.out.println("Udalo sie odprzypiac " + pinToDelete);
            if (pinToDelete != null) {            
                this.userPinnedProjectRepository.deletePinnedProject(_projectId, _userId);
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
    
    @CrossOrigin
    @PostMapping(path = "/ispinned")
    public ResponseEntity<Boolean> isPinned (
            @RequestParam("userId") String userId,
            @RequestParam("projectId") String projectId) {
       
        Long _userId = Long.parseLong(userId);
        Long _projectId = Long.parseLong(projectId);
        System.out.println("Czyprzypie " + _userId + " " + _projectId);
            UserPinnedProject pinned = this.userPinnedProjectRepository.getPinnedProject(_projectId, _userId);
            System.out.println("Udalo sie odprzypiac " + pinned);
            if (pinned != null) {            
                return new ResponseEntity<>(true, HttpStatus.OK);
            }
            return new ResponseEntity<>(false, HttpStatus.OK);
    }
}
