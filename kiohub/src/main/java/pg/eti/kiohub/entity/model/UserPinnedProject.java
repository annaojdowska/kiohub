/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author Aleksander Kania
 */
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
