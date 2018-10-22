package pg.eti.kiohub.security;

import lombok.extern.jbosslog.JBossLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import pg.eti.kiohub.entity.model.*;
import pg.eti.kiohub.entity.repository.AttachmentRepository;
import pg.eti.kiohub.entity.repository.NoteRepository;
import pg.eti.kiohub.entity.repository.UserRepository;
import pg.eti.kiohub.service.CollaboratorsService;
import pg.eti.kiohub.service.LoginService;

import javax.servlet.http.HttpServletRequest;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static pg.eti.kiohub.entity.enums.Visibility.*;

@JBossLog
@Component("securityService")
public class SecurityService {
    @Autowired
    LoginService loginService;
    @Autowired
    CollaboratorsService collaboratorsService;
    @Autowired
    AttachmentRepository attachmentRepository;
    @Autowired
    NoteRepository noteRepository;
    @Autowired
    UserRepository userRepository;


    public boolean isLogged(HttpServletRequest request) {

        return loginService.isUserLogged(request);
    }

    public boolean isLoggedAndSupervisor(HttpServletRequest request){
        User loggedUser = loginService.getLoggedUser(request);
        if(loggedUser == null)
            return false;

        return loggedUser.getIsSupervisor();
    }

    public boolean isCollaborator(HttpServletRequest request, long projectId){
        User loggedUser = loginService.getLoggedUser(request);
        if(loggedUser == null)
            return false;

        return collaboratorsService.isProjectCollaborator(loggedUser.getId(), projectId);
    }

    public boolean isCollaboratorAndSupervisor(HttpServletRequest request, long projectId){
        User loggedUser = loginService.getLoggedUser(request);
        if(loggedUser == null)
            return false;

        return collaboratorsService.isSupervisorOfProject(loggedUser.getId(), projectId);
    }

    public boolean checkAttachmentVisibility(HttpServletRequest request, Long attachmentId){
        Optional<Attachment> attachmentOpt = attachmentRepository.findById(attachmentId);
        if(!attachmentOpt.isPresent()) return false;

        Attachment attachment = attachmentOpt.get();
        if(attachment.getVisibility() == EVERYONE) return true;

        User loggedUser = loginService.getLoggedUser(request);
        if(loggedUser == null) return false;
        if(attachment.getVisibility() == LOGGED_USERS) return true;
        if(attachment.getVisibility() == COLLABORATORS)
           return collaboratorsService.isProjectCollaborator(loggedUser.getId(), attachment.getProject().getId());
        return false;
    }

    public boolean isMyself(HttpServletRequest request, Long userId){
        User loggedUser = loginService.getLoggedUser(request);
        if(loggedUser == null) return false;

        return loggedUser.getId() == userId;
    }

    public boolean hasPermissionToNote(HttpServletRequest request, Long noteId){
        User loggedUser = loginService.getLoggedUser(request);
        if(loggedUser == null) return false;

        Optional<Note> noteOpt = noteRepository.findById(noteId);
        if(!noteOpt.isPresent()) return true;

        Note note = noteOpt.get();
        return isPermittedToNote(note, loggedUser);
    }

    private boolean isPermittedToNote(Note note, User loggedUser) {
        if(note.getIsPrivate())
            return note.getOwnerId() == loggedUser.getId();

        return collaboratorsService.isProjectCollaborator(loggedUser.getId(), note.getProject().getId());
    }

    public boolean checkProjectNotesVisibility(ResponseEntity<Iterable<Note>> response, Long projectId, HttpServletRequest request){
        if(response.getBody() == null) return true;
        User loggedUser = loginService.getLoggedUser(request);
        if(loggedUser == null) return false;

        Iterator<Note> iterator = response.getBody().iterator();
        while(iterator.hasNext()){
            if(!isPermittedToNote(iterator.next(), loggedUser))
                iterator.remove();
        }
        return true;
    }

    public boolean checkCollaboratorsVisibilityByEmail(ResponseEntity<Iterable<UserEmail>> response,
                                                       Long projectId,
                                                       HttpServletRequest request){
        if(response.getBody() == null) return true;

        User loggedUser = loginService.getLoggedUser(request);

        Iterator<UserEmail> iterator = response.getBody().iterator();
        while(iterator.hasNext()){
            UserEmail email = iterator.next();
            checkVisibilityTypes(projectId, loggedUser, iterator, email.getUser().getId());
        }
        return true;
    }

