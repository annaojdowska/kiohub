
package pg.eti.kiohub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import pg.eti.kiohub.entity.model.Note;
import pg.eti.kiohub.entity.model.Project;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.Optional;

@Controller
@RequestMapping(path = "/note")
public class NoteController extends MainController {

    @GetMapping(path = "/project/{id}")
    @PreAuthorize("@securityService.isCollaborator(#request, #projectId)")
    @PostAuthorize("@visibilityService.checkProjectNotesVisibility(returnObject, #projectId, #request)")
    public ResponseEntity<Iterable<Note>> getNotesByProjectId(@PathVariable("id") Long projectId,
                                                              HttpServletRequest request) {
        return new ResponseEntity<>(noteRepository.getNotesByProjectId(projectId), HttpStatus.OK);
    }

    @PostMapping(path = "/add")
    @PreAuthorize("@securityService.isCollaborator(#request, #projectId)")
    public ResponseEntity<Note> addNote(
            @RequestParam("content") String content,
            @RequestParam("isPrivate") String isPrivate,
            @RequestParam("ownerId") String ownerId,
            @RequestParam("projectId") String projectId,
            HttpServletRequest request) {
        Project project = projectRepository.findById(Long.parseLong(projectId)).get();
        Note noteToAdd = new Note(Long.parseLong(ownerId), project, content, new Date(), Integer.parseInt(isPrivate) == 1);
        noteToAdd = noteRepository.saveAndFlush(noteToAdd);

        return new ResponseEntity<>(noteToAdd, HttpStatus.OK);
    }

    @DeleteMapping(value = "/delete/{id}")
    @PreAuthorize("@securityService.hasPermissionToNote(#request, #id)")
    public ResponseEntity delete(@PathVariable("id") Long id,
                                 HttpServletRequest request) {
        Optional<Note> noteToDelete = this.noteRepository.findById(id);
        if (noteToDelete.isPresent()) {
            this.noteRepository.delete(noteToDelete.get());
            return new ResponseEntity<>(HttpStatus.OK);
        } else
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping(path = "/update/{id}")
    @PreAuthorize("@securityService.hasPermissionToNote(#request, #id)")
    public ResponseEntity update(
            @PathVariable("id") Long id,
            @RequestParam("content") String content,
            @RequestParam("isPrivate") String isPrivate,
            HttpServletRequest request) {
        try {
            Note noteToUpdate = noteRepository.findById(id).get();
            noteToUpdate.setContent(content);
            noteToUpdate.setIsPrivate(Integer.parseInt(isPrivate) == 1);
            super.noteRepository.saveAndFlush(noteToUpdate);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
