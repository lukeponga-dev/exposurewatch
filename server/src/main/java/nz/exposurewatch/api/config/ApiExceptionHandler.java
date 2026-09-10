package nz.exposurewatch.api.config;

import nz.exposurewatch.api.xposedornot.XposedOrNotClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail validation(MethodArgumentNotValidException exception) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setTitle("Invalid request");
        problem.setDetail("Please provide a valid email address.");
        return problem;
    }

    @ExceptionHandler(IllegalStateException.class)
    public ProblemDetail configuration(IllegalStateException exception) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.SERVICE_UNAVAILABLE);
        problem.setTitle("Exposure service is not configured");
        problem.setDetail("The exposure provider is not configured on the server.");
        return problem;
    }

    @ExceptionHandler(XposedOrNotClient.XposedOrNotException.class)
    public ProblemDetail provider(XposedOrNotClient.XposedOrNotException exception) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_GATEWAY);
        problem.setTitle("Exposure provider unavailable");
        problem.setDetail("The breach data provider could not complete the request.");
        return problem;
    }
}
