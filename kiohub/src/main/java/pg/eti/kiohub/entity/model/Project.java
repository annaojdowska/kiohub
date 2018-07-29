/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
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
import javax.persistence.OneToOne;
import lombok.*;

/**
 *
 * @author Aleksander Kania <kania>
 */
@Entity(name = "PROJECTS")
@Getter
@Setter
@NoArgsConstructor
public class Project implements Serializable {

    @Id
    @Column(name = "project_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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


    /*
    Projekty, z którymi jest powiązany projekt (on z nimi)
     */
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "RELATED_PROJECTS",
            joinColumns = {
                @JoinColumn(name = "project_id")},
            inverseJoinColumns = {
                @JoinColumn(name = "related_project_id")})
    private List<Project> relatedToProjects = new ArrayList<Project>();

    /*
    Projekty, z którymi jest powiązany projekt (one z nim)
     */
    @ManyToMany(mappedBy = "relatedToProjects")
    private List<Project> relatedFromProjects = new ArrayList<Project>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "project_id", referencedColumnName = "id")
    private ProjectSettings projectSettings;

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

    @Column(name = "title_PL")
    private String title;

    @Column(name = "title_ENG")
    private String titleEng;

    @Column(name = "description_PL")
    private String description;

    @Column(name = "description_ENG")
    private String descriptionEng;

    @Column(name = "publication_date")
    private Date publicationDate;

    //TODO problem z boolean
    @Column(name = "is_published")
    private Boolean published;

    public void addTag(Tag tag) {
        tags.add(tag);
        tag.getProjects().add(this);
    }

    public void addSemester(Semester semester) {
        semesters.add(semester);
        semester.getProjects().add(this);
    }

    public void addRelationWithProject(Project project) {
        this.getRelatedToProjects().add(project);
        project.getRelatedToProjects().add(this);
    }

}
