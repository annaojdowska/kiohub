package pg.eti.kiohub.utils;

import java.time.LocalDate;
import java.time.Month;
import java.time.ZoneId;
import java.util.Date;

/**
 *
 * @author Aleksander Kania <kania>
 */
public class DateUtills {

    public static Date getDate(int year, int month, int day) {
        LocalDate localDate = LocalDate.of(year, month + 1, month);
        return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }
}
