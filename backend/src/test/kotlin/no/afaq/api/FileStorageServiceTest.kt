package no.afaq.api

import no.afaq.config.StorageProperties
import org.junit.jupiter.api.Assertions.assertArrayEquals
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.io.TempDir
import org.springframework.mock.web.MockMultipartFile
import java.nio.file.Files
import java.nio.file.Path

class FileStorageServiceTest {

    @TempDir
    lateinit var tempDir: Path

    @Test
    fun `stores and loads valid png image`() {
        val service = service()
        val pngBytes = byteArrayOf(
            0x89.toByte(),
            0x50,
            0x4E,
            0x47,
            0x0D,
            0x0A,
            0x1A,
            0x0A,
            0x00,
        )

        val file = MockMultipartFile(
            "image",
            "photo.png",
            "image/png",
            pngBytes,
        )

        val stored = service.storeImage(file)

        assertEquals("image/png", stored.contentType)
        assertEquals(pngBytes.size.toLong(), stored.fileSizeBytes)
        assertTrue(stored.imageKey.endsWith(".png"))

        val loaded = service.loadImage(stored.imageKey)
        assertArrayEquals(pngBytes, loaded.content)
    }

    @Test
    fun `stores valid jpeg image`() {
        val service = service()
        val jpegBytes = byteArrayOf(
            0xFF.toByte(),
            0xD8.toByte(),
            0xFF.toByte(),
            0xE0.toByte(),
            0x00,
        )

        val file = MockMultipartFile(
            "image",
            "photo.jpg",
            "image/jpeg",
            jpegBytes,
        )

        val stored = service.storeImage(file)

        assertEquals("image/jpeg", stored.contentType)
        assertTrue(stored.imageKey.endsWith(".jpg"))
    }

    @Test
    fun `rejects empty image`() {
        val service = service()
        val file = MockMultipartFile(
            "image",
            "empty.png",
            "image/png",
            byteArrayOf(),
        )

        assertThrows(InvalidImageUploadException::class.java) {
            service.storeImage(file)
        }
    }

    @Test
    fun `rejects unsupported image content`() {
        val service = service()
        val file = MockMultipartFile(
            "image",
            "fake.png",
            "image/png",
            "not-an-image".toByteArray(),
        )

        assertThrows(InvalidImageUploadException::class.java) {
            service.storeImage(file)
        }
    }

    @Test
    fun `rejects mismatched declared content type`() {
        val service = service()
        val pngBytes = byteArrayOf(
            0x89.toByte(),
            0x50,
            0x4E,
            0x47,
            0x0D,
            0x0A,
            0x1A,
            0x0A,
        )

        val file = MockMultipartFile(
            "image",
            "photo.jpg",
            "image/jpeg",
            pngBytes,
        )

        assertThrows(InvalidImageUploadException::class.java) {
            service.storeImage(file)
        }
    }

    @Test
    fun `rejects oversized image`() {
        val service = service(maxFileSizeBytes = 8)
        val pngBytes = byteArrayOf(
            0x89.toByte(),
            0x50,
            0x4E,
            0x47,
            0x0D,
            0x0A,
            0x1A,
            0x0A,
            0x00,
        )

        val file = MockMultipartFile(
            "image",
            "large.png",
            "image/png",
            pngBytes,
        )

        assertThrows(InvalidImageUploadException::class.java) {
            service.storeImage(file)
        }
    }

    @Test
    fun `deletes stored image`() {
        val service = service()
        val pngBytes = byteArrayOf(
            0x89.toByte(),
            0x50,
            0x4E,
            0x47,
            0x0D,
            0x0A,
            0x1A,
            0x0A,
        )

        val file = MockMultipartFile(
            "image",
            "photo.png",
            "image/png",
            pngBytes,
        )

        val stored = service.storeImage(file)
        val storedPath = tempDir.resolve(stored.imageKey)

        assertTrue(Files.exists(storedPath))

        service.deleteImage(stored.imageKey)

        assertFalse(Files.exists(storedPath))
    }

    @Test
    fun `blocks path traversal image key`() {
        val service = service()

        assertThrows(InvalidImageUploadException::class.java) {
            service.loadImage("../outside.png")
        }
    }

    private fun service(maxFileSizeBytes: Long = 5L * 1024L * 1024L): FileStorageService {
        val properties = StorageProperties().apply {
            uploadDirectory = tempDir.toString()
            this.maxFileSizeBytes = maxFileSizeBytes
        }

        return FileStorageService(properties)
    }
}