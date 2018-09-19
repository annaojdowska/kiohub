/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.entity.search;

import java.time.LocalDate;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author Anna
 */
@Getter
@Setter
public class QueryDescription {    
    private List<String> supervisors;
    private List<String> tags;
    private List<String> titles;
    private List<String> descriptions;
    private List<Long> licencesIds;
    private List<Long> projectTypesIds;
    private List<Long> semestersIds;
    private LocalDate dateTo;
    private LocalDate dateFrom;
}
