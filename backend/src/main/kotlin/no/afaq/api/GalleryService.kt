package no.afaq.api

import no.afaq.api.dto.CreateGalleryItemRequest
import no.afaq.api.dto.GalleryItemResponse
import no.afaq.api.dto.UpdateGalleryItemRequest
import no.afaq.persistence.entity.GalleryItemEntity
import no.afaq.persistence.repository.GalleryItemRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@Service
class GalleryService(
    private val galleryItemRepository: GalleryItemRepository,
    private val fileStorageService: FileStorageService,
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    data class GalleryImagePayload(
        val content: ByteArray,
        val contentType: String,
    )

    @Transactional(readOnly = true)
    fun listPublicGalleryItems(): List<GalleryItemResponse> =
        galleryItemRepository.findAllByActiveTrueOrderByDisplayOrderAscCreatedAtAsc()
            .map(::toResponse)

    @Transactional(readOnly = true)
    fun listAdminGalleryItems(): List<GalleryItemResponse> =
        galleryItemRepository.findAllByOrderByDisplayOrderAscCreatedAtAsc()
            .map(::toResponse)

    @Transactional(readOnly = true)
    fun getPublicGalleryImage(id: UUID): GalleryImagePayload {
        val item = galleryItemRepository.findByIdAndActiveTrue(id)
            ?: throw GalleryImageNotFoundException()
        val imageContent = fileStorageService.loadImage(item.imageKey)
        return GalleryImagePayload(content = imageContent.content, contentType = item.contentType)
    }

    @Transactional
    fun createGalleryItem(request: CreateGalleryItemRequest, image: MultipartFile): GalleryItemResponse {
        val storedImage = fileStorageService.storeImage(image)

        val entity = GalleryItemEntity(
            titleNo = request.titleNo?.trim()?.takeIf { it.isNotEmpty() },
            titleAr = request.titleAr?.trim()?.takeIf { it.isNotEmpty() },
            altTextNo = request.altTextNo.trim(),
            altTextAr = request.altTextAr.trim(),
            imageKey = storedImage.imageKey,
            contentType = storedImage.contentType,
            fileSizeBytes = storedImage.fileSizeBytes,
            displayOrder = request.displayOrder,
            active = request.active,
        )

        return try {
            toResponse(galleryItemRepository.saveAndFlush(entity))
        } catch (ex: RuntimeException) {
            safeDeleteNewFile(storedImage.imageKey)
            throw ex
        }
    }

    @Transactional
    fun updateGalleryItem(id: UUID, request: UpdateGalleryItemRequest, image: MultipartFile?): GalleryItemResponse {
        val item = galleryItemRepository.findById(id)
            .orElseThrow { GalleryItemNotFoundException() }

        val storedImage = image?.takeIf { !it.isEmpty }?.let { fileStorageService.storeImage(it) }
        val previousImageKey = item.imageKey

        item.titleNo = request.titleNo?.trim()?.takeIf { it.isNotEmpty() }
        item.titleAr = request.titleAr?.trim()?.takeIf { it.isNotEmpty() }
        item.altTextNo = request.altTextNo.trim()
        item.altTextAr = request.altTextAr.trim()
        item.displayOrder = request.displayOrder
        item.active = request.active

        if (storedImage != null) {
            item.imageKey = storedImage.imageKey
            item.contentType = storedImage.contentType
            item.fileSizeBytes = storedImage.fileSizeBytes
        }

        val saved = try {
            galleryItemRepository.saveAndFlush(item)
        } catch (ex: RuntimeException) {
            if (storedImage != null) {
                safeDeleteNewFile(storedImage.imageKey)
            }
            throw ex
        }

        if (storedImage != null && previousImageKey != storedImage.imageKey) {
            try {
                fileStorageService.deleteImage(previousImageKey)
            } catch (ex: RuntimeException) {
                logger.warn("Failed to remove superseded gallery image file for item {}", id)
            }
        }

        return toResponse(saved)
    }

    @Transactional
    fun setActiveStatus(id: UUID, active: Boolean): GalleryItemResponse {
        val item = galleryItemRepository.findById(id)
            .orElseThrow { GalleryItemNotFoundException() }
        item.active = active
        return toResponse(galleryItemRepository.saveAndFlush(item))
    }

    @Transactional
    fun deleteGalleryItem(id: UUID) {
        val item = galleryItemRepository.findById(id)
            .orElseThrow { GalleryItemNotFoundException() }

        galleryItemRepository.delete(item)
        galleryItemRepository.flush()

        try {
            fileStorageService.deleteImage(item.imageKey)
        } catch (ex: RuntimeException) {
            logger.warn("Failed to delete image file for gallery item {} after metadata deletion", id)
            throw ex
        }
    }

    private fun toResponse(entity: GalleryItemEntity): GalleryItemResponse {
        val id = entity.id ?: throw IllegalStateException("Gallery item id missing")
        return GalleryItemResponse(
            id = id,
            titleNo = entity.titleNo,
            titleAr = entity.titleAr,
            altTextNo = entity.altTextNo,
            altTextAr = entity.altTextAr,
            imageUrl = "/api/public/gallery/$id/image",
            contentType = entity.contentType,
            fileSizeBytes = entity.fileSizeBytes,
            displayOrder = entity.displayOrder,
            active = entity.active,
        )
    }

    private fun safeDeleteNewFile(imageKey: String) {
        try {
            fileStorageService.deleteImage(imageKey)
        } catch (cleanupEx: RuntimeException) {
            logger.warn("Failed to cleanup gallery image file after persistence error")
        }
    }
}
