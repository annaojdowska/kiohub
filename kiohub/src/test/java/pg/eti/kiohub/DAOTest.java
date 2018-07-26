/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub;

import pg.eti.kiohub.entity.model.UserPinnedProject;
import pg.eti.kiohub.entity.model.ProjectSettings;
import pg.eti.kiohub.entity.model.Licence;
import pg.eti.kiohub.entity.model.ProjectCollaborator;
import pg.eti.kiohub.entity.model.Project;
import pg.eti.kiohub.entity.model.Note;
import pg.eti.kiohub.entity.model.User;
import pg.eti.kiohub.entity.model.ProjectStatus;
import pg.eti.kiohub.entity.model.ProjectType;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import pg.eti.kiohub.entity.repository.LicenceRepository;
import pg.eti.kiohub.entity.repository.NoteRepository;
import pg.eti.kiohub.entity.repository.ProjectCollaboratorRepository;
import pg.eti.kiohub.entity.repository.ProjectRepository;
import pg.eti.kiohub.entity.repository.ProjectSettingsRepository;
import pg.eti.kiohub.entity.repository.ProjectStatusRepository;
import pg.eti.kiohub.entity.repository.ProjectTypeRepository;
import pg.eti.kiohub.entity.repository.UserPinnedProjectRepository;
import pg.eti.kiohub.entity.repository.UserRepository;
import pg.eti.kiohub.utils.DateUtills;

/**
 *
 * @author Aleksander Kania <kania>
 */
//TODO usuwanie encji po teście
@RunWith(SpringRunner.class)
@SpringBootTest
public class DAOTest {

    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ProjectTypeRepository projectTypeRepository;
    @Autowired
    private ProjectStatusRepository projectStatusRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserPinnedProjectRepository userPinnedProjectRepository;
    @Autowired
    private ProjectCollaboratorRepository projectCollaboratorRepository;
    @Autowired
    private NoteRepository noteRepository;
    @Autowired
    private LicenceRepository licenceRepository;
    @Autowired
    private ProjectSettingsRepository projectSettingsRepository;

    private Project project;
    private Long projectId;
    private Long userId1;
    private Long userId2;

    @Test
    public void saveProject() {
        findNewEntityIds();

        project = createProject();
        List<User> users = createUsers();
        ProjectCollaborator projectCollaborator = createProjectCollaborators();
        List<Note> notes = createNotes();

        persistEntities(users, project, projectCollaborator, notes);
        assertEntities();
    }

    private void assertEntities() {
        Optional<Project> savedProject = projectRepository.findById(projectId);
        Assert.assertTrue(savedProject.isPresent());

    }

    private void findNewEntityIds() {
        projectId = findNewProjectId();
        userId1 = findNewUserId();
        userId2 = userId1 + 1;
    }

    private void persistEntities(List<User> users, Project project, ProjectCollaborator projectCollaborator, List<Note> notes) {
        projectRepository.save(project);
        userRepository.saveAll(users);
        userPinnedProjectRepository.save(new UserPinnedProject(userId1, projectId));
        projectCollaboratorRepository.save(projectCollaborator);
        noteRepository.saveAll(notes);
    }

    private Project createProject() {
        Project project = new Project();
        createProjectData(project);
        createProjectReferences(project);
        return project;
    }

    private Project createProjectData(Project project) {
        project.setId(projectId);
        project.setDescriptionEng("English desc");
        project.setDescription("Polish desc");
        project.setPublicationDate(DateUtills.getDate(2018, 07, 24));
        project.setTitle("Polski tytuł");
        project.setTitleEng("Angielski tytuł");
        project.setPublished(Boolean.FALSE);
        return project;
    }

    private Project createProjectReferences(Project project) {
        project.setProjectType(createSaveProjectType());
        project.setProjectStatus(createSaveProjectStatus());
        project.setLicence(createSaveLicence());
        project.setProjectSettings(createSaveProjectSettings());
        return project;
    }

    private ProjectCollaborator createProjectCollaborators() {
        ProjectCollaborator projectCollaborator = new ProjectCollaborator();
        projectCollaborator.setProjectId(projectId);
        projectCollaborator.setUserId(userId2);
        projectCollaborator.setIsSupervisor(Boolean.FALSE);
        projectCollaborator.setUserDataVisible(Boolean.TRUE);

        return projectCollaborator;
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

    private List<User> createUsers() {
        List<User> users = new ArrayList<>();
        User user1 = new User("Jan", "Kowalski", "jan.kow@o2.pl");
        user1.setId(userId1);
        User user2 = new User("Ewa", "Chodowiecka", "ewcia2@gmail.com");
        user1.setId(userId2);

        users.add(user1);
        users.add(user2);
        return users;
    }

    private List<Note> createNotes() {
        List<Note> notes = new ArrayList<>();
        Note note1 = new Note(userId1, projectId, "Login: root, haslo: admin", DateUtills.getDate(2018, 04, 11), Boolean.TRUE);
        Note note2 = new Note(userId1, projectId, "Nie zapomnieć zmienić hasła admina!!", DateUtills.getDate(2018, 07, 15), Boolean.TRUE);
        Note note3 = new Note(userId2, projectId, "www.java.pl - dobry tutorial", DateUtills.getDate(2018, 07, 14), Boolean.TRUE);
        notes.addAll(Arrays.asList(note1, note2, note3));
        return notes;
    }

    private Licence createSaveLicence() {
        Licence licence = new Licence("GNU Affero General Public License v3.0");

        licenceRepository.save(licence);
        return licence;
    }

    private ProjectSettings createSaveProjectSettings() {
        ProjectSettings settings = new ProjectSettings();
        settings.setId(projectId);
        settings.setLicenceVisible(Boolean.FALSE);
        settings.setPublicationDateVisible(Boolean.FALSE);
        settings.setRelatedProjectsVisible(Boolean.TRUE);
        settings.setSemestersVisible(Boolean.TRUE);
        settings.setSupervisorVisible(Boolean.FALSE);
        settings.setTagsVisible(Boolean.FALSE);
        
        projectSettingsRepository.save(settings);
        return settings;
    }

}
