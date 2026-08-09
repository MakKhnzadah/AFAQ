package no.afaq.api.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.PositiveOrZero
import jakarta.validation.constraints.Size
import java.util.UUID

data class GalleryItemResponse(
    val id: UUID,
    val titleNo: String?,
    val titleAr: String?,
    val altTextNo: String,
    val altTextAr: String,
    val imageUrl: String,
    val contentType: String,
    val fileSizeBytes: Long,
    val displayOrder: Int,
    val active: Boolean,
)

data class CreateGalleryItemRequest(
    @field:Size(max = 255, message = "Norwegian title must be at most 255 characters")
    val titleNo: String? = null,
    @field:Size(max = 255, message = "Arabic title must be at most 255 characters")
    val titleAr: String? = null,
    @field:NotBlank(message = "Norwegian alt text is required")
    @field:Size(max = 255, message = "Norwegian alt text must be at most 255 characters")
    val altTextNo: String,
    @field:NotBlank(message = "Arabic alt text is required")
    @field:Size(max = 255, message = "Arabic alt text must be at most 255 characters")
    val altTextAr: String,
    @field:PositiveOrZero(message = "Display order must be zero or positive")
    val displayOrder: Int = 0,
    val active: Boolean = true,
)

data class UpdateGalleryItemRequest(
    @field:Size(max = 255, message = "Norwegian title must be at most 255 characters")
    val titleNo: String? = null,
    @field:Size(max = 255, message = "Arabic title must be at most 255 characters")
    val titleAr: String? = null,
    @field:NotBlank(message = "Norwegian alt text is required")
    @field:Size(max = 255, message = "Norwegian alt text must be at most 255 characters")
    val altTextNo: String,
    @field:NotBlank(message = "Arabic alt text is required")
    @field:Size(max = 255, message = "Arabic alt text must be at most 255 characters")
    val altTextAr: String,
    @field:PositiveOrZero(message = "Display order must be zero or positive")
    val displayOrder: Int = 0,
    val active: Boolean,
)

data class UpdateGalleryItemStatusRequest(
    val active: Boolean,
)
