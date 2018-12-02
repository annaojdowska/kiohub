
package pg.eti.kiohub.entity.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "notes")
@Getter
@Setter
@NoArgsConstructor
public class Note {

    @Id
    @Column(name = "note_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "owner_id")
    private Long ownerId;
    
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    @Column(name = "content")
    private String content;
    
    @Column(name = "publication_date")
    private Date publicationDate;
    
    @Column(name = "is_private")
    private Boolean isPrivate;

    public Note(Long ownerId, Project project, String content, Date publicationDate, Boolean isPrivate) {
        this.ownerId = ownerId;
        this.project = project;
        this.content = content;
        this.publicationDate = publicationDate;
        this.isPrivate = isPrivate;
    }
    
}
