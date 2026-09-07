package nz.exposurewatch.api.model;

import java.util.List;

public record BreachRecord(String breachName, List<String> dataClasses) {
    public BreachRecord {
        dataClasses = dataClasses == null ? List.of() : List.copyOf(dataClasses);
    }
}
