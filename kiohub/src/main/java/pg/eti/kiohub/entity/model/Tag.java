
package pg.eti.kiohub.entity.model;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tags")
@Getter
@Setter
@NoArgsConstructor
public class Tag {

    @Id
    @Column(name = "tag_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToMany(mappedBy = "tags")
    @JsonBackReference
    private List<Project> projects = new ArrayList<>();

    private String name;

    public void addProject(Project project) {
        projects.add(project);
        project.getTags().add(this);
    }

    public Tag(String name) {
        this.name = name;
    }

}
