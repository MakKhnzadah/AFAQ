package no.afaq.persistence.repository

import no.afaq.persistence.entity.ClassroomEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface ClassroomRepository : JpaRepository<ClassroomEntity, UUID> {
    fun findAllByActiveTrueOrderByDisplayOrderAsc(): List<ClassroomEntity>
}