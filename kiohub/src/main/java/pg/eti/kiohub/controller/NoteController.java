/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import java.util.Date;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

/**
 *
 * @author Kasia
 */

@Controller
@RequestMapping(path = "/note")
public class NoteController extends MainController {
    
    @GetMapping(path = "/project/{id}")
    public ResponseEntity<Iterable<Note>> getNotesByProjectId(@PathVariable("id") Long id) {
        return new ResponseEntity<>(noteRepository.getNotes(id), HttpStatus.OK);
    }   
    
    @PostMapping(path = "/add")
    public ResponseEntity<Note> addNote (
            @RequestParam("content") String content,
            @RequestParam("isPrivate") String isPrivate,
            @RequestParam("ownerId") String ownerId,
            @RequestParam("projectId") String projectId) {
        System.out.println("Jestem tutaj");
        Project project = projectRepository.findById(Long.parseLong(projectId)).get();
        Note noteToAdd = new Note(Long.parseLong(ownerId), project, content, new Date(), Boolean.parseBoolean(isPrivate));
        noteRepository.saveAndFlush(noteToAdd);
       
        return new ResponseEntity<>(noteToAdd, HttpStatus.OK);
    }
    
    @CrossOrigin
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity delete(@PathVariable("id") Long id) {
        Optional<Note> noteToDelete = this.noteRepository.findById(id);
        if (noteToDelete.isPresent()) {            
            this.noteRepository.delete(noteToDelete.get());
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
    
    @CrossOrigin
    @PostMapping(path = "/update/{id}")
    public ResponseEntity update(
            @PathVariable("id") Long id,
            @RequestParam("content") String content){
        try { 
            Note noteToUpdate = noteRepository.findById(id).get();
            noteToUpdate.setContent(content);
            super.noteRepository.saveAndFlush(noteToUpdate);
         } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
