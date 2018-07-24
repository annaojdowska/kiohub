/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.*;

/**
 *
 * @author Aleksander Kania <kania>
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name="projects")
public class Project implements Serializable {
    @Id
    @Column(name="project_id")
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;
    
    @Column(name="title_PL")
    private String titlePL;
    
    @Column(name="title_ENG")
    private String titleENG;
    
    @Column(name="description_PL")
    private String descriptionPL;
    
    @Column(name="description_ENG")
    private String descriptionENG;
    
    @Column(name="publication_date")
    private LocalDateTime publicationDate;
    
    @Column(name = "is_published", columnDefinition="BIT")
    private Boolean isPublished;
    
    @ManyToOne
    @JoinColumn(name = "licence_id")
    private Licence licence;
    
    @ManyToOne
    @JoinColumn(name = "type_id")
    private ProjectType type;
    
    @ManyToOne
    @JoinColumn(name = "status_id")
    private ProjectStatus status;
    
}