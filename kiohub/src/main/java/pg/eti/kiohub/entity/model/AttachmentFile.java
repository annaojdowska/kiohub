/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.model;


import java.sql.Blob;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author Tomasz
 */
@Entity(name = "ATTACHMENTS_FILE")
@Getter
@Setter
@NoArgsConstructor
public class AttachmentFile {
        
    @Id
    @Column(name = "attachments_id")
    private Long id;

    @Column(name = "file")
    private Blob file;
}
