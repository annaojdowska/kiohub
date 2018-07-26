/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author Aleksander Kania
 */
@Entity(name = "USER_PINNED_PROJECTS")
@Getter
@Setter
@NoArgsConstructor
@IdClass(UserPinnedProjectPK.class)
public class UserPinnedProject {

    @Id
    private Long userId;
    @Id
    private Long pinnedProjectId;

    public UserPinnedProject(Long userId, Long pinnedProjectId) {
        this.userId = userId;
        this.pinnedProjectId = pinnedProjectId;
    }

}
