package nz.exposurewatch.api.controller;

import nz.exposurewatch.api.config.ApiExceptionHandler;
import nz.exposurewatch.api.model.BreachRecord;
import nz.exposurewatch.api.model.ExposureResponse;
import nz.exposurewatch.api.service.ExposureService;
import nz.exposurewatch.api.xposedornot.XposedOrNotClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup;

class ExposureControllerTest {
    private final ExposureService exposureService = mock(ExposureService.class);
    private MockMvc mockMvc;
    private LocalValidatorFactoryBean validator;

    @BeforeEach
    void setUp() {
        validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        mockMvc = standaloneSetup(new ExposureController(exposureService))
                .setControllerAdvice(new ApiExceptionHandler())
                .setValidator(validator)
                .build();
    }

    @Test
    void returnsExposureReportForValidJsonRequest() throws Exception {
        when(exposureService.check("person@example.com"))
                .thenReturn(new ExposureResponse(
                        "person@example.com",
                        40,
                        "Medium",
                        List.of(new BreachRecord("Example breach", List.of("Passwords")))));

        mockMvc.perform(post("/exposure/check")
                        .contentType("application/json")
                        .content("{\"email\":\"person@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("person@example.com"))
                .andExpect(jsonPath("$.score").value(40))
                .andExpect(jsonPath("$.level").value("Medium"))
                .andExpect(jsonPath("$.breaches[0].breachName").value("Example breach"))
                .andExpect(jsonPath("$.breaches[0].dataClasses[0]").value("Passwords"));

        verify(exposureService).check("person@example.com");
    }

    @Test
    void rejectsInvalidJsonEmail() throws Exception {
        mockMvc.perform(post("/exposure/check")
                        .contentType("application/json")
                        .content("{\"email\":\"not-an-email\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Invalid request"));
    }

    @Test
    void mapsProviderFailureToBadGateway() throws Exception {
        when(exposureService.check(anyString()))
                .thenThrow(new XposedOrNotClient.XposedOrNotException("provider unavailable"));

        mockMvc.perform(post("/exposure/check")
                        .contentType("application/json")
                        .content("{\"email\":\"person@example.com\"}"))
                .andExpect(status().isBadGateway())
                .andExpect(jsonPath("$.title").value("Exposure provider unavailable"));
    }
}
