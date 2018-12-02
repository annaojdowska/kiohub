
package pg.eti.kiohub.entity.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.util.StringUtils;

import javax.persistence.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Setter(AccessLevel.NONE)
    @Column(name = "first_name")
    private String firstName;

    @Setter(AccessLevel.NONE)
    @Column(name = "last_name")
    private String lastName;
    
    @Column(name = "is_supervisor")
    private Boolean isSupervisor;
        
    public User(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.isSupervisor = false;
    }

    public void setFirstName(String firstName) {
        this.firstName = StringUtils.capitalize(firstName);
    }

    public void setLastName(String lastName) {
        this.lastName = StringUtils.capitalize(lastName);
    }

}
