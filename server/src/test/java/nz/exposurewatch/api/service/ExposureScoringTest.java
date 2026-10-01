package nz.exposurewatch.api.service;

import nz.exposurewatch.api.model.BreachRecord;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ExposureScoringTest {
    private final ExposureScoring scoring = new ExposureScoring();

    @Test
    void scoresAndLabelsDocumentedBoundaries() {
        assertEquals(0, scoring.score(Collections.emptyList()));
        assertEquals("Low", scoring.level(20));
        assertEquals("Medium", scoring.level(21));
        assertEquals("Medium", scoring.level(50));
        assertEquals("High", scoring.level(51));
        assertEquals("High", scoring.level(75));
        assertEquals("Critical", scoring.level(76));
    }

    @Test
    void capsScoreAtOneHundred() {
        List<BreachRecord> breaches = Collections.nCopies(6, new BreachRecord("Example", List.of()));

        assertEquals(100, scoring.score(breaches));
    }
}
