package nz.exposurewatch.api.hibp;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record HibpBreach(
        @JsonProperty("Name") String name,
        @JsonProperty("DataClasses") List<String> dataClasses
) {
}
