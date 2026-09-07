package nz.exposurewatch.api.hibp;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class HibpClient {
    private final RestClient restClient;
    private final String apiKey;
    private final String userAgent;

    public HibpClient(
            @Value("${exposurewatch.hibp.base-url}") String baseUrl,
            @Value("${exposurewatch.hibp.api-key}") String apiKey,
            @Value("${exposurewatch.hibp.user-agent}") String userAgent) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
        this.apiKey = apiKey;
        this.userAgent = userAgent;
    }

    public List<HibpBreach> breachedAccount(String email) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("HIBP_API_KEY is not configured");
        }

        HibpBreach[] response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/breachedaccount/{email}")
                        .queryParam("truncateResponse", "false")
                        .build(email))
                .header(HttpHeaders.AUTHORIZATION, "")
                .header("hibp-api-key", apiKey)
                .header(HttpHeaders.USER_AGENT, userAgent)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                    if (response.getStatusCode().value() == 404) {
                        return;
                    }
                    throw new HibpException("HIBP rejected the request: HTTP " + response.getStatusCode().value());
                })
                .body(HibpBreach[].class);

        return response == null ? List.of() : List.of(response);
    }

    public static class HibpException extends RuntimeException {
        public HibpException(String message) {
            super(message);
        }
    }
}
