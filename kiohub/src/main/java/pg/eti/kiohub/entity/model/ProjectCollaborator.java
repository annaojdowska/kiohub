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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pg.eti.kiohub.entity.enums.Visibility;

/**
 *
 * @author Aleksander Kania
 */
@Entity(name = "PROJECT_COLLABORATORS")
@Getter
@Setter
@NoArgsConstructor
@IdClass(UserProjectPK.class)
public class ProjectCollaborator {

    @Id
    private Long userId;
    @Id
    private Long projectId;
    @Column(name = "user_data_visible")
    private Visibility userDataVisible;
    @Column(name = "is_supervisor")
    private Boolean isSupervisor;

}
