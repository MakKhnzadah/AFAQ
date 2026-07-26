package no.afaq.api

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.validation.Valid
import no.afaq.api.dto.AuthenticatedUserResponse
import no.afaq.api.dto.LoginRequest
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.context.HttpSessionSecurityContextRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
) {
    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest, requestContext: HttpServletRequest, response: HttpServletResponse): AuthenticatedUserResponse {
        val result = authService.authenticate(request)
        if (!result.authenticated) {
            response.status = HttpStatus.UNAUTHORIZED.value()
            throw IllegalArgumentException("Invalid username or password")
        }

        val auth = UsernamePasswordAuthenticationToken(result.userEmail, null, listOf())
        val context = org.springframework.security.core.context.SecurityContextHolder.createEmptyContext()
        context.authentication = auth
        SecurityContextHolder.setContext(context)
        requestContext.session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context)

        return AuthenticatedUserResponse(email = result.userEmail!!, roles = result.roles)
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun logout(requestContext: HttpServletRequest, response: HttpServletResponse) {
        requestContext.session.invalidate()
        response.setHeader("Set-Cookie", "JSESSIONID=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax")
        SecurityContextHolder.clearContext()
    }

    @GetMapping("/me")
    fun me(requestContext: HttpServletRequest): AuthenticatedUserResponse {
        val email = requestContext.userPrincipal?.name ?: throw IllegalStateException("Unauthenticated")
        return authService.currentUser(email)
    }
}
