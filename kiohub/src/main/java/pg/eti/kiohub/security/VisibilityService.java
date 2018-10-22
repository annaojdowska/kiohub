package pg.eti.kiohub.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import pg.eti.kiohub.entity.model.*;
import pg.eti.kiohub.entity.repository.AttachmentRepository;
import pg.eti.kiohub.entity.search.SearchResult;
import pg.eti.kiohub.service.CollaboratorsService;
import pg.eti.kiohub.service.LoginService;

import javax.servlet.http.HttpServletRequest;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static pg.eti.kiohub.entity.enums.Visibility.COLLABORATORS;
import static pg.eti.kiohub.entity.enums.Visibility.EVERYONE;
import static pg.eti.kiohub.entity.enums.Visibility.LOGGED_USERS;

@Component("visibilityService")
public class VisibilityService extends SecurityService {

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
            applyVisibilitySettings(projectId, loggedUser, iterator, email.getUser().getId());
        }
        return true;
    }

    public boolean checkUserAsCollaboratorVisibility(ResponseEntity<User> response,
                                                     Long projectId,
                                                     HttpServletRequest request){
        User returnedUser = response.getBody();
        if(returnedUser == null) return true;

        User loggedUser = loginService.getLoggedUser(request);

        return applyVisibilitySettings(projectId, returnedUser.getId(), loggedUser);
    }


    public boolean checkSingleCollaboratorVisibility(ResponseEntity<ProjectCollaborator> response,
                                                     Long projectId,
                                                     HttpServletRequest request){
        ProjectCollaborator returnedCollaborator = response.getBody();
        if(returnedCollaborator == null) return true;

        User loggedUser = loginService.getLoggedUser(request);

        return applyVisibilitySettings(projectId, returnedCollaborator.getUserId(), loggedUser);
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
            applyVisibilitySettings(projectId, loggedUser, iterator, collaborator.getUserId());
        }
        return true;
    }

    public boolean checkVisibilityOfProjects(ResponseEntity<List<Project>> response,
                                             HttpServletRequest request){
        if(response.getBody() == null)
            return true;

        User loggedUser = loginService.getLoggedUser(request);
        response.getBody().forEach(project -> applyVisibilitySettings(project, loggedUser));
        return true;
    }

    public boolean checkVisibilityOfSingleProject(ResponseEntity<Optional<Project>> response, HttpServletRequest request){
        Project project = response.getBody() != null ? response.getBody().get() : null;
        if(project == null) return true;

        User loggedUser = loginService.getLoggedUser(request);
        applyVisibilitySettings(project, loggedUser);
        return true;
    }

    public boolean checkVisibilityOfSearchResults(ResponseEntity<List<SearchResult>> response, HttpServletRequest request){
        if(response.getBody() == null)
            return true;

        User loggedUser = loginService.getLoggedUser(request);
        response.getBody()
                .stream()
                .map(searchResult -> searchResult.getProject())
                .forEach(project -> applyVisibilitySettings(project, loggedUser));
        return true;
    }

    private boolean applyVisibilitySettings(Long projectId, Long checkedUserId, User loggedUser) {
        switch(collaboratorsService.getCollaboratorVisibility(projectId, checkedUserId)){
            case EVERYONE: return true;
            case LOGGED_USERS:
                return loggedUser != null;
            case COLLABORATORS:
                return loggedUser != null && collaboratorsService.isProjectCollaborator(loggedUser.getId(), projectId);
            default: return true;
        }
    }

    private void applyVisibilitySettings(Long projectId, User loggedUser, Iterator<?> iterator, Long checkedUserId) {
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
