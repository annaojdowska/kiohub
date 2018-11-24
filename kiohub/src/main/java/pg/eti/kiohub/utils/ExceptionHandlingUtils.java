package pg.eti.kiohub.utils;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.StringWriter;

public class ExceptionHandlingUtils {

    public static ResponseEntity handleException(Throwable ex) {
        StringWriter sw = new StringWriter();
        if (ex.getMessage() != null) {
            sw.append("Treść wyjątku: " + ex.getMessage());
        }
        if (ex.getCause() != null) {
            sw.append("Przyczyna: " + ex.getCause().toString());
        }
        return new ResponseEntity<>(sw, HttpStatus.BAD_REQUEST);
    }
}
