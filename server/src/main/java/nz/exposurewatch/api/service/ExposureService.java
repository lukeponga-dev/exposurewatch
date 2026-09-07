package nz.exposurewatch.api.service;

import nz.exposurewatch.api.hibp.HibpBreach;
import nz.exposurewatch.api.hibp.HibpClient;
import nz.exposurewatch.api.model.BreachRecord;
import nz.exposurewatch.api.model.ExposureResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExposureService {
    private final HibpClient hibpClient;
    private final ExposureScoring scoring;

    public ExposureService(HibpClient hibpClient, ExposureScoring scoring) {
        this.hibpClient = hibpClient;
        this.scoring = scoring;
    }

    public ExposureResponse check(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        List<HibpBreach> hibpBreaches = hibpClient.breachedAccount(normalizedEmail);

        List<BreachRecord> breaches = hibpBreaches.stream()
                .map(breach -> new BreachRecord(
                        breach.name(),
                        breach.dataClasses() == null ? List.of() : breach.dataClasses()))
                .toList();

        int score = scoring.score(breaches);
        return new ExposureResponse(normalizedEmail, score, scoring.level(score), breaches);
    }
}
