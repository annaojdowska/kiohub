
package pg.eti.kiohub.entity.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.util.StringUtils;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 *
 * @author Aleksander Kania <kania>
 */
@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Project implements Serializable {

    @Id
    @Column(name = "project_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", nullable = false)
    private ProjectType projectType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", nullable = false)
    private ProjectStatus projectStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "licence_id", nullable = false)
    private Licence licence;
    
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "project")
    private List<Attachment> attachments;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "project")
    private List<Note> notes;

    /*
    Projekty, z którymi jest powiązany projekt (on z nimi)
     */
    @JsonIgnore
    @ManyToMany
    @JoinTable(name="related_projects",
            joinColumns=@JoinColumn(name="project_id"),
            inverseJoinColumns=@JoinColumn(name="related_project_id")
    )
    private List<Project> relatedToProjects;

    @ManyToMany
    @JoinTable(name = "project_tags",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id"))

    private List<Tag> tags = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "project_semesters",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "semester_id"))

    private List<Semester> semesters = new ArrayList<>();

    @Setter(AccessLevel.NONE)
    @Column(name = "title_PL")
    private String title;

    @Setter(AccessLevel.NONE)
    @Column(name = "title_ENG")
    private String titleEng;

    @Setter(AccessLevel.NONE)
    @Column(name = "description_PL")
    private String description;

    @Setter(AccessLevel.NONE)
    @Column(name = "description_ENG")
    private String descriptionEng;

    @Column(name = "publication_date")
    private Date publicationDate;

    @Column(name = "is_published")
    private Boolean published;


    public Project(String titlePl, List<String> collaborators) {
        this.title = titlePl;

    }

    public void addTag(Tag tag) {
        tags.add(tag);
        tag.getProjects().add(this);
    }

    public void addSemester(Semester semester) {
        semesters.add(semester);
        semester.getProjects().add(this);
    }

    public void addRelationWithProject(Project project) {
        this.relatedToProjects.add(project);
        project.getRelatedToProjects().add(this);
    }

    public void setTitle(String title) {
        this.title = StringUtils.capitalize(title);
    }

    public void setTitleEng(String titleEng) {
        this.titleEng = StringUtils.capitalize(titleEng);
    }

    public void setDescription(String description) {
        this.description = StringUtils.capitalize(description);
    }

    public void setDescriptionEng(String descriptionEng) {
        this.descriptionEng = StringUtils.capitalize(descriptionEng);
    }
}
