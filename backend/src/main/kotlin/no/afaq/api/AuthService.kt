package no.afaq.api

import no.afaq.api.dto.AuthResult
import no.afaq.api.dto.AuthenticatedUserResponse
import no.afaq.api.dto.LoginRequest
import no.afaq.persistence.entity.AdminUserEntity
import no.afaq.persistence.repository.AdminUserRepository
import no.afaq.persistence.repository.RoleRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class AuthService(
    private val adminUserRepository: AdminUserRepository,
    private val roleRepository: RoleRepository,
    private val passwordEncoder: PasswordEncoder,
) {
    @Transactional(readOnly = true)
    fun authenticate(request: LoginRequest): AuthResult {
        val user = adminUserRepository.findByEmailIgnoreCase(request.email.trim())
            .orElse(null) ?: return AuthResult(authenticated = false)

        if (!user.enabled || user.accountLocked) {
            return AuthResult(authenticated = false)
        }

        val passwordMatches = passwordEncoder.matches(request.password, user.passwordHash)
        if (!passwordMatches) {
            return AuthResult(authenticated = false)
        }

        return AuthResult(
            authenticated = true,
            userEmail = user.email,
            roles = user.roles.map { it.name },
        )
    }

    @Transactional(readOnly = true)
    fun currentUser(email: String): AuthenticatedUserResponse {
        val user = adminUserRepository.findByEmailIgnoreCase(email).orElseThrow { IllegalArgumentException("User not found") }
        return AuthenticatedUserResponse(
            email = user.email,
            roles = user.roles.map { it.name },
        )
    }

    @Transactional
    fun bootstrapInitialAdmin(email: String, password: String) {
        val normalizedEmail = email.trim().lowercase()
        if (adminUserRepository.findByEmailIgnoreCase(normalizedEmail).isPresent) {
            return
        }

        val role = roleRepository.findByName("ROLE_ADMIN")
            ?: throw IllegalStateException("ROLE_ADMIN not found")

        val entity = AdminUserEntity(
            email = normalizedEmail,
            passwordHash = passwordEncoder.encode(password),
            enabled = true,
            accountLocked = false,
        )
        entity.grantRole(role)
        adminUserRepository.save(entity)
    }
}
