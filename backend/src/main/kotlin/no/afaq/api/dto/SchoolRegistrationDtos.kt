package no.afaq.api.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

data class CreateSchoolRegistrationRequest(
    @field:NotBlank(message = "Child name is required")
    val childFullName: String,
    @field:NotNull(message = "Date of birth is required")
    val childDateOfBirth: LocalDate,
    @field:NotBlank(message = "Guardian name is required")
    val guardianFullName: String,
    @field:NotBlank(message = "Phone number is required")
    val phoneNumber: String,
    @field:NotBlank(message = "Email is required")
    @field:Email(message = "Email must be valid")
    val email: String,
    @field:NotBlank(message = "Address is required")
    val address: String,
    @field:NotNull(message = "Classroom is required")
    val classroomId: UUID,
    @field:Size(max = 2000, message = "Comment must be at most 2000 characters")
    val comment: String? = null,
    val consentAccepted: Boolean = false,
    @field:NotBlank(message = "Privacy policy version is required")
    val privacyPolicyVersion: String,
)

data class SchoolRegistrationResponse(
    val publicReference: String,
    val ageYears: Int?,
    val createdAt: Instant,
)
