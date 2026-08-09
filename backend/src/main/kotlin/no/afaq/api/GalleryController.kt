package no.afaq.api

import jakarta.validation.Valid
import no.afaq.api.dto.CreateGalleryItemRequest
import no.afaq.api.dto.UpdateGalleryItemRequest
import no.afaq.api.dto.UpdateGalleryItemStatusRequest
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@RestController
@RequestMapping("/api")
class GalleryController(
    private val galleryService: GalleryService,
) {
    @GetMapping("/public/gallery")
    fun listPublicGalleryItems() = galleryService.listPublicGalleryItems()

    @GetMapping("/public/gallery/{id}/image")
    fun getPublicGalleryImage(@PathVariable id: UUID): ResponseEntity<ByteArray> {
        val image = galleryService.getPublicGalleryImage(id)
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(image.contentType))
            .header(HttpHeaders.CACHE_CONTROL, "public, max-age=300")
            .body(image.content)
    }

    @GetMapping("/admin/gallery")
    fun listAdminGalleryItems() = galleryService.listAdminGalleryItems()

    @PostMapping("/admin/gallery", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    @ResponseStatus(HttpStatus.CREATED)
    fun createGalleryItem(
        @Valid @RequestPart("metadata") request: CreateGalleryItemRequest,
        @RequestPart("image") image: MultipartFile,
    ) = galleryService.createGalleryItem(request, image)

    @PutMapping("/admin/gallery/{id}", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun updateGalleryItem(
        @PathVariable id: UUID,
        @Valid @RequestPart("metadata") request: UpdateGalleryItemRequest,
        @RequestPart("image", required = false) image: MultipartFile?,
    ) = galleryService.updateGalleryItem(id, request, image)

    @PatchMapping("/admin/gallery/{id}/status")
    fun updateGalleryStatus(
        @PathVariable id: UUID,
        @RequestPart request: UpdateGalleryItemStatusRequest,
    ) = galleryService.setActiveStatus(id, request.active)

    @DeleteMapping("/admin/gallery/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteGalleryItem(@PathVariable id: UUID) {
        galleryService.deleteGalleryItem(id)
    }
}
