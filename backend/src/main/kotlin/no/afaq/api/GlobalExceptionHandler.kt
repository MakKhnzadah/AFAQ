package no.afaq.api

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.multipart.MaxUploadSizeExceededException

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

    @ExceptionHandler(GalleryItemNotFoundException::class, GalleryImageNotFoundException::class)
    fun handleGalleryNotFound(ex: RuntimeException): ResponseEntity<Map<String, Any>> {
        val body: MutableMap<String, Any> = linkedMapOf()
        body["error"] = ex.message ?: "Gallery resource not found"
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body)
    }

    @ExceptionHandler(InvalidImageUploadException::class)
    fun handleInvalidImageUpload(ex: InvalidImageUploadException): ResponseEntity<Map<String, Any>> {
        val body: MutableMap<String, Any> = linkedMapOf()
        body["error"] = ex.message ?: "Invalid image upload"
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body)
    }

    @ExceptionHandler(MaxUploadSizeExceededException::class)
    fun handleMaxUploadSizeExceeded(ex: MaxUploadSizeExceededException): ResponseEntity<Map<String, Any>> {
        val body: MutableMap<String, Any> = linkedMapOf()
        body["error"] = "Uploaded file is too large"
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(body)
    }

    @ExceptionHandler(FileStorageException::class)
    fun handleStorageException(ex: FileStorageException): ResponseEntity<Map<String, Any>> {
        val body: MutableMap<String, Any> = linkedMapOf()
        body["error"] = ex.message ?: "File storage operation failed"
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body)
    }
}
