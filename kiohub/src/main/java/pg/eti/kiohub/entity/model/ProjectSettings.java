/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pg.eti.kiohub.entity.enums.Visibility;

/**
 *
 * @author Aleksander Kania
 */
@Entity
@Table(name = "project_settings")
@Getter
@Setter
@NoArgsConstructor
public class ProjectSettings {

    @Id
    @Column(name = "project_id")
    private Long id;
    
    private Visibility licenceVisible;
    private Visibility supervisorVisible;
    private Visibility publicationDateVisible;
    private Visibility tagsVisible;
    private Visibility semestersVisible;
    private Visibility relatedProjectsVisible;

}
