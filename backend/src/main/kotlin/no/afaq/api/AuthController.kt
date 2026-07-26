package no.afaq.api

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.validation.Valid
import no.afaq.api.dto.AuthenticatedUserResponse
import no.afaq.api.dto.LoginRequest
import org.springframework.http.HttpStatus
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.context.HttpSessionSecurityContextRepository
import org.springframework.security.web.csrf.CsrfToken
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
) {
    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest, requestContext: HttpServletRequest): AuthenticatedUserResponse {
        val result = authService.authenticate(request)
        if (!result.authenticated) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password")
        }

        val authorities = result.roles.map(::SimpleGrantedAuthority)
        val auth = UsernamePasswordAuthenticationToken(result.userEmail, null, authorities)
        val context = org.springframework.security.core.context.SecurityContextHolder.createEmptyContext()
        context.authentication = auth
        SecurityContextHolder.setContext(context)
        requestContext.getSession(true)
        requestContext.changeSessionId()
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
        val email = requestContext.userPrincipal?.name
            ?: throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthenticated")
        return authService.currentUser(email)
    }

    @GetMapping("/csrf")
    fun csrf(csrfToken: CsrfToken): Map<String, String> = mapOf("token" to csrfToken.token)
}
