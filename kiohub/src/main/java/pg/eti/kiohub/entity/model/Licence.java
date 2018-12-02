
package pg.eti.kiohub.entity.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "licences")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Licence {

    @Id
    @Column(name = "licence_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "name")
    private String name;
    
    @JsonBackReference
    @OneToMany(fetch=FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "licence")
    private List<Project> projects;

    public Licence(String name) {
        this.name = name;
    }

}
