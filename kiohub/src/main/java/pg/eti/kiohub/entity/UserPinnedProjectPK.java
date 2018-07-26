/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.NoArgsConstructor;

/**
 *
 * @author Aleksander Kania
 */
//@Embeddable
@NoArgsConstructor
public class UserPinnedProjectPK implements Serializable {

    //@Column(name = "user_id")
    private Long userId;
    //@Column(name = "pinned_project_id")
    private Long pinnedProjectId;

//    public UserPinnedProjectPK(Long userId, Long projectId) {
//        this.userId = userId;
//        this.projectId = projectId;
//    }
//
//    public void setUserId(Long userId) {
//        this.userId = userId;
//    }
//
//    public void setProjectId(Long projectId) {
//        this.projectId = projectId;
//    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 37 * hash + Objects.hashCode(this.userId);
        hash = 37 * hash + Objects.hashCode(this.pinnedProjectId);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final UserPinnedProjectPK other = (UserPinnedProjectPK) obj;
        if (!Objects.equals(this.userId, other.userId)) {
            return false;
        }
        if (!Objects.equals(this.pinnedProjectId, other.pinnedProjectId)) {
            return false;
        }
        return true;
    }
    
    

}
