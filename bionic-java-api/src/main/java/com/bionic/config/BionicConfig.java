package com.bionic.config;

import com.bionic.application.port.in.BionicConvertPort;
import com.bionic.application.port.out.BionicProcessorPort;
import com.bionic.application.usecase.BionicConvertUseCase;
import com.bionic.domain.service.BionicProcessor;
import com.bionic.infrastructure.processor.BionicProcessorImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Central wiring configuration.
 *
 * <p>All beans are explicitly declared here rather than scattered via {@code @Component}
 * annotations.  This makes the dependency graph visible in one place and simplifies
 * testing (beans can be constructed directly without Spring).
 *
 * <h2>CORS</h2>
 * <p>By default allows any origin.  Restrict {@code allowedOrigins} before deploying
 * to production (e.g. to the origin of the React front-end).
 */
@Configuration
public class BionicConfig {

    // -------------------------------------------------------------------------
    // Domain layer
    // -------------------------------------------------------------------------

    @Bean
    public BionicProcessor bionicProcessor() {
        return new BionicProcessor();
    }

    // -------------------------------------------------------------------------
    // Infrastructure layer
    // -------------------------------------------------------------------------

    @Bean
    public BionicProcessorPort bionicProcessorPort(BionicProcessor bionicProcessor) {
        return new BionicProcessorImpl(bionicProcessor);
    }

    // -------------------------------------------------------------------------
    // Application layer
    // -------------------------------------------------------------------------

    @Bean
    public BionicConvertPort bionicConvertPort(BionicProcessorPort bionicProcessorPort) {
        return new BionicConvertUseCase(bionicProcessorPort);
    }

    // -------------------------------------------------------------------------
    // Web / CORS configuration
    // -------------------------------------------------------------------------

    /**
     * CORS configuration.
     *
     * <p>Allows the React dev server (localhost:5173) and any port on localhost
     * during development.  Replace or restrict these origins for production.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOriginPatterns(
                                "http://localhost:*",
                                "http://127.0.0.1:*"
                        )
                        .allowedMethods("GET", "POST", "OPTIONS")
                        .allowedHeaders("*")
                        .maxAge(3600);
            }
        };
    }
}
