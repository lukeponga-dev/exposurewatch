package nz.exposurewatch.api.xposedornot;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Component
public class XposedOrNotClient {
    private final RestClient restClient;

    public XposedOrNotClient(
            @Value("${exposurewatch.xposedornot.base-url:https://api.xposedornot.com}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    public List<XposedOrNotBreach> breachAnalytics(String email) {
        JsonNode response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1/breach-analytics")
                        .queryParam("email", email)
                        .build())
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, clientResponse) -> {
                    if (clientResponse.getStatusCode().value() != 404) {
                        throw new XposedOrNotException(
                                "XposedOrNot rejected the request: HTTP " + clientResponse.getStatusCode().value());
                    }
                })
                .body(JsonNode.class);

        if (response == null || response.has("Error")) {
            return List.of();
        }

        JsonNode exposedBreaches = field(response, "ExposedBreaches", "exposedBreaches");
        if (exposedBreaches == null || !exposedBreaches.isArray()) {
            return List.of();
        }

        List<XposedOrNotBreach> breaches = new ArrayList<>();
        for (JsonNode breach : exposedBreaches) {
            String name = text(breach, "breach", "Breach", "name", "Name");
            if (name == null || name.isBlank()) {
                continue;
            }

            List<String> dataClasses = values(breach, "xposed_data", "xposedData", "exposedData", "ExposedData");
            breaches.add(new XposedOrNotBreach(name, dataClasses));
        }

        return List.copyOf(breaches);
    }

    private static JsonNode field(JsonNode node, String... names) {
        for (String name : names) {
            JsonNode value = node.get(name);
            if (value != null && !value.isNull()) {
                return value;
            }
        }
        return null;
    }

    private static String text(JsonNode node, String... names) {
        JsonNode value = field(node, names);
        return value == null ? null : value.asText(null);
    }

    private static List<String> values(JsonNode node, String... names) {
        JsonNode value = field(node, names);
        if (value == null || value.isNull()) {
            return List.of();
        }

        if (value.isArray()) {
            List<String> result = new ArrayList<>();
            value.forEach(item -> {
                if (item.isTextual() && !item.asText().isBlank()) {
                    result.add(item.asText());
                }
            });
            return List.copyOf(result);
        }

        return java.util.Arrays.stream(value.asText("").split("[;,]"))
                .map(String::trim)
                .filter(item -> !item.isBlank())
                .toList();
    }

    public static class XposedOrNotException extends RuntimeException {
        public XposedOrNotException(String message) {
            super(message);
        }
    }
}
