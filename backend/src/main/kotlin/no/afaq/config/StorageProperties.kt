package no.afaq.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "app.storage")
class StorageProperties {
    var uploadDirectory: String = "./uploads"
    var maxFileSizeBytes: Long = 5L * 1024L * 1024L
}
