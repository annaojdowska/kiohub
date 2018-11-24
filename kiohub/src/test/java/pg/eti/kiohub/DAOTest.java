
package pg.eti.kiohub;

import pg.eti.kiohub.entity.enums.AttachmentType;
import pg.eti.kiohub.entity.model.*;

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
import pg.eti.kiohub.entity.enums.Visibility;
import pg.eti.kiohub.entity.repository.*;
import pg.eti.kiohub.utils.DateUtills;

/**
 *
 * @author Aleksander Kania <kania>
 */
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
    @Autowired
    private TagRepository tagRepository;
    @Autowired
    private SemesterRepository semesterRepository;
    @Autowired
    private AttachmentRepository attachmentRepository;
    @Autowired
    private UserEmailRepository userEmailRepository;

    private Project project;
    private Project project2;
    private Long projectId;
    private Long project2Id;
    private Long userId1;
    private Long userId2;

    @Test
    public void saveSimpleProject() {
        Project project = new Project();
        project.setTitle("Projekt testowy");
        project = projectRepository.saveAndFlush(project);
        Assert.assertNotNull(project);
        projectRepository.delete(project);
    }

    @Test
    public void checkSqlQueries() {
        boolean exceptionThrown = false;

        try {
            userRepository.checkIfUserExistsByEmail("ja");
            userRepository.findUserByEmail("ja");
        } catch (Exception e) {
            e.printStackTrace();
            exceptionThrown = true;
        }

        Assert.assertFalse(exceptionThrown);
    }

    private void assertEntities() {
        Optional<Project> savedProject = projectRepository.findById(projectId);
        Assert.assertTrue(savedProject.isPresent());

    }

    private void findNewEntityIds() {
        projectId = findNewProjectId();
        project2Id = findNewProjectId();
        userId1 = findNewUserId();
        userId2 = userId1 + 1;
    }

    private void persistEntities(List<User> users, ProjectCollaborator projectCollaborator, List<Note> notes) {
        projectRepository.save(project);
        projectRepository.save(project2);

        userRepository.saveAll(users);
        userPinnedProjectRepository.save(new UserPinnedProject(userId1, projectId));
        projectCollaboratorRepository.save(projectCollaborator);
        noteRepository.saveAll(notes);
        
        saveAttachments();
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
        project.setTags(createSaveTags());
        project.setSemesters(createSaveSemesters());
        return project;
    }

    private ProjectCollaborator createProjectCollaborators() {
        ProjectCollaborator projectCollaborator = new ProjectCollaborator();
        projectCollaborator.setProjectId(projectId);
        projectCollaborator.setUserId(userId2);
        projectCollaborator.setIsSupervisor(Boolean.FALSE);
        projectCollaborator.setUserDataVisible(Visibility.COLLABORATORS);

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

        User user1 = new User("Jan", "Kowalski");
        user1.setId(userId1);
        User user2 = new User("Ewa", "Chodowiecka");
        user1.setId(userId2);

        users.add(user1);
        users.add(user2);

        return users;
    }

    private List<Note> createNotes() {
        List<Note> notes = new ArrayList<>();
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
        settings.setLicenceVisible(Visibility.COLLABORATORS);
        settings.setPublicationDateVisible(Visibility.EVERYONE);
        settings.setRelatedProjectsVisible(Visibility.COLLABORATORS);
        settings.setSemestersVisible(Visibility.LOGGED_USERS);
        settings.setSupervisorVisible(Visibility.COLLABORATORS);
        settings.setTagsVisible(Visibility.EVERYONE);

        projectSettingsRepository.save(settings);
        return settings;
    }

    private List<Tag> createSaveTags() {
        List<Tag> tags = new ArrayList<>();
        Tag tag1 = new Tag("spring");
        Tag tag2 = new Tag("web-app");
        tags.addAll(Arrays.asList(tag1, tag2));

        tagRepository.saveAll(tags);
        return tags;
    }

    private List<Semester> createSaveSemesters() {
        Semester semester = new Semester("1993/1994 - zimowy");
        List<Semester> semesters = new ArrayList<>(Arrays.asList(semester));

        semesterRepository.saveAll(semesters);
        return semesters;
    }

    private List<Attachment> saveAttachments() {
        List<Attachment> attachments = new ArrayList<>();
        Attachment at1 = new Attachment();
        at1.setFileName("obrazek.png");
        at1.setFileSize(Long.valueOf(31));
        at1.setMainPhoto(Boolean.TRUE);
        at1.setProject(project);
        at1.setVisibility(Visibility.EVERYONE);
        at1.setType(AttachmentType.PHOTO);

        Attachment at2 = new Attachment();
        at2.setFileName("instrukcja.pdf");
        at2.setFileSize(Long.valueOf(33));
        at2.setMainPhoto(Boolean.FALSE);
        at2.setProject(project);
        at2.setVisibility(Visibility.COLLABORATORS);
        at2.setType(AttachmentType.MANUAL_STARTUP);
        
        attachments.addAll(Arrays.asList(at1, at2));
        attachmentRepository.saveAll(attachments);
        
        return attachments;
    }

}
