package no.afaq.api

import io.mockk.every
import io.mockk.mockk
import no.afaq.api.dto.LoginRequest
import no.afaq.persistence.entity.AdminUserEntity
import no.afaq.persistence.entity.RoleEntity
import no.afaq.persistence.repository.AdminUserRepository
import no.afaq.persistence.repository.RoleRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import java.util.Optional
import java.util.UUID

class AuthServiceTest {

    private val adminUserRepository = mockk<AdminUserRepository>()
    private val roleRepository = mockk<RoleRepository>()
    private val passwordEncoder = BCryptPasswordEncoder()
    private val service = AuthService(adminUserRepository, roleRepository, passwordEncoder)

    @Test
    fun `successful login returns admin user`() {
        val role = RoleEntity(id = UUID.randomUUID(), name = "ROLE_ADMIN")
        val user = AdminUserEntity(
            id = UUID.randomUUID(),
            email = "admin@example.com",
            passwordHash = passwordEncoder.encode("secret123"),
            enabled = true,
            accountLocked = false,
        )
        user.grantRole(role)

        every { adminUserRepository.findByEmailIgnoreCase("admin@example.com") } returns Optional.of(user)

        val result = service.authenticate(LoginRequest("admin@example.com", "secret123"))

        assertTrue(result.authenticated)
        assertEquals("admin@example.com", result.userEmail)
    }

    @Test
    fun `invalid password fails authentication`() {
        val user = AdminUserEntity(
            id = UUID.randomUUID(),
            email = "admin@example.com",
            passwordHash = passwordEncoder.encode("secret123"),
            enabled = true,
            accountLocked = false,
        )

        every { adminUserRepository.findByEmailIgnoreCase("admin@example.com") } returns Optional.of(user)

        val result = service.authenticate(LoginRequest("admin@example.com", "wrong"))

        assertTrue(!result.authenticated)
    }
}
