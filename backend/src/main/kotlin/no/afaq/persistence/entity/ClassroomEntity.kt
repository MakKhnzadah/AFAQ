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
@Table(name = "classrooms")
class ClassroomEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    var id: UUID? = null,

    @Column(name = "name", nullable = false, unique = true, length = 120)
    var name: String = "",

    @Column(name = "description")
    var description: String? = null,

    @Column(name = "capacity")
    var capacity: Int? = null,

    @Column(name = "active", nullable = false)
    var active: Boolean = true,

    @Column(name = "display_order", nullable = false)
    var displayOrder: Int = 0,

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