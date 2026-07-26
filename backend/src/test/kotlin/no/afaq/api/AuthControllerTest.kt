package no.afaq.api

import io.mockk.every
import io.mockk.mockk
import no.afaq.api.dto.AuthResult
import no.afaq.api.dto.LoginRequest
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.context.HttpSessionSecurityContextRepository
import org.springframework.web.server.ResponseStatusException

class AuthControllerTest {

    private val authService = mockk<AuthService>()
    private val controller = AuthController(authService)

    @AfterEach
    fun clearSecurityContext() {
        SecurityContextHolder.clearContext()
    }

    @Test
    fun `login stores roles as granted authorities in the session`() {
        val loginRequest = LoginRequest("admin@example.com", "secret123")
        val servletRequest = MockHttpServletRequest()
        every { authService.authenticate(loginRequest) } returns AuthResult(
            authenticated = true,
            userEmail = "admin@example.com",
            roles = listOf("ROLE_ADMIN"),
        )

        val response = controller.login(loginRequest, servletRequest)

        assertEquals(listOf("ROLE_ADMIN"), response.roles)
        assertEquals(
            listOf("ROLE_ADMIN"),
            SecurityContextHolder.getContext().authentication.authorities.map { it.authority },
        )
        assertNotNull(
            servletRequest.session.getAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
            ),
        )
    }

    @Test
    fun `invalid credentials return unauthorized`() {
        val loginRequest = LoginRequest("admin@example.com", "wrong")
        every { authService.authenticate(loginRequest) } returns AuthResult(authenticated = false)

        val exception = assertThrows(ResponseStatusException::class.java) {
            controller.login(loginRequest, MockHttpServletRequest())
        }

        assertEquals(HttpStatus.UNAUTHORIZED, exception.statusCode)
    }
}
