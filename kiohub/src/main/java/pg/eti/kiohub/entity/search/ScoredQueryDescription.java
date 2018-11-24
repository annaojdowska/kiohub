
package pg.eti.kiohub.entity.search;

import java.util.HashMap;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author Anna
 */
@Setter
@Getter
@AllArgsConstructor
public class ScoredQueryDescription {
     
    private HashMap<String, Double> supervisors;
    private HashMap<String, Double> tags;
    private HashMap<String, Double> titles;
    private HashMap<String, Double> descriptions;
    private HashMap<Long, Double> licencesIds;
    private HashMap<Long, Double> projectTypesIds;
    private HashMap<Long, Double> semestersIds;
}
