/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author Aleksander Kania
 */
@Entity(name = "PROJECT_SETTINGS")
@Getter
@Setter
@NoArgsConstructor
public class ProjectSettings {

    @Id
    @Column(name = "project_id")
    private Long id;
    
    private Boolean licenceVisible;
    private Boolean supervisorVisible;
    private Boolean publicationDateVisible;
    private Boolean tagsVisible;
    private Boolean semestersVisible;
    private Boolean relatedProjectsVisible;

}
