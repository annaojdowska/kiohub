
package pg.eti.kiohub.entity.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_pinned_projects")
@Getter
@Setter
@NoArgsConstructor
@IdClass(UserProjectPK.class)
public class UserPinnedProject {

    @Id
    @Column(name = "user_id")
    private Long userId;
    @Id
    @Column(name = "pinned_project_id")
    private Long projectId;

    public UserPinnedProject(Long userId, Long projectId) {
        this.userId = userId;
        this.projectId = projectId;
    }

}
