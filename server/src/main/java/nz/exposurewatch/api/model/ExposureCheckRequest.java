package nz.exposurewatch.api.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ExposureCheckRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email
) {
}
