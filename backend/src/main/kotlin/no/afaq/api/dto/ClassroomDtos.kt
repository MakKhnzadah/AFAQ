package no.afaq.api.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.PositiveOrZero
import java.util.UUID

data class ClassroomResponse(
    val id: UUID,
    val name: String,
    val description: String?,
    val capacity: Int?,
    val active: Boolean,
    val displayOrder: Int,
)

data class CreateClassroomRequest(
    @field:NotBlank(message = "Name is required")
    val name: String,
    val description: String? = null,
    @field:PositiveOrZero(message = "Capacity must be zero or positive")
    val capacity: Int? = null,
    val active: Boolean = true,
    val displayOrder: Int = 0,
)

data class UpdateClassroomRequest(
    @field:NotBlank(message = "Name is required")
    val name: String,
    val description: String? = null,
    @field:PositiveOrZero(message = "Capacity must be zero or positive")
    val capacity: Int? = null,
    val active: Boolean = true,
    val displayOrder: Int = 0,
)

data class UpdateClassroomStatusRequest(val active: Boolean)
