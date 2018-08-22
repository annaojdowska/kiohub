/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

/**
 *
 * @author Aleksander Kania
 */
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
    
    @Column(name = "project_id")
    private Long projectId;
    
    @Column(name = "content")
    private String content;
    
    @Column(name = "publication_date")
    private Date publicationDate;
    
    @Column(name = "is_private")
    private Boolean isPrivate;

    public Note(Long ownerId, Long projectId, String content, Date publicationDate, Boolean isPrivate) {
        this.ownerId = ownerId;
        this.projectId = projectId;
        this.content = content;
        this.publicationDate = publicationDate;
        this.isPrivate = isPrivate;
    }    
    
}
