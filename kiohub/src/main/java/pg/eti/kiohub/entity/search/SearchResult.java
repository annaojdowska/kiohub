/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.search;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pg.eti.kiohub.entity.model.Project;

/**
 *
 * @author Anna
 */

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SearchResult implements Comparable<SearchResult>{
    private Project project;
    private double score;

    @Override
    public int compareTo(SearchResult o) {
        if(o.getScore() < this.score) return 1;
        else if(o.getScore() == this.score) return 0;
        return -1;
    }


}
