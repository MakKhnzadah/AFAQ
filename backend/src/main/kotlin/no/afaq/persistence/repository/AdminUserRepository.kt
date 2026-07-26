package no.afaq.persistence.repository

import no.afaq.persistence.entity.AdminUserEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional
import java.util.UUID

interface AdminUserRepository : JpaRepository<AdminUserEntity, UUID> {
    fun findByEmailIgnoreCase(email: String): Optional<AdminUserEntity>
}