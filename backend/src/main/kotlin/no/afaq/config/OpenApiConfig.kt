package no.afaq.config

import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OpenApiConfig {
    @Bean
    fun openAPI(): OpenAPI = OpenAPI()
        .info(
            Info()
                .title("Afaq Islamic Center API")
                .description("Public and admin APIs for the Afaq Islamic Center website")
                .version("1.0.0"),
        )
}
