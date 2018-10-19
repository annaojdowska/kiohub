/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import pg.eti.kiohub.entity.model.Note;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.security.SecurityService;

import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author Kasia
 */

@CrossOrigin
@Controller
@RequestMapping(path = "/note")
public class NoteController extends MainController {
    @Autowired
    SecurityService securityService;

 //   @PreAuthorize("@securityService.isCollaborator(#request, #id)")
    @GetMapping(path = "/project/{id}")
    public ResponseEntity<Iterable<Note>> getNotesByProjectId(@PathVariable("id") Long id,
                                                              HttpServletRequest request) {
        if(securityService.isCollaborator(request, id))
            return new ResponseEntity<>(noteRepository.getNotes(id), HttpStatus.OK);
        else return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
    }

    @PreAuthorize("@securityService.isCollaborator(#request, #projectId)")
    @PostMapping(path = "/add")
    public ResponseEntity<Note> addNote (
            @RequestParam("content") String content,
            @RequestParam("isPrivate") String isPrivate,
            @RequestParam("ownerId") String ownerId,
            @RequestParam("projectId") String projectId,
            HttpServletRequest request) {
        System.out.println("Jestem tutaj");
        Project project = projectRepository.findById(Long.parseLong(projectId)).get();
        Note noteToAdd = new Note(Long.parseLong(ownerId), project, content, new Date(), Integer.parseInt(isPrivate) == 1 ? true : false);
        noteRepository.saveAndFlush(noteToAdd);
       
        return new ResponseEntity<>(noteToAdd, HttpStatus.OK);
    }

    @PreAuthorize("@securityService.isCollaborator(#request, #projectId)")
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity delete(@PathVariable("id") Long id,
                                 @RequestParam("projectId") Long projectId,
                                 HttpServletRequest request) {
        Optional<Note> noteToDelete = this.noteRepository.findById(id);
        if (noteToDelete.isPresent()) {            
            this.noteRepository.delete(noteToDelete.get());
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PreAuthorize("@securityService.isCollaborator(#request, #projectId)")
    @PostMapping(path = "/update/{id}")
    public ResponseEntity update(
            @PathVariable("id") Long id,
            @RequestParam("content") String content,
            @RequestParam("isPrivate") String isPrivate,
            @RequestParam("projectId") Long projectId,
            HttpServletRequest request){
        try { 
            Note noteToUpdate = noteRepository.findById(id).get();
            noteToUpdate.setContent(content);
            noteToUpdate.setIsPrivate(Integer.parseInt(isPrivate) == 1 ? true : false);
            super.noteRepository.saveAndFlush(noteToUpdate);
         } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
