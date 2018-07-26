/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import pg.eti.kiohub.entity.*;
import pg.eti.kiohub.repository.ProjectRepository;
import pg.eti.kiohub.repository.ProjectStatusRepository;
import pg.eti.kiohub.repository.ProjectTypeRepository;
import pg.eti.kiohub.repository.UserPinnedProjectRepository;
import pg.eti.kiohub.repository.UserRepository;
import pg.eti.kiohub.utils.DateUtills;

/**
 *
 * @author Aleksander Kania <kania>
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class DAOTest {

    private Project project;

    //TODO zbadać temat co robić, aby za każdym razem nie czyścić bazy
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectTypeRepository projectTypeRepository;

    @Autowired
    private ProjectStatusRepository projectStatusRepository;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected UserPinnedProjectRepository userPinnedProjectRepository;

    @Test
    public void saveProject() {
        Long projectId = findNewProjectId();
        Long userId1 = findNewUserId();
        project = createProject(projectId);
        project.setProjectType(createSaveProjectType());
        project.setProjectStatus(createSaveProjectStatus());
        List<User> users = createUsers(findNewUserId());

        projectRepository.save(project);
        userRepository.saveAll(users);
 
        userPinnedProjectRepository.save(new UserPinnedProject(userId1, projectId));

        // userRepository.saveAll(project.getUsers()); 
        Optional<Project> savedProject = projectRepository.findById(projectId);
        Assert.assertTrue(savedProject.isPresent());
    }

    private Project createProject(Long id) {
        Project project = new Project();
        project.setId(id);
        project.setDescriptionEng("English desc");
        project.setDescription("Polish desc");
        project.setPublicationDate(DateUtills.getDate(2018, 07, 24));
        project.setTitle("Polski tytuł");
        project.setTitleEng("Angielski tytuł");
        project.setPublished(Boolean.FALSE);
        return project;
    }

    private ProjectType createSaveProjectType() {
        ProjectType projectType = new ProjectType();
        projectType.setName("Praca inżynierska");

        projectTypeRepository.save(projectType);
        return projectType;
    }

    private ProjectStatus createSaveProjectStatus() {
        ProjectStatus projectStatus = new ProjectStatus();
        projectStatus.setName("W trakcie realizacji");

        projectStatusRepository.save(projectStatus);
        return projectStatus;
    }

    private Long findNewProjectId() {
        Iterable<Project> projectsOpt = projectRepository.findAll();
        Long maxId = Long.valueOf(0);
        for (Project project : projectsOpt) {
            if (project.getId() > maxId) {
                maxId = project.getId();
            }
        }
        return maxId + 1;
    }

    private Long findNewUserId() {
        Iterable<User> projectsOpt = userRepository.findAll();
        Long maxId = Long.valueOf(0);
        for (User user : projectsOpt) {
            if (user.getId() > maxId) {
                maxId = user.getId();
            }
        }
        return maxId + 1;
    }

    private List<User> createUsers(Long newId) {
        List<User> users = new ArrayList<>();
        User user1 = new User("Jan", "Kowalski", "jan.kow@o2.pl");
        user1.setId(newId);
        //user1.addProject(project);
        User user2 = new User("Ewa", "Chodowiecka", "ewcia2@gmail.com");
        //   user2.addProject(project);

        users.add(user1);
        users.add(user2);
//        
//        //userRepository.saveAll(users);        
        return users;
    }

}
