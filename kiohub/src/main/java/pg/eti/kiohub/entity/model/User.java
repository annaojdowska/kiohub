/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.model;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.util.StringUtils;

/**
 *
 * @author Aleksander Kania
 */
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
 
//    @OneToMany(fetch=FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "user")
//    private List<UserPinnedProject> userPinnedProjects = new ArrayList<>();

    @Setter(AccessLevel.NONE)
    @Column(name = "first_name")
    private String firstName;

    @Setter(AccessLevel.NONE)
    @Column(name = "last_name")
    private String lastName;

//    @Column(name = "email")
//    private String email;
    
    @Column(name = "person_number")
    private Long person_number;
    
    public User(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public void setFirstName(String firstName) {
        this.firstName = StringUtils.capitalize(firstName);
    }

    public void setLastName(String lastName) {
        this.lastName = StringUtils.capitalize(lastName);
    }
}
