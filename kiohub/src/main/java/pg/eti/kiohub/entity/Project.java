/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity;

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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
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
    
    
//    @OneToMany(fetch=FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "project")
//    private List<UserPinnedProject> userPinnedProjects = new ArrayList<>();
    
    
    
    
    /*
        TODO
        licence_id
     */
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


}
