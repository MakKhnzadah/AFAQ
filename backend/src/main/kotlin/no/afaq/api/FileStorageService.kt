package no.afaq.api

import no.afaq.config.StorageProperties
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.StandardOpenOption
import java.util.UUID

@Service
class FileStorageService(
    private val storageProperties: StorageProperties,
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    data class StoredImageFile(
        val imageKey: String,
        val contentType: String,
        val fileSizeBytes: Long,
    )

    data class StoredImageContent(
        val content: ByteArray,
    )

    private enum class ImageFormat(val extension: String, val contentType: String) {
        JPEG("jpg", "image/jpeg"),
        PNG("png", "image/png"),
    }

    private val storageRoot: Path by lazy {
        val root = Path.of(storageProperties.uploadDirectory).toAbsolutePath().normalize()
        Files.createDirectories(root)
        root
    }

    fun storeImage(file: MultipartFile): StoredImageFile {
        val bytes = try {
            file.bytes
        } catch (ex: IOException) {
            throw FileStorageException("Unable to read uploaded image", ex)
        }

        if (bytes.isEmpty()) {
            throw InvalidImageUploadException("Image file cannot be empty")
        }

        val maxFileSize = storageProperties.maxFileSizeBytes
        if (bytes.size.toLong() > maxFileSize) {
            throw InvalidImageUploadException("Image file exceeds the maximum allowed size")
        }

        val detectedFormat = detectImageFormat(bytes)
            ?: throw InvalidImageUploadException("Only JPEG and PNG images are supported")

        val declaredType = normalizeContentType(file.contentType)
            ?: throw InvalidImageUploadException("Missing or unsupported image content type")

        if (declaredType != detectedFormat.contentType) {
            throw InvalidImageUploadException("Image content type does not match file content")
        }

        val imageKey = "${UUID.randomUUID()}.${detectedFormat.extension}"
        val targetPath = resolveImagePath(imageKey)

        try {
            Files.write(targetPath, bytes, StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE)
        } catch (ex: IOException) {
            throw FileStorageException("Unable to store uploaded image", ex)
        }

        return StoredImageFile(
            imageKey = imageKey,
            contentType = detectedFormat.contentType,
            fileSizeBytes = bytes.size.toLong(),
        )
    }

    fun loadImage(imageKey: String): StoredImageContent {
        val path = resolveImagePath(imageKey)
        if (!Files.exists(path)) {
            throw GalleryImageNotFoundException()
        }

        val bytes = try {
            Files.readAllBytes(path)
        } catch (ex: IOException) {
            throw FileStorageException("Unable to read stored image", ex)
        }

        return StoredImageContent(content = bytes)
    }

    fun deleteImage(imageKey: String) {
        val path = resolveImagePath(imageKey)
        if (!Files.exists(path)) {
            return
        }

        try {
            Files.delete(path)
        } catch (ex: IOException) {
            throw FileStorageException("Unable to delete stored image", ex)
        }
    }

    private fun resolveImagePath(imageKey: String): Path {
        if (imageKey.isBlank()) {
            throw InvalidImageUploadException("Image key cannot be blank")
        }

        val resolved = storageRoot.resolve(imageKey).normalize()
        if (!resolved.startsWith(storageRoot)) {
            logger.warn("Blocked image path traversal attempt")
            throw InvalidImageUploadException("Invalid image key")
        }

        return resolved
    }

    private fun normalizeContentType(contentType: String?): String? {
        val value = contentType?.trim()?.lowercase() ?: return null
        return when (value) {
            "image/jpeg", "image/jpg" -> "image/jpeg"
            "image/png" -> "image/png"
            else -> null
        }
    }

    private fun detectImageFormat(bytes: ByteArray): ImageFormat? {
        if (isJpeg(bytes)) {
            return ImageFormat.JPEG
        }
        if (isPng(bytes)) {
            return ImageFormat.PNG
        }
        return null
    }

    private fun isJpeg(bytes: ByteArray): Boolean {
        if (bytes.size < 4) {
            return false
        }
        return bytes[0] == 0xFF.toByte() &&
            bytes[1] == 0xD8.toByte() &&
            bytes[2] == 0xFF.toByte()
    }

    private fun isPng(bytes: ByteArray): Boolean {
        if (bytes.size < 8) {
            return false
        }
        val pngMagic = byteArrayOf(
            0x89.toByte(),
            0x50.toByte(),
            0x4E.toByte(),
            0x47.toByte(),
            0x0D.toByte(),
            0x0A.toByte(),
            0x1A.toByte(),
            0x0A.toByte(),
        )
        return pngMagic.indices.all { idx -> bytes[idx] == pngMagic[idx] }
    }
}
