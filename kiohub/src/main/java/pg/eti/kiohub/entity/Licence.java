/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author Anna
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name="licences")
public class Licence {
    @Id
    @Column(name="licence_id")
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;
    
}
