package no.afaq.persistence.repository

import no.afaq.persistence.entity.GalleryItemEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface GalleryItemRepository : JpaRepository<GalleryItemEntity, UUID> {
    fun findAllByActiveTrueOrderByDisplayOrderAscCreatedAtAsc(): List<GalleryItemEntity>

    fun findAllByOrderByDisplayOrderAscCreatedAtAsc(): List<GalleryItemEntity>

    fun findByIdAndActiveTrue(id: UUID): GalleryItemEntity?
}
