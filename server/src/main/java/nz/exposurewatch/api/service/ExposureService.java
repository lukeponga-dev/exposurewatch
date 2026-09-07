package nz.exposurewatch.api.service;

import nz.exposurewatch.api.model.BreachRecord;
import nz.exposurewatch.api.model.ExposureResponse;
import nz.exposurewatch.api.xposedornot.XposedOrNotBreach;
import nz.exposurewatch.api.xposedornot.XposedOrNotClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExposureService {
    private final XposedOrNotClient exposureClient;
    private final ExposureScoring scoring;

    public ExposureService(XposedOrNotClient exposureClient, ExposureScoring scoring) {
        this.exposureClient = exposureClient;
        this.scoring = scoring;
    }

    public ExposureResponse check(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        List<XposedOrNotBreach> sourceBreaches = exposureClient.checkEmail(normalizedEmail);

        List<BreachRecord> breaches = sourceBreaches.stream()
                .map(breach -> new BreachRecord(
                        breach.name(),
                        breach.dataClasses() == null ? List.of() : breach.dataClasses()))
                .toList();

        int score = scoring.score(breaches);
        return new ExposureResponse(normalizedEmail, score, scoring.level(score), breaches);
    }
}
