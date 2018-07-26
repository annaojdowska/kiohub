/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@Entity(name = "PROJECT_TYPES")
@Getter
@Setter
@NoArgsConstructor
public class ProjectType {
    @Id
    @Column(name = "type_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 
    
    @Column(name = "name")
    private String name;
    
    @OneToMany(fetch=FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "projectType")
    private List<Project> projects;
}