    public boolean checkUserAsCollaboratorVisibility(ResponseEntity<User> response,
                                                  Long projectId,
                                                  HttpServletRequest request){
        User returnedUser = response.getBody();
        if(returnedUser == null) return true;

        User loggedUser = loginService.getLoggedUser(request);

        return checkVisibilityTypes(projectId, returnedUser.getId(), loggedUser);
    }


    public boolean checkProjectCollaboratorVisibility(ResponseEntity<ProjectCollaborator> response,
                                                      Long projectId,
                                                      HttpServletRequest request){
        ProjectCollaborator returnedCollaborator = response.getBody();
        if(returnedCollaborator == null) return true;

        User loggedUser = loginService.getLoggedUser(request);

        return checkVisibilityTypes(projectId, returnedCollaborator.getUserId(), loggedUser);
    }



    public boolean checkCollaboratorsVisibility(ResponseEntity<Iterable<ProjectCollaborator>> response,
                                                       Long projectId,
                                                       HttpServletRequest request) {
        if(response.getBody() == null)
            return true;

        User loggedUser = loginService.getLoggedUser(request);
        Iterator<ProjectCollaborator> iterator = response.getBody().iterator();
        while(iterator.hasNext()){
            ProjectCollaborator collaborator = iterator.next();
            checkVisibilityTypes(projectId, loggedUser, iterator, collaborator.getUserId());
        }
        return true;
    }

    private boolean checkVisibilityTypes(Long projectId, Long checkedUserId, User loggedUser) {
        switch(collaboratorsService.getCollaboratorVisibility(projectId, checkedUserId)){
            case EVERYONE: return true;
            case LOGGED_USERS:
                return loggedUser != null;
            case COLLABORATORS:
                return loggedUser != null && collaboratorsService.isProjectCollaborator(loggedUser.getId(), projectId);
            default: return true;
        }
    }

    private void checkVisibilityTypes(Long projectId, User loggedUser, Iterator<?> iterator, Long checkedUserId) {
        switch(collaboratorsService.getCollaboratorVisibility(projectId, checkedUserId)){
            case EVERYONE: break;
            case LOGGED_USERS: {
                if (loggedUser == null)
                    iterator.remove();
            }
            break;
            case COLLABORATORS:{
                if(loggedUser == null || !collaboratorsService.isProjectCollaborator(loggedUser.getId(), projectId))
                    iterator.remove();
            }
            break;
        }
    }

    public boolean checkVisibilityOfProjects(ResponseEntity<List<Project>> response, HttpServletRequest request){
        if(response.getBody() == null)
            return true;

        User loggedUser = loginService.getLoggedUser(request);
        response.getBody().forEach(project -> applyVisibilitySettings(project, loggedUser));
        return true;
    }

    public boolean checkVisibilityOfProject(ResponseEntity<Optional<Project>> response, HttpServletRequest request){
        Project project = response.getBody() == null ? null : response.getBody().get();
        if(project == null) return true;

        User loggedUser = loginService.getLoggedUser(request);
        applyVisibilitySettings(project, loggedUser);
        return true;
    }

    private void applyVisibilitySettings(Project project, User loggedUser){
        if(loggedUser == null) {
            project.setAttachments(project.getAttachments()
                    .stream()
                    .filter(attachment -> attachment.getVisibility() == EVERYONE)
                    .collect(Collectors.toList()));
            project.setNotes(null);
        }
        else if(collaboratorsService.isProjectCollaborator(loggedUser.getId(), project.getId())){
            project.setNotes(project.getNotes()
                    .stream()
                    .filter(note -> !note.getIsPrivate() || (note.getIsPrivate() && note.getOwnerId() == loggedUser.getId()))
                    .collect(Collectors.toList()));
        }
        else {
            project.setAttachments(project.getAttachments()
                    .stream()
                    .filter(attachment -> attachment.getVisibility() != COLLABORATORS)
                    .collect(Collectors.toList()));
            project.setNotes(null);
        }
    }
}
