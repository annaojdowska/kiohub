/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.model;


        import java.sql.Blob;
        import java.util.List;
        import javax.persistence.*;

        import lombok.Getter;
        import lombok.NoArgsConstructor;
        import lombok.Setter;

/**
 *
 * @author Tomasz
 */
@Entity
@Table(name = "attachments_files")
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
