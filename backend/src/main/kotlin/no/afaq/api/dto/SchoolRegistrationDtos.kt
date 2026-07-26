package no.afaq.api.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.PastOrPresent
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

data class CreateSchoolRegistrationRequest(
    @field:NotBlank(message = "Child name is required")
    @field:Size(max = 255, message = "Child name must be at most 255 characters")
    val childFullName: String,
    @field:NotNull(message = "Date of birth is required")
    @field:PastOrPresent(message = "Date of birth cannot be in the future")
    val childDateOfBirth: LocalDate,
    @field:NotBlank(message = "Guardian name is required")
    @field:Size(max = 255, message = "Guardian name must be at most 255 characters")
    val guardianFullName: String,
    @field:NotBlank(message = "Phone number is required")
    @field:Pattern(regexp = "^[+0-9][0-9 ()-]{5,31}$", message = "Phone number has an invalid format")
    val phoneNumber: String,
    @field:NotBlank(message = "Email is required")
    @field:Email(message = "Email must be valid")
    val email: String,
    @field:NotBlank(message = "Address is required")
    @field:Size(max = 255, message = "Address must be at most 255 characters")
    val address: String,
    @field:NotNull(message = "Classroom is required")
    val classroomId: UUID,
    @field:Size(max = 2000, message = "Comment must be at most 2000 characters")
    val comment: String? = null,
    val consentAccepted: Boolean = false,
    @field:NotBlank(message = "Privacy policy version is required")
    @field:Size(max = 50, message = "Privacy policy version must be at most 50 characters")
    val privacyPolicyVersion: String,
)

data class SchoolRegistrationResponse(
    val publicReference: String,
    val ageYears: Int?,
    val createdAt: Instant,
)
