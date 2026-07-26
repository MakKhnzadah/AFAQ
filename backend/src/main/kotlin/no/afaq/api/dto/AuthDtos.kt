package no.afaq.api.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class LoginRequest(
    @field:Email(message = "Email must be valid")
    @field:NotBlank(message = "Email is required")
    val email: String,
    @field:NotBlank(message = "Password is required")
    val password: String,
)

data class AuthenticatedUserResponse(
    val email: String,
    val roles: List<String>,
)

data class AuthResult(
    val authenticated: Boolean,
    val userEmail: String? = null,
    val roles: List<String> = emptyList(),
)
