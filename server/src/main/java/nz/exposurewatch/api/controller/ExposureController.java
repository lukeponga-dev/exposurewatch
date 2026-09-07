package nz.exposurewatch.api.controller;

import jakarta.validation.Valid;
import nz.exposurewatch.api.model.ExposureCheckRequest;
import nz.exposurewatch.api.model.ExposureResponse;
import nz.exposurewatch.api.service.ExposureService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/exposure")
public class ExposureController {
    private final ExposureService exposureService;

    public ExposureController(ExposureService exposureService) {
        this.exposureService = exposureService;
    }

    @PostMapping(value = "/check", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ExposureResponse checkJson(@Valid @RequestBody ExposureCheckRequest request) {
        return exposureService.check(request.email());
    }

    @PostMapping(value = "/check", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ExposureResponse checkForm(@RequestParam String email) {
        return exposureService.check(email);
    }
}
