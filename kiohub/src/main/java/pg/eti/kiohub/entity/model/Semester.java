
package pg.eti.kiohub.entity.model;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pg.eti.kiohub.entity.model.Project;

/**
 *
 * @author Aleksander Kania
 */
@Entity
@Table(name = "semesters")
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
    @JsonBackReference
    private List<Project> projects = new ArrayList<>();

    public void addProject(Project project) {
        projects.add(project);
        project.getSemesters().add(this);
    }

    public Semester(String name) {
        this.name = name;
    }

}
