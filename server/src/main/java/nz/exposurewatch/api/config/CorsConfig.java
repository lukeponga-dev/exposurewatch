package nz.exposurewatch.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    private final String productionOrigin;

    public CorsConfig(@Value("${EXPOSUREWATCH_FRONTEND_ORIGIN:https://exposurewatch.nz}") String productionOrigin) {
        this.productionOrigin = productionOrigin;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/exposure/**")
                .allowedOrigins(productionOrigin, "http://localhost:5173")
                .allowedMethods("POST", "OPTIONS")
                .allowedHeaders("Content-Type", "Accept")
                .maxAge(3600);
    }
}
