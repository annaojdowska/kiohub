
package pg.eti.kiohub.entity.model;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.sql.Blob;

/**
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
