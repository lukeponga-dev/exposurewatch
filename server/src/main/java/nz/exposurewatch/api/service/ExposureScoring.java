package nz.exposurewatch.api.service;

import nz.exposurewatch.api.model.BreachRecord;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExposureScoring {
    private static final int POINTS_PER_BREACH = 20;

    public int score(List<BreachRecord> breaches) {
        return Math.min(100, breaches.size() * POINTS_PER_BREACH);
    }

    public String level(int score) {
        if (score <= 20) return "Low";
        if (score <= 50) return "Medium";
        if (score <= 75) return "High";
        return "Critical";
    }
}
