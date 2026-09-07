package nz.exposurewatch.api.model;

import java.util.List;

public record ExposureResponse(
        String email,
        int score,
        String level,
        List<BreachRecord> breaches
) {
    public ExposureResponse {
        breaches = breaches == null ? List.of() : List.copyOf(breaches);
    }
}
