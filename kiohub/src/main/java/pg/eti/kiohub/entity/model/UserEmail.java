package pg.eti.kiohub.entity.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "users_emails")
@Getter
@Setter
@NoArgsConstructor
public class UserEmail {
    
    public static final String STUDENT_EMAIL = "@student";
    
    public static final String PG_EDU_EMAIL = "pg.edu.pl";
    
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "email")
    private String email;

    public UserEmail(String email, User user) {
        this.email = email;
        this.user = user;
    }
    
    public Boolean isStudentMail() {
        return (email.contains(STUDENT_EMAIL));
    }
    
    public Boolean isPGEduMail() {
        return (email.contains(PG_EDU_EMAIL));
    }
}
