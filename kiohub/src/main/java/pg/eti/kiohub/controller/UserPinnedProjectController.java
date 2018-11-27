
package pg.eti.kiohub.controller;

import lombok.extern.jbosslog.JBossLog;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import pg.eti.kiohub.entity.model.UserPinnedProject;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@JBossLog
@Controller
@CrossOrigin
@RequestMapping(path = "/userpinnedproject")
public class UserPinnedProjectController extends MainController {


    @GetMapping(path = "/user/{userId}")
  //  @PreAuthorize("@securityService.isMyself(#request, #userId)")
    public ResponseEntity<Iterable<Long>> getUserPinnedProjectsIdsByUserId(@PathVariable("userId") Long userId,
                                                                           HttpServletRequest request) {
        List<UserPinnedProject> pinnedProjects = userPinnedProjectRepository.getPinnedProjects(userId);
        List<Long> pinnedIds = new ArrayList<>();
        for (UserPinnedProject upp : pinnedProjects) {
            pinnedIds.add(upp.getProjectId());
        }
        return new ResponseEntity<>(pinnedIds, HttpStatus.OK);
    }

    @PostMapping(path = "/pin")
  //  @PreAuthorize("@securityService.isMyself(#request, #userId)")
    public ResponseEntity<UserPinnedProject> pin(
            @RequestParam("userId") String userId,
            @RequestParam("projectId") String projectId,
            HttpServletRequest request) {
        log.info("Przypne " + userId + " " + projectId);
        UserPinnedProject userPinnedProject = new UserPinnedProject(Long.parseLong(userId), Long.parseLong(projectId));

        userPinnedProjectRepository.saveAndFlush(userPinnedProject);
        log.info("Udalo sie przypiac " + userPinnedProject);
        return new ResponseEntity<>(userPinnedProject, HttpStatus.OK);
    }

    @PostMapping(path = "/unpin")
 //   @PreAuthorize("@securityService.isMyself(#request, #userId)")
    public ResponseEntity<UserPinnedProject> unPin(
            @RequestParam("userId") String userId,
            @RequestParam("projectId") String projectId,
            HttpServletRequest request) {

        Long _userId = Long.parseLong(userId);
        Long _projectId = Long.parseLong(projectId);
        log.info("OdPrzypne " + _userId + " " + _projectId);
        UserPinnedProject pinToDelete = this.userPinnedProjectRepository.getPinnedProject(_projectId, _userId);
        log.info("Udalo sie odprzypiac " + pinToDelete);
        if (pinToDelete != null) {
            this.userPinnedProjectRepository.deletePinnedProject(_projectId, _userId);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }


    @PostMapping(path = "/ispinned")
 //   @PreAuthorize("@securityService.isMyself(#request, #userId)")
    public ResponseEntity<Boolean> isPinned(
            @RequestParam("userId") String userId,
            @RequestParam("projectId") String projectId,
            HttpServletRequest request) {

        Long _userId = Long.parseLong(userId);
        Long _projectId = Long.parseLong(projectId);
        log.info("Czyprzypie " + _userId + " " + _projectId);
        UserPinnedProject pinned = this.userPinnedProjectRepository.getPinnedProject(_projectId, _userId);
        log.info("Udalo sie odprzypiac " + pinned);
        if (pinned != null) {
            return new ResponseEntity<>(true, HttpStatus.OK);
        }
        return new ResponseEntity<>(false, HttpStatus.OK);
    }
}
