package no.afaq.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import jakarta.persistence.Version
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "gallery_items")
class GalleryItemEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    var id: UUID? = null,

    @Column(name = "title_no", length = 255)
    var titleNo: String? = null,

    @Column(name = "title_ar", length = 255)
    var titleAr: String? = null,

    @Column(name = "alt_text_no", nullable = false, length = 255)
    var altTextNo: String = "",

    @Column(name = "alt_text_ar", nullable = false, length = 255)
    var altTextAr: String = "",

    @Column(name = "image_key", nullable = false, unique = true, length = 255)
    var imageKey: String = "",

    @Column(name = "content_type", nullable = false, length = 100)
    var contentType: String = "",

    @Column(name = "file_size_bytes", nullable = false)
    var fileSizeBytes: Long = 0,

    @Column(name = "display_order", nullable = false)
    var displayOrder: Int = 0,

    @Column(name = "active", nullable = false)
    var active: Boolean = true,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.EPOCH,

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.EPOCH,

    @Version
    @Column(name = "version", nullable = false)
    var version: Long? = null,
) {
    @PrePersist
    fun prePersist() {
        val now = Instant.now()
        if (createdAt == Instant.EPOCH) {
            createdAt = now
        }
        if (updatedAt == Instant.EPOCH) {
            updatedAt = now
        }
    }

    @PreUpdate
    fun preUpdate() {
        updatedAt = Instant.now()
    }
}
