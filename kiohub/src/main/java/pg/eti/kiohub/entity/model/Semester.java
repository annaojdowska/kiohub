/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.model;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pg.eti.kiohub.entity.model.Project;

/**
 *
 * @author Aleksander Kania
 */
@Entity(name = "SEMESTERS")
@Getter
@Setter
@NoArgsConstructor
public class Semester {

    @Id
    @Column(name = "semester_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @ManyToMany(mappedBy = "semesters")
    private List<Project> projects = new ArrayList<>();

    public void addProject(Project project) {
        projects.add(project);
        project.getSemesters().add(this);
    }

    public Semester(String name) {
        this.name = name;
    }

}
