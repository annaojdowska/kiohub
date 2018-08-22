/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;
import javax.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author Aleksander Kania <kania>
 */
@Entity
@Table(name = "project_types")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProjectType {
    @Id
    @Column(name = "type_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id; 
    
    @Column(name = "name")
    private String name;
    
    @JsonBackReference
    @OneToMany(fetch=FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "projectType")
    private List<Project> projects;
}
