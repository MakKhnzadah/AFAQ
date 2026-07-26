package no.afaq.api

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException): ResponseEntity<Map<String, Any>> {
        val errors = ex.bindingResult.fieldErrors.map { error ->
            error.field to (error.defaultMessage ?: "Invalid value")
        }
        val body: MutableMap<String, Any> = linkedMapOf()
        body["errors"] = errors
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body)
    }

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgument(ex: IllegalArgumentException): ResponseEntity<Map<String, Any>> {
        val body: MutableMap<String, Any> = linkedMapOf()
        body["error"] = ex.message ?: "Bad request"
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body)
    }

    @ExceptionHandler(DuplicateRegistrationException::class)
    fun handleDuplicateRegistration(ex: DuplicateRegistrationException): ResponseEntity<Map<String, Any>> {
        val body: MutableMap<String, Any> = linkedMapOf()
        body["error"] = ex.message ?: "Duplicate registration"
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body)
    }
}
