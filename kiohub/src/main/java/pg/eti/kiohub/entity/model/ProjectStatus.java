/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.model;

import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author Aleksander Kania <kania>
 */
@Entity(name = "PROJECT_STATUS")
@Getter
@Setter
@NoArgsConstructor
public class ProjectStatus {
    @Id
    @Column(name = "status_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "name")
    private String name;
    
    @OneToMany(fetch=FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "projectStatus")
    private List<Project> projects;
}
